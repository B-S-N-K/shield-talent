export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description?: string;
  tags: string[];
  postedAt: string;
  featured: boolean;
}
