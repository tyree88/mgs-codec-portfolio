import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createProxyMiddleware } from 'http-proxy-middleware';

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Set up a proxy for the Svelte app
  app.use('/svelte-app', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    pathRewrite: {
      '^/svelte-app': ''
    },
    ws: true
  }));

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
