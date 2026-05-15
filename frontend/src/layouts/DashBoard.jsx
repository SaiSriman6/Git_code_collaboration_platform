import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Fixed Navbar */}
      <Navbar />

      {/* Layout body */}
      <div className="flex flex-1 mt-16">

        <Sidebar />

        <main className="flex-1 p-6 bg-gray-100 overflow-x-hidden">
          <Outlet />
        </main>

      </div>

      <Footer />

    </div>
  );
}

export default DashboardLayout;