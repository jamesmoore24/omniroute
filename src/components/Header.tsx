"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center h-16 px-5">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-orange-500 rounded-full"></div>
          <span className="text-black text-xl font-bold">OmniRoute.ai</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/directory">
            <Button
              variant="ghost"
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              Directory
            </Button>
          </Link>
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
