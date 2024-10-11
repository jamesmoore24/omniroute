import React from "react";
import Link from "next/link";
import { Job } from "@/types";
import { MapPin, DollarSign } from "lucide-react";

const JobPostingPreview = ({ job }: { job: Job }) => {
  return (
    <Link href={`/careers/${job.id}`} passHref>
      <div className="job-posting bg-white border rounded-lg shadow-md pt-2 p-4 hover:shadow-lg cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
        <p className="text-gray-600">{job.description}</p>
        <p className="text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </p>
        <p className="text-gray-500 flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          {job.compensation}
        </p>
      </div>
    </Link>
  );
};

export default JobPostingPreview;
