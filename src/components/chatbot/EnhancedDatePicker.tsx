
import React, { useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EnhancedDatePickerProps {
  onDateSelect: (dateOrOption: Date | string) => void;
  disabled?: boolean;
}

export const EnhancedDatePicker: React.FC<EnhancedDatePickerProps> = ({ 
  onDateSelect, 
  disabled 
}) => {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Validate that the date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setError('Flyttdatum kan inte vara i det förflutna');
        return;
      }

      setDate(selectedDate);
      setSelectedOption('');
      setError('');
      onDateSelect(selectedDate);
    }
  };

  const handleFlexibleOption = (option: string) => {
    setSelectedOption(option);
    setDate(undefined);
    setError('');
    onDateSelect(option);
  };

  const flexibleOptions = [
    { value: 'asap', label: 'Så snart som möjligt', emoji: '⚡' },
    { value: 'flexible', label: 'Flexibelt datum', emoji: '📅' }
  ];

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 shadow-sm">
      <h3 className="font-semibold text-blue-800 text-lg flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        Välj flyttdatum
      </h3>

      {/* Flexible options */}
      <div className="grid grid-cols-1 gap-3">
        {flexibleOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleFlexibleOption(option.value)}
            variant={selectedOption === option.value ? "default" : "outline"}
            className={cn(
              "min-h-11 justify-start text-left rounded-xl transition-all duration-200 hover:scale-[1.02]",
              selectedOption === option.value 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                : "bg-white border-blue-200 hover:bg-blue-50 text-blue-700"
            )}
            disabled={disabled}
          >
            <span className="mr-2 text-lg">{option.emoji}</span>
            <span className="text-lg">{option.label}</span>
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="text-center text-sm text-blue-600 font-medium mb-2">
          eller välj specifikt datum
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full min-h-11 justify-start text-left font-normal rounded-xl bg-white border-blue-200 hover:bg-blue-50 text-lg",
                !date && !selectedOption && "text-muted-foreground",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-3 h-5 w-5 text-blue-600" />
              {date ? (
                format(date, "PPPP", { locale: sv })
              ) : selectedOption ? (
                flexibleOptions.find(opt => opt.value === selectedOption)?.label
              ) : (
                <span>Välj datum från kalender</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              initialFocus
              className="p-3 pointer-events-auto"
              locale={sv}
            />
          </PopoverContent>
        </Popover>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {(date || selectedOption) && !error && (
        <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
          ✓ Valt: {date ? format(date, "PPPP", { locale: sv }) : flexibleOptions.find(opt => opt.value === selectedOption)?.label}
        </div>
      )}
    </div>
  );
};
