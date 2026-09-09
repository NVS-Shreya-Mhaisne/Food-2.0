import express from "express";
import { chatWithAi, analyzeFoodImage } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/chat", chatWithAi);
aiRouter.post("/analyze-image", analyzeFoodImage);

export default aiRouter;
