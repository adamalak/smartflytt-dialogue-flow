
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
  'size',
  'elevator',
  'contact',
  'gdpr',
  'summary',
  'submitted'
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length - 1; // Exclude welcome step from total
  const progressPercentage = currentStepIndex <= 0 ? 0 : (currentStepIndex / totalSteps) * 100;

  if (currentStep === 'welcome' || currentStep === 'faq' || currentStep === 'services') {
    return null;
  }

  return (
    <div className="p-4 border-b bg-muted/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Förlopp
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.max(0, currentStepIndex)}/{totalSteps}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <p className="text-xs text-muted-foreground mt-1">
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
    case 'size':
      return 'Bohagsstorlek';
    case 'elevator':
      return 'Hiss';
    case 'contact':
      return 'Kontaktuppgifter';
    case 'gdpr':
      return 'GDPR-samtycke';
    case 'summary':
      return 'Sammanfattning';
    case 'submitted':
      return 'Skickat!';
    default:
      return '';
  }
};
