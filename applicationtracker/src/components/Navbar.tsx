'use client';

import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">

        <div className="font-bold text-lg tracking-tight">
          <span className="text-black">trackli</span>
        </div>

        <nav className="space-x-6 text-sm font-medium text-black">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/jobs" className="hover:underline">
            Job Board
          </Link>
          <Link to="/applications" className="hover:underline">
            My Jobs
          </Link>
          <Link to="/resumebuilder" className="hover:underline">
            Resume Builder
          </Link>
        </nav>

        {/* Add pfp/avatar */}
        <Link to="/signup">
        <User/>
        </Link>
      </div>
    </header>
  );
}
