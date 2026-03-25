import express from 'express';
import { AIController } from '../controllers/aiController';

const router = express.Router();

router.post("/generate", AIController.generateResponse);
router.post("/save", AIController.saveConversation);
router.get("/conversations", AIController.getConversations);
router.get("'/conversations/:id", AIController.getConversation);



export default router;