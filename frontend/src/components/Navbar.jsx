import { Link, useNavigate } from "react-router-dom";
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
    <nav className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-6 bg-gray-900 text-white shadow-md">
      <Link to="/" className="text-xl font-bold">
        GitClone
      </Link>

      

      <div className="flex items-center gap-4">

        {!isAuthenticated ? (
          <>
            <Link to="/features">Features</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link
              to={`/profile/${currentUser?.username}`}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              {currentUser?.username}
            </Link>
            
            <NotificationBell />

            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded"
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