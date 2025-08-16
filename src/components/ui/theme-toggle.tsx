import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl glass-card border border-smartflytt-200/30 dark:border-gray-600/30 hover:bg-smartflytt-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
      aria-label={`Växla till ${theme === 'light' ? 'mörkt' : 'ljust'} läge`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-smartflytt-600" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-smartflytt-400" />
    </Button>
  );
};