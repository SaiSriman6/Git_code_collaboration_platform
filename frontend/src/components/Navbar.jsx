import { Link, useNavigate , NavLink } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { toast } from "react-hot-toast";
import NotificationBell from "./NotificationBell";

function Navbar() {
  let currentUser = useAuth(state => state.currentUser);
  let navigate = useNavigate();
  let isAuthenticated = useAuth(state => state.isAuthenticated);
  let logout = useAuth(state => state.logout);

  const onLogout = async () => {
    await logout();
    toast.success("Logout successful");
    navigate("/login");
  };

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        h-24
        pl-20 pr-6 lg:px-12
        shadow-md
        z-50
        flex
        items-center
        justify-between
        bg-white/95
        backdrop-blur-md
        border-b
        border-gray-200
      "
    >
      {/* Logo */}
      <Link
        to="/"
        className="
          text-2xl lg:text-4xl
          font-extrabold
          tracking-tight
          text-blue-600
          hover:text-blue-700
          transition
        "
      >
        GitHub-Style Code Collaboration
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {!isAuthenticated ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) => `px-4 py-2 rounded-lg font-bold transition ${isActive ? "bg-blue-600 text-white" : "text-black hover:text-blue-600"}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) => `px-4 py-2 rounded-lg font-bold transition ${isActive ? "bg-blue-600 text-white" : "text-black hover:text-blue-600"}`}
            >
              Signup
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) => `px-4 py-2 rounded-lg font-bold transition ${isActive ? "bg-blue-600 text-white" : "text-black hover:text-blue-600"}`}
            >
              Login
            </NavLink>
          </>
        ) : (
          <>
            {/* Profile */}
            <Link
              to={`/profile/${currentUser?.username}`}
              className="
                bg-gray-100
                hover:bg-gray-200
                text-gray-700
                px-4
                py-2
                rounded-xl
                font-medium
                transition-all
                duration-200
              "
            >
              {currentUser?.username}
            </Link>

            {/* Notification */}
            <div
              className="
                bg-gray-100
                hover:bg-gray-200
                p-2
                rounded-xl
                transition-all
                duration-200
              "
            >
              <NotificationBell />
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                py-2
                rounded-xl
                font-medium
                shadow-sm
                transition-all
                duration-200
              "
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;