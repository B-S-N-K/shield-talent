import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import db from "./src/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/jobs", (req, res) => {
    try {
      const jobs = db.prepare('SELECT * FROM jobs ORDER BY featured DESC, posted_at DESC').all();
      // Parse tags from JSON string
      const jobsWithTags = jobs.map((job: any) => {
        const date = new Date(job.posted_at);
        const euDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        return {
          ...job,
          tags: JSON.parse(job.tags || '[]'),
          postedAt: euDate
        };
      });
      res.json(jobsWithTags);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs", (req, res) => {
    try {
      const { title, company, location, type, salary, description, tags, featured } = req.body;
      const stmt = db.prepare(`
        INSERT INTO jobs (title, company, location, type, salary, description, tags, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(title, company, location, type, salary, description, JSON.stringify(tags), featured ? 1 : 0);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs/:id", (req, res) => {
    try {
      const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
      if (job) {
        // @ts-ignore
        job.tags = JSON.parse(job.tags || '[]');
        
        // @ts-ignore
        const date = new Date(job.posted_at);
        // @ts-ignore
        job.postedAt = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
        
        res.json(job);
      } else {
        res.status(404).json({ error: "Job not found" });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/applications", (req, res) => {
    try {
      const { jobId, name, email, message, cvUrl } = req.body;
      const stmt = db.prepare(`
        INSERT INTO applications (job_id, name, email, message, cv_url)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(jobId, name, email, message, cvUrl);
      res.json({ success: true });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
