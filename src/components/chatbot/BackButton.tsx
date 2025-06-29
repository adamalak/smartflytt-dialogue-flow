
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onGoBack: () => void;
  disabled?: boolean;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onGoBack, 
  disabled,
  className = "" 
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onGoBack}
      disabled={disabled}
      className={`text-smartflytt-600 hover:text-smartflytt-700 hover:bg-smartflytt-50 min-h-11 min-w-11 rounded-xl transition-all duration-200 ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Tillbaka
    </Button>
  );
};
