import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EnhancedDatePicker } from './EnhancedDatePicker';
import { AutocompleteAddressInput } from './AutocompleteAddressInput';
import { Address } from '@/types/chatbot';
import { handleFromAddressSubmission, handleToAddressSubmission } from '@/utils/addressHandlers';
import { ModernRoomSelector } from './ModernRoomSelector';
import { VolumeSlider } from './VolumeSlider';
import { ContactInputs } from './ContactInputs';
import { AdditionalInfoInput } from './AdditionalInfoInput';
import { EnhancedLoadingIndicator } from './EnhancedLoadingIndicator';
import { MessageBubble } from './MessageBubble';
import { ThankYouPage } from './ThankYouPage';
import { PreviewSummaryPage } from './PreviewSummaryPage';

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
  const [showContactInputs, setShowContactInputs] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<any>({});

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
    setShowContactInputs(false);
    setShowPreview(false);

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
    } else if (currentStep === 'contact') {
      setShowContactInputs(true);
    } else if (currentStep === 'additionalInfo') {
      setShowAdditionalInfo(true);
    } else if (currentStep === 'summary') {
      setShowPreview(true);
    }
  }, [currentStep]);

  const handleQuickReply = (value: string) => {
    if (onQuickReply) {
      onQuickReply(value);
    }
  };

  const handleDateSelect = (dateOrOption: Date | string) => {
    if (onQuickReply) {
      if (typeof dateOrOption === 'string') {
        onQuickReply(dateOrOption);
      } else {
        const formattedDate = dateOrOption.toISOString().split('T')[0];
        onQuickReply(formattedDate);
      }
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

  const handleVolumeSubmit = (volume: number | string) => {
    if (onQuickReply) {
      onQuickReply(volume.toString());
      setShowVolumeInput(false);
    }
  };

  const handleContactSubmit = (contactData: { name: string; phone: string; email: string }) => {
    if (onQuickReply) {
      onQuickReply(`${contactData.name}, ${contactData.phone}, ${contactData.email}`);
      setShowContactInputs(false);
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

  const handlePreviewEdit = (step: string) => {
    if (setCurrentStep) {
      setCurrentStep(step);
    }
  };

  const handlePreviewConfirm = () => {
    if (addMessage && setCurrentStep) {
      addMessage('Tack! Jag skickar nu ditt ärende...', 'bot');
      // The form submission will be handled by the dialog manager
      if (onQuickReply) {
        onQuickReply('confirm_submission');
      }
    }
  };

  const handleStartOver = () => {
    if (setCurrentStep) {
      localStorage.removeItem('smartflytt-chat-state');
      window.location.reload();
    }
  };

  // Show thank you page if submitted
  if (currentStep === 'submitted') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <ThankYouPage formData={formData} onStartOver={handleStartOver} />
      </div>
    );
  }

  // Show preview/summary page
  if (showPreview && currentStep === 'summary') {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <PreviewSummaryPage 
          formData={formData}
          onEdit={handlePreviewEdit}
          onConfirm={handlePreviewConfirm}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-6 bg-gradient-to-br from-smartflytt-50/80 via-white/90 to-indigo-50/80 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90">
      <div className="space-y-8 max-w-3xl mx-auto">
        <div role="list" className="space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              onQuickReply={handleQuickReply}
            />
          ))}
        </div>

        {/* Enhanced Interactive Components */}
        {showDatePicker && (
          <div className="flex justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <EnhancedDatePicker
                onDateSelect={handleDateSelect}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {showAddressInput && (
          <div className="flex justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <AutocompleteAddressInput
                onAddressSelect={handleAddressSubmit}
                title={showAddressInput === 'from' ? 'Från-adress' : 'Till-adress'}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {showRoomsSelection && (
          <div className="flex justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <ModernRoomSelector 
                onRoomSelect={handleRoomSelection}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {showVolumeInput && (
          <div className="flex justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <VolumeSlider 
                onVolumeSelect={handleVolumeSubmit}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {showContactInputs && (
          <div className="flex justify-center animate-fade-in">
            <div className="w-full max-w-md">
              <ContactInputs 
                onContactSubmit={handleContactSubmit}
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {showAdditionalInfo && (
          <div className="animate-fade-in">
            <AdditionalInfoInput onSubmit={handleAdditionalInfoSubmit} />
          </div>
        )}
        
        {isLoading && <EnhancedLoadingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
