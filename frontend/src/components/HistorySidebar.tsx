import React, { useEffect, useState } from 'react';
import { AIService } from '../services/api';
import { Conversation } from '../types';
import { History, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (conversation: Conversation) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, onSelect }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadConversations();
        }
    }, [isOpen]);

    const loadConversations = async () => {
        setIsLoading(true);
        const data = await AIService.getConversations();
        setConversations(data);
        setIsLoading(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="flex items-center gap-2 text-white">
                        <History className="w-5 h-5" />
                        <h2 className="text-xl font-semibold">Conversation History</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 overflow-y-auto h-[calc(100%-73px)]">
                    {isLoading ? (
                        <div className="text-center text-gray-500 py-8">Loading...</div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No saved conversations yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer bg-white"
                                    onClick={() => onSelect(conv)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 truncate">{conv.prompt}</p>
                                            <p className="text-sm text-gray-500 mt-1 truncate">{conv.response}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-2">
                                        {formatDate(conv.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default HistorySidebar;