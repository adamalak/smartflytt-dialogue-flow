
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FlowStep } from '@/types/chatbot';

interface ProgressIndicatorProps {
  currentStep: FlowStep;
}

const stepOrder: FlowStep[] = [
  'welcome',
  'moveType', 
  'date',
  'fromAddress',
  'toAddress',
  'rooms',
  'volume',
  'volumeCoordinator',
  'elevator',
  'priceCalculation',
  'contact',
  'gdpr',
  'additionalInfo',
  'summary',
  'submitted'
];

const getStepLabel = (step: FlowStep): string => {
  switch (step) {
    case 'moveType':
      return 'Typ av flytt';
    case 'date':
      return 'Flyttdatum';
    case 'fromAddress':
      return 'Från-adress';
    case 'toAddress':
      return 'Till-adress';
    case 'rooms':
      return 'Antal rum';
    case 'volume':
      return 'Volymuppskattning';
    case 'volumeCoordinator':
      return 'Volymkoordinator';
    case 'elevator':
      return 'Hiss';
    case 'priceCalculation':
      return 'Prisberäkning';
    case 'contact':
      return 'Kontaktuppgifter';
    case 'gdpr':
      return 'GDPR-samtycke';
    case 'additionalInfo':
      return 'Ytterligare information';
    case 'summary':
      return 'Sammanfattning';
    case 'submitted':
      return 'Skickat!';
    default:
      return '';
  }
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length - 2; // Exclude welcome and submitted from total
  const progressPercentage = currentStepIndex <= 0 ? 0 : Math.min(((currentStepIndex - 1) / (totalSteps - 1)) * 100, 100);
  const currentStepNumber = Math.max(0, currentStepIndex - 1);

  // Don't show for welcome, FAQ, or services pages
  if (currentStep === 'welcome' || currentStep === 'faq' || currentStep === 'services') {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 glass-overlay border-b border-gradient shadow-elegant">
      <div className="px-6 py-5">
        {/* Step indicators with enhanced styling */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-smartflytt-700 dark:text-smartflytt-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-smartflytt-500 animate-pulse-glow"></div>
            Förlopp
          </span>
          <div className="glass-card px-3 py-1 rounded-xl">
            <span className="text-lg font-bold bg-gradient-to-r from-smartflytt-600 to-smartflytt-500 bg-clip-text text-transparent">
              {currentStepNumber}/{totalSteps - 1}
            </span>
          </div>
        </div>

        {/* Enhanced progress bar */}
        <div className="relative mb-4">
          <div className="h-3 bg-smartflytt-100/30 dark:bg-smartflytt-900/30 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-smartflytt-600 via-smartflytt-500 to-smartflytt-400 rounded-full transition-all duration-700 ease-out shadow-glow relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-float"></div>
            </div>
          </div>
        </div>

        {/* Current step with enhanced styling */}
        <div className="mb-4 text-center">
          <div className="glass-card inline-block px-4 py-2 rounded-2xl">
            <p className="text-sm font-semibold text-smartflytt-700 dark:text-smartflytt-300">
              {getStepLabel(currentStep)}
            </p>
          </div>
        </div>

        {/* Enhanced step dots */}
        <div className="flex justify-center space-x-3">
          {stepOrder.slice(1, -1).map((step, index) => {
            const isCompleted = index < currentStepNumber;
            const isCurrent = index === currentStepNumber;
            
            return (
              <div
                key={step}
                className={`relative transition-all duration-500 ${
                  isCompleted 
                    ? 'w-3 h-3 bg-smartflytt-600 scale-110 shadow-glow rounded-full' 
                    : isCurrent 
                    ? 'w-4 h-4 bg-smartflytt-500 scale-125 rounded-full animate-pulse-glow ring-2 ring-smartflytt-300/50' 
                    : 'w-2 h-2 bg-smartflytt-200 dark:bg-smartflytt-800 rounded-full hover:scale-110'
                }`}
              >
                {isCompleted && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
