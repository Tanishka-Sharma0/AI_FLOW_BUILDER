import express from 'express';
import { AIController } from '../controllers/aiController';

const router = express.Router();

router.post("/generate", AIController.generateResponse);
router.post("/save", AIController.saveConversation);
router.post("/conversations", AIController.getConversations);
router.post("'/conversations/:id", AIController.getConversation);



export default router;