import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#eef2f7]">

      {/* Navbar */}
      <Navbar />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          lg:hidden fixed top-7 left-5 z-[60]
          bg-white p-2 rounded-xl shadow-md
        "
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Layout */}
      <div className="flex flex-1 pt-24">

        {/* Sidebar */}
        <aside
  className={`
    fixed top-24 left-0 z-40
    w-72 bottom-0
    bg-white border-r border-gray-200
    shadow-lg overflow-y-auto
    transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
          <div className="p-6">
            <Sidebar />
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          />
        )}

        {/* Content */}
        <div className="flex-1 lg:ml-72 flex flex-col">

          {/* Main */}
          <main className="flex-1 p-8 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>

        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;