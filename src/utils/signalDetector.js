// Extracts suspicious phrases locally for the "Why did ScamShield flag this?" breakdown
// strictly labeled as potential signals, without modifying the user's original text.

const categoryTranslations = {
  English: {
    guaranteed: "Guaranteed Return Claim",
    guaranteedReason: "Regulated Indian capital markets prohibit offering guaranteed speculative profits without risk disclosures.",
    urgency: "Urgency & Artificial Pressure",
    urgencyReason: "Creates artificial panic to bypass deliberate investor verification.",
    payment: "Immediate Payment Demand",
    paymentReason: "Unsolicited requests to transfer funds via UPI or payment gateways without contractual agreements.",
    credentials: "Credential Solicitation",
    credentialsReason: "Legitimate institutions and advisors never request authentication secrets.",
    channel: "Unregulated Channel / Link",
    channelReason: "Directing users to private messaging groups helps bad actors evade regulatory compliance.",
    authority: "Authority / Insider Claim",
    authorityReason: "Claims of official authority or private insider quotas are common impersonation lures.",
    multiplier: "Exorbitant Multiplier Claim",
    multiplierReason: "Promises of rapid capital multiplication within days are strong indicators of Ponzi/advance-fee structures.",
  },
  Hindi: {
    guaranteed: "गारंटीकृत रिटर्न का दावा",
    guaranteedReason: "भारतीय विनियमित वित्तीय बाजारों में बिना जोखिम प्रकटीकरण के भारी गारंटीकृत मुनाफे का वादा प्रतिबंधित है।",
    urgency: "जल्दबाजी और तात्कालिक दबाव",
    urgencyReason: "विचारपूर्वक सत्यापन को दरकिनार करने के लिए कृत्रिम घबराहट पैदा की जाती है।",
    payment: "तत्काल भुगतान की मांग",
    paymentReason: "बिना किसी समझौते के सीधे यूपीआई या पेमेंट गेटवे से पैसे भेजने का अवांछित अनुरोध।",
    credentials: "संवेदनशील जानकारी की मांग",
    credentialsReason: "वैध संस्थान और वित्तीय सलाहकार कभी भी आपकी गोपनीय सुरक्षा जानकारी (ओटीपी/पिन) नहीं मांगते।",
    channel: "अनियमित चैनल या लिंक",
    channelReason: "निजी मैसेजिंग ग्रुप्स में ले जाना नियामक निगरानी से बचने का एक सामान्य तरीका है।",
    authority: "प्राधिकरण या इनसाइडर का दावा",
    authorityReason: "अधिकारियों या अंदरूनी कोटे का दावा अक्सर पहचान छुपाने और झांसा देने के लिए किया जाता है।",
    multiplier: "अवास्तविक गुणक का दावा",
    multiplierReason: "कुछ ही दिनों में पैसे कई गुना करने का वादा पोंजी या अग्रिम शुल्क धोखाधड़ी का प्रबल संकेत है।",
  },
  Telugu: {
    guaranteed: "గ్యారెంటీ రిటర్న్స్ వాగ్దానం",
    guaranteedReason: "భారతీయ నియంత్రిత మార్కెట్లలో ఎలాంటి రిస్క్ లేకుండా గ్యారెంటీ లాభాలు ఇవ్వడం నిషేధించబడింది.",
    urgency: "అత్యవసర మరియు కృత్రిమ ఒత్తిడి",
    urgencyReason: "ఆలోచించి నిర్ణయం తీసుకోకుండా అడ్డుకోవడానికి కృత్రిమ భయాందోళనలను సృష్టిస్తారు.",
    payment: "తక్షణ చెల్లింపు డిమాండ్",
    paymentReason: "సరైన ఒప్పందాలు లేకుండా నేరుగా UPI ద్వారా డబ్బు పంపమని కోరే ప్రమాదకర అభ్యర్థన.",
    credentials: "సున్నితమైన వివరాల అభ్యర్థన",
    credentialsReason: "రిజిస్టర్డ్ సంస్థలు ఎప్పుడూ OTP, PIN లేదా పాస్‌వర్డ్‌లను అడగవు.",
    channel: "అనియంత్రిత ఛానెల్ లేదా లింక్",
    channelReason: "ప్రైవేట్ మెసేజింగ్ గ్రూపుల ద్వారా కమ్యూనికేట్ చేయడం నియంత్రణలను దాటవేసే ప్రయత్నం.",
    authority: "అధికారిక హోదా లేదా ఇన్‌సైడర్ వాదన",
    authorityReason: "అధికారుల పేర్లు లేదా ప్రైవేట్ కోటా పేరిట ఇతరులను మోసం చేయడం సాధారణ పద్ధతి.",
    multiplier: "అధిక గుణకార లాభాల వాదన",
    multiplierReason: "కొద్ది రోజుల్లోనే డబ్బును రెట్టింపు చేస్తామని చెప్పడం పొంజీ లేదా మోసపూరిత పథకాల లక్షణం.",
  },
  Tamil: {
    guaranteed: "உறுதிசெய்யப்பட்ட லாப வாக்குறுதி",
    guaranteedReason: "ஒழுங்குபடுத்தப்பட்ட இந்திய சந்தைகளில் ஆபத்து இல்லாத உறுதிசெய்யப்பட்ட லாபங்களை வழங்க அனுமதி இல்லை.",
    urgency: "அவசரம் மற்றும் அழுத்த உத்தி",
    urgencyReason: "முறையான சரிபார்ப்பைத் தவிர்க்க செயற்கையான அவசரத்தை ஏற்படுத்துகிறார்கள்.",
    payment: "உடனடி பணப்பரிவர்த்தனை கோரிக்கை",
    paymentReason: "ஒப்பந்தங்கள் இல்லாமல் UPI மூலம் உடனடியாகப் பணம் அனுப்பக் கோருவது ஆபத்தானது.",
    credentials: "ரகசிய விவரங்கள் கோருதல்",
    credentialsReason: "முறையான வங்கிகளோ நிறுவனங்களோ ஒருபோதும் OTP அல்லது கடவுச்சொல்லைக் கேட்காது.",
    channel: "ஒழுங்குபடுத்தப்படாத இணைப்பு",
    channelReason: "சரிபார்க்கப்படாத குழுக்களுக்கு பயனர்களை வழிநடத்துவது மோசடியாளர்களின் வழக்கமான உத்தி.",
    authority: "அதிகாரபூர்வ நபர் போன்ற நடிப்பு",
    authorityReason: "அதிகாரிகளின் பெயரில் அல்லது உள் தகவல் இருப்பதாகக் கூறி ஏமாற்றுவது பொதுவான முறை.",
    multiplier: "அபரிமிதமான பெருக்கக் கூற்று",
    multiplierReason: "சில நாட்களில் பணத்தைப் பல மடங்கு ஆக்குவதாகக் கூறுவது போலித் திட்டங்களின் அறிகுறி.",
  },
  Bengali: {
    guaranteed: "নিশ্চিত লাভের দাবি",
    guaranteedReason: "নিয়ন্ত্রিত ভারতীয় বাজারে ঝুঁকিমুক্ত নিশ্চিত আকাশচুম্বী মুনাফার প্রতিশ্রুতি দেওয়া নিষিদ্ধ।",
    urgency: "জরুরি চাপ সৃষ্টি",
    urgencyReason: "সঠিক যাচাইকরণ এড়াতে ইচ্ছাকৃতভাবে কৃত্রিম আতঙ্ক তৈরি করা হয়।",
    payment: "অবিলম্বে টাকা পাঠানোর দাবি",
    paymentReason: "কোনো আনুষ্ঠানিক চুক্তি ছাড়া সরাসরি UPI-এর মাধ্যমে টাকা পাঠানোর অনুরোধ।",
    credentials: "গোপনীয় তথ্যের দাবি",
    credentialsReason: "বৈধ আর্থিক প্রতিষ্ঠান কখনোই OTP, PIN বা পাসওয়ার্ড চায় না।",
    channel: "অনিয়ন্ত্রিত চ্যানেল বা লিংক",
    channelReason: "ব্যক্তিগত মেসেজিং গ্রুপে নিয়ে গিয়ে নিয়ন্ত্রক নজরদারি এড়ানোর চেষ্টা করা হয়।",
    authority: "কর্তৃপক্ষ বা ইনসাইডারের দাবি",
    authorityReason: "সরকারি কর্মকর্তা বা গোপন তথ্যের মিথ্যা দাবি প্রতারকদের সাধারণ কৌশল।",
    multiplier: "অস্বাভাবিক গুণিতক বৃদ্ধির দাবি",
    multiplierReason: "কয়েক দিনে টাকা বহুগুণ করার প্রতিশ্রুতি পনজি বা জালিয়াতির অন্যতম প্রধান লক্ষণ।",
  },
  Marathi: {
    guaranteed: "हमी परताव्याचा दावा",
    guaranteedReason: "भारतीय भांडवली बाजारात जोखीम प्रकटीकरणाशिवाय हमी नफ्याचे आश्वासन देणे प्रतिबंधित आहे.",
    urgency: "तातडी आणि कृत्रिम दबाव",
    urgencyReason: "विचारपूर्वक पडताळणी टाळण्यासाठी कृत्रिम भीती निर्माण केली जाते.",
    payment: "तात्काळ पैसे पाठवण्याची मागणी",
    paymentReason: "कोणत्याही कराराशिवाय थेट यूपीआयद्वारे पैसे पाठवण्याची अवांछित मागणी.",
    credentials: "गोपनीय माहितीची मागणी",
    credentialsReason: "अधिकृत संस्था किंवा सल्लागार कधीही OTP, PIN किंवा पासवर्ड मागत नाहीत.",
    channel: "अनियंत्रित चॅनेल किंवा लिंक",
    channelReason: "खासगी मेसेजिंग ग्रुप्सचा वापर करून नियामक देखरेख टाळण्याचा प्रयत्न केला जातो.",
    authority: "प्राधिकरणाचा किंवा अंतर्गत माहितीचा दावा",
    authorityReason: "अधिकारी असल्याचा किंवा अंतर्गत कोट्याचा दावा करून दिशाभूल केली जाते.",
    multiplier: "अवास्तव परतावा वाढीचा दावा",
    multiplierReason: "काही दिवसांत पैसे अनेक पटींनी वाढवण्याचे आश्वासन देणे हे फसवणुकीचे लक्षण आहे.",
  },
};

