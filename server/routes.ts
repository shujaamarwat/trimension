import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
// import { generateScene } from "./services/aiService";
// import { handleTextureUpload } from "./services/uploadService";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // AI scene generation endpoint (disabled for now)
  app.post("/api/ai/scene-from-prompt", async (req, res) => {
    res.status(503).json({ 
      error: "AI scene generation is currently disabled. Please configure OpenAI API key to enable this feature." 
    });
  });

  // Texture upload endpoint
  app.post("/api/upload/texture", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: "No file uploaded" 
        });
      }

      const url = `/uploads/${req.file.filename}`;
      res.json({ url });
      
    } catch (error) {
      console.error("Texture upload error:", error);
      res.status(500).json({ 
        error: "Failed to upload texture" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
