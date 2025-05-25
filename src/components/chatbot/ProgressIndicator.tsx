
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

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length - 2; // Exclude welcome and submitted from total
  const progressPercentage = currentStepIndex <= 0 ? 0 : Math.min(((currentStepIndex - 1) / (totalSteps - 1)) * 100, 100);

  if (currentStep === 'welcome' || currentStep === 'faq' || currentStep === 'services') {
    return null;
  }

  return (
    <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-green-700">
          Förlopp
        </span>
        <span className="text-sm font-semibold text-green-600">
          {Math.max(0, currentStepIndex - 1)}/{totalSteps - 1}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2 bg-green-100" />
      <p className="text-xs text-green-600 mt-2 font-medium">
        {getStepDescription(currentStep)}
      </p>
    </div>
  );
};

const getStepDescription = (step: FlowStep): string => {
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
