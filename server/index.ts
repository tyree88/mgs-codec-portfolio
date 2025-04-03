import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Run Svelte app in a separate process with enhanced reliability
  try {
    import('child_process').then(({ spawn }) => {
      // Use spawn instead of exec for better stream handling
      const svelteProcess = spawn('node', ['svelte-start.js'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false, // Keep tied to parent process
      });
      
      // Pipe output to console with prefixes for better readability
      svelteProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.filter((line: string) => line.trim() !== '').forEach((line: string) => {
          log(`[SVELTE] ${line}`, 'svelte');
        });
      });
      
      svelteProcess.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.filter((line: string) => line.trim() !== '').forEach((line: string) => {
          console.error(`[SVELTE ERROR] ${line}`);
        });
      });
      
      // Handle process exit
      svelteProcess.on('exit', (code, signal) => {
        if (code !== 0) {
          console.error(`Svelte process exited with code ${code}, signal: ${signal}`);
          // Attempt to restart after 5 seconds
          setTimeout(() => {
            log("Attempting to restart Svelte process...", 'svelte');
            try {
              spawn('node', ['svelte-start.js'], {
                stdio: 'inherit',
                detached: false,
              });
            } catch (e) {
              console.error("Failed to restart Svelte process:", e);
            }
          }, 5000);
        } else {
          log("Svelte process exited normally", 'svelte');
        }
      });
      
      // Log startup
      log("Started Svelte app in background with enhanced monitoring", 'svelte');
      
      // Clean up on server shutdown
      process.on('exit', () => {
        try {
          svelteProcess.kill();
        } catch (e) {
          // Ignore errors when killing process during shutdown
        }
      });
    });
  } catch (error: unknown) {
    console.error("Failed to start Svelte app:", error);
  }

  // Root redirect is now handled in routes.ts
  
  // Explicitly serve the public directory
  app.use(express.static('public'));

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
