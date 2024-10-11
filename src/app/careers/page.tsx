import React from "react";
import { Job } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import JobPostingPreview from "@/components/Careers/JobPostingPreview";

const jobs: Job[] = [
  {
    id: 1,
    title: "UI/UX Design Intern",
    responsibilities: ["Design UI/UX", "Design UI/UX"],
    requirements: ["Experience with Figma", "Experience with React"],
    bonuses: ["Bonus for working with AI", "Bonus for working with AI"],
    shortDescription: "UI/UX Designer",
    commitment: "Part-time",
    compensation: "$20/hour",
    description:
      "We are on the lookout for a talented UI/UX Designer to join our team. Our platforms can potentially attract millions of visitors each year, and we aim to provide them with a flawless and engaging experience. As a UI/UX Designer, you will play a critical role in both designing and implementing user-centric solutions that enhance functionality and drive conversions.",
    location: "Remote",
  },
];

export default function Component() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
        <div className="flex-1 p-4">
          {jobs.map((job) => (
            <JobPostingPreview key={job.id} job={job} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
