import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X, MessageSquare, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// Add speech recognition types for TS
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const VoiceAssistant: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusText, setStatusText] = useState('Click microphone to speak');
  const [lastSpeech, setLastSpeech] = useState<string>('');
  
  // Conversational auto-booking states
  const [bookingCrop, setBookingCrop] = useState<string>('paddy');
  const [bookingState, setBookingState] = useState<'idle' | 'awaiting_weight' | 'awaiting_time'>('idle');
  const [bookingWeight, setBookingWeight] = useState<number>(20);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(window.speechSynthesis || null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Localization dict for voice prompts & feedback
  const voiceDict: Record<string, Record<string, string>> = {
    en: {
      greet: 'Hello! I am your KisanMitra voice assistant. How can I help you today? You can say commands like: Go to Weather, Book Slot, Check Queue, or Read Page.',
      listening: 'Listening to your voice...',
      speaking: 'Speaking...',
      idle: 'Click microphone to speak',
      unknown: 'Sorry, I did not recognize that command. Please try again.',
      navigating: 'Navigating to',
      reading: 'Reading page details aloud now.',
      stopped: 'Voice feedback stopped.',
      logout: 'Logging out from your session.',
      help_title: 'Voice Commands Guide',
      help_desc: 'Talk to navigate or control the portal hands-free:',
      cmd_home: '"Go Home" / "Dashboard"',
      cmd_book: '"Book Slot" / "Register Slot"',
      cmd_queue: '"Check Queue" / "My Token"',
      cmd_weather: '"Weather Forecast"',
      cmd_advisor: '"AI Advisor" / "Crop Advisor"',
      cmd_read: '"Read Page" / "Speak Content"',
      cmd_stop: '"Stop" / "Quiet"',
      cmd_logout: '"Log out" / "Sign out"',
      assistant_name: 'KisanMitra AI Voice'
    },
    te: {
      greet: 'నమస్కారం! నేను మీ కిసాన్-మిత్ర వాయిస్ అసిస్టెంట్. నేను మీకు ఎలా సహాయపడగలను? వాతావరణం, స్లాట్ బుకింగ్, క్యూ స్థితి, లేదా పేజీ చదవండి అని చెప్పండి.',
      listening: 'మీ మాటలను వింటున్నాను...',
      speaking: 'మాట్లాడుతున్నాను...',
      idle: 'మాట్లాడటానికి మైక్రోఫోన్ నొక్కండి',
      unknown: 'క్షమించండి, ఆ आदेशం నాకు అర్థం కాలేదు. మరొకసారి ప్రయత్నించండి.',
      navigating: 'దీనికి వెళ్తున్నాము:',
      reading: 'పేజీ వివరాలను చదువుతున్నాను.',
      stopped: 'ఆపివేయబడింది.',
      logout: 'లాగ్ అవుట్ చేస్తున్నాను.',
      help_title: 'వాయిస్ ఆదేశాల గైడ్',
      help_desc: 'చేతులు ఉపయోగించకుండా పోర్టల్‌ను నియంత్రించండి:',
      cmd_home: '"హోమ్" / "డాష్‌బోర్డ్"',
      cmd_book: '"స్లాట్ బుక్" / "కొత్త స్లాట్"',
      cmd_queue: '"క్యూ స్థితి" / "నా టోకెన్"',
      cmd_weather: '"వాతావరణం"',
      cmd_advisor: '"పంట సలహాదారు"',
      cmd_read: '"చదవండి" / "పేజీ సమాచారం"',
      cmd_stop: '"ఆపు" / "నిశ్శబ్దం"',
      cmd_logout: '"లాగ్ అవుట్" / "వెనక్కి వెళ్ళు"',
      assistant_name: 'కిసాన్-మిత్ర వాయిస్'
    },
    hi: {
      greet: 'नमस्ते! मैं आपका किसान-मित्र वॉयस असिस्टेंट हूँ। आज मैं आपकी क्या मदद कर सकता हूँ? आप कह सकते हैं: मौसम, स्लॉट बुक करें, कतार की स्थिति, या पेज पढ़ें।',
      listening: 'आपकी आवाज़ सुन रहा हूँ...',
      speaking: 'बोल रहा हूँ...',
      idle: 'बोलने के लिए माइक दबाएं',
      unknown: 'क्षमा करें, मुझे वह आदेश समझ नहीं आया। कृपया पुनः प्रयास करें।',
      navigating: 'इस पर जा रहे हैं:',
      reading: 'पेज का विवरण जोर से पढ़ रहा हूँ।',
      stopped: 'आवाज बंद कर दी गई है।',
      logout: 'लॉग आउट कर रहा हूँ।',
      help_title: 'वॉयस कमांड गाइड',
      help_desc: 'बिना छुए पोर्टल को नियंत्रित करने के लिए बोलें:',
      cmd_home: '"मुख्य पृष्ठ" / "होम"',
      cmd_book: '"स्लॉट बुक करें" / "बुकिंग"',
      cmd_queue: '"कतार स्थिति" / "मेरा टोकन"',
      cmd_weather: '"मौसम पूर्वानुमान"',
      cmd_advisor: '"फसल सलाहकार" / "सलाहकार"',
      cmd_read: '"पेज पढ़ें" / "विवरण पढ़ें"',
      cmd_stop: '"रुकें" / "चुप"',
      cmd_logout: '"लॉग आउट" / "बाहर निकलें"',
      assistant_name: 'किसान-मित्र वॉयस'
    }
  };

  const getLangText = (key: string) => {
    return voiceDict[language]?.[key] || voiceDict['en']?.[key] || key;
  };

  // Latin phonetic translations if device lacks native voices
  const transliterations: Record<string, Record<string, string>> = {
    te: {
      greet: 'Namaskaram! Nenu mee Kisan-Mitra voice assistant. Nenu meeku yela sahaya pada galanu? Vaathaavaranam, slot booking, queue sthithi, ledha page chadavandi ani cheppandi.',
      listening: 'Mee maatalanu vintunnaanu...',
      speaking: 'Maatlaaduthunnaanu...',
      idle: 'Maatlaadadaaniki microphone nokkandi.',
      unknown: 'Kshaminchandi, aa aadesham naaku ardham kaaledhu. Marokasaari prayathninchandi.',
      navigating: 'Deeniki velthunnaamu:',
      reading: 'Page vivaraalanu chaduvuthunnaanu.',
      stopped: 'Aapiveyabadindhi.',
      logout: 'Log out chesthunnaanu.',
      stopped_speak: 'Aapiveyabadindhi.'
    },
    hi: {
      greet: 'Namaste! Main aapka Kisan-Mitra voice assistant hoon. Aaj main aapki kya madad kar sakta hoon? Aap keh sakte hain: mausam, slot book karein, queue status, ya page padhein.',
      listening: 'Aapki aawaz sun raha hoon...',
      speaking: 'Bol raha hoon...',
      idle: 'Bolne ke liye mic dabayein.',
      unknown: 'Kshama karein, mujhe woh aadesh samajh nahi aaya. Kripya firse prayas karein.',
      navigating: 'Is par ja rahe hain:',
      reading: 'Page ka vivaran zor se padh raha hoon.',
      stopped: 'Aawaz band kar di gayi hai.',
      logout: 'Log out kar raha hoon.',
      stopped_speak: 'Aawaz band kar di gayi hai.'
    }
  };

  const getPhoneticText = (rawText: string, lang: string): string => {
    if (lang === 'te') {
      const weightMatch = rawText.match(/\d+/);
      const weight = weightMatch ? weightMatch[0] : '';
      if (rawText.includes('సరే') && rawText.includes('సమయం')) {
        return `Okay, ${weight} quintals. Meeru ఏ samayam ishtapadathaaru? Udhayam, madhyaahnam, ledha saayantram cheppandi.`;
      }
      if (rawText.includes('క్షమించండి') && rawText.includes('సంఖ్య')) {
        return 'Kshaminchandi, naaku sankya ardham kaaledhu. Dhayachesi yaabhai ledha iravai ani sankya cheppandi.';
      }
      if (rawText.includes('సమయం చెప్పండి')) {
        return 'Dhayachesi samayam cheppandi: udhayam, madhyaahnam, ledha saayantram.';
      }
      if (rawText.includes('రేపు') && rawText.includes('బుక్')) {
        const timeStr = rawText.includes('ఉదయం') ? 'udhayam' : rawText.includes('మధ్యాహ్నం') ? 'madhyaahnam' : 'saayantram';
        return `Okay. Repu ${timeStr} poota ${weight} quintalla panta book chesthunnaamu. Dhayachesi vechi undandi.`;
      }
      if (rawText.includes('విజయవంతమైంది')) {
        return 'Booking vijayavanthamainadhi. Mee digital token mariyu QR code siddhanga unnaayi.';
      }
      if (rawText.includes('ఆటో బుకింగ్')) {
        return `Okay, auto booking cheddham. Modhata, mee vaddha enni quintalla panta undhi? Dhayachesi sankya cheppandi.`;
      }
    }
    if (lang === 'hi') {
      const weightMatch = rawText.match(/\d+/);
      const weight = weightMatch ? weightMatch[0] : '';
      if (rawText.includes('ठीक है') && rawText.includes('समय')) {
        return `Theek hai, ${weight} quintal. Ab, aap kis samay aana pasand karenge? Subah, dopahar, ya shaam kahein.`;
      }
      if (rawText.includes('क्षमा करें') && rawText.includes('संख्या')) {
        return 'Kshama karein, mujhe sankhya samajh nahi aayi. Kripya firse sankhya bolein jaise pachas ya bees.';
      }
      if (rawText.includes('समय कहें')) {
        return 'Kripya samay kahein: subah, dopahar, ya shaam.';
      }
      if (rawText.includes('कल') && rawText.includes('बुकिंग')) {
        const timeStr = rawText.includes('सुबह') ? 'subah' : rawText.includes('दोपहर') ? 'dopahar' : 'shaam';
        return `Theek hai. Kal ${timeStr} ko ${weight} quintal fasal ki booking kar rahe hain. Kripya prateeksha karein.`;
      }
      if (rawText.includes('सफल रही')) {
        return 'Booking safal rahi. Aapka digital token aur QR code taiyar hai.';
      }
      if (rawText.includes('शुरू करते हैं')) {
        return `Zaroor, aapki slot booking shuru karte hain. Pehle, aapke paas kitne quintal fasal hai? Kripya sankhya bolein.`;
      }
    }
    return rawText;
  };

  // Setup Web Speech Synthesis (Text-to-Speech)
  const speakText = (text: string, onSpeechEnd?: () => void) => {
    if (!synthRef.current) return;
    
    // Stop ongoing speech
    synthRef.current.cancel();
    
    // Find target native voice
    const voices = synthRef.current.getVoices();
    let matchingVoice = null;
    if (language === 'te') {
      matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith('te') || v.name.toLowerCase().includes('telugu'));
    } else if (language === 'hi') {
      matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    }

    let textToSpeak = text;
    let finalLang = 'en-IN';

    if (matchingVoice) {
      finalLang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    } else if (language === 'te' || language === 'hi') {
      // Missing local voice: map to phonetic English transliteration
      const transKey = Object.keys(voiceDict[language]).find(k => voiceDict[language][k] === text);
      if (transKey && transliterations[language]?.[transKey]) {
        textToSpeak = transliterations[language][transKey];
      } else {
        textToSpeak = getPhoneticText(text, language);
      }
      // Use general English voice to pronounce Latin phonetics
      matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      finalLang = 'en-IN';
    } else {
      matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      finalLang = 'en-IN';
    }

    utteranceRef.current = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current.lang = finalLang;
    if (matchingVoice) {
      utteranceRef.current.voice = matchingVoice;
    }

    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => {
      setIsSpeaking(false);
      if (onSpeechEnd) onSpeechEnd();
    };
    utteranceRef.current.onerror = () => {
      setIsSpeaking(false);
      if (onSpeechEnd) onSpeechEnd();
    };

    synthRef.current.speak(utteranceRef.current);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Setup Speech Recognition (Speech-to-Text)
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      
      if (language === 'te') rec.lang = 'te-IN';
      else if (language === 'hi') rec.lang = 'hi-IN';
      else rec.lang = 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setStatusText(getLangText('listening'));
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        setLastSpeech(transcript);
        processCommandRef.current(transcript);
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
        if (err.error === 'not-allowed') {
          setStatusText('Microphone access denied. Please allow mic access.');
          speakText('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (err.error === 'no-speech') {
          setStatusText('No speech detected. Click mic to try again.');
        } else {
          setStatusText(`Speech error: ${err.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopSpeaking();
    };
  }, [language]);

  // Read current page details aloud
  const readPageAloud = () => {
    // Extract main text content of the page
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    // Filter headings and paragraphs
    const textElements = mainEl.querySelectorAll('h1, h2, h3, h4, p, li');
    let pageText = '';
    
    // Grab first 8 elements so we don't speak indefinitely
    let count = 0;
    textElements.forEach((el) => {
      if (count < 8 && el.textContent) {
        pageText += el.textContent.trim() + '. ';
        count++;
      }
    });

    if (pageText) {
      speakText(`${getLangText('reading')} ${pageText}`);
    }
  };

  const parseNumberFromSpeech = (text: string): number | null => {
    const match = text.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    
    const wordMap: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
      twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
      'పది': 10, 'ఇరవై': 20, 'ముప్పై': 30, 'నలభై': 40, 'యాభై': 50, 'వంద': 100,
      'दस': 10, 'बीस': 20, 'तीस': 30, 'चालीस': 40, 'पचास': 50, 'सौ': 100
    };
    
    for (const word in wordMap) {
      if (text.includes(word)) return wordMap[word];
    }
    return null;
  };

  // Voice navigation commands mapping
  const processCommand = (command: string) => {
    const cleanCmd = command.toLowerCase().trim();
    console.info(`[KisanMitra Voice] Process Command: "${cleanCmd}"`);

    // Conversational booking flow intercepts
    if (bookingState === 'awaiting_weight') {
      const weight = parseNumberFromSpeech(cleanCmd);
      if (weight) {
        setBookingWeight(weight);
        setBookingState('awaiting_time');
        
        const nextPrompt = language === 'te'
          ? `సరే, ${weight} క్వింటాళ్లు. మీరు ఏ సమయం ఇష్టపడతారు? ఉదయం, మధ్యాహ్నం, లేదా సాయంత్రం చెప్పండి.`
          : language === 'hi'
          ? `ठीक है, ${weight} क्विंटल। अब, आप किस समय आना पसंद करेंगे? सुबह, दोपहर, या शाम कहें।`
          : `Got it, ${weight} quintals. Now, what time of day do you prefer? Say: morning, afternoon, or evening.`;
        
        setStatusText(language === 'te' ? 'సమయం చెప్పండి (ఉదయం/మధ్యాహ్నం)...' : language === 'hi' ? 'समय कहें (सुबह/दोपहर)...' : 'Listening for preferred time...');
        speakText(nextPrompt, () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch(e) {}
          }
        });
      } else {
        const errorPrompt = language === 'te'
          ? 'క్షమించండి, నాకు సంఖ్య అర్థం కాలేదు. దయచేసి యాభై లేదా ఇరవై అని సంఖ్య చెప్పండి.'
          : language === 'hi'
          ? 'क्षमा करें, मुझे संख्या समझ नहीं आई। कृपया फिर से संख्या बोलें जैसे पचास या बीस।'
          : "Sorry, I didn't hear the number of quintals clearly. Please tell me a number again, like fifty.";
        
        speakText(errorPrompt, () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch(e) {}
          }
        });
      }
      return;
    }

    if (bookingState === 'awaiting_time') {
      let timePref = '';
      if (cleanCmd.includes('morning') || cleanCmd.includes('udayam') || cleanCmd.includes('ఉదయం') || cleanCmd.includes('subah') || cleanCmd.includes('सुबह') || cleanCmd.includes('morning') || cleanCmd.includes('morn')) {
        timePref = 'morning';
      } else if (cleanCmd.includes('afternoon') || cleanCmd.includes('madhyahnam') || cleanCmd.includes('మధ్యాహ్నం') || cleanCmd.includes('dopahar') || cleanCmd.includes('दोपहर') || cleanCmd.includes('noon')) {
        timePref = 'afternoon';
      } else if (cleanCmd.includes('evening') || cleanCmd.includes('sayantram') || cleanCmd.includes('సాయంత్రం') || cleanCmd.includes('shaam') || cleanCmd.includes('शाम') || cleanCmd.includes('eve')) {
        timePref = 'evening';
      }

      if (timePref) {
        setBookingState('idle');
        
        const confirmPrompt = language === 'te'
          ? `సరే. రేపు ${timePref === 'morning' ? 'ఉదయం' : timePref === 'afternoon' ? 'మధ్యాహ్నం' : 'సాయంత్రం'} పూట ${bookingWeight} క్వింటాళ్ల పంటను బుక్ చేస్తున్నాము. దయచేసి వేచి ఉండండి.`
          : language === 'hi'
          ? `ठीक है। कल ${timePref === 'morning' ? 'सुबह' : timePref === 'afternoon' ? 'दोपहर' : 'शाम'} को ${bookingWeight} क्विंटल फसल की बुकिंग कर रहे हैं। कृपया प्रतीक्षा करें।`
          : `Understood. Booking slot for tomorrow ${timePref} with ${bookingWeight} quintals. Processing now.`;

        speakText(confirmPrompt);

        const executeBookingWithParams = () => {
          let retries = 0;
          const interval = setInterval(() => {
            if ((window as any).triggerVoiceAutoBooking) {
              clearInterval(interval);
              (window as any).triggerVoiceAutoBooking(bookingCrop, bookingWeight, timePref);
              
              const successPrompt = language === 'te'
                ? `బుకింగ్ విజయవంతమైంది. మీ డిజిటల్ టోకెన్ మరియు క్యూ ఆర్ కోడ్ సిద్ధంగా ఉన్నాయి.`
                : language === 'hi'
                ? `बुकिंग सफल रही। आपका डिजिटल टोकन और क्यू आर कोड तैयार है।`
                : `Booking completed successfully. Your digital token and QR code are ready.`;
              speakText(successPrompt);
            } else {
              retries++;
              if (retries > 10) {
                clearInterval(interval);
                speakText("Failed to complete slot booking automatically.");
              }
            }
          }, 300);
        };

        if (location.pathname !== '/farmer/book-slot') {
          navigate('/farmer/book-slot');
          executeBookingWithParams();
        } else {
          executeBookingWithParams();
        }
      } else {
        const errorPrompt = language === 'te'
          ? 'దయచేసి సమయం చెప్పండి: ఉదయం, మధ్యాహ్నం, లేదా సాయంత్రం.'
          : language === 'hi'
          ? 'कृपया समय कहें: सुबह, दोपहर, या शाम।'
          : "Please say morning, afternoon, or evening to set your time slot.";
        
        speakText(errorPrompt, () => {
          if (recognitionRef.current) {
            try { recognitionRef.current.start(); } catch(e) {}
          }
        });
      }
      return;
    }

    // 1. Landing Page / Signin / Signup navigation
    const isToLogin = 
      cleanCmd.includes('login') || 
      cleanCmd.includes('signin') || 
      cleanCmd.includes('లాగిన్') || 
      cleanCmd.includes('लॉगिन') ||
      cleanCmd.includes('sign in');

    const isToRegister = 
      cleanCmd.includes('register') || 
      cleanCmd.includes('signup') || 
      cleanCmd.includes('రిజిస్టర్') || 
      cleanCmd.includes('पंजीकरण') ||
      cleanCmd.includes('sign up');

    const isToHelpline = 
      cleanCmd.includes('helpline') || 
      cleanCmd.includes('support') || 
      cleanCmd.includes('సహాయం') || 
      cleanCmd.includes('हेल्पलाइन') ||
      cleanCmd.includes('sahayata');

    // 2. Farmer Dashboard / Home
    const isHome = 
      cleanCmd.includes('home') || 
      cleanCmd.includes('dashboard') || 
      cleanCmd.includes('హోమ్') || 
      cleanCmd.includes('డాష్') || 
      cleanCmd.includes('illu') ||
      cleanCmd.includes('मुख्य') || 
      cleanCmd.includes('होम') ||
      cleanCmd.includes('ghar');

    // 3. Book Slot
    const isBook = 
      cleanCmd.includes('book') || 
      cleanCmd.includes('slot') || 
      cleanCmd.includes('బుక్') || 
      cleanCmd.includes('రిజిస్టర్') || 
      cleanCmd.includes('స్లాట్') || 
      cleanCmd.includes('బుకింగ్') ||
      cleanCmd.includes('स्लॉट') || 
      cleanCmd.includes('बुक') ||
      cleanCmd.includes('booking');

    // 4. Queue / Token Status
    const isQueue = 
      cleanCmd.includes('queue') || 
      cleanCmd.includes('token') || 
      cleanCmd.includes('status') ||
      cleanCmd.includes('कतार') || 
      cleanCmd.includes('టోకెన్') || 
      cleanCmd.includes('క్యూ') || 
      cleanCmd.includes('స్థితి') ||
      cleanCmd.includes('टोकन') ||
      cleanCmd.includes('नंबर');

    // 5. Weather Forecast
    const isWeather = 
      cleanCmd.includes('weather') || 
      cleanCmd.includes('rain') || 
      cleanCmd.includes('forecast') ||
      cleanCmd.includes('వాతావరణం') || 
      cleanCmd.includes('వాన') || 
      cleanCmd.includes('వర్షం') ||
      cleanCmd.includes('मौसम') || 
      cleanCmd.includes('बारिश') ||
      cleanCmd.includes('पानी');

    // 6. AI Advisor
    const isAdvisor = 
      cleanCmd.includes('advisor') || 
      cleanCmd.includes('price') ||
      cleanCmd.includes('పంట సలహాదారు') || 
      cleanCmd.includes('సలహా') || 
      cleanCmd.includes('ధర') ||
      cleanCmd.includes('फसल सलाहकार') || 
      cleanCmd.includes('सलाहकार') ||
      cleanCmd.includes('दाम');

    // 7. Guidelines / checklist
    const isGuidelines = 
      cleanCmd.includes('checklist') || 
      cleanCmd.includes('guideline') || 
      cleanCmd.includes('document') ||
      cleanCmd.includes('మార్గాలు') || 
      cleanCmd.includes('చెక్లిస్ట్') || 
      cleanCmd.includes('కాగితాలు') ||
      cleanCmd.includes('मार्गदर्शिका') || 
      cleanCmd.includes('दस्तावेज') ||
      cleanCmd.includes('कागजात');

    // 8. Payout / Payment Tracking
    const isPayment = 
      cleanCmd.includes('payment') || 
      cleanCmd.includes('payout') || 
      cleanCmd.includes('money') || 
      cleanCmd.includes('డబ్బులు') || 
      cleanCmd.includes('చెల్లింపు') || 
      cleanCmd.includes('भुगतान') ||
      cleanCmd.includes('पैसा');

    // 9. Procurement Tracking
    const isProcurement = 
      cleanCmd.includes('tracking') || 
      cleanCmd.includes('history') || 
      cleanCmd.includes('ట్రాకింగ్') || 
      cleanCmd.includes('చరిత్ర') || 
      cleanCmd.includes('ट्रैकिंग') ||
      cleanCmd.includes('इतिहास');

    // 10. Profile
    const isProfile = 
      cleanCmd.includes('profile') || 
      cleanCmd.includes('account') || 
      cleanCmd.includes('ప్రొఫైల్') || 
      cleanCmd.includes('ఖాతా') || 
      cleanCmd.includes('प्रोफ़ाइल') ||
      cleanCmd.includes('खाता');

    // 11. Read page
    const isRead = 
      cleanCmd.includes('read page') || 
      cleanCmd.includes('read') || 
      cleanCmd.includes('speak') || 
      cleanCmd.includes('చదవండి') || 
      cleanCmd.includes('వివరించండి') || 
      cleanCmd.includes('పేజీ') ||
      cleanCmd.includes('पेज पढ़ें') || 
      cleanCmd.includes('पढ़ें') ||
      cleanCmd.includes('सुनाओ');

    // 12. Stop / Quiet
    const isStop = 
      cleanCmd.includes('stop') || 
      cleanCmd.includes('quiet') || 
      cleanCmd.includes('ఆపు') || 
      cleanCmd.includes('చాలు') || 
      cleanCmd.includes('రాలేదు') ||
      cleanCmd.includes('रुकें') || 
      cleanCmd.includes('बंद') ||
      cleanCmd.includes('चुप');

    // 13. Logout
    const isLogout = 
      cleanCmd.includes('logout') || 
      cleanCmd.includes('sign out') || 
      cleanCmd.includes('లాగ్ అవుట్') || 
      cleanCmd.includes('వెనక్కి') || 
      cleanCmd.includes('लॉग आउट') || 
      cleanCmd.includes('बाहर');

    // ── Login page specific automation triggers ──
    if (location.pathname === '/signin') {
      // 1. Farmer Ravi credentials fill
      if (cleanCmd.includes('ravi') || cleanCmd.includes('రవి') || cleanCmd.includes('रवि')) {
        const mobInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
        if (mobInput) {
          mobInput.value = '9876543210';
          mobInput.dispatchEvent(new Event('input', { bubbles: true }));
          speakText("Autofilling Farmer Ravi Kumar's number. Say Send OTP to proceed.");
          return;
        }
      }
      
      // 2. Officer credentials fill
      if (cleanCmd.includes('officer') || cleanCmd.includes('ఆఫీసర్') || cleanCmd.includes('अधिकारी') || cleanCmd.includes('sharma')) {
        const officerTab = document.querySelectorAll('button')[1] as HTMLButtonElement;
        if (officerTab) officerTab.click();
        
        setTimeout(() => {
          const inputs = document.querySelectorAll('input');
          if (inputs.length >= 3) {
            inputs[0].value = 'STATION-GUNTUR-01';
            inputs[1].value = '9876543211';
            inputs[2].value = '123456';
            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
            inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
            speakText("Autofilling Officer Sharma's credentials. Say submit to login.");
          }
        }, 150);
        return;
      }

      // 3. Admin credentials fill
      if (cleanCmd.includes('admin') || cleanCmd.includes('అడ్మిన్') || cleanCmd.includes('एडमिन')) {
        const adminTab = document.querySelectorAll('button')[2] as HTMLButtonElement;
        if (adminTab) adminTab.click();
        
        setTimeout(() => {
          const inputs = document.querySelectorAll('input');
          if (inputs.length >= 2) {
            inputs[0].value = 'admin@smartprocure.gov.in';
            inputs[1].value = 'admin123';
            inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
            speakText("Autofilling Admin credentials. Say submit to login.");
          }
        }, 150);
        return;
      }

      // 4. Send OTP trigger
      if (cleanCmd.includes('send') || cleanCmd.includes('otp') || cleanCmd.includes('పంపండి') || cleanCmd.includes('भेजें')) {
        const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (btn) {
          btn.click();
          speakText("Sending verification OTP.");
          return;
        }
      }

      // 5. Verify & Login / Auto-fill OTP
      if (cleanCmd.includes('verify') || cleanCmd.includes('submit') || cleanCmd.includes('ధృవీకరించు') || cleanCmd.includes('सत्यापित') || cleanCmd.includes('login') || cleanCmd.includes('लॉगिन')) {
        const otpInputs = document.querySelectorAll('input[type="text"]');
        if (otpInputs.length > 0) {
          otpInputs.forEach((inp: any) => {
            inp.value = '123456';
            inp.dispatchEvent(new Event('input', { bubbles: true }));
          });
          speakText("Autofilling demo OTP code.");
        }
        setTimeout(() => {
          const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (btn) btn.click();
        }, 300);
        return;
      }
    }

    // ── Auto-Booking Command ──
    const isAutoBook = 
      cleanCmd.includes('auto book') || 
      cleanCmd.includes('autobook') ||
      cleanCmd.includes('ఆటో బుక్') ||
      cleanCmd.includes('బుకింగ్ చేయి') ||
      cleanCmd.includes('బుక్ చేయి') ||
      cleanCmd.includes('ఆటోమేటిక్ బుక్') ||
      cleanCmd.includes('ऑटो बुक') ||
      cleanCmd.includes('बुक करो') ||
      cleanCmd.includes('बुक करें');

    if (isAutoBook) {
      let cropName = 'paddy';
      if (cleanCmd.includes('maize') || cleanCmd.includes('మొక్కజొన్న') || cleanCmd.includes('मक्का')) {
        cropName = 'maize';
      } else if (cleanCmd.includes('groundnut') || cleanCmd.includes('వేరుశనగ') || cleanCmd.includes('मूंगफली')) {
        cropName = 'groundnut';
      } else if (cleanCmd.includes('cotton') || cleanCmd.includes('ప్రత్తి') || cleanCmd.includes('कपास')) {
        cropName = 'cotton';
      } else if (cleanCmd.includes('chilli') || cleanCmd.includes('chili') || cleanCmd.includes('mirchi') || cleanCmd.includes('మిరప') || cleanCmd.includes('మిర్చి') || cleanCmd.includes('मिर्च') || cleanCmd.includes('मिर्ची')) {
        cropName = 'chilli';
      }

      setBookingCrop(cropName);
      setBookingState('awaiting_weight');
      
      const welcomePrompt = language === 'te'
        ? `సరే, ఆటో బుకింగ్ చేద్దాం. మొదట, మీ వద్ద ఎన్ని క్వింటాళ్ల పంట ఉంది? దయచేసి సంఖ్యను చెప్పండి.`
        : language === 'hi'
        ? `ज़रूर, आपकी स्लॉट बुकिंग शुरू करते हैं। पहले, आपके पास कितने क्विंटल फसल है? कृपया संख्या बोलें।`
        : `Sure, let's auto-book your slot. First, how many quintals of ${cropName} do you have? Please speak a number.`;
      
      setStatusText(language === 'te' ? 'బరువు చెప్పండి (ఉదా: యాభై)...' : language === 'hi' ? 'वजन कहें (जैसे: पचास)...' : 'Listening for weight (quintals)...');
      
      speakText(welcomePrompt, () => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch(e) {
            console.warn(e);
          }
        }
      });
      return;
    }

    // ── Navigation Routing Commands ──
    if (isToLogin) {
      speakText(`${getLangText('navigating')} Sign In page.`);
      navigate('/signin');
      setIsOpen(false);
      return;
    }
    if (isToRegister) {
      speakText(`${getLangText('navigating')} Registration page.`);
      navigate('/register');
      setIsOpen(false);
      return;
    }
    if (isToHelpline) {
      speakText(`${getLangText('navigating')} Help Center.`);
      navigate('/helpline');
      setIsOpen(false);
      return;
    }
    if (isHome) {
      speakText(`${getLangText('navigating')} Dashboard.`);
      navigate('/farmer');
      setIsOpen(false);
      return;
    }
    if (isBook) {
      speakText(`${getLangText('navigating')} Slot Booking.`);
      navigate('/farmer/book-slot');
      setIsOpen(false);
      return;
    }
    if (isQueue) {
      speakText(`${getLangText('navigating')} Live Queue.`);
      navigate('/farmer/my-queue');
      setIsOpen(false);
      return;
    }
    if (isWeather) {
      speakText(`${getLangText('navigating')} Weather.`);
      navigate('/farmer/weather');
      setIsOpen(false);
      return;
    }
    if (isAdvisor) {
      speakText(`${getLangText('navigating')} Crop Advisor.`);
      navigate('/farmer/ai-advisor');
      setIsOpen(false);
      return;
    }
    if (isGuidelines) {
      speakText(`${getLangText('navigating')} Guidelines.`);
      navigate('/farmer/guidelines');
      setIsOpen(false);
      return;
    }
    if (isPayment) {
      speakText(`${getLangText('navigating')} Payments.`);
      navigate('/farmer/payment');
      setIsOpen(false);
      return;
    }
    if (isProcurement) {
      speakText(`${getLangText('navigating')} Procurement history.`);
      navigate('/farmer/procurement');
      setIsOpen(false);
      return;
    }
    if (isProfile) {
      speakText(`${getLangText('navigating')} profile.`);
      navigate('/farmer/profile');
      setIsOpen(false);
      return;
    }
    if (isRead) {
      readPageAloud();
      return;
    }
    if (isStop) {
      stopSpeaking();
      speakText(getLangText('stopped'));
      return;
    }
    if (isLogout) {
      speakText(getLangText('logout'));
      logout();
      navigate('/signin');
      setIsOpen(false);
      return;
    }

    // Unknown command
    speakText(getLangText('unknown'));
    setStatusText(getLangText('unknown'));
  };

  // Keep processCommand reference fresh to solve React closure stale state bugs in recognition event listeners
  const processCommandRef = useRef(processCommand);
  useEffect(() => {
    processCommandRef.current = processCommand;
  });

  const toggleListen = () => {
    if (!recognitionRef.current) {
      const errorMsg = "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.";
      speakText(errorMsg);
      setStatusText('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const handleOpenWidget = () => {
    setIsOpen(true);
    setStatusText(getLangText('idle'));
    // Greet synchronously to pass browser autoplay constraints
    speakText(getLangText('greet'));
    
    // Auto-start listening after greeting (approx 5.5s delay)
    setTimeout(() => {
      if (recognitionRef.current) {
        stopSpeaking();
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Autostart mic blocked:', e);
        }
      }
    }, 5500);
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    stopSpeaking();
    if (isListening) recognitionRef.current?.stop();
  };

  // Auto-read page title on route transition
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent) {
          speakText(`${getLangText('navigating')} ${h1.textContent}`);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isOpen]);

  // Hide only if explicitly logged in as non-farmer (officer/admin)
  if (user && user.role !== 'FARMER') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* ── Floating Voice Assistant Panel ── */}
      {isOpen && (
        <div className="bg-slate-900 border-2 border-emerald-500 text-white rounded-3xl p-5 shadow-2xl w-80 max-w-[90vw] mb-4 space-y-4 animate-scaleUp relative overflow-hidden">
          {/* Subtle glowing effect */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

          {/* Title Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 relative z-10">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-xs uppercase tracking-wider text-emerald-400">
                {getLangText('assistant_name')}
              </span>
            </div>
            <button 
              onClick={handleCloseWidget}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Animation Display */}
          <div className="bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 border border-slate-850 relative z-10 min-h-[110px]">
            {/* Visualizer Sound Waves */}
            {(isListening || isSpeaking) ? (
              <div className="flex items-center justify-center space-x-1.5 h-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-emerald-500 rounded-full animate-wave"
                    style={{
                      height: '100%',
                      animationDelay: `${i * 0.15}s`,
                      transformOrigin: 'bottom'
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <Mic className="w-4 h-4" />
              </div>
            )}

            <p className="text-center font-bold text-xs text-slate-200">{statusText}</p>
            
            {lastSpeech && (
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 max-w-full truncate">
                🗣️ Heard: "{lastSpeech}"
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 relative z-10">
            {/* Listen / Mic trigger */}
            <button
              onClick={toggleListen}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                isListening 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Click to talk"
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Read Aloud */}
            <button
              onClick={readPageAloud}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                isSpeaking 
                  ? 'bg-amber-600 border-amber-500 text-white' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Read Page Aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Stop speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-rose-400 hover:text-rose-300 transition-all"
                title="Stop Speech"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Commands Guide Card */}
          <div className="bg-slate-950 rounded-2xl p-3 border border-slate-850 space-y-2 text-[10px] relative z-10 max-h-[140px] overflow-y-auto">
            <h4 className="font-extrabold text-emerald-400 flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{getLangText('help_title')}</span>
            </h4>
            <p className="text-slate-500">{getLangText('help_desc')}</p>
            <div className="grid grid-cols-2 gap-1 text-slate-300">
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_home')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_book')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_queue')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_weather')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_advisor')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_read')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_stop')}</div>
              <div className="p-1 bg-white/5 rounded">{getLangText('cmd_logout')}</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Circular Mic Trigger Button ── */}
      {!isOpen && (
        <button
          onClick={handleOpenWidget}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition hover:-translate-y-0.5 active:translate-y-0 select-none group border-2 border-emerald-400 relative"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-30 group-hover:opacity-50" />
          
          <Mic className="w-6 h-6 transition-transform group-hover:scale-110" />
        </button>
      )}

    </div>
  );
};
