import React from "react";
import { Job } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import JobPostingPreview from "@/components/Careers/JobPostingPreview";

const jobs: Job[] = [
  {
    id: "5db2f88d-4f4b-49e5-8aeb-0f8a9db3443c",
    title: "Founding Marketing & Design Intern",
    responsibilities: [
      "Reimagining our brand identity and developing a cohesive visual design language that appeals to our target demographic",
      "Refactoring our pitch deck to effectively communicate our value proposition and unique selling points",
      "Developing a new mockup for our web application that showcases a user-centric and intuitive design",
      "Collaborating with our team of engineers and researchers to implement design solutions and iterate on feedback",
    ],
    aboutUs:
      "Currently, people are stuck using multiple interfaces to access different AI models, often paying upwards of $20/month for each premium platform (ChatGPT Plus, Gemini Pro, etc). With Omniroute, we envision a future where anyone can fully utilize the benefits of every model provider through a single interface. We do this by routing requests to the best model for the task at hand. We are currently a pre-seed, stealth startup backed by MIT Sandbox looking to raise our seed round in the coming months.",
    requirements: [
      "Pursuing a bachelor's degree in Marketing, Business, Graphic Design, or a related design-oriented field",
      "Strong understanding of design principles, human-centered design, and user experience design",
      "Excellent written and verbal communication skills",
      "Experience with front-end development (HTML, CSS, JavaScript) is a plus",
      "Experience with Figma, Sketch, and/or Adobe XD",
    ],
    bonuses: [
      "Add to your portfolio with a high-profile project that will be featured on our website and marketing materials",
      "Receive letters of recommendation from our team of world-class MIT AI researchers and engineers",
      "Flexible, remote work arrangements",
    ],
    commitment: "Part-time (5-10 hours/week)",
    compensation:
      "$500 upon project completion with the opportunity to earn more cash, equity, and join the team full-time depending on performance",
    description:
      "We are on the lookout for a talented Founding Marketing & Design intern to join our team. Our platforms can potentially attract millions of visitors and business owners alike, and we aim to provide them with a flawless and engaging experience. As a Marketing & Design intern, you will play a critical role in both designing and implementing user-centric solutions that enhance functionality and drive conversions.",
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
