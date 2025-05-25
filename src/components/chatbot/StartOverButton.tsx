
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface StartOverButtonProps {
  onStartOver: () => void;
  disabled?: boolean;
}

export const StartOverButton: React.FC<StartOverButtonProps> = ({ 
  onStartOver, 
  disabled 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onStartOver}
      disabled={disabled}
      className="text-muted-foreground hover:text-foreground"
    >
      <RotateCcw className="w-4 h-4 mr-2" />
      Börja om
    </Button>
  );
};
