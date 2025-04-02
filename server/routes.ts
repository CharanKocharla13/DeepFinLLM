import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApiKeysSchema, insertQAHistorySchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user's API keys
  app.get("/api/settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const apiKeys = await storage.getApiKeys(userId);
      
      if (!apiKeys) {
        return res.status(404).json({ message: "API keys not found" });
      }
      
      return res.json(apiKeys);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve API keys" });
    }
  });

  // Save API keys
  app.post("/api/settings", async (req: Request, res: Response) => {
    try {
      const apiKeys = insertApiKeysSchema.parse(req.body);
      const savedApiKeys = await storage.saveApiKeys(apiKeys);
      return res.status(201).json(savedApiKeys);
    } catch (error) {
      return res.status(400).json({ message: "Invalid API keys data" });
    }
  });

  // Get QA history
  app.get("/api/history/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const history = await storage.getQAHistory(userId);
      return res.json(history);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve QA history" });
    }
  });

  // Save QA history
  app.post("/api/history", async (req: Request, res: Response) => {
    try {
      const qaHistory = insertQAHistorySchema.parse(req.body);
      const savedQAHistory = await storage.saveQAHistory(qaHistory);
      return res.status(201).json(savedQAHistory);
    } catch (error) {
      return res.status(400).json({ message: "Invalid QA history data" });
    }
  });

  // Clear QA history
  app.delete("/api/history/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      await storage.clearQAHistory(userId);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Failed to clear QA history" });
    }
  });

  // Ask financial question (integrates with DeepSeek and FMP APIs)
  app.post("/api/ask", async (req: Request, res: Response) => {
    try {
      const { userId, question } = req.body;
      
      if (!userId || !question) {
        return res.status(400).json({ message: "Missing userId or question" });
      }
      
      const apiKeys = await storage.getApiKeys(userId);
      
      if (!apiKeys) {
        return res.status(400).json({ message: "API keys not configured" });
      }
      
      const { deepseekKey, fmpKey, deepseekModel, includeMarketData } = apiKeys;
      
      if (!deepseekKey || !fmpKey) {
        return res.status(400).json({ message: "Missing API keys" });
      }
      
      let financialData = null;
      
      // Get financial data from FMP API if includeMarketData is true
      if (includeMarketData) {
        try {
          // Extract potential stock symbols from the question
          const symbols = extractPotentialSymbols(question);
          
          if (symbols.length > 0) {
            // Get data for the first potential symbol
            const fmpResponse = await axios.get(
              `https://financialmodelingprep.com/api/v3/quote/${symbols[0]}?apikey=${fmpKey}`
            );
            
            if (fmpResponse.data && fmpResponse.data.length > 0) {
              financialData = fmpResponse.data[0];
            }
          }
        } catch (fmpError) {
          console.error("FMP API error:", fmpError);
          // Continue even if FMP API fails
        }
      }
      
      // Prepare DeepSeek prompt with financial context
      let prompt = `As a financial advisor AI, please answer the following question with a focus on profitability and actionable advice: ${question}`;
      
      if (financialData) {
        prompt += `\n\nHere is the current financial data for a relevant company: ${JSON.stringify(financialData)}`;
      }
      
      // Call OpenRouter API with DeepSeek model
      try {
        const deepseekResponse = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
              { role: "system", content: "You are a financial advisor AI focused on providing profitable advice and actionable insights." },
              { role: "user", content: prompt }
            ]
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${deepseekKey}`,
              "HTTP-Referer": "https://replit.com",
              "X-Title": "Financial Advisor"
            }
          }
        );
        
        let answer = deepseekResponse.data.choices[0].message.content;
        
        // Clean the response to remove markdown heading symbols
        answer = cleanMarkdownHeadings(answer);
        
        // Save the Q&A to history if saveHistory is enabled
        if (apiKeys.saveHistory) {
          await storage.saveQAHistory({
            userId,
            question,
            answer
          });
        }
        
        return res.json({
          id: Date.now().toString(),
          question,
          answer,
          timestamp: new Date().toISOString()
        });
      } catch (apiError: any) {
        console.error("OpenRouter API error:", apiError.response?.data || apiError.message);
        return res.status(500).json({ 
          message: "Error calling AI API service", 
          details: apiError.response?.data?.error?.message || apiError.message 
        });
      }
      
    } catch (error: any) {
      console.error("Error processing request:", error);
      return res.status(500).json({ message: "Error processing your question", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to extract potential stock symbols from a question
function extractPotentialSymbols(question: string): string[] {
  // Simple pattern matching for potential stock symbols (uppercase 1-5 letters)
  const symbolRegex = /\b[A-Z]{1,5}\b/g;
  const matches = question.match(symbolRegex) || [];
  
  // Filter out common English words that might be mistaken for symbols
  const commonWords = ["I", "A", "AN", "THE", "AND", "OR", "FOR", "TO", "IN", "ON", "AT"];
  return matches.filter(match => !commonWords.includes(match));
}

// Helper function to clean markdown heading symbols from the response
function cleanMarkdownHeadings(text: string): string {
  if (!text) return text;
  
  // First, handle line-by-line to catch all heading patterns
  let lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    // Check if the line starts with # (markdown heading)
    if (lines[i].match(/^#{1,6}\s/)) {
      // Remove the heading markers (the # symbols)
      lines[i] = lines[i].replace(/^#{1,6}\s+/, '');
    }
  }
  
  let processedText = lines.join('\n');
  
  // Additional specific replacements for sections with special formatting
  // This catches any remaining headings we might have missed
  const commonSections = [
    'Actionable Advice',
    'Investment Recommendation',
    'Market Analysis',
    'Risk Assessment',
    'Summary',
    'Conclusion',
    'Key Points',
    'Financial Analysis',
    'Profit Potential',
    'Buy Recommendation',
    'Sell Recommendation',
    'Hold Recommendation',
    'Technical Analysis',
    'Fundamental Analysis'
  ];
  
  // Create a regex pattern for each common section
  commonSections.forEach(section => {
    const pattern = new RegExp(`###\\s+${section}:?`, 'i');
    processedText = processedText.replace(pattern, section);
  });
  
  // Finally, one more generic pass to catch any remaining patterns
  // This will remove any # symbols at the beginning of lines
  processedText = processedText.replace(/^#{1,6}\s+/gm, '');
  
  return processedText;
}
