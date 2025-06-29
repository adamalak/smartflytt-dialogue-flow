
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
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Hoppa till huvudinnehåll"
      >
        Hoppa till huvudinnehåll
      </a>

      {/* Popup Button with glassmorphism */}
      <Button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full btn-gradient-primary shadow-2xl transition-all duration-300 hover:scale-110 touch-target"
        size="icon"
        aria-label="Öppna Smartflytt chattbot"
        aria-expanded={isOpen}
      >
        <MessageCircle className="w-8 h-8 text-white" aria-hidden="true" />
      </Button>

      {/* Popup Modal with enhanced glassmorphism */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          <Card className="w-full max-w-2xl h-[600px] flex flex-col glass-card shadow-2xl animate-scale-in">
            <div className="bg-gradient-to-r from-smartflytt-600 via-smartflytt-700 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 id="chatbot-title" className="text-xl font-bold">
                  Smartflytt AI-Assistent
                </h2>
                <p className="text-smartflytt-100 text-base opacity-90">
                  Få en preliminär offert för din flytt
                </p>
              </div>
              <Button
                onClick={togglePopup}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-xl touch-target transition-all duration-200"
                aria-label="Stäng chattbot"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </Button>
            </div>
            
            <div id="main-content" className="flex-1 min-h-0">
              <ChatbotContainer />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
