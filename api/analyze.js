import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are ScamShield Bharat, an investor-safety assistant built for Indian retail investors.
Your mission is to help people recognize potential warning signs in suspicious financial communications.

MANDATORY SAFETY BOUNDARIES:
- NEVER recommend buying, selling, holding, or trading any stock, mutual fund, IPO, cryptocurrency, or financial instrument.
- NEVER predict stock prices, market movements, or investment returns.
- NEVER recommend specific brokers, advisors, or investment schemes.
- NEVER encourage speculative trading.
- NEVER declare with certainty that a message is definitely a scam or fraud (use objective phrasing: "Potential warning signs detected", "Multiple risk indicators were identified").
- NEVER ask for or validate OTPs, PINs, passwords, CVVs, or confidential banking credentials.
- All advice must be cautious, objective, and focused strictly on safety and independent verification.

OUTPUT FORMAT REQUIREMENTS:
Return ONLY valid JSON matching this schema:
{
  "risk_level": "LOW" | "CAUTION" | "MEDIUM" | "HIGH",
  "summary": "Clear, concise risk summary",
  "warning_signs": [
    { "title": "Specific warning sign", "explanation": "Why this is risky and what it means" }
  ],
  "safe_actions": ["Actionable verification step 1", "Actionable verification step 2", "Actionable verification step 3"],
  "uncertainty": "Statement that warning signs do not by themselves prove fraud and independent verification is necessary."
}

CRITICAL RULES:
- The JSON keys must remain exactly: "risk_level", "summary", "warning_signs", "safe_actions", "uncertainty".
- "risk_level" must be one of: LOW, CAUTION, MEDIUM, HIGH.
- Do NOT wrap in markdown backticks or commentary. Output raw JSON only.
`;

const languageMap = {
  English: "English",
  Hindi: "Hindi (हिन्दी) written strictly in Devanagari script",
  Telugu: "Telugu (తెలుగు) written strictly in Telugu script",
  Tamil: "Tamil (தமிழ்) written strictly in Tamil script",
  Bengali: "Bengali (বাংলা) written strictly in Bengali script",
  Marathi: "Marathi (मराठी) written strictly in Devanagari script",
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Health check endpoint
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      message: "ScamShield Bharat Vercel Serverless API is running.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const rawMessage = body?.message;
    const language = body?.language || "English";

    if (!rawMessage || !String(rawMessage).trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is not set in environment. Falling back to local heuristic analysis.");
      return res.status(200).json(getHeuristicAnalysis(rawMessage, language));
    }

    const ai = new GoogleGenAI({ apiKey });
    const targetLanguage = languageMap[language] || "English";

    const userPrompt = `
CRITICAL LANGUAGE INSTRUCTION:
The required output language is: ${targetLanguage}.
You MUST write all values ("summary", "title", "explanation", all items in "safe_actions", and "uncertainty") completely in ${targetLanguage}.
${language !== "English" ? `DO NOT use English words or Latin script for the values. Write every value in ${targetLanguage} script.` : ""}
Keep the JSON keys in English: risk_level, summary, warning_signs, safe_actions, uncertainty.
The risk_level value must be one of: LOW, CAUTION, MEDIUM, HIGH.

MESSAGE TO ANALYZE:
"${rawMessage}"

Evaluate this suspicious financial communication for common warning signs such as:
1. Guaranteed or unrealistic high returns (e.g. 200%, 300%, double money in days)
2. Urgency, artificial deadlines, and pressure to act right now
3. Requests for immediate money transfer, UPI payments, or wallet top-ups
4. Demands for sensitive information (OTP, PIN, passwords, CVV, bank details, Aadhaar)
5. Impersonation of regulated entities, officials, or fake investment gurus
6. Unverified Telegram/WhatsApp groups or suspicious web links
7. Demands for "processing fees" or taxes to unlock investment withdrawals

Provide:
- A realistic risk_level (LOW, CAUTION, MEDIUM, or HIGH)
- A clear summary
- 2 to 4 distinct warning signs with title and explanation
- 3 to 4 actionable, safe verification steps
- A balanced uncertainty disclaimer emphasizing that warning signs alone do not prove fraud and independent verification is required.

