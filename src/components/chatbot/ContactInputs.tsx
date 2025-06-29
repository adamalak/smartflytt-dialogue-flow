
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Mail, User } from 'lucide-react';
import { validateEmail, validatePhoneNumber } from '@/utils/validation';

interface ContactInputsProps {
  onContactSubmit: (contactData: {
    name: string;
    phone: string;
    email: string;
  }) => void;
  disabled?: boolean;
}

export const ContactInputs: React.FC<ContactInputsProps> = ({ 
  onContactSubmit, 
  disabled 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as 070-123 45 67
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 8) return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let processedValue = value;
    
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time validation
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Ange en giltig e-postadress' }));
      }
    }
    
    if (field === 'phone' && value) {
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length > 0 && !validatePhoneNumber(cleanPhone)) {
        setErrors(prev => ({ ...prev, phone: 'Ange ett giltigt telefonnummer (07X-XXX XX XX)' }));
      }
    }
  };

  const handleSubmit = () => {
    const newErrors = {
      name: '',
      phone: '',
      email: ''
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Namn är obligatoriskt';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ange ditt fullständiga namn';
    }

    // Validate phone
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Telefonnummer är obligatoriskt';
    } else if (!validatePhoneNumber(cleanPhone)) {
      newErrors.phone = 'Ange ett giltigt svenskt mobilnummer';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'E-postadress är obligatorisk';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ange en giltig e-postadress';
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (!newErrors.name && !newErrors.phone && !newErrors.email) {
      onContactSubmit({
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim()
      });
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/50 shadow-sm">
      <h3 className="font-semibold text-teal-800 text-lg flex items-center gap-2">
        <User className="w-5 h-5" />
        Dina kontaktuppgifter
      </h3>

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ditt fullständiga namn"
              disabled={disabled}
              className={`min-h-11 pl-12 pr-4 text-lg rounded-xl border-teal-200 focus:border-teal-400 focus:ring-teal-400 ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone Input */}
        <div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="070-123 45 67"
              disabled={disabled}
              className={`min-h-11 pl-12 pr-4 text-lg rounded-xl border-teal-200 focus:border-teal-400 focus:ring-teal-400 ${
                errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="din@email.se"
              disabled={disabled}
              className={`min-h-11 pl-12 pr-4 text-lg rounded-xl border-teal-200 focus:border-teal-400 focus:ring-teal-400 ${
                errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={disabled || !formData.name || !formData.phone || !formData.email}
        className="w-full min-h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg"
      >
        Fortsätt med dessa uppgifter
      </Button>
    </div>
  );
};
