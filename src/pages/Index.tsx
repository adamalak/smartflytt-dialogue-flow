
import React from 'react';
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-smartflytt-50 to-smartflytt-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[95vh] bg-white/98 backdrop-blur-sm rounded-3xl shadow-2xl border border-smartflytt-200/30 flex flex-col overflow-hidden">
        <ChatbotContainer />
      </div>
    </div>
  );
};

export default Index;
