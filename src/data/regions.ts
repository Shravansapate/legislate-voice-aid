export const regions = [
  { value: 'all', label: { 'hi-IN': 'सभी क्षेत्र', 'en-IN': 'All Regions', 'te-IN': 'అన్ని ప్రాంతాలు', 'mr-IN': 'सर्व प्रदेश' } },
  { value: 'north', label: { 'hi-IN': 'उत्तर भारत', 'en-IN': 'North India', 'te-IN': 'ఉత్తర భారతదేశం', 'mr-IN': 'उत्तर भारत' } },
  { value: 'south', label: { 'hi-IN': 'दक्षिण भारत', 'en-IN': 'South India', 'te-IN': 'దక్షిణ భారతదేశం', 'mr-IN': 'दक्षिण भारत' } },
  { value: 'west', label: { 'hi-IN': 'पश्चिम भारत', 'en-IN': 'West India', 'te-IN': 'పశ్చిమ భారతదేశం', 'mr-IN': 'पश्चिम भारत' } },
  { value: 'east', label: { 'hi-IN': 'पूर्व भारत', 'en-IN': 'East India', 'te-IN': 'తూర్పు భారతదేశం', 'mr-IN': 'पूर्व भारत' } }
];

export const cityToRegion: { [key: string]: string } = {
  'Delhi': 'north',
  'Mumbai': 'west',
  'Hyderabad': 'south',
  'Pune': 'west',
  'Lucknow': 'north',
  'Chennai': 'south',
  'Kolkata': 'east',
  'Jaipur': 'north',
  'Ahmedabad': 'west',
  'Bangalore': 'south'
};