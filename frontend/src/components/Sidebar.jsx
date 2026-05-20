import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  User,
  GitPullRequest,
  FolderGit2,
  Bug,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "My Repositories",
      path: "/repositories",
      icon: <FolderGit2 size={20} />,
    },
    {
      name: "Pull Requests",
      path: "/repo/:id/pulls",
      icon: <GitPullRequest size={20} />,
    },
    {
      name: "Issues",
      path: "/repo/:id/issues",
      icon: <Bug size={20} />,
    },
    {
      name: "Profile",
      path: "/profile/me",
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between px-5 py-8">
      
      {/* Top Navigation */}
      <div>
        <ul className="space-y-3">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-4
                    px-4 py-3
                    rounded-2xl
                    font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  <span>{item.icon}</span>

                  <span className="text-[15px]">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Card */}
      <div className="mt-10">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          
          <h2 className="font-bold text-blue-700 text-lg">
            Welcome 👋
          </h2>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Manage repositories, pull requests and issues professionally.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;