import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import RepoCard from "../components/RepoCard";
import { useNavigate } from "react-router";
import axios from "axios";

function Repositories() {
  const currentUser = useAuth((state) => state.currentUser);
  let navigate=useNavigate();
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState(null);
  let [repos,setRepos]=useState([])
   const toRepo = (repoObj) => {
    navigate('/repo', { state: { repo: repoObj } })
  }

  useEffect(() => {
    async function getRepo(){
      try{
        setLoading(true);
        let res=await axios.get(`${import.meta.env.VITE_API_URL}/api/repos/repos-owner/${currentUser._id}`,
          {withCredentials:true}
        )
        if(res.status==200){      
          setRepos(res.data.payload)
          
        }
      }catch(err){
        setError(err.message);
        setLoading(false);
      }finally{
        setLoading(false)
      }
    }
    getRepo()
}, []);

  const toNewRepo = () => {
    navigate('/add-repo')
  }
 
 if(loading){
  return <p>Loading....</p>
 }
  
  return (
    <div className="p-6">
       <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold mb-4">
        Your Repositories
      </h1>
      <button
          onClick={toNewRepo}
          className="bg-green-600 text-white px-2 py-2  rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          + New Repository
        </button>
       </div>
      {error && <p>{error}</p>}
      <div className="grid gap-4" >
        {
          repos.length===0?<p>No Repos till Now.Create Repo</p>
          :
          <div className="grid gap-4">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                toRepo={toRepo}
              />
            ))}
          </div>
        }  
        
        

      
      </div>

    </div>
  );
}

export default Repositories;

