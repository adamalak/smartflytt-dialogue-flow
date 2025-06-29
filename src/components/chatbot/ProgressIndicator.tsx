
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
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-smartflytt-200/50 shadow-sm">
      <div className="px-4 py-4">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-smartflytt-700">
            Förlopp
          </span>
          <span className="text-lg font-bold text-smartflytt-600">
            {currentStepNumber}/{totalSteps - 1}
          </span>
        </div>

        {/* Progress bar with glassmorphic styling */}
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-smartflytt-100 rounded-full overflow-hidden shadow-inner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full pointer-events-none"></div>
        </div>

        {/* Current step description */}
        <div className="mt-3 flex items-center justify-center">
          <p className="text-sm font-medium text-smartflytt-600 text-center">
            {getStepLabel(currentStep)}
          </p>
        </div>

        {/* Step dots visualization */}
        <div className="flex justify-center mt-2 space-x-2">
          {stepOrder.slice(1, -1).map((step, index) => {
            const isCompleted = index < currentStepNumber;
            const isCurrent = index === currentStepNumber;
            
            return (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-smartflytt-600 scale-110 shadow-sm' 
                    : isCurrent 
                    ? 'bg-smartflytt-400 scale-125 ring-2 ring-smartflytt-200' 
                    : 'bg-smartflytt-200'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
