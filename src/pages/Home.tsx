import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { VoiceInput } from '@/components/ui/voice-input';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Phone, MessageSquare } from 'lucide-react';
import heroImage from '@/assets/hero-justice.jpg';

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [transcript, setTranscript] = useState('');
  const navigate = useNavigate();

  const handleTranscript = (text: string) => {
    setTranscript(text);
    if (text.trim()) {
      navigate('/chat', { 
        state: { 
          query: text.trim(), 
          language: selectedLanguage 
        } 
      });
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "आवाज़ से पूछें",
      description: "अपनी भाषा में बोलकर कानूनी सलाह पाएं",
      color: "text-voice-active"
    },
    {
      icon: FileText,
      title: "दस्तावेज़ बनाएं",
      description: "FIR, RTI और अन्य कानूनी दस्तावेज़",
      color: "text-justice-gold"
    },
    {
      icon: Users,
      title: "NGO सपोर्ट",
      description: "विशेषज्ञ कानूनी सहायता केंद्रों से जुड़ें",
      color: "text-justice-indigo"
    },
    {
      icon: Phone,
      title: "WhatsApp शेयर",
      description: "दस्तावेज़ और जानकारी साझा करें",
      color: "text-voice-active"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <Button 
              variant="outline" 
              onClick={() => navigate('/ngos')}
              className="text-sm"
            >
              सहायता केंद्र
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Image Banner */}
        <div className="relative mb-16 rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_hsl(var(--primary)/0.3)]">
          <img 
            src={heroImage} 
            alt="Legislate AI - Justice for All" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-justice-indigo/80 to-justice-indigo/40 flex items-center">
            <div className="container mx-auto px-8">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Legislate AI
                </h1>
                <p className="text-xl md:text-2xl mb-6 opacity-90">
                  आपकी <span className="text-justice-gold-light font-semibold">आवाज़</span> है आपका अधिकार
                </p>
                <p className="text-lg opacity-80">
                  कानूनी समस्याओं का समाधान • दस्तावेज़ निर्माण • विशेषज्ञ सहायता
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          
          {/* Language Selector */}
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            className="mb-12"
          />
          
          {/* Voice Input */}
          <div className="bg-card p-8 rounded-2xl shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.1)] max-w-md mx-auto mb-12">
            <VoiceInput 
              onTranscript={handleTranscript}
              language={selectedLanguage}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              "मेरी जमीन का विवाद है" या "घरेलू हिंसा की शिकायत कैसे करें"
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.1)] hover:shadow-[0_12px_35px_-10px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <CardHeader className="text-center">
                <feature.icon className={`w-12 h-12 mx-auto mb-2 ${feature.color}`} />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-foreground mb-6">
            त्वरित सहायता
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/chat', { 
                state: { 
                  query: "FIR कैसे दर्ज करें", 
                  language: selectedLanguage 
                } 
              })}
              className="bg-document-bg hover:bg-muted"
            >
              FIR दर्ज करना
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/chat', { 
                state: { 
                  query: "RTI कैसे भरें", 
                  language: selectedLanguage 
                } 
              })}
              className="bg-document-bg hover:bg-muted"
            >
              RTI आवेदन
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/chat', { 
                state: { 
                  query: "वृद्धावस्था पेंशन", 
                  language: selectedLanguage 
                } 
              })}
              className="bg-document-bg hover:bg-muted"
            >
              पेंशन योजना
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            यह एक AI सहायक है। कानूनी सलाह के लिए योग्य वकील से सलाह लें।
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;