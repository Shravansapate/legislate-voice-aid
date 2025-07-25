import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Share, Users } from 'lucide-react';
import { Chatbot } from '@/components/ui/chatbot';
import { LanguageSelector } from '@/components/ui/language-selector';
import { getTranslation } from '@/data/translations';

const ChatAI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('hi-IN');
  const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (location.state?.language) {
      setLanguage(location.state.language);
    }
    if (location.state?.initialMessage) {
      setInitialMessage(location.state.initialMessage);
    }
  }, [location.state]);

  const t = (key: string) => getTranslation(key, language);

  const handleDocumentGeneration = (type: 'fir' | 'rti') => {
    navigate('/document', { 
      state: { 
        type, 
        language,
        fromChat: true
      } 
    });
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`${t('appName')} - ${t('tagline')}\n\n${t('whatsappDescription')}\n\n${window.location.origin}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToHome')}</span>
              </Button>
              <Logo showText={false} />
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={language}
                onLanguageChange={setLanguage}
                className="hidden md:flex"
              />
            </div>
          </div>
          
          {/* Mobile Language Selector */}
          <div className="mt-4 md:hidden">
            <LanguageSelector 
              selectedLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-justice-indigo to-justice-gold bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {t('tagline')}
          </p>
          <Badge variant="outline" className="text-sm border-justice-indigo text-justice-indigo">
            AI {t('thinking')}
          </Badge>
        </div>

        {/* Main Chatbot */}
        <div className="mb-8">
          <Chatbot language={language} initialMessage={initialMessage} />
        </div>

        {/* Quick Action Buttons */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-muted/30">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">{t('quickHelp')}</CardTitle>
              <CardDescription>
                {language === 'hi-IN' && 'त्वरित दस्तावेज़ निर्माण और सहायता'}
                {language === 'en-IN' && 'Quick document generation and assistance'}
                {language === 'te-IN' && 'త్వరిత పత్రాల తయారీ మరియు సహాయం'}
                {language === 'mr-IN' && 'त्वरित कागदपत्र निर्मिती आणि मदत'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleDocumentGeneration('fir')}
                  className="bg-justice-indigo hover:bg-justice-indigo/90 text-white h-auto py-4 flex flex-col items-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{t('generateFIR')}</div>
                    <div className="text-xs opacity-90">{t('firHelp')}</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => handleDocumentGeneration('rti')}
                  variant="outline"
                  className="border-justice-gold text-justice-gold hover:bg-justice-gold hover:text-primary h-auto py-4 flex flex-col items-center gap-2"
                >
                  <FileText className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{t('generateRTI')}</div>
                    <div className="text-xs opacity-90">{t('rtiHelp')}</div>
                  </div>
                </Button>
                
                <Button 
                  onClick={() => navigate('/ngos')}
                  variant="outline"
                  className="border-voice-active text-voice-active hover:bg-voice-active hover:text-white h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Users className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold">{t('ngoSupport')}</div>
                    <div className="text-xs opacity-90">{t('ngoDescription')}</div>
                  </div>
                </Button>
              </div>
              
              {/* WhatsApp Share */}
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleWhatsAppShare}
                  variant="outline"
                  className="border-justice-gold text-justice-gold hover:bg-justice-gold hover:text-primary"
                >
                  <Share className="w-4 h-4 mr-2" />
                  {t('shareWhatsApp')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Disclaimer */}
        <Card className="mt-8 bg-muted/50 border-0 max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <CardDescription className="text-center text-sm">
              ⚖️ <strong>
                {language === 'hi-IN' && 'कानूनी अस्वीकरण:'}
                {language === 'en-IN' && 'Legal Disclaimer:'}
                {language === 'te-IN' && 'న్యాయ నిరాకరణ:'}
                {language === 'mr-IN' && 'कायदेशीर अस्वीकरण:'}
              </strong> {t('disclaimer')}
            </CardDescription>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChatAI;