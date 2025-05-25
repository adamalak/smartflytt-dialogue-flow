
import React from 'react';
import { Button } from '@/components/ui/button';

interface RoomsSelectionProps {
  onSelect: (roomType: string) => void;
}

export const RoomsSelection: React.FC<RoomsSelectionProps> = ({ onSelect }) => {
  const roomOptions = [
    { value: '1 rok', label: '1 rum och kök' },
    { value: '2 rok', label: '2 rum och kök' },
    { value: '3 rok', label: '3 rum och kök' },
    { value: 'villa', label: 'Villa/Hus' },
    { value: 'annat', label: 'Annat' }
  ];

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-2">
        {roomOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value)}
            variant="outline"
            className="w-full border-green-200 hover:bg-green-50 text-green-700"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
