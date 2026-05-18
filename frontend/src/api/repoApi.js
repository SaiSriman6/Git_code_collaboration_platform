import axios from "axios";

export const fetchRepositories = async () => {
  
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/repos`,{withCredentials:true}
    );
    if (res.status !== 200) {
      throw new Error("Failed to fetch repositories");
    }
    
    return res.data
};

export const fetchRepositoriesById = async(userId) =>{
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/repos/repos-owner/${userId}`,
    {withCredentials:true}
  )
  if(res.status !==200){
    throw new Error("Failed to fetch Repositories");
  }
  return res.data

}