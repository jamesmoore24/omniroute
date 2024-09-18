import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react"; // Import the UserCircle icon

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center h-16 px-5">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
          <span className="text-black text-xl font-bold">OmniRoute</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/chat">
            <Button
              variant="ghost"
              className="text-black hover:text-orange-500"
            >
              Chat
            </Button>
          </Link>
          <Button variant="ghost" className="text-black hover:text-orange-500">
            Docs
          </Button>
          <Button variant="ghost" className="text-black hover:text-orange-500">
            <UserCircle className="w-5 h-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};
