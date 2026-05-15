import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 min-w-64 h-[calc(100vh-64px)] sticky top-16 bg-gray-900 text-white p-4">

      <ul className="space-y-4 whitespace-nowrap">

        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/profile/me">Profile</Link>
        </li>

        <li>
          <Link to="/repo/:id/pulls">PullRequests</Link>
        </li>

        <li>
          <Link to="/repositories">My Repositories</Link>
        </li>

        <li>
          <Link to="/repo/:id/issues">Issues</Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;