
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PickerOption {
  label: string;
  value: any;
}

interface NativePickerProps {
  options: PickerOption[];
  onSelect: (value: any) => void;
  title: string;
  subtitle?: string;
  selectedValue?: any;
}

export const NativePicker: React.FC<NativePickerProps> = ({
  options,
  onSelect,
  title,
  subtitle,
  selectedValue
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedValue) {
      const index = options.findIndex(opt => opt.value === selectedValue);
      if (index >= 0) {
        setHighlightedIndex(index);
      }
    }
  }, [selectedValue, options]);

  const handleSelect = (option: PickerOption, index: number) => {
    setHighlightedIndex(index);
    setIsOpen(false);
    onSelect(option.value);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return;
    
    const scrollTop = e.currentTarget.scrollTop;
    const itemHeight = 50; // Height of each option
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex >= 0 && newIndex < options.length) {
      setHighlightedIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!wheelRef.current) return;
    const itemHeight = 50;
    wheelRef.current.scrollTo({
      top: index * itemHeight,
      behavior: 'smooth'
    });
  };

  if (!isOpen) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-md space-y-4 p-6 bg-smartflytt-50/50 rounded-2xl border border-smartflytt-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full h-14 text-lg bg-smartflytt-600 hover:bg-smartflytt-700 rounded-xl"
            aria-label={`Välj ${title.toLowerCase()}`}
          >
            {selectedValue ? 
              options.find(opt => opt.value === selectedValue)?.label || 'Välj alternativ' :
              'Tryck för att välja'
            }
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-smartflytt-200 overflow-hidden">
        <div className="bg-smartflytt-600 text-white p-4 text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        {/* Native-style picker wheel */}
        <div className="relative h-60 overflow-hidden">
          <div 
            ref={wheelRef}
            className="h-full overflow-y-scroll scrollbar-hide"
            onScroll={handleScroll}
            style={{ 
              scrollSnapType: 'y mandatory',
              paddingTop: '105px', // Center the middle item
              paddingBottom: '105px'
            }}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={`h-[50px] flex items-center justify-center text-lg transition-all duration-200 cursor-pointer ${
                  index === highlightedIndex 
                    ? 'text-smartflytt-600 font-semibold scale-110 bg-smartflytt-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ scrollSnapAlign: 'center' }}
                onClick={() => handleSelect(option, index)}
              >
                {option.label}
              </div>
            ))}
          </div>
          
          {/* Selection indicator lines */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="h-[50px] border-t-2 border-b-2 border-smartflytt-200 bg-smartflytt-50/30"></div>
          </div>
        </div>
        
        <div className="p-4 space-y-3 border-t border-gray-200">
          <Button
            onClick={() => handleSelect(options[highlightedIndex], highlightedIndex)}
            className="w-full bg-smartflytt-600 hover:bg-smartflytt-700 rounded-xl h-12"
          >
            Välj {options[highlightedIndex]?.label}
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="w-full border-smartflytt-200 hover:bg-smartflytt-50 rounded-xl h-10"
          >
            Avbryt
          </Button>
        </div>
      </div>
    </div>
  );
};
