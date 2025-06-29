
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';
import { Address } from '@/types/chatbot';
import { validatePostalCode } from '@/utils/validation';

interface AutocompleteAddressInputProps {
  onAddressSelect: (address: Address) => void;
  title: string;
  disabled?: boolean;
}

export const AutocompleteAddressInput: React.FC<AutocompleteAddressInputProps> = ({
  onAddressSelect,
  title,
  disabled
}) => {
  const [inputValue, setInputValue] = useState('');
  const [address, setAddress] = useState<Partial<Address>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showManualEntry, setShowManualEntry] = useState(false);

  const validateAddress = (addr: Partial<Address>) => {
    const newErrors: { [key: string]: string } = {};

    if (!addr.street?.trim()) {
      newErrors.street = 'Gatuadress är obligatorisk';
    }

    if (!addr.postal?.trim()) {
      newErrors.postal = 'Postnummer är obligatoriskt';
    } else if (!validatePostalCode(addr.postal)) {
      newErrors.postal = 'Ogiltigt postnummer (använd format: 123 45)';
    }

    if (!addr.city?.trim()) {
      newErrors.city = 'Stad är obligatorisk';
    }

    return newErrors;
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Clear previous errors when user starts typing
    if (errors.general) {
      setErrors({});
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    let finalAddress: Address;

    if (showManualEntry) {
      const validationErrors = validateAddress(address);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      finalAddress = address as Address;
    } else {
      if (!inputValue.trim()) {
        setErrors({ general: 'Ange en adress' });
        return;
      }

      // Simple parsing for demonstration - in real app, use Google Places API
      const parts = inputValue.split(',').map(p => p.trim());
      if (parts.length < 2) {
        setErrors({ general: 'Ange fullständig adress (gata, postnummer stad)' });
        return;
      }

      const streetPart = parts[0];
      const locationPart = parts[1];
      const locationMatch = locationPart.match(/^(\d{3}\s?\d{2})\s+(.+)$/);

      if (!locationMatch) {
        setErrors({ general: 'Ange adress i format: Gata 123, 123 45 Stad' });
        return;
      }

      finalAddress = {
        street: streetPart,
        postal: locationMatch[1],
        city: locationMatch[2]
      };

      const validationErrors = validateAddress(finalAddress);
      if (Object.keys(validationErrors).length > 0) {
        setErrors({ general: 'Kontrollera adressformatet' });
        return;
      }
    }

    onAddressSelect(finalAddress);
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 shadow-sm">
      <h3 className="font-semibold text-emerald-800 text-lg flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        {title}
      </h3>

      {!showManualEntry ? (
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-600" />
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Skriv gata, nummer, postnummer och stad..."
              disabled={disabled}
              className={`min-h-11 pl-12 pr-4 text-lg rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 ${
                errors.general ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          
          {errors.general && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.general}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit}
              disabled={disabled || !inputValue.trim()}
              className="flex-1 min-h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-medium"
            >
              Använd denna adress
            </Button>
            <Button 
              onClick={handleManualEntry}
              variant="outline"
              disabled={disabled}
              className="min-h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
            >
              Ange manuellt
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Input
              value={address.street || ''}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Gatuadress och nummer"
              disabled={disabled}
              className={`min-h-11 text-lg rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 ${
                errors.street ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.street && (
              <p className="text-red-600 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <div>
            <Input
              value={address.postal || ''}
              onChange={(e) => handleAddressChange('postal', e.target.value)}
              placeholder="Postnummer (123 45)"
              disabled={disabled}
              className={`min-h-11 text-lg rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 ${
                errors.postal ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.postal && (
              <p className="text-red-600 text-sm mt-1">{errors.postal}</p>
            )}
          </div>

          <div>
            <Input
              value={address.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Stad"
              disabled={disabled}
              className={`min-h-11 text-lg rounded-xl border-emerald-200 focus:border-emerald-400 focus:ring-emerald-400 ${
                errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit}
              disabled={disabled}
              className="flex-1 min-h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-medium"
            >
              Spara adress
            </Button>
            <Button 
              onClick={() => setShowManualEntry(false)}
              variant="outline"
              disabled={disabled}
              className="min-h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
            >
              Tillbaka
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