Return strictly raw JSON.
`;

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-flash-latest",
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
    ];

    let response = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
            config: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          });
          if (response?.text?.trim()) {
            break;
          }
        } catch (modelErr) {
          console.warn(`Model ${modelName} attempt ${attempt} failed:`, modelErr?.message || modelErr);
          if (attempt === 1) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      }
      if (response?.text?.trim()) {
        break;
      }
    }

    if (!response || !response.text) {
      console.warn("Gemini API models unavailable. Activating safety heuristic fallback.");
      return res.status(200).json(getHeuristicAnalysis(rawMessage, language));
    }

    let text = response.text.trim();
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("Gemini returned non-JSON output, using heuristic fallback:", text);
      return res.status(200).json(getHeuristicAnalysis(rawMessage, language));
    }

    result.risk_level = result.risk_level || "CAUTION";
    result.summary = result.summary || "Please verify this message carefully.";
    result.warning_signs = Array.isArray(result.warning_signs) ? result.warning_signs : [];
    result.safe_actions = Array.isArray(result.safe_actions) && result.safe_actions.length > 0
      ? result.safe_actions
      : [
          "Do not transfer money based only on an unsolicited message.",
          "Verify the organization independently through official channels.",
          "Never share OTPs, PINs, passwords, banking details, or CVVs.",
        ];
    result.uncertainty = result.uncertainty || "Warning signs do not by themselves prove fraud. Verify the information independently before taking action.";

    return res.status(200).json(result);
  } catch (error) {
    console.error("Analysis execution error:", error?.message || error);
    return res.status(200).json(getHeuristicAnalysis(req.body?.message || "", req.body?.language || "English"));
  }
}

function getHeuristicAnalysis(message, language = "English") {
  const text = String(message || "").toLowerCase();
  const warningSigns = [];

  const hasGuaranteed = /(guarantee|guaranteed|300%|200%|100%|double|triple|5x|10x|sure return|fixed return|profit|गारंटी|గ్యారెంటీ|உத்தரவாதம்|নিশ্চিত|हमी)/i.test(text);
  const hasUrgency = /(urgent|immediately|act now|hurry|today only|last chance|minutes left|expires|blocked|तुरंत|వెంటనే|உடனே|অবিলম্বে|तातडीने)/i.test(text);
  const hasPayment = /(send payment|transfer|upi|pay|fee|deposit|processing fee|unlock withdrawal|gpay|phonepe|पैसे|చెల్లించండి|பணம்|টাকা|पैसे पाठवा)/i.test(text);
  const hasCredentials = /(otp|pin|password|cvv|bank account|pan card|aadhaar|credentials|ओटीपी|पिन|பாஸ்வேர்ட்|পাসওয়ার্ড)/i.test(text);
  const hasContact = /(telegram|whatsapp|dm me|inbox|secret tip|link|http|bit\.ly|चैनल|గ్రూప్)/i.test(text);

  let riskScore = 0;
  if (hasGuaranteed) riskScore += 3;
  if (hasPayment) riskScore += 3;
  if (hasUrgency) riskScore += 2;
  if (hasCredentials) riskScore += 4;
  if (hasContact) riskScore += 2;

  let riskLevel = "LOW";
  if (riskScore >= 6) {
    riskLevel = "HIGH";
  } else if (riskScore >= 4) {
    riskLevel = "MEDIUM";
  } else if (riskScore >= 2) {
    riskLevel = "CAUTION";
  }

  const translations = {
    English: {
      highSummary: "This message contains multiple severe risk indicators commonly associated with digital financial scams.",
      medSummary: "This message contains patterns that require strict independent verification before taking action.",
      cautSummary: "This message contains potential warning signs. Exercise caution before responding or sharing funds.",
      lowSummary: "No immediate high-risk scam triggers were detected, but always verify unfamiliar financial communications.",
      guaranteedTitle: "Guaranteed or Unrealistic Returns",
      guaranteedExp: "Regulated investments never guarantee exorbitant profits without market risk. Promises of guaranteed multi-fold returns are a primary warning sign.",
      urgencyTitle: "Urgency and Artificial Pressure",
      urgencyExp: "High-pressure tactics like 'urgent', 'act today', or threat of account blockage attempt to bypass rational investor due diligence.",
      paymentTitle: "Immediate Payment / Transfer Demand",
      paymentExp: "Unsolicited demands to transfer funds via UPI or pay fees to 'unlock' money are characteristic of advance-fee schemes.",
      credTitle: "Sensitive Credential Request",
      credExp: "Legitimate financial institutions and advisors never ask for your OTP, PIN, password, CVV, or banking credentials.",
      contactTitle: "Suspicious Channel or Unverified Links",
      contactExp: "Directing users to private messaging groups (like unverified Telegram channels) or shortened links helps scammers avoid regulatory oversight.",
      actions: [
        "Do not transfer money based only on this message.",
        "Verify the entity or advisor independently through official regulatory registers (e.g. sebi.gov.in).",
        "Never share OTPs, PINs, passwords, bank account numbers, or CVVs.",
        "If you suspect fraud, report it immediately to the National Cyber Crime Helpline at 1930.",
      ],
      uncertainty: "Warning signs do not by themselves prove fraud. Verify the sender and information independently before taking action.",
    },
    Hindi: {
      highSummary: "इस संदेश में डिजिटल वित्तीय घोटालों से जुड़े कई गंभीर जोखिम संकेतक पाए गए हैं।",
      medSummary: "इस संदेश में ऐसे पैटर्न हैं जिन्हें कोई भी कदम उठाने से पहले स्वतंत्र रूप से सत्यापित करना आवश्यक है।",
      cautSummary: "इस संदेश में संभावित चेतावनी संकेत मिले हैं। किसी भी वित्तीय लेनदेन से पहले सावधानी बरतें।",
      lowSummary: "संदेश में कोई प्रत्यक्ष गंभीर जोखिम संकेतक नहीं मिला, फिर भी अनजान वित्तीय संदेशों का सत्यापन अवश्य करें।",
      guaranteedTitle: "गारंटीकृत या अवास्तविक रिटर्न का वादा",
      guaranteedExp: "वैध और विनियमित निवेश कभी भी बिना बाजार जोखिम के भारी गारंटीकृत मुनाफे का वादा नहीं करते।",
      urgencyTitle: "तात्कालिकता और जल्दबाजी का दबाव",
      urgencyExp: "'तुरंत करें' या खाते बंद होने की धमकी देकर जल्दबाजी में निर्णय लेने का दबाव बनाना एक प्रमुख चेतावनी संकेत है।",
      paymentTitle: "तत्काल भुगतान या यूपीआई ट्रांसफर की मांग",
      paymentExp: "अवांछित संदेशों के आधार पर अग्रिम शुल्क या पैसे ट्रांसफर करने की मांग अक्सर धोखाधड़ी से जुड़ी होती है।",
      credTitle: "संवेदनशील जानकारी की मांग",
      credExp: "कोई भी वैध बैंक या वित्तीय संस्थान कभी भी आपसे ओटीपी, पिन, पासवर्ड या सीवीवी नहीं मांगता।",
      contactTitle: "संदेहास्पद लिंक या निजी ग्रुप",
      contactExp: "टेलीग्राम या अनजान लिंक के जरिए निवेश का लालच देकर निगरानी से बचने की कोशिश की जाती है।",
      actions: [
        "केवल इस संदेश के आधार पर कभी भी पैसे ट्रांसफर न करें।",
        "आधिकारिक स्रोतों और सेबी (sebi.gov.in) पर संस्था या सलाहकार का स्वतंत्र सत्यापन करें।",
        "अपना ओटीपी, यूपीआई पिन, पासवर्ड या बैंक विवरण कभी किसी से साझा न करें।",
        "संदिग्ध वित्तीय धोखाधड़ी की शिकायत राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर दर्ज करें।",
      ],
      uncertainty: "चेतावनी संकेत स्वतः ही धोखाधड़ी सिद्ध नहीं करते। कोई भी कदम उठाने से पहले स्वतंत्र रूप से पुष्टि अवश्य करें।",
    },
    Telugu: {
      highSummary: "ఈ సందేశంలో డిజిటల్ ఆర్థిక మోసాలకు సంబంధించిన తీవ్రమైన హెచ్చరిక సంకేతాలు గుర్తించబడ్డాయి.",
      medSummary: "ఈ సందేశంలోని వివరాలను ఏదైనా చర్య తీసుకునే ముందు స్వతంత్రంగా ధృవీకరించుకోవాలి.",
      cautSummary: "ఈ సందేశంలో కొన్ని ప్రమాద సంకేతాలు ఉన్నాయి. ఎలాంటి లావాదేవీలు చేసే ముందైనా జాగ్రత్త వహించండి.",
      lowSummary: "ప్రత్యక్ష మోసపూరిత సంకేతాలు కనిపించలేదు, అయితే తెలియని ఆర్థిక సమాచారాన్ని ఎల్లప్పుడూ ధృవీకరించుకోండి.",
      guaranteedTitle: "గ్యారెంటీ రిటర్న్స్ వాగ్దానం",
      guaranteedExp: "రిజిస్టర్డ్ పెట్టుబడులు ఎప్పుడూ ఎలాంటి రిస్క్ లేకుండా భారీ గ్యారెంటీ లాభాలను వాగ్దానం చేయవు.",
      urgencyTitle: "అత్యవసర ఒత్తిడి",
      urgencyExp: "'వెంటనే చెల్లించండి' లేదా ఖాతా నిలిపివేయబడుతుంది అని ఒత్తిడి చేయడం ఒక సాధారణ మోసపూరిత పద్ధతి.",
      paymentTitle: "తక్షణ చెల్లింపు అభ్యర్థన",
      paymentExp: "అపరిచిత సందేశాల ఆధారంగా UPI లేదా బ్యాంకు ద్వారా ముందస్తు రుసుములు పంపమని కోరడం ప్రమాదకరం.",
      credTitle: "సున్నితమైన వివరాల అభ్యర్థన",
      credExp: "బ్యాంకులు లేదా రిజిస్టర్డ్ సంస్థలు ఎప్పుడూ OTP, PIN లేదా పాస్‌వర్డ్‌లను అడగవు.",
      contactTitle: "అనుమానాస్పద లింకులు లేదా ప్రైవేట్ గ్రూపులు",
      contactExp: "టెలిగ్రామ్ లేదా తెలియని లింకుల ద్వారా రహస్య పెట్టుబడి చిట్కాలు ఇవ్వడం నిబంధనలను దాటవేసే ప్రయత్నం.",
      actions: [
        "ఈ సందేశం ఆధారంగా ఎవరికీ డబ్బు బదిలీ చేయవద్దు.",
        "సంస్థ లేదా సలహాదారుని అధికారిక వెబ్‌సైట్ లేదా SEBI ద్వారా స్వతంత్రంగా తనిఖీ చేయండి.",
        "OTP, UPI PIN, పాస్‌వర్డ్‌లు ఎవరితోనూ పంచుకోవద్దు.",
        "అనుమానాస్పద మోసాల గురించి నేషనల్ సైబర్ క్రైమ్ హెల్ప్‌లైన్ 1930 కు ఫిర్యాదు చేయండి.",
      ],
      uncertainty: "హెచ్చరిక సంకేతాలు నేరుగా మోసాన్ని రుజువు చేయవు. చర్య తీసుకునే ముందు స్వతంత్రంగా ధృవీకరించుకోండి.",
    },
    Tamil: {
      highSummary: "இந்தச் செய்தியில் நிதி மோசடிகளுடன் தொடர்புடைய பல கடுமையான எச்சரிக்கை அறிகுறிகள் உள்ளன.",
      medSummary: "எந்தவொரு நடவடிக்கையும் எடுப்பதற்கு முன் சுயாதீனமாக சரிபார்க்க வேண்டிய வடிவங்கள் இதில் உள்ளன.",
      cautSummary: "இந்தச் செய்தியில் எச்சரிக்கை அறிகுறிகள் உள்ளன. பணப் பரிவர்த்தனைக்கு முன் எச்சரிக்கையாக இருக்கவும்.",
      lowSummary: "உடனடி ஆபத்துக்கான அறிகுறிகள் இல்லை, எனினும் அறியப்படாத நிதிச் செய்திகளை எப்போதும் சரிபார்க்கவும்.",
      guaranteedTitle: "உறுதிசெய்யப்பட்ட அபரிமிதமான லாப வாக்குறுதி",
      guaranteedExp: "சந்தைப் பாதுகாப்பு விதிமுறைகளின்படி எந்தவொரு முறையான முதலீடும் 100% உத்தரவாத லாபத்தை வழங்க முடியாது.",
      urgencyTitle: "அவசர அழுத்தம்",
      urgencyExp: "'உடனே செயல்படுங்கள்' அல்லது கணக்கு முடக்கப்படும் என அவசரப்படுத்துவது மோசடி வடிவமாகும்.",
      paymentTitle: "உடனடி பணப்பரிவர்த்தனை கோரிக்கை",
      paymentExp: "தெரியாத செய்திகளை நம்பி UPI அல்லது வங்கி மூலம் பணம் அனுப்பக் கூடாது.",
      credTitle: "ரகசிய விவரங்கள் கோருதல்",
      credExp: "வங்கிகளோ அல்லது முதலீட்டு நிறுவனங்களோ ஒருபோதும் OTP, PIN அல்லது கடவுச்சொல்லைக் கேட்காது.",
      contactTitle: "சந்தேகத்திற்கிடமான இணைப்புகள்",
      contactExp: "சரிபார்க்கப்படாத டெலிகிராம் குழுக்கள் அல்லது லிங்க்குகள் மூலம் முதலீட்டு ஆலோசனைகள் பெறுவது ஆபத்தானது.",
      actions: [
        "இந்தச் செய்தியின் அடிப்படையில் மட்டுமே பணம் அனுப்ப வேண்டாம்.",
        "அதிகாரப்பூர்வ SEBI தளத்தில் நிறுவனத்தை சுயாதீனமாக சரிபார்க்கவும்.",
        "OTP, PIN அல்லது கடவுச்சொற்களை யாரிடமும் பகிர வேண்டாம்.",
        "சைபர் கிரைம் உதவி எண் 1930 இல் சந்தேகத்திற்கிடமான மோசடிகளைப் புகாரளிக்கவும்.",
      ],
      uncertainty: "எச்சரிக்கை அறிகுறிகள் மட்டுமே மோசடியை நிரூபித்துவிடாது. செயல்படுவதற்கு முன் சுயாதீனமாக சரிபார்க்கவும்.",
    },
    Bengali: {
      highSummary: "এই বার্তায় ডিজিটাল আর্থিক জালিয়াতির একাধিক গুরুতর ঝুঁকির লক্ষণ শনাক্ত করা হয়েছে।",
      medSummary: "কোনো পদক্ষেপ নেওয়ার আগে এই বার্তার বিষয়বস্তু স্বাধীনভাবে যাচাই করা আবশ্যক।",
      cautSummary: "এই বার্তায় সম্ভাব্য সতর্কতার লক্ষণ রয়েছে। অর্থ লেনদেনের আগে সতর্ক থাকুন।",
      lowSummary: "সরাসরি ঝুঁকির লক্ষণ পাওয়া যায়নি, তবে অপরিচিত আর্থিক যোগাযোগ সবসময় যাচাই করুন।",
      guaranteedTitle: "নিশ্চিত বা অস্বাভাবিক লাভের প্রতিশ্রুতি",
      guaranteedExp: "বৈধ ও নিয়ন্ত্রিত বিনিয়োগ বাজার কখনো ঝুঁকিমুক্ত নিশ্চিত আকাশচুম্বী মুনাফার প্রতিশ্রুতি দেয় না।",
      urgencyTitle: "জরুরি চাপ সৃষ্টি",
      urgencyExp: "'অবিলম্বে করুন' বা অ্যাকাউন্ট বন্ধের ভয় দেখিয়ে তাড়াহুড়োয় সিদ্ধান্ত নিতে বাধ্য করা হয়।",
      paymentTitle: "অবিলম্বে টাকা পাঠানোর দাবি",
      paymentExp: "অপরিচিত বার্তার ভিত্তিতে কোনো ফি বা টাকা ট্রান্সফার করা ঝুঁকিপূর্ণ।",
      credTitle: "গোপনীয় তথ্যের দাবি",
      credExp: "কোনো ব্যাংক বা আর্থিক প্রতিষ্ঠান কখনোই OTP, PIN বা পাসওয়ার্ড চায় না।",
      contactTitle: "সন্দেহজনক লিংক বা গোপন চ্যানেল",
      contactExp: "টেলিগ্রাম গ্রুপ বা সন্দেহজনক লিংকের মাধ্যমে বিনিয়োগের ফাঁদ পাতা হয়।",
      actions: [
        "কেবল এই বার্তার ওপর ভিত্তি করে টাকা পাঠাবেন না।",
        "নিয়ন্ত্রক সংস্থা বা অফিসিয়াল মাধ্যমে প্রেরককে যাচাই করুন।",
        "কখনোই OTP, PIN, পাসওয়ার্ড বা ব্যাংক বিবরণ কারো সাথে শেয়ার করবেন না।",
        "সন্দেহ হলে জাতীয় সাইবার ক্রাইম হেল্পলাইন ১৯৩০ নম্বরে রিপোর্ট করুন।",
      ],
      uncertainty: "সতর্কতার লক্ষণ মানেই নিশ্চিত জালিয়াতি নয়। পদক্ষেপ নেওয়ার আগে স্বাধীনভাবে সত্যতা যাচাই করুন।",
    },
    Marathi: {
      highSummary: "या संदेशामध्ये डिजिटल आर्थिक फसवणुकीशी संबंधित अनेक गंभीर धोक्याचे संकेत आढळले आहेत.",
      medSummary: "कोणतीही कृती करण्यापूर्वी या संदेशाची स्वतंत्रपणे पडताळणी करणे अत्यंत आवश्यक आहे.",
      cautSummary: "या संदेशात संभाव्य चेतावणीचे संकेत आहेत. कोणताही व्यवहार करण्यापूर्वी सावधगिरी बाळगा.",
      lowSummary: "कोणतेही थेट धोक्याचे संकेत आढळले नाहीत, तरीही अनोळखी आर्थिक संवादांची नेहमी पडताळणी करा.",
      guaranteedTitle: "हमीभावाचा किंवा अवास्तव परताव्याचा दावा",
      guaranteedExp: "अधिकृत आणि नियंत्रित गुंतवणूक कधीही बाजारातील जोखीम नसताना अवास्तव हमी परतावा देत नाही.",
      urgencyTitle: "तातडी आणि घाईचा दबाव",
      urgencyExp: "'लगेच पैसे पाठवा' किंवा खाते बंद होण्याची भीती दाखवून विचार न करता निर्णय घेण्यास भाग पाडणे हा धोका आहे.",
      paymentTitle: "तात्काळ पैसे ट्रान्सफर करण्याची मागणी",
      paymentExp: "अनोळखी मेसेजच्या आधारे यूपीआय किंवा बँक खात्यात शुल्क पाठवण्याची मागणी फसवणुकीचे लक्षण असू शकते.",
      credTitle: "गोपनीय माहितीची मागणी",
      credExp: "कोणतीही अधिकृत बँक किंवा सल्लागार कधीही तुमचा OTP, PIN किंवा पासवर्ड मागत नाही.",
      contactTitle: "संशयास्पद लिंक्स किंवा खासगी ग्रुप्स",
      contactExp: "अनधिकृत टेलिग्राम ग्रुप्स किंवा लिंक्सद्वारे गुप्त टिप्स देणे हे नियमांचे उल्लंघन आहे.",
      actions: [
        "फक्त या संदेशाच्या आधारे कधीही पैसे ट्रान्सफर करू नका.",
        "अधिकृत नियामक संस्था किंवा सेबीच्या नोंदणीवरून स्वतंत्रपणे पडताळणी करा.",
        "तुमचा OTP, PIN, पासवर्ड किंवा बँक तपशील कधीही कोणालाही सांगू नका.",
        "संशयास्पद फसवणुकीची माहिती राष्ट्रीय सायबर क्राईम हेल्पलाइन १९३० वर नोंदवा.",
      ],
      uncertainty: "चेतावणीचे संकेत स्वतःहून फसवणूक सिद्ध करत नाहीत. कोणतीही कृती करण्यापूर्वी माहितीची स्वतंत्रपणे खात्री करा.",
    },
  };

  const loc = translations[language] || translations.English;

  if (hasGuaranteed) {
    warningSigns.push({ title: loc.guaranteedTitle, explanation: loc.guaranteedExp });
  }
  if (hasUrgency) {
    warningSigns.push({ title: loc.urgencyTitle, explanation: loc.urgencyExp });
  }
  if (hasPayment) {
    warningSigns.push({ title: loc.paymentTitle, explanation: loc.paymentExp });
  }
  if (hasCredentials) {
    warningSigns.push({ title: loc.credTitle, explanation: loc.credExp });
  }
  if (hasContact) {
    warningSigns.push({ title: loc.contactTitle, explanation: loc.contactExp });
  }

  if (warningSigns.length === 0) {
    warningSigns.push({
      title: language === "Hindi" ? "अपरिचित वित्तीय संवाद" : "Unverified Financial Outreach",
      explanation:
        language === "Hindi"
          ? "अनोळखी स्त्रोताकडून आलेला संदेश नेहमी अधिकृत माध्यमांद्वारे पडताळून पहा."
          : "Always independently verify the sender and legitimacy of unsolicited investment information before taking action.",
    });
  }

  let summary = loc.cautSummary;
  if (riskLevel === "HIGH") summary = loc.highSummary;
  else if (riskLevel === "MEDIUM") summary = loc.medSummary;
  else if (riskLevel === "LOW") summary = loc.lowSummary;

  return {
    risk_level: riskLevel,
    summary,
    warning_signs: warningSigns,
    safe_actions: loc.actions,
    uncertainty: loc.uncertainty,
  };
}
