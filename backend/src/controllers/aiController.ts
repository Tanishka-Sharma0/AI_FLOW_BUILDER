import { Request, Response } from "express";
import axios from 'axios';
import { Conversation } from "../models/Conversation";
import { AIRequest, AIResponse } from "../types"


export class AIController {
    static async generateResponse(req: Request, res: Response): Promise<void> {
        try {
            const { prompt, model = 'openrouter/auto' } = req.body as AIRequest;
            if (!prompt) {
                res.status(400).json({
                    success: false,
                    error: 'Prompt is required',
                } as AIResponse);
                return;
            }
            const response = await axios.post(
                `${process.env.OPENROUTER_BASE_URL}/chat/completions`,
                {
                    model: model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 500

                },

                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
                        'X-Title': 'MERN AI Flow',
                    },

                }
            );
            const aiResponse = response.data.choices[0]?.message?.content || 'No response generated';

            res.json({
                success: true,
                data: {
                    response: aiResponse,
                    model: model,
                },
            } as AIResponse);

        } catch (error: any) {
            console.error('Error generating AI response:', error.response?.data || error.message);
            res.status(500).json({
                success: false,
                error: error.response?.data?.error?.message || 'Failed to generate AI response',
            } as AIResponse);
        }
    }

    static async saveConversation(req: Request, res: Response): Promise<void> {
        try {
            const { prompt, response, modelUsed, metadata } = req.body;

            if (!prompt || !response) {
                res.status(400).json({
                    success: false,
                    error: 'Prompt and response are required',
                });
                return;
            }

            const conversation = new Conversation({
                prompt,
                response,
                modelUsed,
                metadata,
            });

            await conversation.save();

            res.status(201).json({
                success: true,
                data: conversation,
            });

        } catch (error: any) {
            console.error('Error saving conversation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate AI response',
            });
        }
    }

    static async getConversations(req: Request, res: Response): Promise<void> {
        try {
            const conversation = await Conversation.find().sort({ createdAt: -1 }).limit(50);

            res.json({
                success: true,
                data: conversation,
            });

        } catch (error: any) {
            console.error('Error fetching conversations:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch conversations',
            });
        }
    }

    static async getConversation(req: Request, res: Response): Promise<void> {
        try {
            const conversation = await Conversation.findById(req.params.id);

            if (!conversation) {
                res.status(404).json({
                    success: false,
                    error: 'Conversation not found',
                });
                return;
            }

            res.json({
                success: true,
                data: conversation,
            });

        } catch (error: any) {
            console.error('Error fetching conversation:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch conversation',
            });
        }
    }
}