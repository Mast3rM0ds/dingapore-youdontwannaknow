import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  const dataFile = path.join(process.cwd(), 'shared', 'data.json');

  // Get all items
  app.get('/api/items', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      res.json(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      res.status(500).json({ error: 'Failed to load data' });
    }
  });

  // Add new item
  app.post('/api/items', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      const newItem = {
        id: Math.max(...data.map((item: any) => item.id), 0) + 1,
        ...req.body
      };
      data.push(newItem);
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
      res.json(newItem);
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: 'Failed to add item' });
    }
  });

  // Delete item
  app.delete('/api/items/:id', (req, res) => {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      const filteredData = data.filter((item: any) => item.id !== parseInt(req.params.id));
      fs.writeFileSync(dataFile, JSON.stringify(filteredData, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
