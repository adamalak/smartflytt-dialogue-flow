
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, HelpCircle, Truck } from 'lucide-react';

interface VolumeSliderProps {
  onVolumeSelect: (volume: number | string) => void;
  disabled?: boolean;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ 
  onVolumeSelect, 
  disabled 
}) => {
  const [volume, setVolume] = useState<number[]>([15]);
  const [isUnsure, setIsUnsure] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    setIsUnsure(false);
  };

  const handleConfirm = () => {
    if (isUnsure) {
      onVolumeSelect('osäker');
    } else {
      onVolumeSelect(volume[0]);
    }
  };

  const handleUnsure = () => {
    setIsUnsure(true);
    setVolume([15]);
  };

  const getVolumeDescription = (vol: number) => {
    if (vol <= 5) return 'Mycket lite - några kartonger och mindre möbler';
    if (vol <= 15) return 'Lite - 1-2 rum, grundläggande möbler';
    if (vol <= 30) return 'Medel - 2-3 rum, normalt hushåll';
    if (vol <= 50) return 'Mycket - stort hushåll eller flera rum';
    return 'Extremt mycket - villa eller stort hus';
  };

  const getTruckSize = (vol: number) => {
    if (vol <= 15) return 'Mindre lastbil';
    if (vol <= 35) return 'Mellanstor lastbil';
    return 'Stor lastbil';
  };

  const HelpModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
          disabled={disabled}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Jag är osäker
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hjälp med volymuppskattning</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Här är en ungefärlig guide:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">5-10 m³</div>
                <div className="text-xs text-gray-600">1 rum, student</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">15-25 m³</div>
                <div className="text-xs text-gray-600">2-3 rum, lägenhet</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm">30-50 m³</div>
                <div className="text-xs text-gray-600">4+ rum, hus</div>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => {
              handleUnsure();
              // Close dialog programmatically would go here
            }}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Jag är fortfarande osäker
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-orange-800 text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Uppskatta volym
        </h3>
        <HelpModal />
      </div>

      {!isUnsure ? (
        <>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-700">{volume[0]} m³</div>
              <div className="text-sm text-orange-600 mt-1">{getVolumeDescription(volume[0])}</div>
            </div>

            <div className="px-4">
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={60}
                min={1}
                step={1}
                disabled={disabled}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-orange-600 mt-2">
                <span>1 m³</span>
                <span>30 m³</span>
                <span>60+ m³</span>
              </div>
            </div>

            <div className="bg-orange-100 p-3 rounded-lg flex items-center gap-3">
              <Truck className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div className="text-sm">
                <div className="font-medium text-orange-800">Rekommenderad lastbil:</div>
                <div className="text-orange-600">{getTruckSize(volume[0])}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-6 bg-orange-100 rounded-lg">
          <HelpCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="font-medium text-orange-800">Ingen fara!</div>
          <div className="text-sm text-orange-600 mt-1">
            Vi hjälper dig uppskatta volymen när vi kontaktar dig.
          </div>
        </div>
      )}

      <Button 
        onClick={handleConfirm}
        disabled={disabled}
        className="w-full min-h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg"
      >
        {isUnsure ? 'Fortsätt utan volymuppskattning' : `Bekräfta ${volume[0]} m³`}
      </Button>
    </div>
  );
};
