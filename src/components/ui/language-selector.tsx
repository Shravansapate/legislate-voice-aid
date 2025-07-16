import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'hi-IN', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी', flag: '🇮🇳' },
  { code: 'en-IN', name: 'English', flag: '🇮🇳' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, className }: LanguageSelectorProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={selectedLanguage === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => onLanguageChange(lang.code)}
          className={cn(
            "flex items-center space-x-2 transition-all duration-200",
            selectedLanguage === lang.code 
              ? "bg-justice-gold text-primary shadow-[0_8px_25px_-8px_hsl(var(--justice-gold)/0.4)]" 
              : "hover:bg-secondary"
          )}
        >
          <span>{lang.flag}</span>
          <span className="text-xs font-medium">{lang.name}</span>
        </Button>
      ))}
    </div>
  );
}