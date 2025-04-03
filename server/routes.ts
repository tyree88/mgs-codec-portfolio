import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { IncomingMessage, ServerResponse } from 'http';
import { storage } from "./storage";
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Set up a proxy for the Svelte app with enhanced reliability
  const svelteProxy = createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true, // Enable WebSockets
    // Extra options for better reliability
    ...(({
      proxyTimeout: 120000, // Extended timeout (2 minutes)
      timeout: 120000,      // Connection timeout
      followRedirects: true,
      onProxyRes: (proxyRes: any, req: IncomingMessage, res: ServerResponse) => {
        // Add CORS headers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        // Log successful proxy responses for debugging
        console.log(`Proxy response: ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
      },
      onError: (err: Error, req: IncomingMessage, res: ServerResponse) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.writeHead(502, {
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(`
            <html>
              <head>
                <title>Codec Connection Error</title>
                <style>
                  body { 
                    background: #000; 
                    color: #00ff00; 
                    font-family: 'Courier New', monospace;
                    padding: 30px;
                    text-align: center;
                  }
                  .error-box {
                    border: 1px solid #00ff00;
                    padding: 20px;
                    margin: 30px auto;
                    max-width: 600px;
                  }
                  h1 { color: #ff0000; }
                  button {
                    background: #003300;
                    color: #00ff00;
                    border: 1px solid #00ff00;
                    padding: 10px 15px;
                    font-family: 'Courier New', monospace;
                    cursor: pointer;
                    margin-top: 20px;
                  }
                  button:hover {
                    background: #00ff00;
                    color: #000;
                  }
                </style>
              </head>
              <body>
                <div class="error-box">
                  <h1>CODEC COMMUNICATION ERROR</h1>
                  <p>Unable to establish connection to frequency: 140.85</p>
                  <p>Error: ${err.message}</p>
                  <p>Try refreshing the page or check if the Svelte dev server is running.</p>
                  <button onclick="location.reload()">RETRY CONNECTION</button>
                </div>
              </body>
            </html>
          `);
        }
      }
    } as unknown) as ProxyOptions<IncomingMessage, ServerResponse>)
  });
  
  // Apply proxy to both /svelte-app path and root for better accessibility
  app.use('/svelte-app', svelteProxy);
  app.use('/app', svelteProxy);
  
  // Explicitly proxy WebSocket connections with better configuration
  app.use(['/ws', '/socket.io', '/__vite_hmr', '/vite-hmr'], createProxyMiddleware({
    target: 'ws://localhost:5173',
    ws: true,
    changeOrigin: true
  }));

  // Serve the standalone fallback page as the root
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile('index.html', { root: './public' });
  });

  // Add a health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Add an API endpoint for checking codec status 
  app.get('/api/codec-status', (_req: Request, res: Response) => {
    res.status(200).json({ 
      status: 'online',
      frequency: '140.85',
      lastCommunication: new Date().toISOString()
    });
  });

  // Basic error handler middleware
  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    if (err) {
      console.error('Express error:', err);
      if (!res.headersSent) {
        res.status(500).send('Server Error: ' + err.message);
      }
    } else {
      next();
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
