
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Address } from '@/types/chatbot';

interface AddressInputProps {
  address: Partial<Address>;
  onAddressChange: (address: Address) => void;
  onSubmit: () => void;
  title: string;
  disabled?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  address,
  onAddressChange,
  onSubmit,
  title,
  disabled
}) => {
  const [street, setStreet] = React.useState(address.street || '');
  const [postal, setPostal] = React.useState(address.postal || '');
  const [city, setCity] = React.useState(address.city || '');
  const [errors, setErrors] = React.useState<Partial<Address>>({});

  const validateAndSubmit = () => {
    const newErrors: Partial<Address> = {};
    
    if (!street.trim()) newErrors.street = 'Gata är obligatorisk';
    if (!postal.trim()) {
      newErrors.postal = 'Postnummer är obligatoriskt';
    } else if (!/^\d{5}$/.test(postal)) {
      newErrors.postal = 'Postnummer måste vara 5 siffror';
    }
    if (!city.trim()) {
      newErrors.city = 'Stad är obligatorisk';
    } else if (city.trim().length < 2) {
      newErrors.city = 'Stad måste vara minst 2 tecken';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onAddressChange({ street: street.trim(), postal: postal.trim(), city: city.trim() });
      onSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateAndSubmit();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
      <h3 className="font-semibold text-green-800">{title}</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="street" className="text-sm font-medium text-gray-700">
            Gata och nummer *
          </Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="t.ex. Storgatan 15"
            disabled={disabled}
            className={errors.street ? 'border-red-500' : 'border-green-200'}
          />
          {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
        </div>

        <div>
          <Label htmlFor="postal" className="text-sm font-medium text-gray-700">
            Postnummer *
          </Label>
          <Input
            id="postal"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="t.ex. 12345"
            disabled={disabled}
            maxLength={5}
            className={errors.postal ? 'border-red-500' : 'border-green-200'}
          />
          {errors.postal && <p className="text-xs text-red-600 mt-1">{errors.postal}</p>}
        </div>

        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">
            Stad *
          </Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="t.ex. Stockholm"
            disabled={disabled}
            className={errors.city ? 'border-red-500' : 'border-green-200'}
          />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>
      </div>

      <Button 
        onClick={validateAndSubmit}
        disabled={disabled}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Bekräfta adress
      </Button>
    </div>
  );
};
