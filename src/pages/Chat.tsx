import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Download, Share, MessageSquare, Bot } from 'lucide-react';
import { generateAIResponse } from '@/data/legal-responses';

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state) {
      const { query: userQuery, language: userLanguage } = location.state;
      setQuery(userQuery);
      setLanguage(userLanguage);
      
      // Simulate AI response generation
      setTimeout(() => {
        const aiResponse = generateAIResponse(userQuery, userLanguage.includes('hi') ? 'hindi' : 'english');
        setResponse(aiResponse);
        setIsLoading(false);
      }, 2000);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleGenerateDocument = (type: 'fir' | 'rti') => {
    navigate('/document', { 
      state: { 
        type, 
        query, 
        response, 
        language 
      } 
    });
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`Legislate AI की सहायता:\n\nप्रश्न: ${query}\n\nउत्तर: ${response}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="w-8 h-8 text-justice-indigo animate-pulse" />
            <div className="text-lg font-semibold">AI विश्लेषण कर रहा है...</div>
          </div>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-justice-gold rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>वापस</span>
            </Button>
            <Logo showText={false} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Query */}
        <Card className="mb-6 border-l-4 border-l-justice-gold">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-justice-gold" />
              <CardTitle className="text-lg">आपका प्रश्न</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {language === 'hi-IN' ? 'हिंदी' : language === 'te-IN' ? 'तेलुगु' : language === 'mr-IN' ? 'मराठी' : 'English'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground font-medium">{query}</p>
          </CardContent>
        </Card>

        {/* AI Response */}
        <Card className="mb-8 border-l-4 border-l-justice-indigo shadow-[0_10px_30px_-10px_hsl(var(--justice-indigo)/0.2)]">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-justice-indigo" />
              <CardTitle className="text-lg">AI कानूनी सलाह</CardTitle>
              <Badge variant="outline" className="text-xs border-justice-indigo text-justice-indigo">
                AI Generated
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{response}</p>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button 
                onClick={() => handleGenerateDocument('fir')}
                className="bg-justice-indigo hover:bg-justice-indigo-light text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                FIR दर्ज करें
              </Button>
              
              <Button 
                onClick={() => handleGenerateDocument('rti')}
                variant="outline"
                className="border-justice-gold text-justice-gold hover:bg-justice-gold hover:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                RTI आवेदन
              </Button>
              
              <Button 
                onClick={handleWhatsAppShare}
                variant="outline"
                className="border-voice-active text-voice-active hover:bg-voice-active hover:text-white"
              >
                <Share className="w-4 h-4 mr-2" />
                WhatsApp शेयर
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <CardDescription className="text-center text-sm">
              ⚖️ <strong>कानूनी अस्वीकरण:</strong> यह AI सिस्टम केवल प्रारंभिक मार्गदर्शन प्रदान करता है। 
              विस्तृत कानूनी सलाह के लिए योग्य वकील या कानूनी विशेषज्ञ से संपर्क करें।
            </CardDescription>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">और सहायता चाहिए?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/ngos')}
              className="bg-document-bg hover:bg-muted"
            >
              NGO सहायता केंद्र
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="bg-document-bg hover:bg-muted"
            >
              नया प्रश्न पूछें
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;