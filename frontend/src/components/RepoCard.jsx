function RepoCard({ repo, toRepo }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-200">
      <h2 className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer">
        {repo?.name}
      </h2>
      <p className="text-gray-600 mt-1 text-sm">
        {repo?.description || "No description provided"}
      </p>
      <div className="flex items-center justify-between mt-4">
        <span className={`text-xs px-2 py-1 rounded-full 
          ${repo?.visibility === "private" 
            ? "bg-red-100 text-red-600" 
            : "bg-green-100 text-green-600"}`}
        >
          {repo?.visibility}
        </span>
        <button
          onClick={() => toRepo(repo)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View →
        </button>
      </div>
    </div>
  );
}

export default RepoCard;