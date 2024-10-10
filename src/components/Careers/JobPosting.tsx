import React from "react";
import Link from "next/link";
import { Job } from "@/types";

const JobPosting = ({ job }: { job: Job }) => {
  return (
    <div className="job-posting">
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <Link href={`/careers/${job.id}`}>View Details</Link>
    </div>
  );
};

export default JobPosting;
