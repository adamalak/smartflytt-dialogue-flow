
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatbotContainer } from './chatbot/ChatbotContainer';

export const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Popup Button/Icon */}
      <Button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </Button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl animate-scale-in">
            <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Smartflytt Chattbot</h2>
                <p className="text-sm opacity-90">Få en preliminär offert för din flytt</p>
              </div>
              <Button
                onClick={togglePopup}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 min-h-0">
              <ChatbotContainer />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
