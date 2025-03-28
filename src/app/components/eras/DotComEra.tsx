'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DotComEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

interface GuestbookEntry {
  name: string;
  message: string;
  timestamp: string;
  icon: string;
}

interface PopupWindow {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
}

interface HelperTip {
  text: string;
  type: 'tip' | 'joke' | 'warning';
}

type BackgroundTheme = {
  id: string;
  name: string;
  style: React.CSSProperties;
};

// Add this type for the drag event
type DragEvent = {
  movementX: number;
  movementY: number;
};

const DotComEra: React.FC<DotComEraProps> = ({ onEggCollect, isActive }) => {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ name: '', message: '' });
  const [popups, setPopups] = useState<PopupWindow[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [cursorTrail, setCursorTrail] = useState<Array<{ x: number; y: number }>>([]);
  const [showMidiPlayer, setShowMidiPlayer] = useState(false);
  const [visitorCount] = useState(Math.floor(Math.random() * 9000000) + 1000000);
  const [backgroundTheme, setBackgroundTheme] = useState<string>('purpleStars');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [draggedPopup, setDraggedPopup] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // New states for helper and random popups
  const [showHelper, setShowHelper] = useState(false);
  const [helperTip, setHelperTip] = useState<HelperTip>({ text: '', type: 'tip' });
  const [helperPosition, setHelperPosition] = useState({ x: 100, y: 300 });
  const [lastPopupTime, setLastPopupTime] = useState(0);
  
  // New guestbook enhancement states
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const guestbookRef = useRef<HTMLDivElement>(null);
  
  // Add popup queue for managing popup order and limiting display
  const [popupQueue, setPopupQueue] = useState<{id: string, title: string, content: string}[]>([]);
  const MAX_POPUPS = 2; // Maximum number of popups allowed at once
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const popupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const quizQuestions = [
    {
      question: 'What\'s your preferred browser?',
      options: [
        'Netscape Navigator (the only real browser)',
        'Internet Explorer (it came with Windows!)',
        'AOL (my mom uses it)',
        'What\'s a browser?'
      ]
    },
    {
      question: 'How do you feel about animated GIFs?',
      options: [
        'The more the merrier!',
        'Only if they\'re under construction',
        'They hurt my eyes',
        'I make my own in Paint Shop Pro'
      ]
    },
    {
      question: 'What\'s your favorite programming language?',
      options: [
        'HTML (it\'s the future!)',
        'JavaScript (for the popups)',
        'Java (for the applets)',
        'Assembly (real programmers use it)'
      ]
    }
  ];

  const judgeProfiles = [
    {
      name: 'Dr. Dennis Ritchie',
      role: 'Lead Hacker Evaluator',
      bio: 'Creator of C and UNIX. Known for his love of black turtlenecks and terminal windows.',
      photo: '/images/judges/ritchie.jpg',
      funFact: 'Still uses dial-up by choice',
      alternateTitles: [
        'Cyber Wizard', 
        'Bit Whisperer', 
        'Code Archaeologist', 
        'Algorithm Alchemist',
        'Digital Sage'
      ]
    },
    {
      name: 'Prof. Ada Lovelace',
      role: 'Algorithm Specialist',
      bio: 'First computer programmer. Can debug code while wearing Victorian-era clothing.',
      photo: '/images/judges/lovelace.jpg',
      funFact: 'Types 200 WPM on a mechanical typewriter',
      alternateTitles: [
        'Loop Enchantress', 
        'Byte Sorceress', 
        'Data Dame', 
        'Memory Mage',
        'Quantum Calculator'
      ]
    },
    {
      name: 'Dr. Grace Hopper',
      role: 'Compiler Expert',
      bio: 'Pioneer of computer programming. Invented the term "debugging" after finding a moth in a relay.',
      photo: '/images/judges/hopper.jpg',
      funFact: 'Actually keeps moths as pets now',
      alternateTitles: [
        'Bug Hunter', 
        'Syntax Savant', 
        'Compiler Queen', 
        'Navy Code Admiral',
        'Binary Genius'
      ]
    },
    {
      name: 'Steve Wozniak',
      role: 'Hardware Guru',
      bio: 'Co-founder of Apple. Built his first computer from spare parts and dreams.',
      photo: '/images/judges/wozniak.jpg',
      funFact: 'Still not using a Mac',
      alternateTitles: [
        'Circuit Sorcerer', 
        'Silicon Samurai', 
        'Logic Board Legend', 
        'Chip Champion',
        'Soldering Sensei'
      ]
    }
  ];

  // Random entries for the guestbook
  const randomEntries: Omit<GuestbookEntry, 'timestamp'>[] = [
    { name: 'Xx_H4CK3R_xX', message: 'This hackathon is TOTALLY RADICAL!', icon: '💻' },
    { name: 'GeoFan98', message: 'just finished my website with 57 animated gifs!!', icon: '🎮' },
    { name: 'NetscapeDude', message: 'IE users are NOOBS lol', icon: '😎' },
    { name: 'AOL_Kid', message: 'a/s/l anyone?? 14/m/california here', icon: '💾' },
    { name: 'ModemGirl', message: 'dont call my house phone, im downloading mp3s!!!', icon: '🌐' },
    { name: 'PunterX', message: 'FIRST!!!!1!!', icon: '💻' },
    { name: 'WinampFan', message: 'it really whips the llama\'s ***', icon: '🎮' },
    { name: 'DialUp2000', message: '*modem connecting sounds*', icon: '💾' }
  ];

  // Random popup contents
  const randomPopups = [
    {
      id: 'fake-winner',
      title: '🎉 CONGRATULATIONS! 🎉',
      content: 'You just won 1,000,000 hackathon points!<br><br><span style="font-size: 10px; color: #666;">(Just kidding)</span><br><br><span style="font-size: 50px;">🎉</span>'
    },
    {
      id: 'browser-error',
      title: '⚠️ BROWSER ERROR ⚠️',
      content: 'Your browser is too advanced for this site!<br><br>Please downgrade to Internet Explorer 4.0 for best experience.<br><br><span style="font-size: 50px;">⚠️</span>'
    },
    {
      id: 'too-much-hacking',
      title: '🚨 SECURITY ALERT 🚨',
      content: 'Warning: Too much hacking detected!<br><br>Please slow down or we\'ll report you to the Cyber Police.<br><br><span style="font-size: 50px;">🚨</span>'
    },
    {
      id: 'free-download',
      title: '💾 FREE DOWNLOAD 💾',
      content: 'Click OK to download 10,000 FREE AOL HOURS!<br><br>*Modem and phone line charges may apply<br><br><span style="font-size: 50px;">💾</span>'
    },
    {
      id: 'virus-scan',
      title: '🦠 VIRUS DETECTED 🦠',
      content: 'Your system might be infected with the ILOVEYOU virus!<br><br>Click OK to install our totally legitimate antivirus.<br><br><span style="font-size: 50px;">🦠</span>'
    },
    {
      id: 'counter-strike',
      title: '🎮 GAMING NEWS 🎮',
      content: 'Have you tried the new game Counter-Strike?<br><br>All the cool hackers are playing it!<br><br><span style="font-size: 50px;">🎮</span>'
    },
    // New ad popups
    {
      id: 'fast-internet',
      title: '🚀 NEW! FASTER INTERNET! 🚀',
      content: 'Upgrade to 56K BLAZING FAST internet!<br><br>Download a FULL MP3 in just 20 minutes!<br><br>Call 1-800-FAST-NET today!<br><br><span style="font-size: 50px;">📞</span>'
    },
    {
      id: 'hackathon-sponsor',
      title: '💼 HACKATHON SPONSOR 💼',
      content: 'This hackathon brought to you by:<br><br><b>GEOCITIES PRO</b><br>Your one-stop web hosting solution!<br><br>Get your own web address:<br>www.geocities.com/SiliconValley/yourname<br><br><span style="font-size: 50px;">🌐</span>'
    },
    {
      id: 'dating-service',
      title: '❤️ HOT SINGLES ALERT! ❤️',
      content: 'Meet other single hackers in your area!<br><br>Join our elite dating service for tech professionals.<br><br>100% FREE SIGNUP!<br><br><span style="font-size: 50px;">❤️</span>'
    },
    {
      id: 'submit-to-directories',
      title: '📖 WEB DIRECTORY LISTING 📖',
      content: 'Submit your website to Yahoo!, AltaVista, and 500+ other search engines!<br><br>Get listed TODAY!<br><br>Only $29.99 per month<br><br><span style="font-size: 50px;">📖</span>'
    },
    {
      id: 'punch-monkey',
      title: '🐒 PUNCH THE MONKEY! 🐒',
      content: 'PUNCH THE MONKEY AND WIN A PRIZE!<br><br><span style="font-size: 60px; display: block; text-align: center; animation: bounce 1s infinite;">🐒</span><br><br>Win a FREE T-SHIRT!'
    },
    {
      id: 'your-computer-slow',
      title: '⏱️ IS YOUR PC RUNNING SLOW? ⏱️',
      content: 'Your computer is running at 73% efficiency!<br><br>Download our SYSTEM OPTIMIZER to BOOST your PC performance!<br><br><div style="background: #00ff00; color: black; text-align: center; padding: 5px;">DOWNLOAD NOW</div>'
    },
    {
      id: 'stock-market',
      title: '📈 HOT TECH STOCKS! 📈',
      content: 'Invest in these HOT INTERNET STOCKS before they EXPLODE!<br><br>- Pets.com<br>- Webvan.com<br>- eToys.com<br><br>LIMITED TIME OFFER!<br><br><span style="font-size: 50px;">📈</span>'
    }
  ];

  // Helper tips
  const helperTips: HelperTip[] = [
    { text: "It looks like you're building a hackathon project! Need some caffeine?", type: 'tip' },
    { text: "Try pressing Alt+F4 for a super secret hacking tool!", type: 'joke' },
    { text: "Pro Tip: Real hackers use green text on black backgrounds.", type: 'tip' },
    { text: "WARNING: Too many GIFs may cause seizures or dial-up lag!", type: 'warning' },
    { text: "Did you know? The first hackathon was held in 1999 by dinosaurs.", type: 'joke' },
    { text: "Sign our guestbook! It's how we harvest your data- I mean, stay connected!", type: 'tip' },
    { text: "HELP! I'm trapped in this browser! Please send pizza!", type: 'joke' },
    { text: "Remember to save your work on a floppy disk every 5 minutes!", type: 'warning' },
    { text: "Pro Tip: Adding 'cyber' to any word makes it sound more technical.", type: 'tip' },
    { text: "Is your code not working? Have you tried turning it off and on again?", type: 'joke' }
  ];

  // Function to convert text to mixed case (random capitalization)
  const toMixedCase = (text: string): string => {
    return text.split('').map(char => 
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()
    ).join('');
  };

  // Function to convert text to alternating caps
  const toAlternatingCaps = (text: string): string => {
    return text.split('').map((char, i) => 
      i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    ).join('');
  };

  // Function to style username in 90s fashion
  const styleName = (name: string): string => {
    const styles = [
      name.toUpperCase(),
      toMixedCase(name),
      toAlternatingCaps(name),
      `~*${name}*~`,
      `<(${name})>`,
      `--==[ ${name} ]==--`,
      `::${name}::`,
      `•§• ${name} •§•`,
      `™${name}™`,
      `×÷•${name}•÷×`,
      `☆彡${name}彡☆`
    ];
    
    return styles[Math.floor(Math.random() * styles.length)];
  };

  // Function to play message sound
  const playMessageSound = () => {
    try {
      const audio = new Audio('/sounds/youve-got-mail.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };

  // Define background themes
  const backgroundThemes: BackgroundTheme[] = [
    {
      id: 'purpleStars',
      name: 'Cosmic Purple',
      style: {
        backgroundColor: "#4a148c",
        backgroundImage: "radial-gradient(white 1px, transparent 1px), repeating-linear-gradient(45deg, #4a148c 0%, #6a1b9a 10%, #7b1fa2 20%, #6a1b9a 30%, #4a148c 40%)",
        backgroundSize: "20px 20px, 100% 100%",
        backgroundBlendMode: "overlay",
      }
    },
    {
      id: 'blueBricks',
      name: 'Blue Bricks',
      style: {
        backgroundColor: "#000080",
        backgroundImage: `repeating-linear-gradient(0deg, #000080, #000080 20px, #0000FF 20px, #0000FF 40px), 
                          repeating-linear-gradient(90deg, #000080, #000080 20px, #0000FF 20px, #0000FF 40px)`,
        backgroundSize: "40px 40px",
        backgroundBlendMode: "difference",
      }
    },
    {
      id: 'neonGrid',
      name: 'Neon Grid',
      style: {
        backgroundColor: "black",
        backgroundImage: `linear-gradient(#00ff00 1px, transparent 1px), 
                          linear-gradient(90deg, #00ff00 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }
    },
    {
      id: 'pixelFlames',
      name: 'Pixel Flames',
      style: {
        backgroundColor: "#000000",
        backgroundImage: `repeating-linear-gradient(0deg, #ff0000, #ff8800 10px, #ffff00 20px, #ff8800 30px, #ff0000 40px)`,
        backgroundSize: "100% 40px",
      }
    },
    {
      id: 'rainbowWaves',
      name: 'Rainbow Waves',
      style: {
        background: `linear-gradient(45deg, 
                     #ff0000 0%, 
                     #ff7f00 10%, 
                     #ffff00 20%, 
                     #00ff00 30%, 
                     #0000ff 40%,
                     #4b0082 50%,
                     #8b00ff 60%,
                     #ff0000 70%,
                     #ff7f00 80%,
                     #ffff00 90%,
                     #00ff00 100%)`,
        backgroundSize: "200% 200%",
        animation: "gradient 15s ease infinite",
      }
    },
    {
      id: 'matrixRain',
      name: 'The Matrix™',
      style: {
        backgroundColor: "#000",
        backgroundImage: `radial-gradient(#00ff00 1px, transparent 1px)`,
        backgroundSize: "10px 10px",
        position: "relative",
      }
    },
    {
      id: 'underConstruction',
      name: 'Under Construction',
      style: {
        backgroundColor: "#ffff00",
        backgroundImage: `repeating-linear-gradient(45deg, #000000, #000000 10px, #ffff00 10px, #ffff00 20px)`,
        backgroundSize: "30px 30px",
      }
    }
  ];

  // Add keyframes for matrix animation and rainbow waves to the component's CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes matrix {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }

      .matrix-code {
        position: absolute;
        top: 0;
        color: #00ff00;
        text-shadow: 0 0 5px #00ff00;
        font-family: monospace;
        font-size: 20px;
        white-space: nowrap;
        animation: matrix 10s linear infinite;
      }
      
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0.7; }
      }
      
      .animate-blink {
        animation: blink 0.5s infinite;
        text-shadow: 0 0 5px #ff00ff;
      }
      
      @keyframes slide-in {
        0% { transform: translateY(-20px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      .animate-slide-in {
        animation: slide-in 0.5s ease-out;
      }
      
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      
      .animate-marquee {
        display: inline-block;
        white-space: nowrap;
        animation: marquee 15s linear infinite;
        padding-left: 100%;
        width: 100%;
        overflow: visible;
      }
      
      @keyframes smooth-marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      
      .smooth-marquee {
        display: inline-block;
        white-space: nowrap;
        animation: smooth-marquee 30s linear infinite;
        padding-left: 100%;
        width: 100%;
        text-shadow: 0 0 10px currentColor;
        overflow: visible;
      }
      
      @keyframes text-glow {
        0% { text-shadow: 0 0 10px currentColor; }
        50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        100% { text-shadow: 0 0 10px currentColor; }
      }
      
      .text-glow {
        animation: text-glow 2s ease-in-out infinite;
      }
      
      @keyframes prize-shake {
        0%, 100% { transform: translate(0, 0) rotate(0); }
        10%, 30%, 50%, 70%, 90% { transform: translate(-2px, -2px) rotate(-1deg); }
        20%, 40%, 60%, 80% { transform: translate(2px, 2px) rotate(1deg); }
      }
      
      .prize-shake {
        animation: prize-shake 0.5s ease-in-out infinite;
        display: inline-block;
      }
      
      @keyframes sparkle {
        0%, 100% { background-position: 0% 0%; }
        50% { background-position: 100% 100%; }
      }
      
      .prize-sparkle {
        background-image: linear-gradient(
          45deg, 
          rgba(255,255,255,0) 45%, 
          rgba(255,255,255,0.8) 50%, 
          rgba(255,255,255,0) 55%
        );
        background-size: 200% 200%;
        animation: sparkle 1s linear infinite;
        color: yellow;
        font-weight: bold;
      }
      
      @keyframes sponsor-glitch {
        0%, 100% { transform: translate(0, 0); filter: none; }
        2% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
        4% { transform: translate(3px, -2px); filter: hue-rotate(180deg); }
        6% { transform: translate(-5px, -2px); filter: hue-rotate(270deg); }
        8% { transform: translate(5px, 2px); filter: hue-rotate(360deg); }
        10% { transform: translate(-3px, -2px); filter: hue-rotate(90deg); }
        12% { transform: translate(3px, 2px); filter: hue-rotate(0deg); }
      }
      
      .sponsor-glitch {
        animation: sponsor-glitch 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .guestbook-container::-webkit-scrollbar {
        width: 10px;
      }
      
      .guestbook-container::-webkit-scrollbar-track {
        background: #000080;
      }
      
      .guestbook-container::-webkit-scrollbar-thumb {
        background: #00ff00;
        border: 2px solid #000080;
      }
      
      .guestbook-typecursor {
        display: inline-block;
        width: 10px;
        height: 16px;
        background: #ffff00;
        animation: blink 0.7s infinite;
      }
    `;
    document.head.appendChild(style);

    // If Matrix theme is active, add falling code
    if (backgroundTheme === 'matrixRain' && cursorRef.current) {
      const container = cursorRef.current;
      const columns = Math.floor(container.offsetWidth / 20);
      
      const intervalId = setInterval(() => {
        if (backgroundTheme !== 'matrixRain') {
          clearInterval(intervalId);
          return;
        }
        
        const code = document.createElement('div');
        code.className = 'matrix-code';
        code.style.left = `${Math.floor(Math.random() * columns) * 20}px`;
        code.textContent = '01'.split('').map(() => 
          String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        ).join('');
        
        container.appendChild(code);
        
        setTimeout(() => {
          if (code.parentNode === container) {
            container.removeChild(code);
          }
        }, 10000);
      }, 300);
      
      return () => {
        clearInterval(intervalId);
        document.head.removeChild(style);
      };
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, [backgroundTheme]);

  useEffect(() => {
    if (isActive) {
      // Show a welcome popup with random content
      const welcomeMessages = [
        `You are visitor #${visitorCount}!<br><br>🏆 Your site has been awarded:<br>"1999 Best Designed Hackathon Website!"`,
        `WELCOME TO THE WORLD WIDE WEB!<br><br>You are visitor #${visitorCount}!<br><br>Please set this as your homepage!`,
        `You have been selected as our ${visitorCount}th visitor!<br><br>Claim your FREE PRIZE by clicking OK!`
      ];
      
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      showPopup('welcome', 'Welcome to the 90s Web!', randomWelcome);
      
      // Queue helper tip instead of showing immediately
      setTimeout(() => {
        showRandomHelperTip();
      }, 5000);
      
      // Show a random ad popup after another delay
      setTimeout(() => {
        showRandomPopup();
      }, 30000);
    }
  }, [isActive]);

  // Get the current background theme
  const getCurrentTheme = () => {
    return backgroundThemes.find(theme => theme.id === backgroundTheme) || backgroundThemes[0];
  };

  // Cycle to the next background theme
  const cycleBackgroundTheme = () => {
    const currentIndex = backgroundThemes.findIndex(theme => theme.id === backgroundTheme);
    const nextIndex = (currentIndex + 1) % backgroundThemes.length;
    setBackgroundTheme(backgroundThemes[nextIndex].id);
  };

  // Toggle the theme picker
  const toggleThemePicker = () => {
    setShowThemePicker(!showThemePicker);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cursorRef.current) return;
    
    const rect = cursorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCursorTrail(prev => {
      const newTrail = [...prev, { x, y }];
      return newTrail.slice(-10); // Keep last 10 positions
    });
  };

  const showPopup = (id: string, title: string, content: string) => {
    // Check if a popup with this ID already exists
    const existingPopupIndex = popups.findIndex(p => p.id === id);
    if (existingPopupIndex !== -1) {
      // If it exists, just bring it to the front by removing and adding it back
      const existingPopup = popups[existingPopupIndex];
      setPopups(prev => [...prev.filter(p => p.id !== id), existingPopup]);
      return;
    }
    
    // Position popups within the visible area of the DotComEra section
    if (!cursorRef.current) return;
    
    const rect = cursorRef.current.getBoundingClientRect();
    
    // Calculate maximum allowed position using more conservative values
    const maxX = Math.max(0, rect.width - 300);
    const maxY = Math.max(0, rect.height - 250);
    
    // Calculate a position that's guaranteed to be within the visible component area
    const position = {
      x: Math.min(Math.max(50, Math.random() * (rect.width - 350)), maxX),
      y: Math.min(Math.max(50, Math.random() * (rect.height - 300)), maxY)
    };
    
    // If we already have MAX_POPUPS popups displayed, add to queue instead
    if (popups.length >= MAX_POPUPS) {
      setPopupQueue(prev => [...prev, {id, title, content}]);
      return;
    }
    
    // Otherwise, show the popup
    setPopups(prev => [...prev, { id, title, content, position }]);
  };

  const closePopup = (id: string, e: React.MouseEvent) => {
    // Stop event propagation to prevent triggering drag
    e.stopPropagation();
    
    // Remove the closed popup
    setPopups(prev => prev.filter(p => p.id !== id));
    
    // Check if there are any waiting popups in the queue
    if (popupQueue.length > 0) {
      // Get the next popup from the queue
      const nextPopup = popupQueue[0];
      
      // Remove it from the queue
      setPopupQueue(prev => prev.slice(1));
      
      // Show this popup after a short delay
      setTimeout(() => {
        showPopup(nextPopup.id, nextPopup.title, nextPopup.content);
      }, 500);
    }
  };

  // Add random entries at intervals when the component is active
  useEffect(() => {
    if (!isActive) return;
    
    const addRandomEntry = () => {
      const entry = randomEntries[Math.floor(Math.random() * randomEntries.length)];
      const newEntry: GuestbookEntry = {
        ...entry,
        name: styleName(entry.name),
        timestamp: new Date().toLocaleString()
      };
      
      setGuestbookEntries(prev => [newEntry, ...prev]);
      
      // Scroll to the top of the guestbook
      if (guestbookRef.current) {
        guestbookRef.current.scrollTop = 0;
      }
    };
    
    // Add initial entries
    setTimeout(addRandomEntry, 3000);
    setTimeout(addRandomEntry, 7000);
    
    // Add random entries periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add an entry
        addRandomEntry();
      }
    }, 15000);
    
    return () => clearInterval(interval);
  }, [isActive]);

  // Typing animation for processing text
  useEffect(() => {
    if (!isSubmittingEntry) return;
    
    const fullText = "PROCESSING ENTRY... CONNECTING TO SERVER... VALIDATING USER... ALLOCATING MEMORY... SAVING DATA...";
    let index = 0;
    let text = '';
    
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        text = fullText.substring(0, index);
        setProcessingText(text);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, [isSubmittingEntry]);

  // Replace the guestbook submission handler
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.name || !newEntry.message) return;
    
    // Play a typing sound
    try {
      const audio = new Audio('/sounds/keyboard.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
    
    // Show the processing animation
    setIsSubmittingEntry(true);
    setProcessingText('');
    
    // Delay to show the processing animation
    setTimeout(() => {
      const icons = ['💾', '💻', '😎', '🎮', '🌐', '🚀', '🔥', '⚡'];
      const entry: GuestbookEntry = {
        name: styleName(newEntry.name),
        message: newEntry.message,
        timestamp: new Date().toLocaleString(),
        icon: icons[Math.floor(Math.random() * icons.length)]
      };
      
      setGuestbookEntries(prev => [entry, ...prev]);
      setNewEntry({ name: '', message: '' });
      setIsSubmittingEntry(false);
      
      // Scroll to the top of the guestbook
      if (guestbookRef.current) {
        guestbookRef.current.scrollTop = 0;
      }
      
      // Play sound after processing is complete
      setTimeout(() => {
        playMessageSound();
      }, 500);
    }, 2500);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizStep(0);
    setQuizResult(null);
  };

  const handleQuizAnswer = (answer: string) => {
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate result based on answers
      const results = [
        'The Matrix Keyboard Warrior',
        'The Geocities Webmaster',
        'The AOL Chat Room Legend',
        'The Netscape Navigator Pro'
      ];
      setQuizResult(results[Math.floor(Math.random() * results.length)]);
      onEggCollect('dotcom-quiz');
    }
  };

  // Handle starting drag
  const startDrag = (id: string, e: React.MouseEvent) => {
    const popup = popups.find(p => p.id === id);
    if (!popup) return;
    
    // Calculate the offset from the mouse position to the popup's top-left corner
    setDragOffset({
      x: e.clientX - popup.position.x,
      y: e.clientY - popup.position.y
    });
    
    setDraggedPopup(id);
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedPopup) return;
      
      const popup = popups.find(p => p.id === draggedPopup);
      if (!popup || !cursorRef.current) return;
      
      const rect = cursorRef.current.getBoundingClientRect();
      
      // Calculate new position with constraints to keep popup in view
      const newX = Math.min(Math.max(0, e.clientX - dragOffset.x), rect.width - 320);
      const newY = Math.min(Math.max(0, e.clientY - dragOffset.y), rect.height - 200);
      
      setPopups(prev => prev.map(p => 
        p.id === draggedPopup ? { ...p, position: { x: newX, y: newY } } : p
      ));
    };
    
    const endDrag = () => {
      setDraggedPopup(null);
    };
    
    if (draggedPopup) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', endDrag);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
    };
  }, [draggedPopup, dragOffset, popups, cursorRef]);

  // Add some initial entries when the component first loads
  useEffect(() => {
    if (guestbookEntries.length === 0) {
      // Shuffle the random entries array
      const shuffled = [...randomEntries]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      
      // Add timestamps to the entries
      const initialEntries = shuffled.map(entry => ({
        ...entry,
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24)
        ).toLocaleString()
      }));
      
      setGuestbookEntries(initialEntries);
    }
  }, []);

  // Function to show a random popup
  const showRandomPopup = () => {
    const now = Date.now();
    // Only show a popup if it's been at least 45 seconds since the last one (increased from 20)
    if (now - lastPopupTime > 45000 && isActive) {
      const randomIndex = Math.floor(Math.random() * randomPopups.length);
      const popup = randomPopups[randomIndex];
      
      // Update the last popup time even if we just queue it
      setLastPopupTime(now);
      
      // If we already have MAX_POPUPS, just queue it
      if (popups.length >= MAX_POPUPS) {
        setPopupQueue(prev => [...prev, popup]);
        return;
      }
      
      if (!cursorRef.current) return;
      
      const rect = cursorRef.current.getBoundingClientRect();
      
      // Randomize position: sometimes in corners, sometimes more centered
      let posX, posY;
      
      const positionStyle = Math.floor(Math.random() * 5); // 0-4 different positioning styles
      
      // Calculate maximum allowed position to keep popup fully within view
      // Use 300px for width and 250px for height as safe popup dimensions
      const maxX = Math.max(0, rect.width - 300);
      const maxY = Math.max(0, rect.height - 250);
      
      switch(positionStyle) {
        case 0: // Top left
          posX = Math.min(Math.random() * 100, maxX);
          posY = Math.min(Math.random() * 100, maxY);
          break;
        case 1: // Top right
          posX = Math.min(rect.width - 300 - Math.random() * 100, maxX);
          posY = Math.min(Math.random() * 100, maxY);
          break;
        case 2: // Bottom left
          posX = Math.min(Math.random() * 100, maxX);
          posY = Math.min(rect.height - 250 - Math.random() * 100, maxY);
          break;
        case 3: // Bottom right
          posX = Math.min(rect.width - 300 - Math.random() * 100, maxX);
          posY = Math.min(rect.height - 250 - Math.random() * 100, maxY);
          break;
        default: // Random position
          posX = Math.min(Math.max(20, Math.random() * (rect.width - 300)), maxX);
          posY = Math.min(Math.max(20, Math.random() * (rect.height - 250)), maxY);
      }
      
      // Keep popups inside the viewable area with more conservative margins
      posX = Math.min(Math.max(10, posX), maxX);
      posY = Math.min(Math.max(10, posY), maxY);
      
      setPopups(prev => [...prev, { ...popup, position: { x: posX, y: posY } }]);
      
      // Collect an egg if this is the first random popup
      if (lastPopupTime === 0) {
        onEggCollect('dotcom-popup');
      }
      
      // No longer show a second popup immediately, to avoid too many popups
      // Instead, queue it with a higher priority
      if (Math.random() < 0.2) {
        const secondIndex = (randomIndex + Math.floor(Math.random() * (randomPopups.length - 1) + 1)) % randomPopups.length;
        const secondPopup = randomPopups[secondIndex];
        
        // Add to the start of the queue to show it next
        setPopupQueue(prev => [
          {...secondPopup},
          ...prev
        ]);
      }
    }
  };

  // Function to show a random helper tip (Hacky's Pro Tips)
  const showRandomHelperTip = () => {
    // If we already have MAX_POPUPS, including the helper, don't show helper
    if (popups.length >= MAX_POPUPS && !showHelper) {
      // Queue helper tip for later with a special ID
      const randomIndex = Math.floor(Math.random() * helperTips.length);
      const tip = helperTips[randomIndex];
      
      // Create a popup-style representation of the helper
      setPopupQueue(prev => [...prev, {
        id: 'helper-tip',
        title: 'Hacky\'s Pro Tip',
        content: `
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 10px;">💻</div>
            <div>
              <strong>${tip.type === 'tip' ? 'PRO TIP:' : tip.type === 'joke' ? 'HACKER JOKE:' : 'WARNING:'}</strong>
              <p>${tip.text}</p>
            </div>
          </div>
        `
      }]);
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * helperTips.length);
    setHelperTip(helperTips[randomIndex]);
    setShowHelper(true);
    
    // Only reposition if Hacky isn't already visible
    if (!showHelper && cursorRef.current) {
      const rect = cursorRef.current.getBoundingClientRect();
      // Position the helper on the left side instead of the right
      setHelperPosition({
        x: Math.min(Math.max(20, 20), 20), // Fixed position on the left
        y: Math.min(Math.max(100, rect.height - 350), rect.height - 350)
      });
    }
  };

  // Function to dismiss the helper
  const dismissHelper = () => {
    setShowHelper(false);
  };

  // Handle helper drag
  const dragHelper = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) => {
    if (!cursorRef.current) return;
    
    const rect = cursorRef.current.getBoundingClientRect();
    setHelperPosition(prev => ({
      x: Math.min(Math.max(0, prev.x + (e as MouseEvent).movementX), rect.width - 300),
      y: Math.min(Math.max(0, prev.y + (e as MouseEvent).movementY), rect.height - 300)
    }));
  };

  // Set up interval for random popups and helper tips
  useEffect(() => {
    if (!isActive) return;
    
    // Random popups every 60-120 seconds (increased from 30-90) with lower probability
    const popupInterval = setInterval(() => {
      // Lower base chance (20% instead of 30%)
      const baseChance = 0.2;
      const timeBonus = Math.min(0.3, (Date.now() - lastPopupTime) / 80000 * 0.1); // Up to +30% over time
      
      if (Math.random() < (baseChance + timeBonus)) {
        showRandomPopup();
      }
    }, 60000 + Math.floor(Math.random() * 60000));
    
    // Random helper tips every 3-6 minutes (increased from 2-5)
    const helperInterval = setInterval(() => {
      if (!showHelper && Math.random() > 0.6) { // 40% chance each interval (decreased from 50%)
        showRandomHelperTip();
      }
    }, 180000 + Math.floor(Math.random() * 180000));
    
    return () => {
      clearInterval(popupInterval);
      clearInterval(helperInterval);
    };
  }, [isActive, showHelper, lastPopupTime]);

  // Add prize popup data
  const prizePopups = [
    {
      id: 'grand-prize',
      title: '🏆 GRAND PRIZE: $1,000,000',
      content: `
        <div class="text-center">
          <h3 style="color: #ff0000; font-size: 24px; font-weight: bold; margin-bottom: 10px;">$1,000,000 GRAND PRIZE!!!</h3>
          <p style="margin-bottom: 15px;">Past Winner: <b>JeffH4x0r</b> (1998)<br>Built a "Y2K-proof" calculator</p>
          <p style="margin-bottom: 15px;">Runner-up: <b>WebGrrrl</b><br>Created an AI that predicts AOL keywords</p>
          <p style="font-size: 12px; color: #666; font-style: italic;">*Prize paid in 1,000,000 installments of $1 over 83,334 years</p>
          <div style="margin-top: 15px; font-size: 60px;">💰</div>
        </div>
      `
    },
    {
      id: 'second-prize',
      title: '🥈 2nd PLACE: $500,000',
      content: `
        <div class="text-center">
          <h3 style="color: #0000ff; font-size: 20px; font-weight: bold; margin-bottom: 10px;">$500,000 RUNNER-UP PRIZE</h3>
          <p style="margin-bottom: 15px;">Past Winner: <b>Coderella</b> (1997)<br>Developed a "Mouse Odometer" to track cursor miles</p>
          <p style="margin-bottom: 15px;">Fun Fact: Winner had to carry home prize in 500,000 pennies</p>
          <p style="font-size: 12px; color: #666; font-style: italic;">*May be substituted with 500,000 AOL free trial CDs</p>
          <div style="margin-top: 15px; font-size: 60px;">💿</div>
        </div>
      `
    },
    {
      id: 'innovation-prize',
      title: '💡 INNOVATION AWARD: $100,000',
      content: `
        <div class="text-center">
          <h3 style="color: #00aa00; font-size: 18px; font-weight: bold; margin-bottom: 10px;">$100,000 INNOVATION AWARD</h3>
          <p style="margin-bottom: 15px;">Past Winner: <b>DialUpDude</b> (1999)<br>Created a "Website Preloader" that downloads websites while you sleep</p>
          <p style="margin-bottom: 15px;">Judge Comment: "This will save HOURS of waiting!"</p>
          <p style="font-size: 12px; color: #666; font-style: italic;">*Prize comes with free 56k modem upgrade</p>
          <div style="margin-top: 15px; font-size: 60px;">🚀</div>
        </div>
      `
    }
  ];

  // Function to show prize details popup when clicking on prize amount
  const showPrizeDetails = (prizeId: string) => {
    const prize = prizePopups.find(p => p.id === prizeId);
    if (prize) {
      // Play a cash register sound
      try {
        const audio = new Audio('/sounds/cash-register.mp3');
        audio.volume = 0.3;
        audio.play().catch(err => console.log('Audio play failed:', err));
      } catch (error) {
        console.log('Sound playback error:', error);
      }

      showPopup(prize.id, prize.title, prize.content);
    }
  };

  // Add state for judgeRoles to track which titles are showing
  const [judgeRoles, setJudgeRoles] = useState<{[key: string]: string}>({});

  // Function to randomize a judge's title
  const randomizeJudgeTitle = (judgeName: string, alternateTitles: string[]) => {
    // Play click sound
    try {
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }

    // Set a random title for the judge
    const randomTitle = alternateTitles[Math.floor(Math.random() * alternateTitles.length)];
    setJudgeRoles(prev => ({
      ...prev,
      [judgeName]: randomTitle
    }));
  };

  // Function to play hover sound over judge name
  const playHoverSound = () => {
    try {
      const audio = new Audio('/sounds/hover.mp3');
      audio.volume = 0.1;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
  };

  // Create "web 1.0" style window content for a judge
  const createJudgeWindowContent = (judge: typeof judgeProfiles[0]) => {
    return `
      <div style="font-family: 'Comic Sans MS', cursive; text-align: center;">
        <div style="background: linear-gradient(to bottom, #6666ff, #000066); color: white; padding: 8px 0; margin-bottom: 15px;">
          <h2 style="margin: 0; text-shadow: 2px 2px #000000;">${judge.name}</h2>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="position: relative; width: 120px; height: 120px; margin-bottom: 10px; border: 3px solid white; outline: 2px solid black; background-color: #cccccc;">
            <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center; overflow: hidden; background-color: #f0f0f0;">
              <div style="font-size: 72px;">${judge.name.charAt(0)}</div>
              <div style="position: absolute; bottom: 2px; right: 2px; font-size: 8px; color: red;">JPG</div>
            </div>
          </div>
          
          <h3 style="color: #990000; margin: 5px 0; font-size: 18px;">${judgeRoles[judge.name] || judge.role}</h3>
          
          <div style="background-color: #ffff99; border: 1px dashed #999900; padding: 8px; margin: 8px 0; text-align: left;">
            <p style="margin: 0; font-size: 14px;"><b>Fun Fact:</b> ${judge.funFact}</p>
          </div>
          
          <p style="margin: 10px 0; text-align: justify; padding: 0 10px; font-size: 14px;">
            ${judge.bio}
          </p>
          
          <div style="margin-top: 15px; border-top: 2px ridge #cccccc; padding-top: 10px; width: 100%;">
            <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
              <tr>
                <td style="border: 1px solid #cccccc; padding: 3px;"><b>Email:</b></td>
                <td style="border: 1px solid #cccccc; padding: 3px;">${judge.name.split(' ')[0].toLowerCase()}@geocities.com</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cccccc; padding: 3px;"><b>ICQ:</b></td>
                <td style="border: 1px solid #cccccc; padding: 3px;">${Math.floor(10000000 + Math.random() * 90000000)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cccccc; padding: 3px;"><b>Homepage:</b></td>
                <td style="border: 1px solid #cccccc; padding: 3px;">www.angelfire.com/~${judge.name.split(' ')[0].toLowerCase()}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 15px; font-size: 10px; color: #666666;">
            Last updated: March 3, 1999 | <span style="color: #0000ff; text-decoration: underline;">Sign my guestbook!</span>
          </div>
        </div>
      </div>
    `;
  };

  // Function to show judge profile in a window styled like IE4 or Netscape
  const showJudgeProfile = (judge: typeof judgeProfiles[0]) => {
    // Decide between IE4 or Netscape style randomly
    const isIE = Math.random() > 0.5;
    const browserName = isIE ? 'Internet Explorer 4.0' : 'Netscape Navigator 4.0';
    const browserStyle = isIE 
      ? 'background: linear-gradient(to bottom, #d0d0d0, #a0a0a0); border: 2px outset #d0d0d0;'
      : 'background: linear-gradient(to bottom, #6666cc, #000099); border: 2px outset #6666cc; color: white;';
    
    const windowContent = `
      <div style="width: 100%; font-family: Arial, sans-serif;">
        <div style="${browserStyle} padding: 4px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <div style="margin-right: 8px; font-size: 20px;">${isIE ? 'e' : 'N'}</div>
            <div>${browserName} - ${judge.name}'s Homepage</div>
          </div>
          <div style="display: flex;">
            <button style="margin: 0 2px; min-width: 22px; text-align: center; border: 1px outset #d0d0d0; background: #c0c0c0;">_</button>
            <button style="margin: 0 2px; min-width: 22px; text-align: center; border: 1px outset #d0d0d0; background: #c0c0c0;">□</button>
            <button style="margin: 0 2px; min-width: 22px; text-align: center; border: 1px outset #d0d0d0; background: #c0c0c0;">×</button>
          </div>
        </div>
        <div style="border-left: 2px solid #808080; border-right: 2px solid #808080; border-bottom: 2px solid #808080; padding: 2px; background-color: #ffffff;">
          <div style="background-color: #e0e0e0; border-bottom: 1px solid #a0a0a0; padding: 4px; font-size: 12px;">
            <span style="margin-right: 12px; color: #0000ff; text-decoration: underline;">File</span>
            <span style="margin-right: 12px; color: #0000ff; text-decoration: underline;">Edit</span>
            <span style="margin-right: 12px; color: #0000ff; text-decoration: underline;">View</span>
            <span style="margin-right: 12px; color: #0000ff; text-decoration: underline;">Go</span>
            <span style="margin-right: 12px; color: #0000ff; text-decoration: underline;">Bookmarks</span>
            <span style="color: #0000ff; text-decoration: underline;">Help</span>
          </div>
          <div style="background-color: #e0e0e0; border-bottom: 1px solid #a0a0a0; padding: 4px; font-size: 10px; display: flex;">
            <div style="margin-right: 8px; color: #0000ff;">◄ Back</div>
            <div style="margin-right: 8px; color: #0000ff;">Forward ►</div>
            <div style="margin-right: 8px; color: #0000ff;">Reload</div>
            <div style="margin-right: 8px; color: #0000ff;">Home</div>
            <div style="margin-right: 8px; color: #0000ff;">Print</div>
          </div>
          <div style="background-color: #e0e0e0; border-bottom: 1px solid #a0a0a0; padding: 4px; font-size: 10px;">
            <span style="margin-right: 4px;">Address:</span>
            <span style="background-color: white; border: 1px inset #c0c0c0; padding: 2px 4px; flex-grow: 1;">
              http://www.geocities.com/SiliconValley/Ridge/5789/${judge.name.toLowerCase().replace(' ', '')}.html
            </span>
          </div>
          <div style="padding: 10px; background-color: white; height: 400px; overflow-y: auto;">
            ${createJudgeWindowContent(judge)}
          </div>
          <div style="background-color: #e0e0e0; border-top: 1px solid #a0a0a0; padding: 4px; font-size: 10px; display: flex; justify-content: space-between;">
            <div>Document: Done (1.21 seconds)</div>
            <div>${isIE ? '© Microsoft Corporation' : '© Netscape Communications'}</div>
          </div>
        </div>
      </div>
    `;
    
    showPopup(`judge-${judge.name}`, `${judge.name}'s Homepage`, windowContent);
  };

  // Add sponsor data
  const sponsors = [
    {
      name: "CRT Monitors Inc.",
      slogan: "Because LCD is for wimps!",
      description: "Bringing you the finest in radiation-emitting display technology since 1982. Our monitors weigh more than your PC and that's how you know they're good!",
      primaryColor: "#ff0000"
    },
    {
      name: "Dial-Up Pro",
      slogan: "We'll connect you... eventually!",
      description: "Enjoy the soothing sounds of modems and random disconnections when your mom picks up the phone. 56k technology - it's practically broadband!",
      primaryColor: "#00ff00"
    },
    {
      name: "GeoCities Plus",
      slogan: "Under Construction Since 1994!",
      description: "Why have a normal website when you can have blinking text, auto-playing MIDI, and visitor counters? Join our neighborhoods today!",
      primaryColor: "#0000ff"
    },
    {
      name: "Floppy Disks R Us",
      slogan: "1.44MB of Pure Power!",
      description: "Store your entire thesis on just 37 disks! Our disks are guaranteed* to last for weeks before developing bad sectors. *Not actually guaranteed.",
      primaryColor: "#ffff00"
    },
    {
      name: "CYBER SECURITY 2000",
      slogan: "Y2K-Proof Your Life!",
      description: "Are computers going to explode on January 1, 2000? Probably! But our special Y2K compliance software will save your Pentium II from certain doom.",
      primaryColor: "#ff00ff"
    },
    {
      name: "Internet Explorer 4",
      slogan: "It's Better* Than Netscape! (*Legal team made us say this)",
      description: "Pre-installed on your PC whether you want it or not. Now with ActiveX technology for all your security vulnerabilities needs!",
      primaryColor: "#00ffff"
    }
  ];

  // Function to show sponsor loading screen then details
  const showSponsorDetails = (sponsor: typeof sponsors[0]) => {
    // First show loading screen
    const loadingContent = `
      <div style="text-align: center; font-family: 'Courier New', monospace;">
        <h3 style="color: ${sponsor.primaryColor}; margin-bottom: 15px;">LOADING SPONSOR DATA...</h3>
        
        <div style="width: 100%; height: 20px; border: 2px solid #808080; margin: 10px 0; position: relative; background: #000000;">
          <div id="loadingBar" style="width: 0%; height: 100%; background: ${sponsor.primaryColor};"></div>
        </div>
        
        <div id="loadingText" style="margin-top: 10px; color: #ffffff;">Connecting to sponsor server...</div>
        
        <div style="margin-top: 20px; color: #c0c0c0; font-size: 12px;">
          Please wait while we connect to our sponsor server. This may take several minutes on a 14.4k modem.
          <br><br>
          Tip: Try setting your display to 800x600 for optimal browsing experience!
        </div>
      </div>
    `;
    
    const loadingPopupId = `loading-${sponsor.name.replace(/\s+/g, '-').toLowerCase()}`;
    showPopup(loadingPopupId, `Loading ${sponsor.name}...`, loadingContent);
    
    // Simulate loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      if (!popupRefs.current[loadingPopupId]) {
        clearInterval(progressInterval);
        return;
      }
      
      progress += Math.random() * 15;
      const loadingBar = popupRefs.current[loadingPopupId]?.querySelector('#loadingBar') as HTMLElement;
      const loadingText = popupRefs.current[loadingPopupId]?.querySelector('#loadingText') as HTMLElement;
      
      if (loadingBar) {
        loadingBar.style.width = `${Math.min(progress, 100)}%`;
      }
      
      if (loadingText) {
        if (progress < 30) {
          loadingText.textContent = "Negotiating connection...";
        } else if (progress < 60) {
          loadingText.textContent = "Downloading sponsor data...";
        } else if (progress < 90) {
          loadingText.textContent = "Rendering promotional content...";
        } else {
          loadingText.textContent = "Almost there...";
        }
      }
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Close loading popup and show sponsor details
        setTimeout(() => {
          closePopup(loadingPopupId, new Event('loaded') as unknown as React.MouseEvent);
          
          // Show sponsor details
          const sponsorContent = `
            <div style="text-align: center; font-family: 'Comic Sans MS', cursive;">
              <div style="background: linear-gradient(to right, black, ${sponsor.primaryColor}, black); color: white; padding: 10px; margin-bottom: 20px;">
                <h2 style="margin: 0; text-shadow: 2px 2px 4px #000000; font-size: 24px;">${sponsor.name}</h2>
              </div>
              
              <div style="margin: 15px 0; border: 3px double #808080; padding: 10px; background-color: #000000; color: ${sponsor.primaryColor};">
                <span style="font-size: 18px; font-weight: bold; font-style: italic;">"${sponsor.slogan}"</span>
              </div>
              
              <p style="margin: 15px 0; text-align: left; font-size: 14px; line-height: 1.5;">
                ${sponsor.description}
              </p>
              
              <div style="margin: 20px 0; text-align: center;">
                <button style="background: ${sponsor.primaryColor}; color: white; border: 3px outset #c0c0c0; padding: 8px 15px; font-weight: bold; cursor: pointer;">
                  VISIT WEBSITE
                </button>
              </div>
              
              <div style="margin-top: 20px; border-top: 1px solid #808080; padding-top: 10px; color: #808080; font-size: 11px;">
                This sponsor ad brought to you by Hackathon '99
                <br>
                Download time: ${Math.floor(Math.random() * 60) + 20} seconds on 56k
              </div>
            </div>
          `;
          
          showPopup(`sponsor-${sponsor.name.replace(/\s+/g, '-').toLowerCase()}`, sponsor.name, sponsorContent);
        }, 500);
      }
    }, 100);
  };

  // Add state for the hack mini-game
  const [showHackGame, setShowHackGame] = useState(false);
  const [hackCommandInput, setHackCommandInput] = useState('');
  const [hackOutput, setHackOutput] = useState<string[]>([
    'WELCOME TO H4X0R TERMINAL v1.0',
    'Type "help" to begin...'
  ]);
  const [hackProgress, setHackProgress] = useState(0);
  const hackInputRef = useRef<HTMLInputElement>(null);

  // Easter egg hack progress milestones
  const hackMilestones = [
    { command: 'help', response: [
      '============================',
      'AVAILABLE COMMANDS:',
      '- scan : Scan the system for vulnerabilities',
      '- exploit : Attempt to exploit a vulnerability',
      '- bypass : Bypass security systems',
      '- decrypt : Decrypt protected files',
      '- access : Gain access to the mainframe',
      '- help : Display this help message',
      '============================'
    ]},
    { command: 'scan', response: [
      'SCANNING SYSTEM FOR VULNERABILITIES...',
      '[■■■■■□□□□□] 50%',
      '[■■■■■■■■■■] 100%',
      'SCAN COMPLETE!',
      'FOUND: 3 VULNERABILITIES',
      '- PORT 21: FTP SERVER (WEAK PASSWORD)',
      '- PORT 80: WEB SERVER (SQL INJECTION)',
      '- PORT 443: SSL (HEARTBLEED)',
      'Try "exploit" command to proceed...'
    ]},
    { command: 'exploit', response: [
      'EXPLOITING VULNERABILITIES...',
      'ATTEMPTING SQL INJECTION...',
      'SUCCESS! SQL INJECTION EXPLOITED!',
      'PARTIAL ACCESS GRANTED TO DATABASE...',
      'FOUND USER TABLE WITH ADMIN CREDENTIALS (ENCRYPTED)',
      'Try "decrypt" command to proceed...'
    ]},
    { command: 'decrypt', response: [
      'DECRYPTING ADMIN CREDENTIALS...',
      '[■□□□□□□□□□] 10%',
      '[■■■■■□□□□□] 50%',
      '[■■■■■■■■□□] 80%',
      '[■■■■■■■■■■] 100%',
      'DECRYPTION COMPLETE!',
      'USERNAME: admin',
      'PASSWORD: ********',
      'SECURITY SYSTEM STILL ACTIVE!',
      'Try "bypass" command to proceed...'
    ]},
    { command: 'bypass', response: [
      'BYPASSING SECURITY SYSTEMS...',
      'DISABLING FIREWALL...',
      'BYPASSING INTRUSION DETECTION...',
      'SPOOFING IP ADDRESS...',
      'SUCCESS! SECURITY SYSTEMS BYPASSED!',
      'MAINFRAME ACCESS AVAILABLE!',
      'Try "access" command to proceed...'
    ]},
    { command: 'access', response: [
      'ACCESSING MAINFRAME...',
      'ESTABLISHING SECURE CONNECTION...',
      'AUTHENTICATING AS ADMIN...',
      '[■■■■■■■■■■] 100%',
      'SUCCESS! MAINFRAME ACCESS GRANTED!',
      'YOU HAVE SUCCESSFULLY HACKED THE SYSTEM!',
      '============================',
      'HACKATHON EASTER EGG UNLOCKED!',
      '============================'
    ]}
  ];

  // Function to handle the hack mini-game commands
  const handleHackCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset focus to input
    if (hackInputRef.current) {
      hackInputRef.current.focus();
    }
    
    if (!hackCommandInput.trim()) return;
    
    // Add command to output
    const newOutput = [...hackOutput, `> ${hackCommandInput}`];
    
    // Check if the command matches the expected next milestone
    const currentMilestone = hackMilestones[hackProgress];
    
    if (hackCommandInput.toLowerCase() === currentMilestone.command) {
      // Add the milestone response
      currentMilestone.response.forEach(line => {
        newOutput.push(line);
      });
      
      // Update progress
      const newProgress = hackProgress + 1;
      setHackProgress(newProgress);
      
      // Check if game is complete
      if (newProgress >= hackMilestones.length) {
        // Play success sound
        try {
          const audio = new Audio('/sounds/success.mp3');
          audio.volume = 0.3;
          audio.play().catch(err => console.log('Audio play failed:', err));
        } catch (error) {
          console.log('Sound playback error:', error);
        }
        
        // Show winning popup after a short delay
        setTimeout(() => {
          const winContent = `
            <div style="text-align: center;">
              <h2 style="color: #00ff00; margin-bottom: 20px;">YOU WIN THE HACKATHON!</h2>
              
              <div style="font-family: monospace; color: #00ff00; margin-bottom: 20px; font-size: 12px; line-height: 1.2;">
                o   \\ o /  _ o        __|    \\ /     |__         o _  \\ o /   o
                /|\\    |     /\\   __\\o   \\o    |    o/     o/__   /\\     |    /|\\
                / \\   / \\   | \\  /) |    ( \\  /o\\  / )    |   (\\  / |   / \\   / \\
              </div>
              
              <div style="font-size: 24px; margin: 20px 0;">
                🏆 CONGRATULATIONS! 🏆
              </div>
              
              <p style="margin-bottom: 15px;">
                You have unlocked the secret Easter Egg!<br>
                10,000 bonus points added to your hackathon score!
              </p>
              
              <div style="background-color: #000; border: 2px solid #00ff00; padding: 10px; margin: 15px 0;">
                <code style="color: #00ff00;">EASTER_EGG_ID = "h4ck3r_m1ndz"</code>
              </div>
              
              <p style="color: #ff00ff; font-style: italic; margin-top: 20px;">
                Remember: The real hackers were the friends we made along the way!
              </p>
            </div>
          `;
          
          showPopup('hack-win', 'SYSTEM HACKED!', winContent);
          onEggCollect('dotcom-hacker');
        }, 1000);
      }
    } else {
      // Invalid command
      newOutput.push(`ERROR: Unknown command or incorrect sequence! Try again or type "help"`);
      
      // Play error sound
      try {
        const audio = new Audio('/sounds/error.mp3');
        audio.volume = 0.2;
        audio.play().catch(err => console.log('Audio play failed:', err));
      } catch (error) {
        console.log('Sound playback error:', error);
      }
    }
    
    setHackOutput(newOutput);
    setHackCommandInput('');
  };

  // Function to start the hacking game
  const startHackGame = () => {
    setShowHackGame(true);
    setHackOutput([
      'WELCOME TO H4X0R TERMINAL v1.0',
      'Type "help" to begin...'
    ]);
    setHackProgress(0);
    setHackCommandInput('');
    
    // Try to play hacking sound
    try {
      const audio = new Audio('/sounds/typing.mp3');
      audio.volume = 0.2;
      audio.play().catch(err => console.log('Audio play failed:', err));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
    
    // Focus the input after a short delay
    setTimeout(() => {
      if (hackInputRef.current) {
        hackInputRef.current.focus();
      }
    }, 100);
  };

  // Function to close the hacking game
  const closeHackGame = () => {
    setShowHackGame(false);
  };

  useEffect(() => {
    if (!isActive) return;
    
    // Add custom CSS for animations and effects
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes sponsor-glitch {
        0%, 100% { transform: translate(0, 0); filter: none; }
        2% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
        4% { transform: translate(3px, -2px); filter: hue-rotate(180deg); }
        6% { transform: translate(-5px, -2px); filter: hue-rotate(270deg); }
        8% { transform: translate(5px, 2px); filter: hue-rotate(360deg); }
        10% { transform: translate(-3px, -2px); filter: hue-rotate(90deg); }
        12% { transform: translate(3px, 2px); filter: hue-rotate(0deg); }
      }
      
      .sponsor-glitch {
        animation: sponsor-glitch 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .guestbook-typecursor::after {
        content: '|';
        animation: blink 1s step-end infinite;
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      
      /* Custom scrollbar for sponsor section */
      .custom-scrollbar::-webkit-scrollbar {
        width: 14px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #000000;
        border: 1px solid #444444;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #ff00ff, #00ffff);
        border: 2px solid #000000;
        border-radius: 0;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #ff00ff, #ffff00, #00ffff);
      }
      .custom-scrollbar::-webkit-scrollbar-button {
        background-color: #808080;
        height: 15px;
        border: 1px outset #c0c0c0;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-button:vertical:start {
        background-image: linear-gradient(45deg, transparent 30%, #000 30%, #000 70%, transparent 70%);
      }
      .custom-scrollbar::-webkit-scrollbar-button:vertical:end {
        background-image: linear-gradient(225deg, transparent 30%, #000 30%, #000 70%, transparent 70%);
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [isActive]);

  // Add the following to the end of your useEffect that adds custom CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes spin-reverse {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.05); }
      }

      @keyframes wobble {
        0% { transform: rotate(-3deg); }
        100% { transform: rotate(3deg); }
      }

      @keyframes rotate3d {
        0% { transform: perspective(800px) rotateY(0deg); }
        50% { transform: perspective(800px) rotateY(15deg); }
        100% { transform: perspective(800px) rotateY(0deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="dotcom-era min-h-screen text-white font-['Comic_Sans_MS'] relative"
      style={getCurrentTheme().style}
      onMouseMove={handleMouseMove}
    >
      {/* Add a colorful tiled border at the top */}
      <div className="w-full text-center py-4 border-b-8 shadow-lg" 
        style={{
          borderImage: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet) 1",
          background: "linear-gradient(to right, #ff00ff, #00ffff)"
        }}>
        <div className="text-3xl font-bold animate-pulse text-yellow-300" 
          style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.8)" }}>
          Welcome to The Web's Best Hackathon!
        </div>
      </div>

      {/* NEW: Main Call-to-Action Button - SIGN UP NOW!!! */}
      <div className="w-full flex justify-center -mt-4 mb-4">
        <button 
          className="px-8 py-3 transform rotate-[-2deg] text-3xl font-extrabold text-white rounded-lg z-10 relative animate-pulse border-4 border-double border-white shadow-xl hover:animate-none hover:scale-110 transition-all duration-300"
          style={{
            background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
            textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
            boxShadow: "0 0 20px rgba(255,255,255,0.8)"
          }}
          onClick={() => {
            // Play 90s sound effect
            try {
              const audio = new Audio('/sounds/click.mp3');
              audio.volume = 0.3;
              audio.play().catch(err => console.log('Audio play failed:', err));
            } catch (error) {
              console.log('Sound playback error:', error);
            }
            
            // Show a special signup popup
            showPopup(
              'sign-up', 
              'SIGN UP NOW!!!', 
              `
                <div style="text-align: center; font-family: 'Comic Sans MS', cursive; color: #ff00ff;">
                  <h2 style="font-size: 24px; margin-bottom: 15px; text-shadow: 2px 2px 2px #00ffff;">
                    Join the MEGA-AWESOME Hackathon!
                  </h2>
                  
                  <div style="border: 3px double #00ff00; padding: 10px; background-color: #000000; margin-bottom: 15px;">
                    <span style="color: #00ff00; font-size: 18px; font-weight: bold;">
                      Only 2 DAYS LEFT to register!!!
                    </span>
                  </div>
                  
                  <form style="margin-bottom: 15px;">
                    <div style="margin-bottom: 8px;">
                      <input type="text" placeholder="Your Name" style="width: 100%; padding: 5px; border: 2px solid #ff00ff;">
                    </div>
                    <div style="margin-bottom: 8px;">
                      <input type="email" placeholder="Your Email" style="width: 100%; padding: 5px; border: 2px solid #ff00ff;">
                    </div>
                    <div>
                      <button type="button" style="width: 100%; background: linear-gradient(to right, #ff00ff, #00ffff); color: white; font-weight: bold; padding: 8px; border: none; cursor: pointer;">
                        SUBMIT REGISTRATION!!!
                      </button>
                    </div>
                  </form>
                  
                  <p style="color: #ffff00; font-size: 12px;">
                    Already over 9,000,000 hackers registered!<br>
                    Don't miss out on the FUN!!
                  </p>
                </div>
              `
            );
          }}
        >
          🔥 SIGN UP NOW!!! 🔥
        </button>
      </div>

      {/* Theme Picker Button - Make more obvious with blinking animation */}
      <button 
        className="absolute top-24 right-4 z-40 bg-[#c0c0c0] border-4 border-[#ff00ff] px-3 py-2 text-black font-bold animate-pulse hover:bg-[#d0d0d0]"
        onClick={toggleThemePicker}
      >
        🎨 CHANGE THEME! 🎨
      </button>

      {/* Theme Picker Menu - Enhanced with more 90s flair */}
      {showThemePicker && (
        <div className="absolute top-40 right-4 z-40 bg-[#c0c0c0] border-2 border-[#808080] p-4 w-80">
          <div className="bg-[#000080] text-white p-2 mb-2 flex justify-between items-center">
            <span className="font-bold">✨ Personal Home Page Themes! ✨</span>
            <button
              onClick={toggleThemePicker}
              className="text-white hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {backgroundThemes.map((theme) => (
              <button 
                key={theme.id}
                className={`w-full text-left px-2 py-1 ${backgroundTheme === theme.id ? 'bg-[#000080] text-white font-bold' : 'bg-[#d0d0d0] text-black'}`}
                onClick={() => {
                  setBackgroundTheme(theme.id);
                  if (theme.id === 'rainbowWaves' || theme.id === 'matrixRain') {
                    onEggCollect('special-theme');
                  }
                }}
              >
                {backgroundTheme === theme.id ? '➡️ ' : ''}{theme.name}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center text-xs">
            <p className="text-[#800080]">Made with MS FrontPage 98</p>
            <p className="text-[#ff0000] font-bold mt-1">Best viewed in Netscape 4.7</p>
          </div>
        </div>
      )}

      {/* Cursor Trail */}
      <div className="fixed inset-0 pointer-events-none">
        {cursorTrail.map((pos, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#00ff00] rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              opacity: 1 - (i / cursorTrail.length)
            }}
          />
        ))}
      </div>

      {/* Marquee Banner - Enhanced with trailing glow and clickable sections */}
      <div className="bg-black text-[#00ff00] py-3 overflow-hidden relative" style={{ boxShadow: "0 0 15px #00ff00" }}>
        <div className="smooth-marquee text-xl font-bold">
          <div className="flex items-center">
            <span 
              className="mx-4 cursor-pointer text-glow"
              onClick={() => showPrizeDetails('grand-prize')}
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('prize-sparkle');
                e.currentTarget.style.animation = 'prize-shake 0.5s ease-in-out infinite';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('prize-sparkle');
                e.currentTarget.style.animation = '';
              }}
            >
              🏆 GRAND PRIZE: $1,000,000
            </span>
            <span className="mx-2">—</span>
            <span 
              className="mx-4 cursor-pointer text-glow"
              onClick={() => showPrizeDetails('second-prize')}
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('prize-sparkle');
                e.currentTarget.style.animation = 'prize-shake 0.5s ease-in-out infinite';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('prize-sparkle');
                e.currentTarget.style.animation = '';
              }}
            >
              🥈 2nd Place: $500,000
            </span>
            <span className="mx-2">—</span>
            <span 
              className="mx-4 cursor-pointer text-glow"
              onClick={() => showPrizeDetails('innovation-prize')}
              onMouseEnter={(e) => {
                e.currentTarget.classList.add('prize-sparkle');
                e.currentTarget.style.animation = 'prize-shake 0.5s ease-in-out infinite';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove('prize-sparkle');
                e.currentTarget.style.animation = '';
              }}
            >
              💡 Innovation Award: $100,000
            </span>
            <span className="mx-2">—</span>
            <span className="mx-4">🔥 CLICK PRIZES FOR DETAILS!</span>
          </div>
        </div>
        
        {/* Background glow effect */}
        <div className="absolute inset-0 pointer-events-none" style={{ 
          background: "linear-gradient(90deg, rgba(0,255,0,0) 0%, rgba(0,255,0,0.1) 50%, rgba(0,255,0,0) 100%)",
          animation: "smooth-marquee 20s linear infinite",
          opacity: 0.5
        }}></div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Guestbook */}
          <div className="bg-[#000080] p-4 rounded-lg border-4 border-[#00ff00] shadow-lg">
            {/* Guestbook Title */}
            <h2 className="text-2xl font-bold text-[#ffff00] mb-4 text-center overflow-hidden">
              <div className="animate-marquee">
                <div className="whitespace-nowrap">📝 HACKATHON GUESTBOOK 📝</div>
              </div>
            </h2>
            
            <form onSubmit={handleGuestbookSubmit} className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                value={newEntry.name}
                onChange={e => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mb-2 p-2 bg-black text-white border-2 border-[#00ff00] rounded"
                disabled={isSubmittingEntry}
              />
              <textarea
                placeholder="Your Message"
                value={newEntry.message}
                onChange={e => setNewEntry(prev => ({ ...prev, message: e.target.value }))}
                className="w-full mb-2 p-2 bg-black text-white border-2 border-[#00ff00] rounded"
                rows={3}
                disabled={isSubmittingEntry}
              />
              {isSubmittingEntry ? (
                <div className="w-full bg-black text-[#00ff00] font-mono p-2 text-center border-2 border-[#00ffff] rounded overflow-hidden">
                  <div className="animate-pulse">
                    {processingText}
                    <span className="guestbook-typecursor"></span>
                  </div>
                  <div className="mt-2 text-[#ffff00] text-xs">
                    PLEASE STAND BY...
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00ffff] text-white font-bold py-2 px-4 rounded hover:animate-pulse"
                >
                  Sign Guestbook!
                </button>
              )}
            </form>

            <div 
              ref={guestbookRef}
              className="h-[400px] overflow-y-auto border-2 border-[#00ff00] p-2 bg-black guestbook-container"
            >
              {guestbookEntries.length === 0 ? (
                <div className="text-center p-4 text-[#00ffff]">
                  <p className="mb-2">🔥 BE THE FIRST TO SIGN OUR GUESTBOOK! 🔥</p>
                  <p className="text-[#ff00ff] animate-blink">━━━━━━━━━━━━━━━━━━━━━━━━</p>
                </div>
              ) : (
                guestbookEntries.map((entry, i) => (
                  <div 
                    key={i} 
                    className={`mb-4 p-2 border-b border-[#00ff00] cursor-pointer hover:bg-[#000055] ${i === 0 ? 'animate-slide-in' : ''}`}
                    onClick={playMessageSound}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.icon}</span>
                      <span className={`font-bold ${i < 3 ? 'animate-blink text-[#ff00ff]' : 'text-[#00ffff]'}`}>
                        {entry.name}
                      </span>
                      <span className="text-sm text-gray-400">{entry.timestamp}</span>
                    </div>
                    <p className="mt-1 text-[#00ff00]">{entry.message}</p>
                    {i === 0 && (
                      <div className="mt-2 text-xs text-[#ff00ff]">
                        &gt;&gt;&gt; NEW ENTRY! &lt;&lt;&lt;
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Middle Column - Main Info */}
          <div className="space-y-8">
            {/* Judges Section - Enhanced to look like a Web 1.0 Staff Page */}
            <div className="bg-[#800080] p-4 rounded-lg border-4 border-[#ff00ff] shadow-lg">
              {/* Judges Title */}
              <h2 className="text-2xl font-bold text-[#ffff00] mb-4 text-center overflow-hidden">
                <div className="animate-marquee">
                  <div className="whitespace-nowrap">👨‍⚖️ MEET OUR ELITE JUDGES 👨‍⚖️</div>
                </div>
              </h2>
              
              <div className="bg-[#000000] p-2 text-center mb-4 border-2 border-dashed border-[#ffff00]">
                <span className="text-[#00ff00] font-bold animate-blink">
                  ☆☆☆ CLICK PHOTOS FOR JUDGE HOMEPAGE ☆☆☆
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {judgeProfiles.map((judge, i) => (
                  <div
                    key={i}
                    className="bg-white p-2 rounded text-center relative cursor-pointer hover:shadow-lg border border-[#000080]"
                    style={{
                      backgroundImage: "url('/images/backgrounds/stars.gif')",
                      backgroundSize: "cover"
                    }}
                    onClick={() => showJudgeProfile(judge)}
                  >
                    {/* Fake "Under Construction" corner banner */}
                    {i === 0 && (
                      <div className="absolute -top-2 -right-2 rotate-12 bg-[#ffff00] text-[#ff0000] text-xs p-1 font-bold border border-black z-10">
                        NEW!
                      </div>
                    )}
                    
                    {/* Low-res "JPEG" image with compression artifacts */}
                    <div 
                      className="w-20 h-20 mx-auto mb-2 bg-[#d0d0d0] border-4 border-double border-[#808080] relative hover:border-[#ff00ff]"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
                        backgroundSize: '6px 6px',
                        backgroundPosition: '0 0, 3px 3px',
                        imageRendering: 'pixelated'
                      }}
                    >
                      {/* Centered initial */}
                      <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#000080]">
                        {judge.name.charAt(0)}
                      </div>
                      
                      {/* JPEG indicator */}
                      <div className="absolute bottom-0 right-0 text-[8px] text-[#ff0000] bg-white px-1">
                        JPG
                      </div>
                      
                      {/* Fake compression artifacts */}
                      <div className="absolute inset-0" style={{ 
                        backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,0,0,0.05), rgba(0,255,0,0.05) 2px, rgba(0,0,255,0.05) 2px, transparent 4px)',
                        mixBlendMode: 'difference'
                      }}></div>
                    </div>
                    
                    <h3 
                      className="text-base font-bold mb-1 bg-[#000080] text-[#ffff00] px-2 py-1 mx-auto inline-block cursor-pointer"
                      onMouseEnter={playHoverSound}
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeJudgeTitle(judge.name, judge.alternateTitles);
                      }}
                    >
                      {judge.name}
                    </h3>
                    
                    <p className="text-sm text-[#ff00ff] font-bold mb-1">
                      {judgeRoles[judge.name] || judge.role}
                    </p>
                    
                    <p className="text-xs text-black italic bg-[#ffff99] p-1 border border-[#666600]">
                      &quot;{judge.funFact}&quot;
                    </p>
                    
                    <div className="mt-2 text-[10px] text-[#0000ff] underline">
                      <span className="blink">CLICK FOR BIO!</span>
                    </div>
                    
                    {/* Hit counter */}
                    <div className="mt-2 text-[10px] text-black flex items-center justify-center">
                      <span>Hits:</span>
                      <div className="flex ml-1 bg-black text-[#00ff00] px-1 font-mono">
                        {Array.from(String(Math.floor(1000 + Math.random() * 9000))).map((digit, j) => (
                          <span key={j}>{digit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center overflow-hidden">
                {/* Judges Message */}
                <div className="text-center">
                  <div className="animate-marquee overflow-hidden">
                    <div className="whitespace-nowrap text-[#00ffff]">
                      JUDGES WILL EVALUATE YOUR HACKS ON TECHNICAL DIFFICULTY, CREATIVITY, AND USEFULNESS! GOOD LUCK!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hot Deals - Moved from right column */}
            <div className="bg-black p-4 rounded-lg border-4 border-[#ff0000] shadow-lg">
              {/* Hot Deals Title */}
              <h2 className="text-2xl font-bold text-[#ffff00] mb-4 text-center overflow-hidden">
                <div className="animate-marquee">
                  <div className="whitespace-nowrap">🔥 HOT DEALS 🔥</div>
                </div>
              </h2>
              
              <div className="space-y-4">
                <div
                  className="bg-gradient-to-r from-[#ff0000] to-[#00ff00] p-4 rounded cursor-pointer hover:animate-pulse"
                  onClick={() => showPopup('prizes', 'Prizes', 'Check out our amazing prizes!')}
                >
                  {/* Prize Announcement */}
                  <div className="animate-marquee overflow-hidden">
                    <div className="whitespace-nowrap text-xl font-bold">
                      WIN BIG $$$ – CLICK HERE
                    </div>
                  </div>
                </div>
                
                <div
                  className="bg-gradient-to-r from-[#00ff00] to-[#0000ff] p-4 rounded cursor-pointer hover:animate-pulse"
                  onClick={() => showPopup('sponsors', 'Sponsors', 'Meet our amazing sponsors!')}
                >
                  {/* Hackathon Alert */}
                  <div className="animate-marquee overflow-hidden">
                    <div className="whitespace-nowrap text-xl font-bold">
                      🚨 HACKATHON ALERT: TOP PRIZE INSIDE 🚨
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sponsors & Easter Eggs */}
          <div className="space-y-8">
            {/* Under Construction Banner with 3D Rotation */}
            <div className="relative bg-black/80 p-6 rounded-lg border-4 border-[#ff0000] shadow-lg overflow-hidden text-center">
              {/* Under Construction Banner */}
              <div className="animate-marquee overflow-hidden">
                <div className="whitespace-nowrap">
                  🚧 UNDER CONSTRUCTION 🚧 SPONSOR SECTION 🚧 UNDER CONSTRUCTION 🚧
                </div>
              </div>
            
              {/* Sponsors Title */}
              <h2 className="text-2xl font-bold text-[#ffff00] mb-6 text-center overflow-hidden">
                <div className="animate-marquee">
                  <div className="whitespace-nowrap">💰 OUR AMAZING SPONSORS 💰</div>
                </div>
              </h2>
              
              {/* Sponsor Wall - now in a scrollable container with more spacing */}
              <div className="max-h-[380px] overflow-y-auto pr-2 mb-4 custom-scrollbar">
                <div className="grid grid-cols-1 gap-8 px-2">
                  {sponsors.map((sponsor, i) => (
                    <div
                      key={i}
                      className="sponsor-ad cursor-pointer relative overflow-hidden border-2 h-40 opacity-90 hover:opacity-100 transition-all duration-200 hover:shadow-[0_0_10px_2px] hover:shadow-[#ffffff50]"
                      style={{ 
                        borderColor: sponsor.primaryColor,
                        background: `repeating-linear-gradient(45deg, black, black 10px, ${sponsor.primaryColor}11 10px, ${sponsor.primaryColor}11 20px)`
                      }}
                      onClick={() => showSponsorDetails(sponsor)}
                      onMouseEnter={(e) => {
                        // Add glitch effect on hover
                        e.currentTarget.classList.add('sponsor-glitch');
                        // Try to play dial-up sound
                        try {
                          const audio = new Audio('/sounds/modem.mp3');
                          audio.volume = 0.1;
                          audio.play().catch(err => console.log('Audio play failed:', err));
                        } catch (error) {
                          console.log('Sound playback error:', error);
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('sponsor-glitch');
                      }}
                    >
                      {/* Apply static/TV effect overlay - reduced opacity further */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==")',
                          backgroundRepeat: 'repeat',
                          mixBlendMode: 'multiply'
                        }}
                      ></div>
                      
                      {/* Logo/Name - reduced contrast */}
                      <div className="h-16 flex items-center justify-center" 
                        style={{ 
                          background: `linear-gradient(to right, black, ${sponsor.primaryColor}88, black)`,
                          color: 'white',
                          textShadow: '1px 1px 2px black'
                        }}
                      >
                        <span className="text-center font-bold text-lg px-2 animate-pulse">{sponsor.name}</span>
                      </div>
                      
                      {/* Slogan with flashing animation - increased padding */}
                      <div className="p-4 bg-black/80 text-center h-24 flex flex-col justify-between">
                        <div 
                          className="animate-blink text-sm" 
                          style={{ color: `${sponsor.primaryColor}dd` }}
                        >
                          {sponsor.slogan}
                        </div>
                        
                        {/* Fake CTA Button */}
                        <div className="mt-2 mx-auto bg-white text-black border-2 border-gray-500 text-xs font-bold p-1 w-3/4 text-center hover:bg-gray-200">
                          CLICK HERE!
                        </div>
                      </div>
                      
                      {/* Best Viewed In - moved to right corner with better contrast */}
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1">
                        Best viewed in 
                        {Math.random() > 0.5 ? 
                          <span className="text-blue-400"> Netscape</span> : 
                          <span className="text-yellow-400"> IE 4.0</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Animated separator */}
              <div className="my-6 h-4 relative overflow-hidden">
                <div className="absolute inset-0 animate-marquee" style={{
                  background: "repeating-linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet, red)",
                  backgroundSize: "200% 100%"
                }}></div>
              </div>
              
              {/* Fake GIF Download Time */}
              <div className="mt-6 text-center text-[#c0c0c0] text-xs space-y-2">
                <div>GIF ads optimized for 14.4k modems - Est. load time: 3:47</div>
                <div className="text-[#00ff00]">⟨⟨ AD SPACE AVAILABLE - YOUR BANNER HERE! ⟩⟩</div>
                <div className="text-[#ff00ff] text-[10px]">Copyright © 1998 Hackathon Web Ring</div>
                
                {/* Hidden Easter Egg - Broken Image */}
                <div className="relative flex justify-center mt-4 opacity-60 hover:opacity-100">
                  <div 
                    className="cursor-pointer bg-[#f0f0f0] border border-[#808080] inline-flex flex-col items-center p-1 w-32 text-[8px]"
                    onClick={startHackGame}
                  >
                    <div className="w-full h-16 bg-[#e0e0e0] border border-[#a0a0a0] flex items-center justify-center">
                      <div className="text-[#ff0000]">❌</div>
                    </div>
                    <div className="mt-1 text-[#0000ff] underline">image.gif</div>
                    <div>12KB - Broken</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Easter Egg Trigger */}
            <div
              className="w-48 h-48 mx-auto cursor-pointer relative group"
              onClick={startQuiz}
              style={{
                transform: "rotate(0deg)",
                animation: "rotate3d 8s linear infinite"
              }}
            >
              {/* Outer spinning ring */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "conic-gradient(from 0deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)",
                animation: "spin 4s linear infinite",
                transform: "rotate(0deg)",
                zIndex: 1
              }}></div>
              
              {/* Inner spinning ring - opposite direction */}
              <div className="absolute inset-[8px] rounded-full" style={{
                background: "conic-gradient(from 0deg, #ff0000, #9400d3, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)",
                animation: "spin-reverse 3s linear infinite",
                zIndex: 2
              }}></div>
              
              {/* Button content */}
              <div className="absolute inset-[16px] rounded-full bg-gradient-to-br from-[#00ffff] to-[#ff00ff] flex flex-col items-center justify-center transform transition-all shadow-[0_0_15px_rgba(255,255,255,0.8)] hover:shadow-[0_0_25px_rgba(255,255,255,1)]" style={{
                animation: "pulse 1.5s infinite alternate",
                zIndex: 3
              }}>
                <div className="text-center relative">
                  {/* Flames around the CD */}
                  <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
                    🔥🔥🔥
                  </div>
                  
                  {/* CD icon with wobble effect */}
                  <div className="text-5xl animate-[spin_4s_linear_infinite] mb-2 transform hover:scale-110 transition-transform"
                    style={{
                      filter: "drop-shadow(0 0 5px white)",
                      animation: "wobble 0.5s ease-in-out infinite alternate"
                    }}>
                    💿
                  </div>
                  
                  {/* Text with blinking effect */}
                  <div className="text-lg font-extrabold text-white animate-pulse px-2 py-1 rounded" style={{
                    textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                    letterSpacing: "1px",
                    background: "linear-gradient(90deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))"
                  }}>
                    WHICH<br/>HACKER<br/>ARE YOU?
                  </div>
                  
                  {/* Stars around the text */}
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
                    ✨✨✨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Windows */}
      {popups.map(popup => (
        <div
          key={popup.id}
          ref={(el: HTMLDivElement | null) => {
            popupRefs.current[popup.id] = el;
          }}
          className="absolute bg-[#c0c0c0] border-2 border-[#808080] rounded shadow-lg p-4 w-80"
          style={{ 
            left: `${popup.position.x}px`, 
            top: `${popup.position.y}px`,
            zIndex: draggedPopup === popup.id ? 1010 : 1000,
            cursor: draggedPopup === popup.id ? 'grabbing' : 'auto'
          }}
        >
          <div 
            className="bg-[#000080] text-white p-2 mb-2 flex justify-between items-center cursor-move"
            onMouseDown={(e) => startDrag(popup.id, e)}
          >
            <span className="font-bold select-none">{popup.title}</span>
            <button
              onClick={(e) => closePopup(popup.id, e)}
              className="text-white hover:text-red-500 px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="bg-white text-black p-2" dangerouslySetInnerHTML={{ __html: popup.content }}>
          </div>
        </div>
      ))}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#c0c0c0] p-8 rounded-lg border-4 border-[#808080] max-w-lg w-full">
            {!quizResult ? (
              <>
                <h2 className="text-2xl font-bold text-[#000080] mb-4">
                  Which 90s Hacker Are You?
                </h2>
                <p className="mb-4">{quizQuestions[quizStep].question}</p>
                <div className="space-y-2">
                  {quizQuestions[quizStep].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full bg-[#000080] text-white p-2 rounded hover:bg-[#0000ff]"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#000080] mb-4">
                  🖥️ YOU ARE: {quizResult}
                </h2>
                <p className="mb-4">You miss Winamp and call people 'd00d'.</p>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="bg-[#000080] text-white px-4 py-2 rounded hover:bg-[#0000ff]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MIDI Player Toggle - Changed from fixed to absolute positioning */}
      <button
        className="absolute bottom-16 right-4 bg-[#000080] text-white p-2 rounded-full hover:bg-[#0000ff]"
        onClick={() => setShowMidiPlayer(!showMidiPlayer)}
      >
        🎵
      </button>

      {/* MIDI Player - Changed from fixed to absolute positioning */}
      {showMidiPlayer && (
        <div className="absolute bottom-28 right-4 bg-[#c0c0c0] p-4 rounded-lg border-2 border-[#808080]">
          {/* Now Playing Text */}
          <div className="bg-[#000080] text-white p-2 mb-2 overflow-hidden">
            <div className="animate-marquee">
              <div className="whitespace-nowrap">🎵 Now Playing: Hackathon Theme 1999 🎵</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#000080] text-white px-4 py-2 rounded hover:bg-[#0000ff]">
              ⏮️
            </button>
            <button className="bg-[#000080] text-white px-4 py-2 rounded hover:bg-[#0000ff]">
              ⏯️
            </button>
            <button className="bg-[#000080] text-white px-4 py-2 rounded hover:bg-[#0000ff]">
              ⏭️
            </button>
          </div>
        </div>
      )}

      {/* Under Construction Banner */}
      <div className="absolute bottom-0 left-0 w-full bg-black py-2">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <div className="text-yellow-300 font-bold animate-pulse">UNDER CONSTRUCTION</div>
          <div className="h-8 w-8 bg-yellow-400 flex items-center justify-center rounded-full">
            <div className="h-6 w-6 bg-black rounded-full flex items-center justify-center">
              <div className="text-yellow-400 text-xs">!</div>
            </div>
          </div>
          <div className="text-yellow-300 font-bold animate-pulse">UNDER CONSTRUCTION</div>
        </div>
      </div>

      {/* Clippy-Style Helper - "Hacky the CRT Monitor" */}
      {showHelper && (
        <div 
          className="absolute bg-[#000000] border-4 border-[#00ff00] rounded-lg p-4 shadow-lg w-72 z-50"
          style={{ 
            left: `${helperPosition.x}px`, 
            top: `${helperPosition.y}px`,
            cursor: 'move'
          }}
          onMouseDown={(e) => {
            // Only do dragging if not clicking on the close button
            if (!(e.target as HTMLElement).closest('button')) {
              window.addEventListener('mousemove', dragHelper);
              
              const handleMouseUp = () => {
                window.removeEventListener('mousemove', dragHelper);
                window.removeEventListener('mouseup', handleMouseUp);
              };
              
              window.addEventListener('mouseup', handleMouseUp);
            }
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-16 h-16 bg-[#00ff00] rounded-full overflow-hidden border-2 border-[#00ffff] text-center flex flex-col justify-center">
              <div className="text-xs text-black font-mono">
                {"<(^_^)>"}<br/>
                {"/|__|"}<br/>
                {" |  | "}
              </div>
            </div>
            <div className="flex-grow">
              <div className="text-sm text-[#00ff00] font-mono mb-2">
                <span className="animate-blink">{">"}</span>
                <span className={`
                  ${helperTip.type === 'tip' ? 'text-[#00ffff]' : ''}
                  ${helperTip.type === 'joke' ? 'text-[#ffff00]' : ''}
                  ${helperTip.type === 'warning' ? 'text-[#ff0000]' : ''}
                `}>
                  <span className="text-[#00ff00]">HACKY:</span> {helperTip.text}
                </span>
              </div>
              <div className="flex justify-between">
                <button 
                  onClick={showRandomHelperTip} 
                  className="text-xs text-[#00ffff] hover:text-[#ffff00] bg-[#000044] px-2 py-1 rounded"
                >
                  More Tips
                </button>
                <button 
                  onClick={dismissHelper}
                  className="text-xs text-[#ff0000] hover:text-[#ff6666] bg-[#000044] px-2 py-1 rounded"
                >
                  Go Away
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add "Hacky" button in the corner to summon the helper */}
      <button 
        className="absolute top-24 left-4 z-40 bg-[#000000] border-4 border-[#00ff00] px-3 py-2 text-[#00ff00] font-bold hover:text-[#ffff00] animate-blink"
        onClick={showRandomHelperTip}
      >
        👾 Need Help?
      </button>

      {/* Hack This Page Mini-Game */}
      {showHackGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-black w-[600px] h-[400px] border-4 border-[#00ff00] p-4 font-mono text-sm relative">
            <div className="flex justify-between items-center mb-2 border-b border-[#00ff00] pb-1">
              <div className="text-[#00ff00] font-bold">H4X0R TERMINAL v1.0</div>
              <button 
                className="text-[#ff0000] hover:text-[#ff5555] text-xl"
                onClick={closeHackGame}
              >
                ×
              </button>
            </div>
            
            <div className="h-[300px] overflow-y-auto mb-2 p-2 bg-black text-[#00ff00]">
              {hackOutput.map((line, i) => (
                <div key={i} className="mb-1 font-mono">
                  {line.startsWith('> ') ? (
                    <span className="text-[#ffffff]">{line}</span>
                  ) : line.includes('ERROR') ? (
                    <span className="text-[#ff0000]">{line}</span>
                  ) : line.includes('SUCCESS') || line.includes('UNLOCKED') ? (
                    <span className="text-[#ffff00] font-bold">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleHackCommand} className="flex items-center">
              <span className="text-[#00ff00] mr-1">$</span>
              <input
                type="text"
                ref={hackInputRef}
                value={hackCommandInput}
                onChange={(e) => setHackCommandInput(e.target.value)}
                className="flex-grow bg-black text-[#00ff00] border-none outline-none font-mono focus:outline-none focus:ring-0"
                placeholder="Enter command..."
                autoFocus
              />
            </form>
            
            <div className="absolute bottom-2 right-2 text-[8px] text-[#555555]">
              Progress: {Math.round((hackProgress / hackMilestones.length) * 100)}% | Built with NetHack.js
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DotComEra; 