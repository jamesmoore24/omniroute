// src/app/careers/[job_id].tsx
import React from "react";
import { Job } from "@/types"; // Adjust the import based on your types location

// Sample job data (replace this with your actual data fetching logic)
const jobs: Job[] = [
  {
    id: 1,
    title: "UI/UX Designer",
    description:
      "As a UI/UX Designer, you will design user-friendly interfaces.",
    shortDescription: "UI/UX Designer",
    compensation: "$70,000 - $90,000",
    location: "Remote",
    responsibilities: ["Design user interfaces", "Conduct user research"],
    requirements: ["Experience with Figma", "Strong portfolio"],
    bonuses: ["Health insurance", "401(k) plan"],
  },
  // Add more job postings as needed
];

const JobDetailPage = ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;

  // Find the job based on the job_id
  const job = jobs.find((job) => job.id === Number(jobId));

  if (!job) {
    return <p>Job not found.</p>; // Handle case where job is not found
  }

  return (
    <div className="job-detail">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-600">{job.description}</p>
      <p className="text-gray-700 font-bold">{job.compensation}</p>
      <p className="text-gray-500">{job.location}</p>
      <div className="mt-2">
        <h4 className="font-medium text-gray-700">Responsibilities:</h4>
        <ul className="list-disc list-inside text-gray-600">
          {job.responsibilities.map((responsibility) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h4 className="font-medium text-gray-700">Requirements:</h4>
        <ul className="list-disc list-inside text-gray-600">
          {job.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h4 className="font-medium text-gray-700">Bonuses:</h4>
        <ul className="list-disc list-inside text-gray-600">
          {job.bonuses.map((bonus) => (
            <li key={bonus}>{bonus}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobDetailPage;
