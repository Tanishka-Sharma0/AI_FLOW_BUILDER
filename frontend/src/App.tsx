import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import FlowChart from './components/FlowChart';
import HistorySidebar from './components/HistorySidebar';
import { Conversation } from './types';
import { History } from 'lucide-react';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleSave = (prompt: string, response: string) => {
    console.log('Saved:', { prompt, response });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsHistoryOpen(false);
  };

  return (
    <div className="relative">
      <Toaster position="top-right" toastOptions={{
        duration: 3000, style: { background: '#363636', color: '#fff' }, success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff', }, }, error: { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff', }, },
      }} />
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="fixed bottom-4 right-4 z-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        title="View History"
      >
        <History className="w-6 h-6" />
      </button>

      <FlowChart onsave={handleSave} />
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSelectConversation}
      />
    </div>
  );
}

export default App;