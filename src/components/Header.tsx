import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "@/assets/logo.png";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center h-16 px-5">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-orange-500 rounded-full"></div>
          <span className="text-black text-xl font-bold">OmniRoute</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/chat">
            <Button variant="ghost" className="text-black hover:text-green-500">
              Chat
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
