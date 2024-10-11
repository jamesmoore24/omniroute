// src/app/careers/[job_id].tsx
import React from "react";
import { Job } from "@/types"; // Adjust the import based on your types location
import { TooltipProvider } from "@/components/ui/tooltip"; // Adjust the import based on your structure
import { Header } from "@/components/Header"; // Adjust the import based on your structure

// Sample job data (replace this with your actual data fetching logic)
const jobs: Job[] = [
  {
    id: "5db2f88d-4f4b-49e5-8aeb-0f8a9db3443c",
    title: "UI/UX Design Intern",
    responsibilities: [
      "Reimagining our brand identity and developing a cohesive visual design language that appeals to our target demographic",
      "Refactoring our pitch deck to effectively communicate our value proposition and unique selling points",
      "Developing a new mockup for our web application that showcases a user-centric and intuitive design",
      "Collaborating with our team of engineers and researchers to implement design solutions and iterate on feedback",
    ],
    aboutUs:
      "Currently, people are stuck using multiple interfaces to access different AI models, often paying upwards of $20/month for each premium platform (ChatGPT Plus, Gemini Pro, etc). With Omniroute, we envision a future where anyone can fully utilize the benefits of every model provider through a single interface. We do this by routing requests to the best model for the task at hand. We are currently a pre-seed, stealth startup backed by MIT Sandbox looking to raise our seed round in the coming months.",
    requirements: [
      "Pursuing a bachelor's degree in UI/UX Design, Computer Science, or a related field",
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
    commitment: "Part-time",
    compensation:
      "$500 upon project completion with the opportunity to earn more",
    description:
      "We are on the lookout for a talented UI/UX Designer to join our team. Our platforms can potentially attract millions of visitors and business owners alike, and we aim to provide them with a flawless and engaging experience. As a UI/UX Designer, you will play a critical role in both designing and implementing user-centric solutions that enhance functionality and drive conversions.",
    location: "Remote",
  },
];

const JobDetailPage = ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;

  // Find the job based on the job_id
  const job = jobs.find((job) => job.id === jobId);

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
            <div className="flex flex-row">
              <p
                className="text-black font-semibold mb-4"
                style={{ whiteSpace: "pre" }}
              >
                {"Job ID: "}
              </p>
              <p className="text-gray-600 mb-4">{job.id}</p>
            </div>
            <h2 className="text-2xl font-semibold mt-6 mb-2">About us:</h2>
            <p className="text-gray-600 mb-4">{job.aboutUs}</p>
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

            <div className="flex flex-row">
              <p
                className="text-black font-semibold mb-4"
                style={{ whiteSpace: "pre" }}
              >
                {"Compensation: "}
              </p>
              <p className="text-gray-600 mb-4">{job.compensation}</p>
            </div>
            <div className="flex flex-row">
              <p
                className="text-black font-semibold mb-4"
                style={{ whiteSpace: "pre" }}
              >
                {"Commitment: "}
              </p>
              <p className="text-gray-600 mb-4">{job.commitment}</p>
            </div>
            <div className="flex flex-row">
              <p
                className="text-black font-semibold mb-4"
                style={{ whiteSpace: "pre" }}
              >
                {"Location: "}
              </p>
              <p className="text-gray-600 mb-4">{job.location}</p>
            </div>
            <h1 className="text-3xl font-bold mb-4">How to Apply</h1>
            <p className="text-gray-600 mb-4">
              Please email your resume and portfolio to{" "}
              <b>
                <a href="mailto:jame.moore24@gmail.com">
                  jame.moore24@gmail.com
                </a>
              </b>{" "}
              with the subject line <b>"Omniroute {job.title} Application"</b>{" "}
              and we'll follow up if you're a good fit!
              <br />
              <br />
              Looking forward to seeing your application!
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default JobDetailPage;
