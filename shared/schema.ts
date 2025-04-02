import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  deepseekKey: text("deepseek_key").notNull(),
  fmpKey: text("fmp_key").notNull(),
  deepseekModel: text("deepseek_model").notNull().default("deepseek/deepseek-chat-v3-0324:free"),
  dataRefreshRate: text("data_refresh_rate").notNull().default("realtime"),
  saveHistory: boolean("save_history").notNull().default(true),
  includeMarketData: boolean("include_market_data").notNull().default(true),
});

// Questions and answers history
export const qaHistory = pgTable("qa_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertApiKeysSchema = createInsertSchema(apiKeys).omit({
  id: true,
});

export const insertQAHistorySchema = createInsertSchema(qaHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertApiKeys = z.infer<typeof insertApiKeysSchema>;
export type ApiKeys = typeof apiKeys.$inferSelect;

export type InsertQAHistory = z.infer<typeof insertQAHistorySchema>;
export type QAHistory = typeof qaHistory.$inferSelect;

// API Response Types
export interface FinancialQuestion {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

export interface ApiSettings {
  userId: string;
  deepseekKey: string;
  fmpKey: string;
  deepseekModel: string;
  dataRefreshRate: string;
  saveHistory: boolean;
  includeMarketData: boolean;
}
