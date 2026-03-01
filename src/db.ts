import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('defensehire.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    salary TEXT NOT NULL,
    description TEXT,
    tags TEXT, -- JSON array
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    featured BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    cv_url TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs (id)
  );
`);

// Seed data if empty
const count = db.prepare('SELECT count(*) as count FROM jobs').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO jobs (title, company, location, type, salary, description, tags, featured)
    VALUES (@title, @company, @location, @type, @salary, @description, @tags, @featured)
  `);

  const seedJobs = [
    {
      title: "Senior Systems Engineer",
      company: "Rheinmetall",
      location: "Düsseldorf, DE",
      type: "Full-time",
      salary: "€75,000 - €95,000",
      description: "We are seeking an experienced systems engineer for defense vehicle development.",
      tags: JSON.stringify(["Engineering", "Security Clearance", "Systems"]),
      featured: 1
    },
    {
      title: "Cybersecurity Analyst",
      company: "Thales Group",
      location: "Paris, FR",
      type: "Contract",
      salary: "€60,000 - €80,000",
      description: "Protect critical national infrastructure against advanced persistent threats.",
      tags: JSON.stringify(["IT", "Cybersecurity", "Network"]),
      featured: 0
    },
    {
      title: "Aerospace Quality Inspector",
      company: "Airbus Defence",
      location: "Munich, DE",
      type: "Full-time",
      salary: "€65,000 - €85,000",
      description: "Ensure the highest quality standards for military aviation components.",
      tags: JSON.stringify(["Manufacturing", "QA", "Aviation"]),
      featured: 1
    }
  ];

  seedJobs.forEach(job => insert.run(job));
}

export default db;
