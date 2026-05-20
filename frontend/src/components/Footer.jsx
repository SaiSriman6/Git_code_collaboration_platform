import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto text-white">
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <h1 className="text-2xl font-bold text-blue-500">
              GitHub-Style Collaboration
            </h1>

            <p className="text-gray-400 mt-3 leading-relaxed">
              A modern platform for repository management,
              issue tracking, pull requests, and seamless
              team collaboration.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Navigation
            </h2>

            <div className="flex flex-col gap-3 text-gray-400">
              
              <a
                href="/dashboard"
                className="hover:text-blue-400 transition"
              >
                Dashboard
              </a>

              <a
                href="/repos"
                className="hover:text-blue-400 transition"
              >
                Repositories
              </a>

              <a
                href="/issues"
                className="hover:text-blue-400 transition"
              >
                Issues
              </a>
              <a
                href="/pullrequests"
                className="hover:text-blue-400 transition"
              >
                Pull Requests
              </a>
            </div>
          </div>
          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Contact
            </h2>

            <div className="space-y-3 text-gray-400">
              <p>support@collabplatform.com</p>
              <p>www.collabplatform.com</p>
              <p>India</p>
            </div>
          </div>
        </div>
        {/* Bottom */}
        <div
          className="
            border-t border-gray-800
            mt-10 pt-6
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="text-gray-500 text-sm">
            © 2026 GitHub-Style Collaboration. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Built with React, Tailwind CSS & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;