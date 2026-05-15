import {  useLocation } from "react-router";


function PullRequestCard() {
  let {state}=useLocation();
  return (
    <div className="border rounded p-4 mb-3">

      <h3 className="font-semibold">
        {state?.pr.title}
      </h3>

      <p className="text-gray-600">
        {state?.pr.description}
      </p>

      <span className="text-sm text-gray-500">
        by {state?.pr.author}
      </span>

    </div>
  );
}

export default PullRequestCard;