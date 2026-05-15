import { useLocation } from "react-router";
import {useAuth} from '../store/useAuth'
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import socket from "../socket";


function Repository() {
  const { state } = useLocation();
  const { register, handleSubmit, reset } = useForm();
  let currentUser=useAuth(state=>state.currentUser);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [files,setFiles]=useState([]);
  const navigate=useNavigate()

  useEffect(()=>{

 const fetchFiles=async()=>{

  try{

   const res=await axios.get(
    `http://localhost:2929/api/files/repo/${state.repo._id}`,
    {withCredentials:true}
   );

   setFiles(res.data);

  }catch(err){

   console.log(err);
   toast.error("Failed to load files");

  }

 };

 fetchFiles();

},[state.repo._id]);

useEffect(() => {

  if(state?.repo?._id){

    // Join repository room
    socket.emit(
      "joinRepoRoom",
      state.repo._id
    );

  }

  return () => {

    // Leave room when component unmounts
    socket.emit(
      "leaveRepoRoom",
      state.repo._id
    );

  };

}, [state?.repo?._id]);


  const toEdit=(repoObj)=>{
     navigate("/edit-repo",{state:{repo:repoObj}})
  }
  const toCreatePR=(repoObj)=>{
    navigate('/create-pr',{state:{repo:repoObj}})
  }
  const toPR=()=>{
    navigate('/pull-req',{state:{repo:state?.repo}})
  }

  const addCollaborator = async (data) => {
  try {

    await axios.post(
      `http://localhost:2929/api/repos/${state.repo._id}/collaborators`,
      data,
      { withCredentials: true }
    );

    toast.success("Collaborator added");
    navigate(-1);

    reset();

  } catch {

    toast.error("Failed to add collaborator");

  }

};

  const updateRole = async (userId, role) => {

  try {

    await axios.patch(
      `http://localhost:2929/api/repos/${state.repo._id}/collaborators/${userId}`,
      { role },
      { withCredentials: true }
    );

    toast.success("Role updated");
    navigate(-1);

  } catch {

    toast.error("Failed to update role");

  }

};

const toFile=(fileObj)=>{
navigate(`/file-view/${fileObj._id}`)
}

const removeCollaborator = async (userId) => {

  try {

    await axios.delete(
      `http://localhost:2929/api/repos/${state.repo._id}/collaborators/${userId}`,
      { withCredentials: true }
    );

    toast.success("Collaborator removed");
    navigate(-1);

  } catch {

    toast.error("Failed to remove collaborator");

  }

};

  const isOwner = currentUser._id === state?.repo?.owner?._id;

  const isCollaborator =
  state?.repo?.collaborators?.some(
    c => c.user === currentUser._id
  );
  const toDelete=async(repoObj)=>{
    try{
     setLoading(true);
     let res=await axios.delete(`http://localhost:2929/api/repos/${repoObj._id}`,
      {withCredentials:true}
     )
     if(res.status===200){
      toast.success("Repository Deleted");
      navigate('/repositories');
     }
    }catch(err){
     setError(err.message);
    }

  }
  if(loading){
    return <p>Deleting...</p>
  }
  return (
<div className="min-h-screen bg-gray-100 p-6">
<div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-6">

{isOwner && (
<>
<button
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
onClick={()=>toEdit(state.repo)}
>
Edit Repo
</button>

<button
className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
onClick={()=>toDelete(state.repo)}
>
Delete Repo
</button>

<button
className="bg-orange-600 text-white px-4 py-2 rounded-lg"
onClick={()=>
  navigate("/add-file",{state:{repo:state.repo}})
}>
  Add File
</button>


</>
)}
{(isOwner || isCollaborator) && (
<>

<button
className="bg-blue-600 text-white px-4 py-2 rounded-lg"
onClick={() =>
navigate("/repo-commits",{state:{repo:state.repo}})
}
>
View Commits
</button>
</>
)}
{currentUser._id !== state?.repo?.owner?._id && (
<button
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
onClick={()=>toCreatePR(state.repo)}
>
Create Pull Request
</button>
)}
<button
className="bg-purple-600 text-white px-4 py-2 rounded-lg"
onClick={toPR}
>
Pull Requests
</button>
<button
className="bg-orange-600 text-white px-4 py-2 rounded-lg"
onClick={() =>
navigate("/repo-issues",{state:{repo:state.repo}})
}
>
Issues
</button>



</div>
<div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-6">
<h1 className="text-3xl font-bold text-gray-800">
{state.repo.name}
</h1>
<p className="text-gray-600 mt-2">
{state.repo.description || "No description provided"}
</p>
<div className="mt-4 flex justify-between text-sm text-gray-500">
<span>
Owner: {state.repo?.owner? state.repo.owner.username:"Deleted User"}
</span>
<span>
Updated: {state.repo.updatedAt}
</span>
</div>
</div>
<div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-6">

<h2 className="text-xl font-semibold mb-4">
 Repository Files
</h2>

{!files.length ? (

<p className="text-gray-500">
 No files uploaded yet
</p>

):(

<div className="space-y-3">

{files.map(file=>(
<div
 key={file._id}
 className="flex justify-between items-center bg-gray-50 rounded-lg p-4 hover:shadow-sm transition"
>

<div>

<p className="font-semibold text-gray-800">
 {file.name}
</p>

<p className="text-sm text-gray-500">
 Uploaded by: {file.uploadedBy?.username || "Unknown"}
</p>

</div>

<button
 onClick={() => toFile(file)}
 className="text-blue-600 hover:underline"
>
 View File
</button>

</div>
))}

</div>

)}

</div>
<div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
<h2 className="text-xl font-semibold mb-4">
Collaborators
</h2>
{isOwner && (
<form
onSubmit={handleSubmit(addCollaborator)}
className="flex gap-3 mb-6"
>
<input
 placeholder="Username"
 {...register("username")}
 required
/>
<select
className="border rounded px-3 py-2"
{...register("role")}
>
<option value="collaborator">
Collaborator
</option>
<option value="viewer">
viewer
</option>
</select>
<button
className="bg-green-600 text-white px-4 rounded"
>
Add
</button>
</form>
)}
{!state.repo.collaborators.length ? (
<p className="text-gray-500">
No collaborators added yet
</p>
) : (
state.repo.collaborators.map(collab => (
<div
key={collab.user._id}
className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-3 hover:shadow-sm"
>
<div>
<p className="font-semibold">
{collab.user.username}
</p>
<p className="text-sm text-gray-500">
{collab.user.email}
</p>
<p className="text-sm capitalize">
Role: {collab.role}
</p>
</div>
{isOwner && (
<div className="flex gap-2">
<select
defaultValue={collab.role}
onChange={(e)=>
updateRole(collab.user._id,e.target.value)
}
className="border rounded px-2"
>
<option value="collaborator">
Collaborator
</option>
<option value="viewer">
Viewer
</option>
</select>
<button
onClick={() =>
removeCollaborator(collab.user._id)
}
className="bg-red-600 text-white px-3 py-1 rounded"
>
Remove
</button>
</div>
)}
</div>
))
)}
</div>
</div>
)
}
export default Repository;