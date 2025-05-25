
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VolumeInputProps {
  onSubmit: (volume: string) => void;
}

export const VolumeInput: React.FC<VolumeInputProps> = ({ onSubmit }) => {
  const [volume, setVolume] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const volumeNum = parseFloat(volume);
    if (!volume.trim()) {
      setError('Ange volym i kubikmeter');
      return;
    }
    if (isNaN(volumeNum) || volumeNum <= 0) {
      setError('Volymen måste vara ett positivt tal');
      return;
    }
    onSubmit(volume);
  };

  const handleUnsure = () => {
    onSubmit('osäker på volym');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md space-y-4 p-4 bg-green-50/50 rounded-lg border border-green-200">
        <div>
          <Label className="text-sm font-medium text-gray-700">
            Uppskattad volym (m³)
          </Label>
          <Input
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              setError('');
            }}
            placeholder="t.ex. 25"
            type="number"
            min="0"
            step="0.5"
            className={error ? 'border-red-500' : 'border-green-200'}
          />
          {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
        
        <div className="space-y-2">
          <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
            Bekräfta volym
          </Button>
          <Button onClick={handleUnsure} variant="outline" className="w-full border-green-200 hover:bg-green-50">
            Jag är osäker på volymen
          </Button>
        </div>
      </div>
    </div>
  );
};
