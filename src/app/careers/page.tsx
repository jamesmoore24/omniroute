import React from "react";
import { Job } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import JobPosting from "@/components/Careers/JobPosting";

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
        <div className="flex-1 p-4">
          {jobs.map((job) => (
            <JobPosting key={job.id} job={job} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
