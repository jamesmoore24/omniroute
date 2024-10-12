export interface Job {
  id: string; // Unique identifier for the job
  title: string; // Job title
  commitment: string;
  aboutUs: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  bonuses: string[];
  location: string;
  compensation: string;
}
