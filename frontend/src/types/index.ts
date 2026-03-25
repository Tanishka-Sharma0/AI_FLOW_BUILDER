export interface NodeData {
    label: string,
    value?: string,
    onChange?: (value: string) => void;
}


export interface Conversation {
    _id: string,
    prompt: string,
    response: string,
    modelUsed: string,
    createdAt: string,
    updatedAt: string,
}

export interface AIResponse {
    success: boolean;
    data?: {
        response: string;
        model: string;
    };
    error?: string;
}