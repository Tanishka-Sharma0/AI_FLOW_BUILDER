import { Document } from "mongoose";

export interface IAIConversation {
    prompt: string;
    response: string;
    createdAt: Date;
    modelUsed?: string;
    metadata?: Record<string, any>;
};

export interface IAIConversationDocument extends IAIConversation, Document {
    _id: string;
}
export interface AIRequest {
    prompt: string;
    model?: string;
};

export interface AIResponse {
    success: boolean;
    data?: {
        response: string;
        model: string
    }
    error?: string;
}