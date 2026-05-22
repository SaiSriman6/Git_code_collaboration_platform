import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";

function PRDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const repo = state?.repo;
  const currentUser = useAuth(s => s.currentUser);
  const navigate = useNavigate();
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/pull-requests/${id}`, { withCredentials: true })
      .then(res => setPr(res.data.pr))
      .catch(() => toast.error("Failed to load PR"))
      .finally(() => setLoading(false));
  }, [id]);

  const patchPR = async (action, successMsg, errorMsg) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/pull-requests/${action}/${id}`, {}, { withCredentials: true });
      setPr(res.data?.pr ?? res.data);
      toast.success(successMsg);
      navigate(-1);
    } catch (err) { toast.error(err?.response?.data?.message || errorMsg); }
  };

  const deletePR = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pull-requests/${id}`, { withCredentials: true });
      toast.success("Pull Request deleted");
      navigate(-1);
    } catch { toast.error("Delete failed"); }
  };

  if (loading || !pr) return <div className="text-center mt-10 text-lg font-semibold">Loading PR details...</div>;

  const isRepoOwner = currentUser?._id === repo?.owner?._id;
  const isPRAuthor = currentUser?._id === pr.author?._id;
  const canModify = isRepoOwner || isPRAuthor;
  const statusCls = pr.status === "open" ? "bg-green-100 text-green-700" : pr.status === "merged" ? "bg-purple-100 text-purple-700" : "bg-red-100 text-red-700";
  const btnCls = "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium shadow-sm transition-all";
  const gridItemCls = "bg-gray-50 border border-gray-200 rounded-2xl p-5";

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      <div className="max-w-5xl mx-auto">

        {/* PR Header */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">🔀</div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-800">{pr.title}</h1>
                  <p className="text-gray-500 mt-1">Pull Request Details</p>
                </div>
              </div>
              <p className="text-gray-600 mt-6 leading-relaxed text-lg">{pr.description || "No description provided"}</p>
            </div>
            <span className={`px-5 py-2 rounded-full text-sm font-semibold ${statusCls}`}>{pr.status.toUpperCase()}</span>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            {[["Author", pr.author?.username], ["Source Branch", pr.sourceBranch], ["Target Branch", pr.targetBranch], ["Current Status", pr.status]].map(([label, value]) => (
              <div key={label} className={gridItemCls}>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">{value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {canModify && (
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100">
              {isRepoOwner && pr.status === "open" && <button onClick={() => patchPR("merge", "Pull Request merged", "Merge failed")} className={btnCls}>Merge PR</button>}
              {pr.status === "open" && <button onClick={() => patchPR("close", "Pull Request closed", "Close failed")} className={btnCls}>Close PR</button>}
              {pr.status === "closed" && <button onClick={() => patchPR("reopen", "Pull Request reopened", "Reopen failed")} className={btnCls}>Reopen PR</button>}
              <button onClick={deletePR} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-medium shadow-sm transition-all">Delete PR</button>
              <button onClick={() => navigate("/update-pr", { state: { repo, pr } })} className={btnCls}>Edit PR</button>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Discussion</h2>
          <CommentSection pullRequestId={pr._id} />
        </div>

      </div>
    </div>
  );
}

export default PRDetails;