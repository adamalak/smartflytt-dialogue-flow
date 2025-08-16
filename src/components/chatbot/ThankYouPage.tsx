
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SMARTFLYTT_CONFIG } from '@/data/constants';
import { Check, Phone, Mail, Clock, Users, Shield, Award, Star, Facebook, Instagram, Linkedin } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

interface ThankYouPageProps {
  formData: any;
  onStartOver: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ formData, onStartOver }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  // Show feedback modal after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedback(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCall = () => {
    window.location.href = `tel:${SMARTFLYTT_CONFIG.COMPANY.phone.replace(/\s/g, '')}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${SMARTFLYTT_CONFIG.COMPANY.email}`;
  };

  const handleFeedbackSubmit = (rating: number, comment?: string) => {
    console.log('Feedback submitted:', { rating, comment });
    // Here you could save feedback to Supabase or analytics
  };

  const getPersonalizedMessage = () => {
    const name = formData.contact?.name || 'vi';
    const city = formData.to?.city || formData.from?.city;
    
    if (city) {
      return `Tack ${name}! Vi ser fram emot att hjälpa dig med din flytt ${city ? `i ${city}` : ''}.`;
    }
    
    return SMARTFLYTT_CONFIG.SUCCESS.title;
  };

  const getResponseTime = () => {
    const submissionType = formData.submissionType || 'offert';
    
    switch (submissionType) {
      case 'offert':
        return 'inom 2-4 timmar';
      case 'kontorsflytt':
        return 'inom 24 timmar';
      case 'volymuppskattning':
        return 'inom 24 timmar';
      default:
        return 'inom 24 timmar';
    }
  };

  return (
    <>
      <div className="flex justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-smartflytt-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-smartflytt-600 via-smartflytt-700 to-smartflytt-800 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 animate-bounce" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">{getPersonalizedMessage()}</h1>
            <div className="space-y-2">
              <p className="text-smartflytt-100 text-lg">
                🎉 Din förfrågan har mottagits!
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Vi bekräftar din offert inom 24 timmar</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Social Proof */}
            <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-smartflytt-50 to-smartflytt-100 border-smartflytt-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-smartflytt-700">3000+</div>
                    <div className="text-xs text-smartflytt-600 flex items-center justify-center">
                      <Users className="w-3 h-3 mr-1" />
                      Nöjda kunder
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-smartflytt-700">4.8</div>
                    <div className="text-xs text-smartflytt-600 flex items-center justify-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Stjärnor
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-smartflytt-700">100%</div>
                    <div className="text-xs text-smartflytt-600 flex items-center justify-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Försäkrat
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-smartflytt-50 to-blue-50 border border-smartflytt-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-smartflytt-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-smartflytt-600 rounded-full flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Nästa steg i processen
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-xl border border-smartflytt-100">
                    <div className="w-8 h-8 bg-smartflytt-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-smartflytt-800">Bekräftelse inom 24 timmar</h4>
                      <p className="text-smartflytt-600 text-sm">Vi granskar din förfrågan och bekräftar offerten via e-post eller telefon</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-xl border border-smartflytt-100">
                    <div className="w-8 h-8 bg-smartflytt-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-smartflytt-800">Besiktning vid behov</h4>
                      <p className="text-smartflytt-600 text-sm">För större flyttar bokar vi en kostnadsfri besiktning för exakt offert</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-white/80 rounded-xl border border-smartflytt-100">
                    <div className="w-8 h-8 bg-smartflytt-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-smartflytt-800">Bindande offert</h4>
                      <p className="text-smartflytt-600 text-sm">Du får en slutgiltig, bindande offert med alla detaljer</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                GDPR-säker
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Award className="w-3 h-3 mr-1" />
                Certifierad
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Users className="w-3 h-3 mr-1" />
                Familjeföretag
              </Badge>
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

            {/* Social Media */}
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-gray-700">Följ oss för flyttips:</p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100"
                  onClick={() => window.open('https://facebook.com/smartflytt', '_blank')}
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full bg-pink-50 hover:bg-pink-100"
                  onClick={() => window.open('https://instagram.com/smartflytt', '_blank')}
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100"
                  onClick={() => window.open('https://linkedin.com/company/smartflytt', '_blank')}
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
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

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
};
