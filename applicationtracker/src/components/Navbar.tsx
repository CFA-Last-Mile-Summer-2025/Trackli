'use client';

import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="fixed w-full top-0 left-0 z-50 backdrop-blur-md bg-gradient-to-br from-[#6B5B95] via-[#8B7EC8] to-[#C8A8E9]">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-2">
        <div className="font-bold text-xl tracking-tight text-white">trackli</div>

        <nav className="flex space-x-4 text-sm font-medium text-white">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            Job Board
          </Link>
          <Link
            to="/applications"
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            My Jobs
          </Link>
          <Link
            to="/resumebuilder"
            className="px-4 py-2 rounded-xl hover:bg-white/20 transition"
          >
            Resume Builder
          </Link>
        </nav>

        <div className="bg-white/40 rounded-full p-1 shadow-inner border border-white/20">
          <User className="text-white" />
        </div>
      </div>
    </div>
  );
}
