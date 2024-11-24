import React from "react";
import Link from "next/link";
import { Job } from "@/types";
import { MapPin } from "lucide-react";

const JobPostingPreview = ({ job }: { job: Job }) => {
  return (
    <Link href={`/careers/${job.id}`} passHref>
      <div className="job-posting bg-white border rounded-lg shadow-md pt-2 p-4 hover:shadow-lg cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
        <p className="text-gray-600 mb-2">{job.description}</p>
        <p className="text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </p>
      </div>
    </Link>
  );
};

export default JobPostingPreview;
