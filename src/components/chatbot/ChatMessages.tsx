
import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from './DatePicker';
import { AddressInput } from './AddressInput';
import { Address } from '@/types/chatbot';
import { handleFromAddressSubmission, handleToAddressSubmission } from '@/utils/addressHandlers';
import { RoomsSelection } from './RoomsSelection';
import { VolumeInput } from './VolumeInput';
import { AdditionalInfoInput } from './AdditionalInfoInput';
import { LoadingIndicator } from './LoadingIndicator';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickReply?: (message: string) => void;
  currentStep?: string;
  addMessage?: (content: string, type: 'bot' | 'user', isQuickReply?: boolean) => void;
  setCurrentStep?: (step: any) => void;
  updateFormData?: (data: any) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading,
  onQuickReply,
  currentStep,
  addMessage,
  setCurrentStep,
  updateFormData
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddressInput, setShowAddressInput] = useState<'from' | 'to' | null>(null);
  const [showVolumeInput, setShowVolumeInput] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showRoomsSelection, setShowRoomsSelection] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Reset all UI states first
    setShowDatePicker(false);
    setShowAddressInput(null);
    setShowVolumeInput(false);
    setShowAdditionalInfo(false);
    setShowRoomsSelection(false);

    // Show appropriate UI based on current step
    if (currentStep === 'date') {
      setShowDatePicker(true);
    } else if (currentStep === 'fromAddress') {
      setShowAddressInput('from');
    } else if (currentStep === 'toAddress') {
      setShowAddressInput('to');
    } else if (currentStep === 'rooms') {
      setShowRoomsSelection(true);
    } else if (currentStep === 'volume') {
      setShowVolumeInput(true);
    } else if (currentStep === 'additionalInfo') {
      setShowAdditionalInfo(true);
    }
  }, [currentStep]);

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
    if (!addMessage || !setCurrentStep || !updateFormData) return;

    const context = {
      message: '',
      addMessage,
      setCurrentStep,
      setSubmissionType: () => {},
      updateFormData,
      state: { formData: {}, currentStep: currentStep || 'welcome' } as any,
      setLoading: () => {}
    };

    if (showAddressInput === 'from') {
      handleFromAddressSubmission(address, context);
    } else if (showAddressInput === 'to') {
      handleToAddressSubmission(address, context);
    }
    
    setShowAddressInput(null);
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

  const handleRoomSelection = (roomType: string) => {
    if (onQuickReply) {
      onQuickReply(roomType);
      setShowRoomsSelection(false);
    }
  };

  return (
    <ScrollArea className="flex-1 p-6 bg-gradient-to-b from-white to-green-50/30">
      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
            onQuickReply={handleQuickReply}
          />
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

        {showRoomsSelection && (
          <RoomsSelection onSelect={handleRoomSelection} />
        )}

        {showVolumeInput && (
          <VolumeInput onSubmit={handleVolumeSubmit} />
        )}

        {showAdditionalInfo && (
          <AdditionalInfoInput onSubmit={handleAdditionalInfoSubmit} />
        )}
        
        {isLoading && <LoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
