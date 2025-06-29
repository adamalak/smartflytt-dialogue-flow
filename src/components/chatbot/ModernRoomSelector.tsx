
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Home, Building, HelpCircle } from 'lucide-react';

interface ModernRoomSelectorProps {
  onRoomSelect: (roomType: string) => void;
  disabled?: boolean;
}

const roomOptions = [
  { value: '1 rok', label: '1 rum och kök', icon: Home, description: 'Liten lägenhet, student eller ungkarlslägenhet' },
  { value: '2 rok', label: '2 rum och kök', icon: Home, description: 'Medelstor lägenhet med sovrum och vardagsrum' },
  { value: '3 rok', label: '3 rum och kök', icon: Home, description: 'Större lägenhet med flera rum' },
  { value: '4+ rok', label: '4+ rum och kök', icon: Building, description: 'Stor lägenhet eller mindre hus' },
  { value: 'villa', label: 'Villa/Hus', icon: Building, description: 'Hus med flera våningar och utomhusområde' },
  { value: 'annat', label: 'Annat/Osäker', icon: HelpCircle, description: 'Kontor, lager eller annan typ av lokal' }
];

export const ModernRoomSelector: React.FC<ModernRoomSelectorProps> = ({ 
  onRoomSelect, 
  disabled 
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onRoomSelect(value);
  };

  const HelpModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
          disabled={disabled}
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Osäker? Tryck här!
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hjälp med boendeval</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Här är en guide för att hjälpa dig välja rätt typ:
          </p>
          {roomOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div key={option.value} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <IconComponent className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-gray-500 mt-4">
            Osäker fortfarande? Välj "Annat/Osäker" så hjälper vi dig senare!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-purple-800 text-lg flex items-center gap-2">
          <Home className="w-5 h-5" />
          Typ av bostad
        </h3>
        <HelpModal />
      </div>

      <Select onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger className="min-h-11 text-lg rounded-xl border-purple-200 focus:border-purple-400 focus:ring-purple-400 bg-white">
          <SelectValue placeholder="Välj typ av bostad som ska flyttas" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-purple-200 rounded-xl shadow-lg">
          {roomOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="min-h-11 flex items-center gap-3 px-4 py-3 hover:bg-purple-50 focus:bg-purple-50"
              >
                <div className="flex items-center gap-3 w-full">
                  <IconComponent className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedValue && (
        <div className="text-sm text-purple-700 bg-purple-100 p-3 rounded-lg">
          ✓ Valt: {roomOptions.find(opt => opt.value === selectedValue)?.label}
        </div>
      )}
    </div>
  );
};
