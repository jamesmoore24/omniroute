import React from "react";
import { Job } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";

const jobs: Job[] = [
  {
    id: 1,
    title: "UI/UX Designer",
    description: "As a UI/UX Designer",
  },
];

export default function Component() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
      </div>
    </TooltipProvider>
  );
}
