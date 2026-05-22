import { useLocation } from "react-router";

function PullRequestCard() {
  const { state } = useLocation();
  const pr = state?.pr;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{pr?.title}</h3>
          <p className="text-gray-600 mt-3 leading-relaxed">
            {pr?.description || "No description provided"}
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
          🔀
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Created by</p>
          <p className="font-semibold text-gray-800">{pr?.author}</p>
        </div>
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          Pull Request
        </span>
      </div>

    </div>
  );
}

export default PullRequestCard;