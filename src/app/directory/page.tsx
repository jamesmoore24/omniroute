"use client";

import React from "react";
import { Header } from "@/components/Header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatedGridBackground } from "@/components/GridBackground";
import { Typography } from "antd";

const { Title } = Typography;

export default function DirectoryPage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white relative">
        <AnimatedGridBackground />
        <div className="relative z-10">
          <Header />
          <main className="flex items-center justify-center h-full">
            <Title
              level={1}
              className="text-gray-800 text-5xl md:text-6xl font-extrabold mb-6"
            >
              😊 Directory Page Coming Soon!
            </Title>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
} 