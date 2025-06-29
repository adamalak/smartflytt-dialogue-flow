
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Address } from '@/types/chatbot';

interface AutocompleteAddressInputProps {
  onAddressSelect: (address: Address) => void;
  title: string;
  placeholder?: string;
  disabled?: boolean;
}

export const AutocompleteAddressInput: React.FC<AutocompleteAddressInputProps> = ({
  onAddressSelect,
  title,
  placeholder = "Skriv gata, nummer och stad...",
  disabled
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  // Mock address suggestions - in real implementation, this would use Google Places API
  const mockSuggestions = [
    "Storgatan 15, 11122 Stockholm",
    "Drottninggatan 25, 11151 Stockholm", 
    "Sveavägen 44, 11134 Stockholm",
    "Kungsgatan 12, 11143 Stockholm",
    "Vasagatan 7, 11120 Stockholm"
  ];

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setError('');
    
    if (value.length > 2) {
      // Filter mock suggestions based on input
      const filtered = mockSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const parts = suggestion.split(', ');
    if (parts.length >= 2) {
      const street = parts[0];
      const cityPart = parts[1];
      const postalMatch = cityPart.match(/(\d{5})\s+(.+)/);
      
      if (postalMatch) {
        const postal = postalMatch[1];
        const city = postalMatch[2];
        
        onAddressSelect({ street, postal, city });
        setInputValue(suggestion);
        setShowSuggestions(false);
      }
    }
  };

  const handleManualSubmit = () => {
    if (inputValue.trim().length < 5) {
      setError('Ange en fullständig adress');
      return;
    }

    // Try to parse manual input
    const parts = inputValue.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const street = parts[0];
      const rest = parts[1];
      const postalMatch = rest.match(/(\d{5})\s*(.+)/);
      
      if (postalMatch) {
        const postal = postalMatch[1];
        const city = postalMatch[2] || rest.replace(/\d{5}\s*/, '');
        onAddressSelect({ street, postal, city });
        return;
      }
    }
    
    setError('Kontrollera adressformatet (t.ex. "Storgatan 15, 11122 Stockholm")');
  };

  return (
    <div className="space-y-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm">
      <h3 className="font-semibold text-green-800 text-lg flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {title}
      </h3>
      
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`min-h-11 pl-12 pr-4 text-lg rounded-xl border-green-200 focus:border-green-400 focus:ring-green-400 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-green-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors min-h-11 flex items-center gap-3"
                disabled={disabled}
              >
                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
          {error}
        </p>
      )}

      <Button 
        onClick={handleManualSubmit}
        disabled={disabled || !inputValue.trim()}
        className="w-full min-h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg"
      >
        Bekräfta adress
      </Button>
    </div>
  );
};
