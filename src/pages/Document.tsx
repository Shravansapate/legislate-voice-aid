import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share, FileText, Calendar, MapPin, User } from 'lucide-react';

const Document = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState<'fir' | 'rti'>('fir');

  useEffect(() => {
    if (location.state) {
      const { type, query, response } = location.state;
      setDocumentType(type);
      
      // Generate document based on type
      if (type === 'fir') {
        generateFIR(query, response);
      } else {
        generateRTI(query, response);
      }
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const generateFIR = (query: string, response: string) => {
    const today = new Date().toLocaleDateString('hi-IN');
    const content = `
प्राथमिकी (FIR) - प्रथम सूचना रिपोर्ट

थाना: ________________________
दिनांक: ${today}
समय: ________________________

श्रीमान/श्रीमती,
    मैं निम्नलिखित घटना की सूचना देना चाहता/चाहती हूँ:

विषय: ${query}

घटना का विवरण:
${response}

मैं अनुरोध करता/करती हूँ कि इस मामले में उचित कार्रवाई की जाए और न्याय दिलाया जाए।

सादर,
शिकायतकर्ता का नाम: ________________________
पता: ________________________
मोबाइल नंबर: ________________________
हस्ताक्षर: ________________________

दिनांक: ${today}

--------------------------------
यह AI द्वारा तैयार किया गया ड्राफ्ट है। कृपया वकील से सलाह लेकर इसे अंतिम रूप दें।
    `;
    setDocumentContent(content);
  };

  const generateRTI = (query: string, response: string) => {
    const today = new Date().toLocaleDateString('hi-IN');
    const content = `
सूचना का अधिकार अधिनियम 2005 के तहत आवेदन

सेवा में,
लोक सूचना अधिकारी
________________________ विभाग/कार्यालय

दिनांक: ${today}

विषय: ${query} संबंधी जानकारी हेतु आवेदन

महोदय/महोदया,

सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के तहत मैं निम्नलिखित जानकारी प्राप्त करना चाहता/चाहती हूँ:

प्रश्न: ${query}

संदर्भ: ${response}

अपेक्षित जानकारी:
1. उपरोक्त विषय से संबंधित सभी दस्तावेज
2. संबंधित नीतियों और नियमों की जानकारी
3. आवेदन की स्थिति और प्रक्रिया

मैं RTI शुल्क के रूप में ₹10 संलग्न कर रहा/रही हूँ।

सादर,
आवेदक का नाम: ________________________
पता: ________________________
मोबाइल नंबर: ________________________
हस्ताक्षर: ________________________

दिनांक: ${today}

--------------------------------
यह AI द्वारा तैयार किया गया ड्राफ्ट है। कृपया वकील से सलाह लेकर इसे अंतिम रूप दें।
    `;
    setDocumentContent(content);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${documentType === 'fir' ? 'FIR' : 'RTI'}_Draft_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`Legislate AI से तैयार ${documentType === 'fir' ? 'FIR' : 'RTI'} ड्राफ्ट:\n\n${documentContent}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentType === 'fir' ? 'FIR' : 'RTI'} Draft</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Legislate AI - ${documentType === 'fir' ? 'FIR Draft' : 'RTI Application'}</h2>
            </div>
            <div class="content">${documentContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
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
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>वापस</span>
            </Button>
            <Logo showText={false} />
            <Badge variant="outline" className="ml-auto">
              {documentType === 'fir' ? 'FIR Draft' : 'RTI Application'}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Document Preview */}
        <Card className="mb-8 shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.1)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className={`w-6 h-6 ${documentType === 'fir' ? 'text-destructive' : 'text-justice-indigo'}`} />
                <CardTitle className="text-xl">
                  {documentType === 'fir' ? 'FIR (प्राथमिकी) ड्राफ्ट' : 'RTI आवेदन ड्राफ्ट'}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('hi-IN')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-document-bg p-6 rounded-lg border-2 border-dashed border-border min-h-[500px]">
              <pre className="whitespace-pre-wrap font-mono text-sm text-foreground leading-relaxed">
                {documentContent}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button 
            onClick={handleDownload}
            className="bg-justice-indigo hover:bg-justice-indigo-light text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            डाउनलोड करें
          </Button>
          
          <Button 
            onClick={handlePrint}
            variant="outline"
            className="border-justice-gold text-justice-gold hover:bg-justice-gold hover:text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            प्रिंट करें
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

        {/* Instructions */}
        <Card className="bg-muted/50 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-justice-indigo" />
              अगले कदम
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• इस ड्राफ्ट को डाउनलोड या प्रिंट करें</li>
              <li>• आवश्यक जानकारी भरें (नाम, पता, मोबाइल नंबर)</li>
              <li>• {documentType === 'fir' ? 'नजदीकी पुलिस स्टेशन' : 'संबंधित सरकारी कार्यालय'} में जमा करें</li>
              <li>• कानूनी सलाह के लिए वकील से मिलें</li>
              <li>• सहायता के लिए NGO से संपर्क करें</li>
            </ul>
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
              <MapPin className="w-4 h-4 mr-2" />
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

export default Document;