export function extractSuspiciousSignals(message = "", language = "English") {
  if (!message || typeof message !== "string") return [];

  const signals = [];
  const text = message;
  const t = categoryTranslations[language] || categoryTranslations.English;

  const patterns = [
    {
      regex: /(guaranteed|guarantee|100%\s*return|200%\s*return|300%\s*return|sure\s*return|fixed\s*return|double\s*money|गारंटी|गॅरंटी|గ్యారెంటీ|உத்தரவாதம்|নিশ্চিত|हमी)/gi,
      category: t.guaranteed,
      reason: t.guaranteedReason,
    },
    {
      regex: /(urgent|immediately|act\s*now|last\s*chance|today\s*only|expires\s*in|will\s*be\s*blocked|तुरंत|तात्काळ|వెంటనే|உடனே|অবিলম্বে|तातडीने)/gi,
      category: t.urgency,
      reason: t.urgencyReason,
    },
    {
      regex: /(send\s*payment|transfer|pay\s*now|pay\s*₹?\d+|upi\s*transfer|processing\s*fee|unlock\s*withdrawal|पैसे\s*भेजें|చెల్లించండి|பணம்\s*அனுப்புங்கள்|পেমেন্ট|पैसे\s*पाठवा)/gi,
      category: t.payment,
      reason: t.paymentReason,
    },
    {
      regex: /(otp|upi\s*pin|cvv|password|banking\s*password|ओटीपी|पिन|పాస్‌వర్డ్|கடவுச்சொல்|পাসওয়ার্ড)/gi,
      category: t.credentials,
      reason: t.credentialsReason,
    },
    {
      regex: /(t\.me\/[a-zA-Z0-9_]+|telegram|whatsapp\s*group|exclusive\s*group|secret\s*tip|bit\.ly\/[a-zA-Z0-9_]+)/gi,
      category: t.channel,
      reason: t.channelReason,
    },
    {
      regex: /(sebi\s*officer|fund\s*manager|insider\s*tip|exclusive\s*pre-ipo|सेबी\s*अधिकारी)/gi,
      category: t.authority,
      reason: t.authorityReason,
    },
    {
      regex: /(₹\s*[\d,]+\s*(?:in|within|to|→)\s*₹?\s*[\d,]+)/gi,
      category: t.multiplier,
      reason: t.multiplierReason,
    },
  ];

  const seenPhrases = new Set();

  for (const { regex, category, reason } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const phrase = match[0].trim();
      const lower = phrase.toLowerCase();
      if (!seenPhrases.has(lower) && phrase.length > 2) {
        seenPhrases.add(lower);
        signals.push({
          phrase,
          category,
          reason,
        });
      }
    }
  }

  return signals.slice(0, 5); // Return top distinct signals
}
