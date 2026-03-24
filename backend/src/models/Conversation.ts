import mongoose, { Schema, Document } from "mongoose";
import { IAIConversation, IAIConversationDocument } from "../types";

interface IConversationDocument extends IAIConversation, Document { }

const ConversationSchema = new Schema<IConversationDocument>({
    prompt: {
        type: String,
        required: true,
        trim: true,
    },
    response: {
        type: String,
        required: true,
    },

    modelUsed: {
        type: String,
        default: 'google/gemini-2.0-flash-lite-preview-02-05:free',
    },

    metadata: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {}
    }
}, { timestamps: true });


ConversationSchema.index({ createdAt: -1 });

export const Conversation = mongoose.model<IConversationDocument>('Conversation', ConversationSchema);