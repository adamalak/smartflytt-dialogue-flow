
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CHATBOT_CONSTANTS } from '@/data/constants';
import { DatePicker } from './DatePicker';
import { AddressInput } from './AddressInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Address } from '@/types/chatbot';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickReply?: (message: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading,
  onQuickReply 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddressInput, setShowAddressInput] = useState<'from' | 'to' | null>(null);
  const [showVolumeInput, setShowVolumeInput] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'bot') {
      if (lastMessage.content.includes('Vilket datum vill du flytta?')) {
        setShowDatePicker(true);
      } else if (lastMessage.content.includes('nuvarande adress')) {
        setShowAddressInput('from');
      } else if (lastMessage.content.includes('nya adress')) {
        setShowAddressInput('to');
      } else if (lastMessage.content.includes('kubikmeter (m³)')) {
        setShowVolumeInput(true);
      } else if (lastMessage.content.includes('ytterligare information')) {
        setShowAdditionalInfo(true);
      } else {
        setShowDatePicker(false);
        setShowAddressInput(null);
        setShowVolumeInput(false);
        setShowAdditionalInfo(false);
      }
    }
  }, [messages]);

  const handleQuickReply = (value: string) => {
    if (onQuickReply) {
      onQuickReply(value);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && onQuickReply) {
      const formattedDate = date.toISOString().split('T')[0];
      onQuickReply(formattedDate);
      setShowDatePicker(false);
    }
  };

  const handleAddressSubmit = (address: Address) => {
    if (onQuickReply) {
      onQuickReply(`${address.street}, ${address.postal} ${address.city}`);
      setShowAddressInput(null);
    }
  };

  const handleVolumeSubmit = (volume: string) => {
    if (onQuickReply && volume.trim()) {
      onQuickReply(volume);
      setShowVolumeInput(false);
    }
  };

  const handleAdditionalInfoSubmit = (info: string) => {
    if (onQuickReply) {
      onQuickReply(info || 'Nej, ingen ytterligare information');
      setShowAdditionalInfo(false);
    }
  };

  return (
    <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-white to-green-50/30">
      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl transition-all duration-300 shadow-md ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200'
                  : 'bg-white text-gray-800 shadow-gray-200 border border-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
              
              {message.isQuickReply && message.type === 'bot' && index === messages.length - 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {CHATBOT_CONSTANTS.QUICK_REPLIES.MAIN_MENU.map((reply) => (
                    <Button
                      key={reply.value}
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white hover:bg-green-50 border-green-200 hover:border-green-300 text-green-700 transition-colors"
                      onClick={() => handleQuickReply(reply.label)}
                    >
                      {reply.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Interactive Components */}
        {showDatePicker && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <DatePicker
                date={undefined}
                onDateChange={handleDateSelect}
              />
            </div>
          </div>
        )}

        {showAddressInput && (
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <AddressInput
                address={{}}
                onAddressChange={handleAddressSubmit}
                onSubmit={() => {}}
                title={showAddressInput === 'from' ? 'Från-adress' : 'Till-adress'}
              />
            </div>
          </div>
        )}

        {showVolumeInput && (
          <VolumeInput onSubmit={handleVolumeSubmit} />
        )}

        {showAdditionalInfo && (
          <AdditionalInfoInput onSubmit={handleAdditionalInfoSubmit} />
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-600 p-4 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm font-medium">Chattbotten skriver...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

// Volume Input Component
const VolumeInput: React.FC<{ onSubmit: (volume: string) => void }> = ({ onSubmit }) => {
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const volumeNum = parseFloat(volume);
    if (!volume.trim()) {
      setError('Ange volym i kubikmeter');
      return;
    }
    if (isNaN(volumeNum) || volumeNum <= 0) {
      setError('Volymen måste vara ett positivt tal');
      return;
    }
    onSubmit(volume);
  };

  const handleUnsure = () => {
    onSubmit('osäker på volym');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Uppskattad volym (m³)
          </Label>
          <Input
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              setError('');
            }}
            placeholder="t.ex. 25"
            type="number"
            min="0"
            step="0.5"
            className={error ? 'border-red-500' : 'border-green-200'}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
        
        <div className="space-y-2">
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Bekräfta volym
          </Button>
          <Button onClick={handleUnsure} variant="outline" className="w-full border-green-200 hover:bg-green-50">
            Jag är osäker på volymen
          </Button>
        </div>
      </div>
    </div>
  );
};

// Additional Info Input Component
const AdditionalInfoInput: React.FC<{ onSubmit: (info: string) => void }> = ({ onSubmit }) => {
  const [info, setInfo] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);

  const handleYes = () => {
    setShowTextarea(true);
  };

  const handleNo = () => {
    onSubmit('');
  };

  const handleSubmitInfo = () => {
    onSubmit(info);
  };

  if (showTextarea) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
          <Label className="text-sm font-medium text-gray-700">
            Ytterligare information eller meddelande
          </Label>
          <Textarea
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            placeholder="Skriv här om du har något speciellt att meddela oss..."
            rows={4}
            className="border-green-200"
          />
          <Button onClick={handleSubmitInfo} className="w-full bg-green-600 hover:bg-green-700">
            Skicka meddelande
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-2">
        <Button onClick={handleYes} className="w-full bg-green-600 hover:bg-green-700">
          Ja, jag vill lägga till information
        </Button>
        <Button onClick={handleNo} variant="outline" className="w-full border-green-200 hover:bg-green-50">
          Nej, gå vidare
        </Button>
      </div>
    </div>
  );
};
