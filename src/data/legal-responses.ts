// Mock AI responses for legal queries
export const legalResponses = {
  'land dispute': {
    'hi-IN': "भूमि विवाद के लिए आपको सबसे पहले अपने पास की सारी जमीन के कागजात इकट्ठे करने होंगे। इसमें खसरा खतौनी, रजिस्ट्री के कागजात, और म्यूटेशन के दस्तावेज शामिल हैं। फिर आप तहसीलदार के पास जाकर शिकायत दर्ज करा सकते हैं।",
    'en-IN': "For land disputes, first collect all property documents including Khasra Khatauni, registry papers, and mutation documents. Then file a complaint with the Tehsildar.",
    'te-IN': "భూమి వివాదాల కోసం, మొదట ఖస్రా ఖతౌని, రిజిస్ట్రీ పేపర్లు మరియు మ్యుటేషన్ పత్రాలతో సహా అన్ని ఆస్తి పత్రాలను సేకరించండి. తరువాత తహసీల్దార్ వద్ద ఫిర్యాదు దాఖలు చేయండి।",
    'mr-IN': "जमिनीच्या वादासाठी, प्रथम खसरा खतावणी, नोंदणी कागदपत्रे आणि म्युटेशन दस्तऐवजांसह सर्व मालमत्ता कागदपत्रे गोळा करा. नंतर तहसीलदार कडे तक्रार दाखल करा.",
    category: "property"
  },
  'domestic violence': {
    'hi-IN': "घरेलू हिंसा के खिलाफ आप महिला हेल्पलाइन 1091 पर कॉल कर सकती हैं। आप नजदीकी पुलिस स्टेशन में FIR दर्ज करा सकती हैं या महिला थाने में जा सकती हैं। घरेलू हिंसा अधिनियम 2005 के तहत आपको सुरक्षा का अधिकार है।",
    'en-IN': "For domestic violence, call Women Helpline 1091. You can file FIR at nearest police station or women's police station. Domestic Violence Act 2005 protects your rights.",
    'te-IN': "గృహ హింస కోసం, మహిళా హెల్ప్‌లైన్ 1091కు కాల్ చేయండి. మీరు సమీప పోలీసు స్టేషన్‌లో లేదా మహిళా పోలీసు స్టేషన్‌లో FIR దాఖలు చేయవచ్చు. గృహ హింస చట్టం 2005 మీ హక్కులను రక్షిస్తుంది.",
    'mr-IN': "घरगुती हिंसाचारासाठी, महिला हेल्पलाइन 1091 वर कॉल करा. तुम्ही जवळच्या पोलिस स्टेशनमध्ये किंवा महिला पोलिस स्टेशनमध्ये FIR दाखल करू शकता. घरगुती हिंसाचार कायदा 2005 तुमच्या हक्कांचे संरक्षण करतो.",
    category: "safety"
  },
  'pension': {
    'hi-IN': "वृद्धावस्था पेंशन के लिए आपको अपने BPL कार्ड, आधार कार्ड, और आयु प्रमाण पत्र की जरूरत होगी। आप अपने ग्राम पंचायत में आवेदन कर सकते हैं या ऑनलाइन पोर्टल पर भी अप्लाई कर सकते हैं।",
    'en-IN': "For old age pension, you need BPL card, Aadhaar card, and age certificate. Apply at your Gram Panchayat or through online portal.",
    'te-IN': "వృద్ధాప్య పెన్షన్ కోసం, మీకు BPL కార్డ్, ఆధార్ కార్డ్ మరియు వయస్సు ప్రమాణ పత్రం అవసరం. మీ గ్రామ పంచాయతీలో లేదా ఆన్‌లైన్ పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి.",
    'mr-IN': "वृद्धत्व पेन्शनसाठी, तुम्हाला BPL कार्ड, आधार कार्ड आणि वय प्रमाणपत्राची गरज आहे. तुमच्या ग्राम पंचायतीत किंवा ऑनलाइन पोर्टलद्वारे अर्ज करा.",
    category: "welfare"
  },
  'employment': {
    'hi-IN': "MNREGA के तहत आपको साल में कम से कम 100 दिन काम पाने का अधिकार है। अगर 15 दिन में काम नहीं मिलता तो बेरोजगारी भत्ता का हक है। नजदीकी रोजगार सहायक से संपर्क करें।",
    'en-IN': "Under MNREGA, you have right to at least 100 days of work per year. If work not provided within 15 days, you get unemployment allowance. Contact local employment assistant.",
    'te-IN': "MNREGA కింద మీకు సంవత్సరానికి కనీసం 100 రోజుల పని పొందే హక్కు ఉంది. 15 రోజుల్లో పని లభించకపోతే, మీకు నిరుద్యోగ భత్యం లభిస్తుంది. స్థానిక ఉపాధి సహాయకుడిని సంప్రదించండి.",
    'mr-IN': "MNREGA अंतर्गत तुम्हाला वर्षभरात किमान 100 दिवसांचे काम मिळण्याचा अधिकार आहे. 15 दिवसांत काम मिळाले नाही तर बेरोजगारी भत्ता मिळण्याचा हक्क आहे. जवळच्या रोजगार सहायकाशी संपर्क साधा.",
    category: "employment"
  }
};

