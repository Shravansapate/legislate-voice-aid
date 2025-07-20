import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Bot, User, Send, Loader2, Volume2, VolumeX, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  language: string;
  className?: string;
}

export function Chatbot({ language, className }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('elevenlabs_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsTTSEnabled(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem('elevenlabs_api_key', key);
    setApiKey(key);
    setIsTTSEnabled(true);
  };

  const speakText = async (text: string) => {
    if (!apiKey || !isTTSEnabled) return;

    try {
      setIsPlaying(true);
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'microsoft/wizardlm-2-8x22b',
        messages: [
          {
            role: 'system',
            content: `You are a helpful legal assistant for Indian law. Respond in ${getLanguageName(language)} language. Provide accurate, simple legal guidance for common issues like land disputes, domestic violence, consumer rights, employment issues, and government schemes. Keep responses clear and actionable.`
          },
          {
            role: 'user',
            content: userMessage.content
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Legislate AI'
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response if TTS is enabled
      if (isTTSEnabled && apiKey) {
        setTimeout(() => speakText(response.data.choices[0].message.content), 500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getErrorMessage(language),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getLanguageName = (lang: string) => {
    const languageMap: { [key: string]: string } = {
      'hi-IN': 'Hindi',
      'en-IN': 'English',
      'te-IN': 'Telugu',
      'mr-IN': 'Marathi'
    };
    return languageMap[lang] || 'Hindi';
  };

  const getErrorMessage = (lang: string) => {
    const errorMessages: { [key: string]: string } = {
      'hi-IN': 'क्षमा करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें।',
      'en-IN': 'Sorry, something went wrong. Please try again.',
      'te-IN': 'క్షమించండి, ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
      'mr-IN': 'माफ करा, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.'
    };
    return errorMessages[lang] || errorMessages['hi-IN'];
  };

  const getPlaceholderText = (lang: string) => {
    const placeholders: { [key: string]: string } = {
      'hi-IN': 'अपना कानूनी प्रश्न टाइप करें...',
      'en-IN': 'Type your legal question...',
      'te-IN': 'మీ న్యాయ ప్రశ్నను టైప్ చేయండి...',
      'mr-IN': 'तुमचा कायदेशीर प्रश्न टाइप करा...'
    };
    return placeholders[lang] || placeholders['hi-IN'];
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardContent className="p-0">
        {/* Header with TTS Controls */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-justice-indigo" />
            <span className="font-semibold text-foreground">AI Legal Assistant</span>
          </div>
          <div className="flex items-center gap-2">
            {isTTSEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? stopSpeech : undefined}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Text-to-Speech Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="api-key" className="text-right">
                      ElevenLabs API Key
                    </Label>
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="sk-or-v1-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => saveApiKey(apiKey)} disabled={!apiKey}>
                      Save & Enable TTS
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="h-[450px] p-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Bot className="w-12 h-12 mx-auto mb-4 text-justice-indigo" />
                <p className="text-lg font-medium">
                  {language === 'hi-IN' && 'कानूनी सहायता के लिए अपना प्रश्न पूछें'}
                  {language === 'en-IN' && 'Ask your legal question for assistance'}
                  {language === 'te-IN' && 'న్యాయ సహాయం కోసం మీ ప్రశ్న అడగండి'}
                  {language === 'mr-IN' && 'कायदेशीर मदतीसाठी तुमचा प्रश्न विचारा'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 p-4 rounded-lg",
                    message.role === 'user' 
                      ? "bg-justice-indigo/5 ml-12" 
                      : "bg-muted/50 mr-12"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === 'user' 
                      ? "bg-justice-indigo text-white" 
                      : "bg-justice-gold text-primary"
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {message.timestamp.toLocaleTimeString(language)}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 p-4 rounded-lg bg-muted/50 mr-12">
                  <div className="w-8 h-8 rounded-full bg-justice-gold text-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-justice-indigo" />
                      <span className="text-sm text-muted-foreground">
                        {language === 'hi-IN' && 'सोच रहा हूँ...'}
                        {language === 'en-IN' && 'Thinking...'}
                        {language === 'te-IN' && 'ఆలోచిస్తున్నాను...'}
                        {language === 'mr-IN' && 'विचार करत आहे...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 space-y-4">
          {/* Start Question Button */}
          {messages.length === 0 && (
            <div className="flex justify-center">
              <Button
                onClick={() => inputRef.current?.focus()}
                className="bg-justice-indigo hover:bg-justice-indigo/90 text-white px-6 py-3 rounded-full"
              >
                {language === 'hi-IN' && 'सवाल पूछना शुरू करें'}
                {language === 'en-IN' && 'Start Asking Question'}
                {language === 'te-IN' && 'ప్రశ్న అడగడం మొదలుపెట్టండి'}
                {language === 'mr-IN' && 'प्रश्न विचारणे सुरू करा'}
              </Button>
            </div>
          )}
          
          {/* Text Input */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholderText(language)}
              disabled={isLoading}
              className="flex-1 bg-background"
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-justice-indigo hover:bg-justice-indigo/90 text-white px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}