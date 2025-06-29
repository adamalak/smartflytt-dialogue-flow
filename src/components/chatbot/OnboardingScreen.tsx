
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

interface OnboardingScreenProps {
  onStartQuote: () => void;
  onInternationalMove: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onStartQuote,
  onInternationalMove
}) => {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-smartflytt-50 to-white">
      {/* Header with Logo */}
      <div className="text-center pt-8 pb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-smartflytt-600 to-smartflytt-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-3xl">{SMARTFLYTT_CONFIG.BOT.avatar}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Välkommen till Smartflytt!
        </h1>
        <p className="text-gray-600 text-lg px-4">
          {SMARTFLYTT_CONFIG.COMPANY.tagline}
        </p>
      </div>

      {/* Step-by-step Process */}
      <div className="px-6 py-6 bg-white/60 backdrop-blur-sm mx-4 rounded-2xl shadow-sm border border-smartflytt-200/30 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Så här funkar det:
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-smartflytt-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <span className="text-gray-700 font-medium">Berätta om din flytt</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-smartflytt-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-gray-700 font-medium">Få din personliga offert</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-smartflytt-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <span className="text-gray-700 font-medium">Vi kontaktar dig inom 24h</span>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Badge variant="secondary" className="flex items-center justify-center py-2 bg-green-50 text-green-700 border-green-200">
            <Shield className="w-4 h-4 mr-1" />
            GDPR-säker
          </Badge>
          <Badge variant="secondary" className="flex items-center justify-center py-2 bg-blue-50 text-blue-700 border-blue-200">
            <Award className="w-4 h-4 mr-1" />
            Certifierad
          </Badge>
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              {SMARTFLYTT_CONFIG.COMPANY.phone}
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              {SMARTFLYTT_CONFIG.COMPANY.email}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-8 space-y-4">
        <Button 
          onClick={onStartQuote}
          size="lg"
          className="w-full bg-gradient-to-r from-smartflytt-600 to-smartflytt-700 hover:from-smartflytt-700 hover:to-smartflytt-800 text-white font-semibold py-4 text-lg shadow-lg rounded-xl"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Starta offert
        </Button>
        
        <Button 
          onClick={onInternationalMove}
          variant="outline"
          size="lg"
          className="w-full border-2 border-smartflytt-300 text-smartflytt-700 hover:bg-smartflytt-50 font-semibold py-4 text-lg rounded-xl"
        >
          Flytt utomlands
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Genom att fortsätta godkänner du vår{' '}
          <a href={SMARTFLYTT_CONFIG.GDPR.link} className="text-smartflytt-600 underline">
            integritetspolicy
          </a>
        </p>
      </div>
    </div>
  );
};
