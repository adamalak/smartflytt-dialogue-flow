
import React from 'react';
import { Button } from '@/components/ui/button';
import { SMARTFLYTT_CONFIG } from '@/data/constants';
import { Check, Phone, Mail, Clock } from 'lucide-react';

interface ThankYouPageProps {
  formData: any;
  onStartOver: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ formData, onStartOver }) => {
  const handleCall = () => {
    window.location.href = `tel:${SMARTFLYTT_CONFIG.COMPANY.phone.replace(/\s/g, '')}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${SMARTFLYTT_CONFIG.COMPANY.email}`;
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-smartflytt-200 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{SMARTFLYTT_CONFIG.SUCCESS.title}</h1>
          <p className="text-green-100">{SMARTFLYTT_CONFIG.SUCCESS.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Summary */}
          <div className="bg-smartflytt-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Din förfrågan:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {formData.from && (
                <p><strong>Från:</strong> {formData.from.city}</p>
              )}
              {formData.to && (
                <p><strong>Till:</strong> {formData.to.city}</p>
              )}
              {formData.date && (
                <p><strong>Datum:</strong> {formData.date}</p>
              )}
              {formData.rooms && (
                <p><strong>Bostad:</strong> {SMARTFLYTT_CONFIG.ROOM_OPTIONS.find(r => r.value === formData.rooms)?.label}</p>
              )}
              {formData.volume && (
                <p><strong>Volym:</strong> {formData.volume} m³</p>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-smartflytt-600" />
              Vad händer nu?
            </h3>
            <div className="space-y-3">
              {SMARTFLYTT_CONFIG.SUCCESS.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-smartflytt-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-smartflytt-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleCall}
              className="w-full bg-smartflytt-600 hover:bg-smartflytt-700 rounded-xl h-14 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              {SMARTFLYTT_CONFIG.SUCCESS.callToAction.primary}
            </Button>
            
            <Button
              onClick={handleEmail}
              variant="outline"
              className="w-full border-smartflytt-200 hover:bg-smartflytt-50 rounded-xl h-12"
            >
              <Mail className="w-4 h-4 mr-2" />
              {SMARTFLYTT_CONFIG.SUCCESS.callToAction.secondary}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>{SMARTFLYTT_CONFIG.COMPANY.phone}</p>
            <p>{SMARTFLYTT_CONFIG.COMPANY.email}</p>
          </div>

          {/* Start Over */}
          <Button
            onClick={onStartOver}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            Starta ny förfrågan
          </Button>
        </div>
      </div>
    </div>
  );
};
