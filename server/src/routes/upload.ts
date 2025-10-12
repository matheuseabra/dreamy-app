import { fal } from "@fal-ai/client";
import busboy from "busboy";
import { Router } from "express";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = Router();

// Configure fal client
fal.config({
  credentials: process.env.FAL_API_KEY!,
});

// Upload file endpoint
router.post(
  "/",
  authenticateUser,
  (req: AuthRequest, res) => {
    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    });

    let fileBuffer: Buffer[] = [];
    let fileName: string = "";
    let mimeType: string = "";
    let fileSize: number = 0;

    bb.on("file", (fieldname, file, info) => {
      const { filename, mimeType: detectedMimeType } = info;
      
      // Validate field name
      if (fieldname !== "image") {
        res.status(400).json({
          success: false,
          error: "Invalid field name. Expected 'image'.",
        });
        return;
      }

      // Validate MIME type
      const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(detectedMimeType)) {
        res.status(400).json({
          success: false,
          error: "Invalid file type. Only PNG, JPG, JPEG, and WEBP files are allowed.",
        });
        return;
      }

      fileName = filename;
      mimeType = detectedMimeType;

      file.on("data", (data) => {
        fileBuffer.push(data);
        fileSize += data.length;
      });

      file.on("limit", () => {
        res.status(400).json({
          success: false,
          error: "File size too large. Please upload files smaller than 10MB.",
        });
      });
    });

    bb.on("finish", async () => {
      try {
        if (fileBuffer.length === 0) {
          return res.status(400).json({
            success: false,
            error: "No file provided",
          });
        }

        // Combine all chunks into a single buffer
        const buffer = Buffer.concat(fileBuffer);

        // Create a File object from the buffer
        const file = new File([buffer], fileName, {
          type: mimeType,
        });

        // Upload to fal.ai storage
        const url = await fal.storage.upload(file);

        res.json({
          success: true,
          data: {
            url,
            filename: fileName,
            size: fileSize,
            type: mimeType,
          },
        });
      } catch (error: any) {
        console.error("Upload error:", error);
        res.status(500).json({
          success: false,
          error: error.message || "Failed to upload file",
        });
      }
    });

    bb.on("error", (err) => {
      console.error("Busboy error:", err);
      res.status(500).json({
        success: false,
        error: "Failed to parse uploaded file",
      });
    });

    req.pipe(bb);
  }
);

export default router;
