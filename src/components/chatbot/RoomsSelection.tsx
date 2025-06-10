
import React from 'react';
import { NativePicker } from './NativePicker';
import { SMARTFLYTT_CONFIG } from '@/data/constants';

interface RoomsSelectionProps {
  onSelect: (roomType: string) => void;
}

export const RoomsSelection: React.FC<RoomsSelectionProps> = ({ onSelect }) => {
  return (
    <NativePicker
      options={SMARTFLYTT_CONFIG.ROOM_OPTIONS.map(room => ({
        label: room.label,
        value: room.value
      }))}
      onSelect={onSelect}
      title="Välj typ av bostad"
      subtitle="Vilken typ av bostad flyttar du från?"
    />
  );
};
