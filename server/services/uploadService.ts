import fs from "fs";
import path from "path";

export async function handleTextureUpload(file: Express.Multer.File): Promise<string> {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Move file to permanent location if needed
    const fileName = file.filename;
    const publicPath = `/uploads/${fileName}`;
    
    // In production, you might want to upload to a CDN like AWS S3
    // For now, we'll serve files from the uploads directory
    
    return publicPath;
    
  } catch (error) {
    console.error("Upload service error:", error);
    throw new Error("Failed to process uploaded file");
  }
}
