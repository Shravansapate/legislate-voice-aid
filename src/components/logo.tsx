import React from 'react';
import { Scale, MessageCircle, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        {/* Justice Scale */}
        <Scale className="w-8 h-8 text-justice-indigo" />
        
        {/* Chat Bubble overlay */}
        <MessageCircle 
          className="absolute -top-1 -right-1 w-4 h-4 text-justice-gold" 
          fill="currentColor"
        />
        
        {/* Mic icon */}
        <Mic 
          className="absolute -bottom-1 -left-1 w-3 h-3 text-voice-active"
          fill="currentColor" 
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-justice-indigo to-justice-gold bg-clip-text text-transparent">
            Legislate AI
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">
            न्यायिक सहायता • న్యాయ సహాయం • न्यायिक मदत
          </p>
        </div>
      )}
    </div>
  );
}