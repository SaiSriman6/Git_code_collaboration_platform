import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb]">

      {/* Navbar */}
      <Navbar
  className="
    fixed top-0 left-0 w-full z-50
    flex items-center justify-between
    px-12 h-24
    bg-white/95 backdrop-blur-md
    border-b border-gray-200
    shadow-md
  "
></Navbar>

      {/* Main Public Content */}
      <main
        className="
          flex-1
          mt-16
          px-6
          py-10
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            p-8
          "
        >
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default RootLayout;