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

  // Get all flights - proxy to external API and merge with local data
  app.get('/api/flights', async (req, res) => {
    try {
      // Get flights from external API
      const externalResponse = await fetch('https://lacy-fine-tax.glitch.me/api');
      let externalFlights = [];
      
      if (externalResponse.ok) {
        const externalData = await externalResponse.json();
        if (externalData.status === "success" && Array.isArray(externalData.allData)) {
          externalFlights = externalData.allData;
        }
      }

      // Get flights from local database
      const localFlights = await db.select().from(flightSubmissions);

      // Combine and format
      const allFlights = [
        ...externalFlights.map((flight: any) => ({ ...flight, submittedBy: 'external' })),
        ...localFlights.map(flight => ({
          discorduser: flight.discorduser,
          call: flight.call,
          plane: flight.plane,
          dep: flight.dep,
          ari: flight.ari,
          submittedBy: flight.submittedBy,
          id: flight.id
        }))
      ];

      res.json({
        status: "success",
        allData: allFlights
      });
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

      // Save to local database with user tracking
      const flightId = randomUUID();
      await db.insert(flightSubmissions).values({
        id: flightId,
        discorduser,
        call,
        plane,
        dep,
        ari,
        submittedBy
      });

      // Also send to external API
      try {
        await fetch('https://lacy-fine-tax.glitch.me/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discorduser, call, plane, dep, ari })
        });
      } catch (extError) {
        console.warn('External API error:', extError);
      }

      res.json({ success: true, id: flightId });
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

      // Find the flight
      const flight = await db.select().from(flightSubmissions).where(eq(flightSubmissions.id, id));
      
      if (flight.length === 0) {
        return res.status(404).json({ error: 'Flight not found' });
      }

      // Check permissions
      if (!isAdmin && flight[0].submittedBy !== userId) {
        return res.status(403).json({ error: 'Can only delete your own flights' });
      }

      // Delete from database
      await db.delete(flightSubmissions).where(eq(flightSubmissions.id, id));

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting flight:', error);
      res.status(500).json({ error: 'Failed to delete flight' });
    }
  });

  // Admin-only: Get all flights with submission details
  app.get('/api/admin/flights', requireAdmin, async (req, res) => {
    try {
      const flights = await db.select().from(flightSubmissions);
      res.json(flights);
    } catch (error) {
      console.error('Error fetching admin flights:', error);
      res.status(500).json({ error: 'Failed to load admin data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
