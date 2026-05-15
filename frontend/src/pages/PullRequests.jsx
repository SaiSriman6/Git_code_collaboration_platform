import { useState } from "react";
import MyPullRequests from "../components/MyPullRequests";
import IncomingPullRequests from "../components/IncomingPullRequests";

function PullRequests() {
  const [view, setView] = useState("my");
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Pull Requests Dashboard
        </h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView("my")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            My Pull Requests
          </button>
          <button
            onClick={() => setView("incoming")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Incoming Pull Requests
          </button>
        </div>
        {view === "my"
          ? <MyPullRequests />
          : <IncomingPullRequests />
        }
      </div>
    </div>
  );
}

export default PullRequests;