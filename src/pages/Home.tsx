import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Heart, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from '@/components/ui/language-selector';
import { getTranslation } from '@/data/translations';

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const navigate = useNavigate();

  const recentAgreements = [
    { name: getTranslation('employmentContract', selectedLanguage), id: 1 },
    { name: getTranslation('tenancyAgreement', selectedLanguage), id: 2 },
    { name: getTranslation('nonDisclosure', selectedLanguage), id: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-orange-300/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-10 w-16 h-16 bg-orange-400/20 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/15 rounded-full animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-b-3xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-full">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Legislate</h1>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </header>

        <div className="p-6 space-y-6">
          {/* Create Agreements Section */}
          <Card className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold mb-2">{getTranslation('createAgreements', selectedLanguage)}</h2>
            <p className="text-white/90 text-lg mb-6">{getTranslation('generateContracts', selectedLanguage)}</p>
          </Card>

          {/* New Agreement Button */}
          <Button
            onClick={() => navigate(`/chat-ai?language=${selectedLanguage}`)}
            className="w-full h-16 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-xl font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Plus className="h-6 w-6 mr-2" />
            {getTranslation('newAgreement', selectedLanguage)}
          </Button>

          {/* My Documents Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{getTranslation('myDocuments', selectedLanguage)}</h3>
          </div>

          {/* Recent Agreements */}
          <Card className="bg-white/70 backdrop-blur-sm p-6 rounded-3xl shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-gray-600" />
              <h4 className="text-xl font-bold text-gray-800">{getTranslation('recentAgreements', selectedLanguage)}</h4>
            </div>
            
            <div className="space-y-4">
              {recentAgreements.map((agreement, index) => (
                <div key={agreement.id} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-300">
                  <span className="text-gray-800 font-medium">{agreement.name}</span>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </Card>

          {/* Floating Heart Button */}
          <div className="fixed bottom-8 right-8">
            <Button className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300">
              <Heart className="h-8 w-8 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;