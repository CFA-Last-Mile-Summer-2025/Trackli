"use client";

import { User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/40 rounded-full p-2 shadow-inner border border-black/20"
            >
              <User className="text-slate-800" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 text-white border border-gray-600">
            <Link to="/settings">
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
