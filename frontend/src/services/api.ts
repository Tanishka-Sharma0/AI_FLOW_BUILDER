import axios from 'axios';
import { Conversation, AIResponse } from '../types';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});


export const AIService = {
    generateResponse: async (prompt: string): Promise<AIResponse> => {
        try {
            const response = await api.post('/ai/generate', { prompt });
            return response.data;
        } catch (error: any) {
            console.error('Error generating response:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to generate response',
            }
        }
    },

    saveConversation: async (prompt: string, response: string, modelUsed?: string): Promise<{ success: boolean, data?: Conversation, error?: string }> => {
        try {
            const result = await api.post('/ai/save', { prompt, response, modelUsed });
            return { success: true, data: result.data.data };
        } catch (error: any) {
            console.error('Error saving conversation:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to save conversation',
            }
        }
    },

    getConversations: async (): Promise<Conversation[]> => {
        try {
            const response = await api.get('/ai/conversations');
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching conversations:', error);
            return [];
        }
    },

    getConversation: async (): Promise<Conversation[]> => {
        try {
            const response = await api.get('/ai/conversation/:id');
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching conversations:', error);
            return [];
        }
    },
}