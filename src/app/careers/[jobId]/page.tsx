// src/app/careers/[job_id].tsx
import React from "react";
import { Job } from "@/types"; // Adjust the import based on your types location
import { TooltipProvider } from "@/components/ui/tooltip"; // Adjust the import based on your structure
import { Header } from "@/components/Header"; // Adjust the import based on your structure

// Sample job data (replace this with your actual data fetching logic)
const jobs: Job[] = [
  {
    id: 1,
    title: "UI/UX Design Intern",
    responsibilities: ["Design UI/UX", "Design UI/UX"],
    requirements: ["Experience with Figma", "Experience with React"],
    bonuses: ["Bonus for working with AI", "Bonus for working with AI"],
    shortDescription: "UI/UX Designer",
    commitment: "Contract",
    compensation: "$500",
    description:
      "We are on the lookout for a talented UI/UX Designer to join our team. Our platforms can potentially attract millions of visitors and business owners alike, and we aim to provide them with a flawless and engaging experience. As a UI/UX Designer, you will play a critical role in both designing and implementing user-centric solutions that enhance functionality and drive conversions.",
    location: "Remote",
  },
];

const JobDetailPage = ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;

  // Find the job based on the job_id
  const job = jobs.find((job) => job.id === Number(jobId));

  if (!job) {
    return <p>Job not found.</p>; // Handle case where job is not found
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-gray-100 text-black">
        <Header />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <p className="text-gray-700 mb-2">{job.shortDescription}</p>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Compensation:{" "}
              <span className="text-green-600">{job.compensation}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Commitment:{" "}
              <span className="text-blue-600">{job.commitment}</span>
            </p>
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Location: <span className="text-purple-600">{job.location}</span>
            </p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">
              Job Description
            </h2>
            <p className="text-gray-600 mb-4">{job.description}</p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside mb-4">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-gray-600">
                  {responsibility}
                </li>
              ))}
            </ul>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Requirements</h2>
            <ul className="list-disc list-inside mb-4">
              {job.requirements.map((requirement, index) => (
                <li key={index} className="text-gray-600">
                  {requirement}
                </li>
              ))}
            </ul>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Bonuses</h2>
            <ul className="list-disc list-inside mb-4">
              {job.bonuses.map((bonus, index) => (
                <li key={index} className="text-gray-600">
                  {bonus}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobDetailPage;
