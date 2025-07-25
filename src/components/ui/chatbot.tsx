import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VoiceInput } from '@/components/ui/voice-input';
import { Bot, User, Send, Loader2 } from 'lucide-react';
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
  initialMessage?: string;
}

export function Chatbot({ language, className, initialMessage }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  // Handle initial message from OCR
  useEffect(() => {
    if (initialMessage && !hasProcessedInitialMessage) {
      setHasProcessedInitialMessage(true);
      sendMessage(initialMessage);
    }
  }, [initialMessage, hasProcessedInitialMessage]);

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
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
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
          {/* Voice Input */}
          <div className="flex justify-center">
            <VoiceInput
              onTranscript={(transcript) => sendMessage(transcript)}
              language={language}
              className="scale-75"
            />
          </div>
          
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