import { useState } from "react";
import MyPullRequests from "../components/MyPullRequests";
import IncomingPullRequests from "../components/IncomingPullRequests";

function PullRequests() {
  const [view, setView] = useState("my");

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            px-8
            py-6
            mb-6
          "
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Pull Requests Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your pull requests and incoming contributions.
          </p>
        </div>

        {/* Toggle Buttons */}
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            p-4
            mb-6
            flex
            gap-4
          "
        >

          <button
            onClick={() => setView("my")}
            className={`
              px-6
              py-3
              rounded-xl
              font-medium
              transition-all
              duration-200
              ${
                view === "my"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            My Pull Requests
          </button>

          <button
            onClick={() => setView("incoming")}
            className={`
              px-6
              py-3
              rounded-xl
              font-medium
              transition-all
              duration-200
              ${
                view === "incoming"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            Incoming Pull Requests
          </button>

        </div>

        {/* Content */}
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            p-6
          "
        >
          {view === "my"
            ? <MyPullRequests />
            : <IncomingPullRequests />
          }
        </div>

      </div>
    </div>
  );
}

export default PullRequests;