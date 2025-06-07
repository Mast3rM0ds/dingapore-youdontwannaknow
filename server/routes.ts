import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  const flightDataFile = path.join(process.cwd(), 'shared', 'flight-data.json');

  // Get all flights - returns your API format
  app.get('/api/flights', (req, res) => {
    try {
      if (!fs.existsSync(flightDataFile)) {
        // Create initial flight data if file doesn't exist
        const initialData = {
          status: "success",
          allData: [
            {
              discorduser: "voidartaron.java",
              call: "AAL123",
              plane: "Boeing 737",
              dep: "JFK",
              ari: "LAX"
            },
            {
              discorduser: "pilot_mike",
              call: "UAL456",
              plane: "Airbus A320",
              dep: "ORD",
              ari: "DEN"
            }
          ]
        };
        fs.writeFileSync(flightDataFile, JSON.stringify(initialData, null, 2));
      }
      
      const data = JSON.parse(fs.readFileSync(flightDataFile, 'utf8'));
      res.json(data);
    } catch (error) {
      console.error('Error reading flight data file:', error);
      res.status(500).json({ error: 'Failed to load data' });
    }
  });

  // Add new flight
  app.post('/api/flights', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(flightDataFile, 'utf8'));
      const newFlight = req.body;
      data.allData.push(newFlight);
      fs.writeFileSync(flightDataFile, JSON.stringify(data, null, 2));
      res.json(newFlight);
    } catch (error) {
      console.error('Error adding flight:', error);
      res.status(500).json({ error: 'Failed to add flight' });
    }
  });

  // Delete flight by callsign
  app.delete('/api/flights/:callsign', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(flightDataFile, 'utf8'));
      data.allData = data.allData.filter((flight: any) => flight.call !== req.params.callsign);
      fs.writeFileSync(flightDataFile, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting flight:', error);
      res.status(500).json({ error: 'Failed to delete flight' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
