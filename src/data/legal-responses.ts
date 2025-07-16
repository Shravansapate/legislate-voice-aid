// Mock AI responses for legal queries
export const legalResponses = {
  'land dispute': {
    hindi: "भूमि विवाद के लिए आपको सबसे पहले अपने पास की सारी जमीन के कागजात इकट्ठे करने होंगे। इसमें खसरा खतौनी, रजिस्ट्री के कागजात, और म्यूटेशन के दस्तावेज शामिल हैं। फिर आप तहसीलदार के पास जाकर शिकायत दर्ज करा सकते हैं।",
    english: "For land disputes, first collect all property documents including Khasra Khatauni, registry papers, and mutation documents. Then file a complaint with the Tehsildar.",
    category: "property"
  },
  'domestic violence': {
    hindi: "घरेलू हिंसा के खिलाफ आप महिला हेल्पलाइन 1091 पर कॉल कर सकती हैं। आप नजदीकी पुलिस स्टेशन में FIR दर्ज करा सकती हैं या महिला थाने में जा सकती हैं। घरेलू हिंसा अधिनियम 2005 के तहत आपको सुरक्षा का अधिकार है।",
    english: "For domestic violence, call Women Helpline 1091. You can file FIR at nearest police station or women's police station. Domestic Violence Act 2005 protects your rights.",
    category: "safety"
  },
  'pension': {
    hindi: "वृद्धावस्था पेंशन के लिए आपको अपने BPL कार्ड, आधार कार्ड, और आयु प्रमाण पत्र की जरूरत होगी। आप अपने ग्राम पंचायत में आवेदन कर सकते हैं या ऑनलाइन पोर्टल पर भी अप्लाई कर सकते हैं।",
    english: "For old age pension, you need BPL card, Aadhaar card, and age certificate. Apply at your Gram Panchayat or through online portal.",
    category: "welfare"
  },
  'employment': {
    hindi: "MNREGA के तहत आपको साल में कम से कम 100 दिन काम पाने का अधिकार है। अगर 15 दिन में काम नहीं मिलता तो बेरोजगारी भत्ता का हक है। नजदीकी रोजगार सहायक से संपर्क करें।",
    english: "Under MNREGA, you have right to at least 100 days of work per year. If work not provided within 15 days, you get unemployment allowance. Contact local employment assistant.",
    category: "employment"
  }
};

export const generateAIResponse = (query: string, language: string = 'hindi'): string => {
  const lowerQuery = query.toLowerCase();
  
  // Simple keyword matching for demonstration
  if (lowerQuery.includes('जमीन') || lowerQuery.includes('भूमि') || lowerQuery.includes('land')) {
    return legalResponses['land dispute'][language as keyof typeof legalResponses['land dispute']] || legalResponses['land dispute'].hindi;
  }
  
  if (lowerQuery.includes('घरेलू हिंसा') || lowerQuery.includes('domestic') || lowerQuery.includes('violence')) {
    return legalResponses['domestic violence'][language as keyof typeof legalResponses['domestic violence']] || legalResponses['domestic violence'].hindi;
  }
  
  if (lowerQuery.includes('पेंशन') || lowerQuery.includes('pension') || lowerQuery.includes('वृद्धावस्था')) {
    return legalResponses['pension'][language as keyof typeof legalResponses['pension']] || legalResponses['pension'].hindi;
  }
  
  if (lowerQuery.includes('काम') || lowerQuery.includes('employment') || lowerQuery.includes('mnrega') || lowerQuery.includes('मनरेगा')) {
    return legalResponses['employment'][language as keyof typeof legalResponses['employment']] || legalResponses['employment'].hindi;
  }
  
  // Default response
  return `आपका प्रश्न: "${query}" के लिए मैं आपकी सहायता करता हूँ। कृपया अधिक विस्तार से बताएं कि आपकी समस्या क्या है। आप निम्नलिखित विषयों पर पूछ सकते हैं: जमीन विवाद, घरेलू हिंसा, पेंशन, रोजगार की समस्या।`;
};