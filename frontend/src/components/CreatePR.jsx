import { useLocation } from "react-router";
import { useAuth } from "../store/useAuth";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function CreatePullRequest() {
  const { state } = useLocation();
  const repo = state?.repo;
  const {handleSubmit,register}=useForm();
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,setError]=useState(null);
  const createPR = async (prObj) => {
    try {
      prObj.repository=repo._id;
      prObj.author=currentUser._id;
      setLoading(true);
      console.log(state);   
      const res = await axios.post(
        "http://localhost:2929/api/pull-requests",
        prObj,
        { withCredentials: true }
      );
      if (res.status === 201) {
        toast.success("Pull Request Created");
        navigate(-2);
      }
    } catch(err) {
      setError(err.message);
      setLoading(false);

    } finally {

      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
        {error && <p>{error}</p>}
      <form
        onSubmit={handleSubmit(createPR)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-5">
          Create Pull Request
        </h2>
        <input
          type="text"
          placeholder="PR Title"
          className="border p-2 w-full mb-4 rounded"
          {...register("title")}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-4 rounded"
          
          {...register("description")}
        />
        <input
          type="text"
          placeholder="Source Branch"
          className="border p-2 w-full mb-4 rounded"
          defaultValue={"feature"}
          
          {...register("sourceBranch")}
        />
        <input
          type="text"
          placeholder="Target Branch"
          className="border p-2 w-full mb-4 rounded"
          defaultValue={"main"}
          
          {...register("targetBranch")}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Pull Request"}
        </button>
      </form>
    </div>
  );
}

export default CreatePullRequest;