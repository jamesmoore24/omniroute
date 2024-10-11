export interface Job {
  id: number; // Unique identifier for the job
  title: string; // Job title
  commitment: "Full-time" | "Part-time" | "Contract";
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  bonuses: string[];
  location: string;
  compensation: string;
}
