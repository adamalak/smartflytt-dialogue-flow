
import React from 'react';
import { NativePicker } from './NativePicker';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

interface VolumeInputProps {
  onSubmit: (volume: string) => void;
}

export const VolumeInput: React.FC<VolumeInputProps> = ({ onSubmit }) => {
  const handleVolumeSelect = (volume: number) => {
    onSubmit(volume.toString());
  };

  return (
    <NativePicker
      options={SMARTFLYTT_CONFIG.VOLUME_OPTIONS.map(vol => ({
        label: vol.label,
        value: vol.value
      }))}
      onSelect={handleVolumeSelect}
      title="Uppskatta volym"
      subtitle="Ungefär hur många kubikmeter har du att flytta?"
    />
  );
};
