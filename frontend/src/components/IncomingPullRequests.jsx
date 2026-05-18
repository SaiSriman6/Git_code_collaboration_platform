import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

function IncomingPullRequests() {
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();
  const [prs, setPrs] = useState([]);
  useEffect(() => {
    async function fetchIncomingPRs() {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pull-requests/incoming/${currentUser._id}`,
        { withCredentials: true }
      );
      setPrs(res.data);
    }
    fetchIncomingPRs();
  }, []);
  return (
    <div>
      {prs.length === 0
        ? <p>No incoming pull requests</p>
        : prs.map(pr => (
          <div
            key={pr._id}
            onClick={() =>
              navigate(`/pull-request/${pr._id}`, {
                state:{ repo: pr.repository }
              })
            }
            className="bg-white shadow-md rounded-lg p-4 mb-3 cursor-pointer"
          >
            <h2 className="font-semibold">
              {pr.title}
            </h2>
            <p className="text-sm text-gray-500">
              Repository: {pr.repository?.name}
            </p>
            <p className="text-sm text-gray-500">
              Author: {pr.author?.username}
            </p>
            <p className="text-sm">
              Status: {pr.status}
            </p>
          </div>
        ))
      }
    </div>
  );
}

export default IncomingPullRequests;