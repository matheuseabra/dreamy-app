import { Request, Response } from "express";
import app from "./app";
import GeneratedImagesController from "./controllers/generated-images-controller";

app.get("/", (_req: Request, res: Response) => res.json({ message: "API health check" }));
app.post("/api/generate-image", GeneratedImagesController.generateImage);
app.get("/api/images", GeneratedImagesController.getGeneratedImages);
