import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIResponse, type ChatRequest } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/universities", async (req, res) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json(universities);
    } catch (error: any) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  app.get("/api/universities/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const results = await storage.searchUniversities(query);
      res.json(results);
    } catch (error: any) {
      console.error("Error searching universities:", error);
      res.status(500).json({ message: "Failed to search universities" });
    }
  });

  app.get("/api/universities/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const university = await storage.getUniversityBySlug(slug);
      
      if (!university) {
        res.status(404).json({ message: "University not found" });
        return;
      }
      
      res.json(university);
    } catch (error: any) {
      console.error("Error fetching university:", error);
      res.status(500).json({ message: "Failed to fetch university" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const chatRequest: ChatRequest = req.body;
      
      if (!chatRequest.message || !chatRequest.message.trim()) {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const response = await generateAIResponse(chatRequest);
      res.json({ message: response });
    } catch (error: any) {
      console.error("Error generating AI response:", error);
      res.status(500).json({ 
        message: error.message || "Failed to generate AI response" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
