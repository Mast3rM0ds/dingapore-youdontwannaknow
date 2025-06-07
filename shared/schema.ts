import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sessions table for auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Flight submissions table
export const flightSubmissions = pgTable("flight_submissions", {
  id: varchar("id").primaryKey(),
  discorduser: varchar("discorduser").notNull(),
  call: varchar("call").notNull(),
  plane: varchar("plane").notNull(),
  dep: varchar("dep").notNull(),
  ari: varchar("ari").notNull(),
  submittedBy: varchar("submitted_by").notNull(), // Track who submitted
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFlightSchema = createInsertSchema(flightSubmissions).omit({
  id: true,
  createdAt: true,
});

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flightSubmissions.$inferSelect;