function RepoCard({ repo, toRepo }) {
  const isPrivate = repo?.visibility === "private";

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer">
            {repo?.name}
          </h2>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            {repo?.description || "No description provided"}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
          📁
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <span className={`text-sm px-4 py-1.5 rounded-full font-semibold ${isPrivate ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {repo?.visibility}
        </span>
        <button
          onClick={() => toRepo(repo)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          View Repository
        </button>
      </div>

    </div>
  );
}

export default RepoCard;