export const generateAIResponse = (query: string, language: string = 'hi-IN'): string => {
  const lowerQuery = query.toLowerCase();
  
  // Simple keyword matching for demonstration
  if (lowerQuery.includes('जमीन') || lowerQuery.includes('भूमि') || lowerQuery.includes('land') || lowerQuery.includes('భూమి') || lowerQuery.includes('जमीन')) {
    return legalResponses['land dispute'][language as keyof typeof legalResponses['land dispute']] || legalResponses['land dispute']['hi-IN'];
  }
  
  if (lowerQuery.includes('घरेलू हिंसा') || lowerQuery.includes('domestic') || lowerQuery.includes('violence') || lowerQuery.includes('గృహ హింస') || lowerQuery.includes('घरगुती हिंसाचार')) {
    return legalResponses['domestic violence'][language as keyof typeof legalResponses['domestic violence']] || legalResponses['domestic violence']['hi-IN'];
  }
  
  if (lowerQuery.includes('पेंशन') || lowerQuery.includes('pension') || lowerQuery.includes('वृद्धावस्था') || lowerQuery.includes('పెన్షన్') || lowerQuery.includes('पेन्शन')) {
    return legalResponses['pension'][language as keyof typeof legalResponses['pension']] || legalResponses['pension']['hi-IN'];
  }
  
  if (lowerQuery.includes('काम') || lowerQuery.includes('employment') || lowerQuery.includes('mnrega') || lowerQuery.includes('मनरेगा') || lowerQuery.includes('పని') || lowerQuery.includes('काम')) {
    return legalResponses['employment'][language as keyof typeof legalResponses['employment']] || legalResponses['employment']['hi-IN'];
  }
  
  // Default response based on language
  const defaultResponses = {
    'hi-IN': `आपका प्रश्न: "${query}" के लिए मैं आपकी सहायता करता हूँ। कृपया अधिक विस्तार से बताएं कि आपकी समस्या क्या है। आप निम्नलिखित विषयों पर पूछ सकते हैं: जमीन विवाद, घरेलू हिंसा, पेंशन, रोजगार की समस्या।`,
    'en-IN': `Your query: "${query}" - I'm here to help you. Please provide more details about your problem. You can ask about: land disputes, domestic violence, pension, employment issues.`,
    'te-IN': `మీ ప్రశ్న: "${query}" కోసం నేను మీకు సహాయం చేస్తాను. దయచేసి మీ సమస్య గురించి మరింత వివరాలు ఇవ్వండి. మీరు అడగవచ్చు: భూమి వివాదాలు, గృహ హింస, పెన్షన్, ఉపాధి సమస్యలు.`,
    'mr-IN': `तुमचा प्रश्न: "${query}" साठी मी तुमची मदत करतो. कृपया तुमच्या समस्येबद्दल अधिक तपशीलांसह सांगा. तुम्ही विचारू शकता: जमिनीचे वाद, घरगुती हिंसाचार, पेन्शन, रोजगाराच्या समस्या.`
  };
  
  return defaultResponses[language as keyof typeof defaultResponses] || defaultResponses['hi-IN'];
};