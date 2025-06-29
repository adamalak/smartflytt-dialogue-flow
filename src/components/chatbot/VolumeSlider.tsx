
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Package, HelpCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VolumeSliderProps {
  onVolumeSelect: (volume: number | string) => void;
  disabled?: boolean;
}

const volumeGuide = [
  { min: 5, max: 15, label: '1 rum och kök', desc: 'Mindre lägenhet, student' },
  { min: 15, max: 35, label: '2 rum och kök', desc: 'Medelstor lägenhet' },
  { min: 35, max: 60, label: '3 rum och kök', desc: 'Större lägenhet' },
  { min: 60, max: 100, label: '4+ rum eller villa', desc: 'Hus eller stor lägenhet' },
];

export const VolumeSlider: React.FC<VolumeSliderProps> = ({ 
  onVolumeSelect, 
  disabled 
}) => {
  const [volume, setVolume] = useState<number>(25);
  const [error, setError] = useState<string>('');

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setError('');
  };

  const handleSubmit = () => {
    if (volume < 1) {
      setError('Volym måste vara minst 1 kubikmeter');
      return;
    }
    if (volume > 200) {
      setError('För stora volymer över 200 m³, kontakta oss direkt');
      return;
    }
    onVolumeSelect(volume);
  };

  const handleUnsure = () => {
    onVolumeSelect('Jag är osäker på volymen');
  };

  const getCurrentGuide = () => {
    return volumeGuide.find(guide => volume >= guide.min && volume <= guide.max);
  };

  const VolumeHelpModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
          disabled={disabled}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Behöver du hjälp?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Volymguide</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Här är en uppskattning baserat på typ av bostad:
          </p>
          {volumeGuide.map((guide, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">{guide.label}</div>
                <div className="text-xs text-gray-600 mt-1">{guide.desc}</div>
                <div className="text-xs text-orange-600 font-medium mt-1">
                  {guide.min}-{guide.max} m³
                </div>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-4">
            Osäker fortfarande? Välj "Jag är osäker" så hjälper vi dig senare!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-orange-800 text-lg flex items-center gap-2">
          <Package className="w-5 h-5" />
          Volymuppskattning
        </h3>
        <VolumeHelpModal />
      </div>

      <div className="space-y-6">
        {/* Volume Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">
            {volume} m³
          </div>
          {getCurrentGuide() && (
            <div className="text-sm text-orange-700 bg-orange-100 px-3 py-1 rounded-full inline-block">
              {getCurrentGuide()?.label}
            </div>
          )}
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            min={1}
            max={150}
            step={1}
            disabled={disabled}
            className="w-full"
          />
          
          {/* Min/Max labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1 m³</span>
            <span>150 m³</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            disabled={disabled}
            className="flex-1 min-h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            Använd {volume} m³
          </Button>
          <Button 
            onClick={handleUnsure}
            variant="outline"
            disabled={disabled}
            className="min-h-11 border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl whitespace-nowrap"
          >
            Jag är osäker
          </Button>
        </div>
      </div>
    </div>
  );
};
