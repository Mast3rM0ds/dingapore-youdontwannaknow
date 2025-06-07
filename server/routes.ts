import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import { db } from "./db";
import { flightSubmissions } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'flight-tracker-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.session.isAdmin) {
      next();
    } else {
      res.status(401).json({ error: 'Admin access required' });
    }
  };

  // Get current user session
  app.get('/api/auth/session', (req: any, res) => {
    res.json({
      isAdmin: req.session.isAdmin || false,
      userId: req.session.userId || null
    });
  });

  // Admin login
  app.post('/api/auth/admin', (req: any, res) => {
    const { password } = req.body;
    const adminPassword = 'bigfatfemboys'; // You can change this
    
    if (password === adminPassword) {
      req.session.isAdmin = true;
      req.session.userId = 'admin';
      res.json({ success: true, isAdmin: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  // User login (simple username for demo)
  app.post('/api/auth/login', (req: any, res) => {
    const { username } = req.body;
    if (username && username.trim()) {
      req.session.userId = username.trim();
      res.json({ success: true, userId: username.trim() });
    } else {
      res.status(400).json({ error: 'Username required' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: any, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Get all flights - use external database
  app.get('/api/flights', async (req, res) => {
    try {
      const externalResponse = await fetch('https://lacy-fine-tax.glitch.me/db');
      
      if (externalResponse.ok) {
        const externalData = await externalResponse.json();
        res.json(externalData);
      } else {
        res.status(500).json({ error: 'Failed to load data from external database' });
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      res.status(500).json({ error: 'Failed to load data' });
    }
  });

  // Add new flight
  app.post('/api/flights', async (req: any, res) => {
    try {
      const { discorduser, call, plane, dep, ari } = req.body;
      const submittedBy = req.session.userId || 'anonymous';

      // Send to external database with user tracking
      const flightData = {
        discorduser,
        call,
        plane,
        dep,
        ari,
        submittedBy
      };

      const response = await fetch('https://lacy-fine-tax.glitch.me/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightData)
      });

      if (response.ok) {
        const result = await response.json();
        res.json({ success: true, ...result });
      } else {
        res.status(500).json({ error: 'Failed to add flight to external database' });
      }
    } catch (error) {
      console.error('Error adding flight:', error);
      res.status(500).json({ error: 'Failed to add flight' });
    }
  });

  // Delete flight (user can only delete their own, admin can delete any)
  app.delete('/api/flights/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const isAdmin = req.session.isAdmin;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Send delete request to external database
      const response = await fetch(`https://lacy-fine-tax.glitch.me/db/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-Is-Admin': isAdmin ? 'true' : 'false'
        }
      });

      if (response.ok) {
        res.json({ success: true });
      } else if (response.status === 403) {
        res.status(403).json({ error: 'Can only delete your own flights' });
      } else if (response.status === 404) {
        res.status(404).json({ error: 'Flight not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete flight' });
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
      res.status(500).json({ error: 'Failed to delete flight' });
    }
  });

  // Admin-only: Get all flights with submission details
  app.get('/api/admin/flights', requireAdmin, async (req, res) => {
    try {
      const response = await fetch('https://lacy-fine-tax.glitch.me/db', {
        headers: { 'X-Admin-Request': 'true' }
      });
      
      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(500).json({ error: 'Failed to load admin data' });
      }
    } catch (error) {
      console.error('Error fetching admin flights:', error);
      res.status(500).json({ error: 'Failed to load admin data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
