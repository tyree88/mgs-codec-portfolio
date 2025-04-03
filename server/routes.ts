import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { IncomingMessage, ServerResponse } from 'http';
import { storage } from "./storage";
import { createProxyMiddleware, Options as ProxyOptions } from 'http-proxy-middleware';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Set up a proxy for the Svelte app with improved configuration
  app.use('/svelte-app', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    pathRewrite: {
      '^/svelte-app': ''
    },
    ws: true,
    // Extra options cast as any to avoid TypeScript errors
    ...(({
      proxyTimeout: 60000, // Increase timeout
      onError: (err: Error, req: IncomingMessage, res: ServerResponse) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end('Proxy error: ' + err.message);
        }
      }
    } as unknown) as ProxyOptions<IncomingMessage, ServerResponse>)
  }));
  
  // Explicitly proxy WebSocket connections
  app.use('/ws', createProxyMiddleware({
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
