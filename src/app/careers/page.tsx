import React from "react";
import { Job } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import JobPostingPreview from "@/components/Careers/JobPostingPreview";

const jobs: Job[] = [
  {
    id: "5db2f88d-4f4b-49e5-8aeb-0f8a9db3443c",
    title: "UI/UX Design Intern",
    aboutUs:
      "We are a team of MIT researchers and engineers who are building the future of AI. We are a tight-knit team of 4 people who are passionate about building products that help people live better lives.",
    responsibilities: [
      "Develop a reimangined UI/UX for our brand that appeals to our target demographic",
      "Learn deeply about our users and their needs",
      "Repurpose existing assets to create new and engaging content",
    ],
    requirements: ["Experience with Figma", "Experience with React"],
    bonuses: [
      "Get to own the work you do",
      "Add to your portfolio",
      "Letters of recommendation",
      "Work with a team of world class MIT AI researchers and engineers",
    ],
    commitment: "Part-time",
    compensation: "$20/hour",
    description:
      "We are on the lookout for a talented and ambitious UI/UX Designer to join our team. Our platforms can potentially attract millions of visitors each year, and we aim to provide them with a flawless and engaging experience. As a UI/UX Designer, you will play a critical role in both designing and implementing user-centric solutions that enhance functionality and drive conversions.",
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
