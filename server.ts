import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getSupabaseAdminClient, getSupabaseClient } from "./src/lib/supabase";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  console.log('ENV CHECK:', {
    hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
    hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
  });
  ```
  
  Then commit and push:
  ```
  git add .
  git commit -m "Add env debug log"
  git push
  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("featured", { ascending: false })
        .order("posted_at", { ascending: false });

      if (error) {
        throw error;
      }

      const jobsWithTags = (data ?? []).map((job: any) => {
        const date = job.posted_at ? new Date(job.posted_at as string) : null;
        const postedAt = date
          ? `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}.${date.getFullYear()}`
          : "";

        return {
          ...job,
          tags: job.tags ?? [],
          postedAt,
        };
      });

      res.json(jobsWithTags);
    } catch (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        type,
        salary,
        description,
        tags,
        featured,
        isActive,
        expiresAt,
      } = req.body;

      const supabaseAdmin = getSupabaseAdminClient();

      const { data, error } = await supabaseAdmin
        .from("jobs")
        .insert({
          title,
          company,
          location,
          type,
          salary,
          description,
          tags: tags ?? [],
          featured: !!featured,
          is_active: typeof isActive === "boolean" ? isActive : true,
          expires_at: expiresAt ?? null,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      res.json({ id: data?.id, success: true });
    } catch (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = Number(req.params.id);
      const supabaseAdmin = getSupabaseAdminClient();

      const { data, error } = await supabaseAdmin
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      const date = data.posted_at ? new Date(data.posted_at as string) : null;
      const postedAt = date
        ? `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()}`
        : "";

      res.json({
        ...data,
        tags: data.tags ?? [],
        postedAt,
      });
    } catch (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const {
        jobId,
        name,
        email,
        phone,
        message,
        cvUrl,
        gdprConsent,
        status,
      } = req.body;

      const supabaseAdmin = getSupabaseAdminClient();

      const { error } = await supabaseAdmin.from("applications").insert({
        job_id: jobId,
        name,
        email,
        phone: phone ?? null,
        cv_url: cvUrl ?? null,
        message,
        gdpr_consent: gdprConsent ?? false,
        status: status ?? "new",
      });

      if (error) {
        throw error;
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Supabase error:", error);
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
