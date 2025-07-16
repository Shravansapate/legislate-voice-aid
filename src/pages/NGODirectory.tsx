import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Globe, MapPin, Users, Scale } from 'lucide-react';
import ngosData from '@/data/ngos.json';

const NGODirectory = () => {
  const navigate = useNavigate();

  const handleWhatsAppContact = (phone: string, ngoName: string) => {
    const message = encodeURIComponent(`नमस्ते, मुझे Legislate AI से आपकी जानकारी मिली है। मुझे कानूनी सहायता चाहिए। कृपया मदद करें।`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handlePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getSpecialityIcon = (speciality: string) => {
    if (speciality.includes('Women') || speciality.includes('Domestic')) {
      return <Users className="w-4 h-4 text-destructive" />;
    }
    if (speciality.includes('Land') || speciality.includes('Property')) {
      return <MapPin className="w-4 h-4 text-justice-gold" />;
    }
    if (speciality.includes('Employment') || speciality.includes('Labor')) {
      return <Users className="w-4 h-4 text-voice-active" />;
    }
    return <Scale className="w-4 h-4 text-justice-indigo" />;
  };

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
              <span>होम</span>
            </Button>
            <Logo showText={false} />
            <h1 className="text-xl font-semibold text-foreground">सहायता केंद्र</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            विशेषज्ञ <span className="text-justice-gold">कानूनी सहायता</span> केंद्र
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            भारत भर के विश्वसनीय NGOs और कानूनी सहायता संगठनों से जुड़ें
          </p>
        </div>

        {/* NGO Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ngosData.map((ngo) => (
            <Card key={ngo.id} className="border-0 shadow-[0_8px_25px_-8px_hsl(var(--primary)/0.1)] hover:shadow-[0_12px_35px_-10px_hsl(var(--primary)/0.2)] transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-foreground mb-1">
                      {ngo.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mb-2">
                      {ngo.englishName}
                    </CardDescription>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{ngo.location}</span>
                    </div>
                  </div>
                  {getSpecialityIcon(ngo.speciality)}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Speciality */}
                <div className="mb-4">
                  <Badge variant="secondary" className="text-xs bg-justice-gold-light text-justice-indigo">
                    {ngo.speciality}
                  </Badge>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">भाषाएं:</p>
                  <div className="flex flex-wrap gap-1">
                    {ngo.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleWhatsAppContact(ngo.whatsapp, ngo.name)}
                    className="w-full bg-voice-active hover:bg-voice-active/90 text-white"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp पर संपर्क करें
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handlePhoneCall(ngo.phone)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      कॉल करें
                    </Button>
                    
                    <Button 
                      onClick={() => window.open(ngo.website, '_blank')}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      वेबसाइट
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-destructive/5 border-destructive/20 mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-destructive flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              आपातकालीन हेल्पलाइन
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">महिला हेल्पलाइन</p>
                <Button 
                  onClick={() => handlePhoneCall('1091')}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  1091
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">पुलिस हेल्पलाइन</p>
                <Button 
                  onClick={() => handlePhoneCall('100')}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  100
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">चाइल्ड हेल्पलाइन</p>
                <Button 
                  onClick={() => handlePhoneCall('1098')}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  1098
                </Button>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">कानूनी सहायता हेल्पलाइन</p>
                <Button 
                  onClick={() => handlePhoneCall('15100')}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  15100
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-center">संपर्क करने से पहले तैयार रखें</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>• अपनी समस्या का संक्षिप्त विवरण</li>
                <li>• संबंधित दस्तावेज़ों की फोटो</li>
                <li>• अपना पूरा नाम और पता</li>
              </ul>
              <ul className="space-y-1">
                <li>• घटना की तारीख और समय</li>
                <li>• गवाहों की जानकारी (यदि कोई हो)</li>
                <li>• पहले से की गई कार्रवाई की जानकारी</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-document-bg hover:bg-muted"
          >
            होम पर वापस जाएं
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NGODirectory;