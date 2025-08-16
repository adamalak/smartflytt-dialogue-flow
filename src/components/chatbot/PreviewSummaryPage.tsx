
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, MapPin, Calendar, Home, Package, User, MessageSquare } from 'lucide-react';
import { MoveQuoteData } from '@/types/chatbot';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

interface PreviewSummaryPageProps {
  formData: Partial<MoveQuoteData>;
  onEdit: (step: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const PreviewSummaryPage: React.FC<PreviewSummaryPageProps> = ({
  formData,
  onEdit,
  onConfirm,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoomLabel = (rooms: string) => {
    const roomOption = SMARTFLYTT_CONFIG.ROOM_OPTIONS.find(r => r.value === rooms);
    return roomOption?.label || rooms;
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-smartflytt-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-smartflytt-600 to-smartflytt-700 text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Kontrollera din förfrågan</h1>
          <p className="text-smartflytt-100">Stämmer all information? Du kan ändra allt innan du skickar.</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Move Details */}
          <Card className="rounded-2xl shadow-lg bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-smartflytt-600" />
                Flyttuppgifter
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => onEdit('fromAddress')}
                className="text-blue-700 underline px-2 py-1 h-auto font-normal hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Ändra
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.from && (
                <div>
                  <span className="font-medium text-gray-700">Från: </span>
                  <span>{formData.from.street}, {formData.from.postal} {formData.from.city}</span>
                </div>
              )}
              {formData.to && (
                <div>
                  <span className="font-medium text-gray-700">Till: </span>
                  <span>{formData.to.street}, {formData.to.postal} {formData.to.city}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date */}
          {formData.date && (
            <Card className="rounded-2xl shadow-lg bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-smartflytt-600" />
                  Flyttdatum
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => onEdit('date')}
                  className="text-blue-700 underline px-2 py-1 h-auto font-normal hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Ändra
                </Button>
              </CardHeader>
              <CardContent>
                <span className="text-lg">{formatDate(formData.date)}</span>
              </CardContent>
            </Card>
          )}

          {/* Property & Volume */}
          <Card className="rounded-2xl shadow-lg bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Package className="w-5 h-5 mr-2 text-smartflytt-600" />
                Bostad & Volym
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => onEdit('rooms')}
                className="text-blue-700 underline px-2 py-1 h-auto font-normal hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Ändra
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.rooms && (
                <div>
                  <span className="font-medium text-gray-700">Bostadstyp: </span>
                  <Badge variant="secondary" className="bg-smartflytt-100 text-smartflytt-700">
                    {getRoomLabel(formData.rooms)}
                  </Badge>
                </div>
              )}
              {formData.volume && (
                <div>
                  <span className="font-medium text-gray-700">Uppskattad volym: </span>
                  <span className="text-lg font-semibold">{formData.volume} m³</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          {formData.contact && (
            <Card className="rounded-2xl shadow-lg bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-smartflytt-600" />
                  Kontaktuppgifter
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => onEdit('contact')}
                  className="text-blue-700 underline px-2 py-1 h-auto font-normal hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Ändra
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Namn: </span>
                  <span>{formData.contact.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">E-post: </span>
                  <span>{formData.contact.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Telefon: </span>
                  <span>{formData.contact.phone}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          {formData.additionalInfo && (
            <Card className="rounded-2xl shadow-lg bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="w-5 h-5 mr-2 text-smartflytt-600" />
                  Ytterligare information
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => onEdit('additionalInfo')}
                  className="text-blue-700 underline px-2 py-1 h-auto font-normal hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Ändra
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{formData.additionalInfo}</p>
              </CardContent>
            </Card>
          )}

          {/* Price Calculation */}
          {formData.priceCalculation && (
            <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200">
              <CardHeader className="border-b border-amber-100 pb-4">
                <CardTitle className="text-xl font-bold text-amber-800 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Preliminär offert
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-800 mb-2">
                    {formData.priceCalculation.totalPrice.toLocaleString('sv-SE')} kr
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full">
                    <span className="text-amber-600 text-sm font-medium">⚠️ Preliminär beräkning</span>
                  </div>
                </div>
                
                <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Viktigt att veta:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Detta är en <strong>preliminär beräkning</strong> baserad på uppgiven information</li>
                    <li>• Slutlig offert bekräftas efter besiktning av vår expertteam</li>
                    <li>• Priset är <strong>inte bindande</strong> och kan justeras</li>
                    <li>• RUT-avdrag (50%) ingår redan i priset</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator className="my-8" />

          {/* Confirmation Section */}
          <div className="bg-gradient-to-br from-smartflytt-50 to-smartflytt-100 rounded-2xl p-8 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-smartflytt-800">Redo att skicka?</h3>
              <p className="text-smartflytt-700 text-lg">
                Vi granskar din förfrågan och återkommer med bekräftelse
              </p>
            </div>
            
            <div className="bg-white/80 rounded-xl p-4 border border-smartflytt-200">
              <p className="text-sm text-smartflytt-600 mb-3">
                Genom att skicka denna förfrågan godkänner du att:
              </p>
              <ul className="text-sm text-smartflytt-600 text-left space-y-1">
                <li>• Vi kontaktar dig för att bekräfta uppgifterna</li>
                <li>• Vi schemalägger en kostnadsfri besiktning vid behov</li>
                <li>• Du får en bindande offert inom 24 timmar</li>
              </ul>
            </div>
            
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-smartflytt-600 to-smartflytt-700 hover:from-smartflytt-700 hover:to-smartflytt-800 text-white rounded-xl h-16 text-xl font-bold shadow-lg transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Skickar förfrågan...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>📨</span>
                  Skicka min förfrågan
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
