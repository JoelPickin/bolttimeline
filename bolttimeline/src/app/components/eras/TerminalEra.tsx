'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

interface UserInfo {
  name: string;
  email?: string;
}

const TerminalEra: React.FC<TerminalEraProps> = ({ onEggCollect, isActive }) => {
  const [commandInput, setCommandInput] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{type: 'command' | 'response', text: string}>>([
    { type: 'response', text: '=====================================' },
    { type: 'response', text: '  MAINFRAME TERMINAL v1.0 (c) 1975' },
    { type: 'response', text: '=====================================' },
    { type: 'response', text: 'ENTER YOUR NAME: ' },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  const [eggFound, setEggFound] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [registrationStep, setRegistrationStep] = useState<'name' | 'email' | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  
  const availableCommands = {
    help: 'Display available commands',
    about: 'About the hackathon',
    prizes: 'Show prize information',
    judges: 'List hackathon judges',
    register: 'Register for the hackathon',
    clear: 'Clear the terminal screen',
    ls: 'List files in current directory',
    cat: 'Display file contents (usage: cat <filename>)',
    date: 'Display current date',
    whoami: 'Display current user',
    man: 'Display manual for command (usage: man <command>)',
    music: 'Play some tunes',
    hack: 'Attempt to hack the mainframe',
    format: 'Format drive (just kidding)',
    sponsors: 'List hackathon sponsors'
  };

  const loginMessages = [
    'WELCOME, OPERATOR. READY TO EXECUTE COMMANDS.',
    'ACCESS GRANTED TO SECURE HACKATHON MAINFRAME.',
    'SYSTEM STATUS: OPERATIONAL. AWAITING COMMANDS.',
    'MAINFRAME LINK ESTABLISHED. PROCEED WITH CAUTION.'
  ];

  const judgeASCII = {
    'Dr. Dennis Ritchie': {
      ascii: `
    ------------------------------
      DR. DENNIS RITCHIE
      BELL LABS PIONEER
    ------------------------------
      ┌───────────────┐
      │   O      O    │
      │      ───      │
      │    \\_____/    │
      └───────────────┘
    ------------------------------`,
      description: 'Creator of the C programming language and co-developer of UNIX at Bell Labs.'
    },
    'Prof. Ada Lovelace': {
      ascii: `
    ------------------------------
      PROF. ADA LOVELACE
      FIRST PROGRAMMER
    ------------------------------
      ┌───────────────┐
      │   O      O    │
      │      ───      │
      │    \\_____/    │
      └───────────────┘
    ------------------------------`,
      description: 'First computer programmer, known for her work on Charles Babbage\'s Analytical Engine.'
    },
    'Dr. Grace Hopper': {
      ascii: `
    ------------------------------
      DR. GRACE HOPPER
      COBOL INVENTOR
    ------------------------------
      ┌───────────────┐
      │   O      O    │
      │      ───      │
      │    \\_____/    │
      └───────────────┘
    ------------------------------`,
      description: 'Pioneer of computer programming, developed the first compiler and COBOL language.'
    },
    'Steve Wozniak': {
      ascii: `
    ------------------------------
      STEVE WOZNIAK
      APPLE CO-FOUNDER
    ------------------------------
      ┌───────────────┐
      │   O      O    │
      │      ───      │
      │    \\_____/    │
      └───────────────┘
    ------------------------------`,
      description: 'Co-founder of Apple Computer, designed the Apple I and Apple II computers.'
    }
  };

  const sponsorAds = {
    'IBM': {
      name: 'IBM',
      slogan: 'THE FUTURE OF COMPUTING IS HERE.',
      description: 'Leading the world in mainframe technology since 1911.'
    },
    'AT&T': {
      name: 'AT&T',
      slogan: 'CONNECTING THE WORLD, ONE BYTE AT A TIME.',
      description: 'Revolutionizing telecommunications since 1877.'
    },
    'XEROX': {
      name: 'XEROX',
      slogan: 'REVOLUTIONIZING DOCUMENTS THROUGH TECHNOLOGY.',
      description: 'Pioneering office automation since 1906.'
    },
    'MICROSOFT': {
      name: 'MICROSOFT',
      slogan: 'OUR SOFTWARE WILL CHANGE THE WORLD.',
      description: 'Founded in 1975, shaping the future of personal computing.'
    }
  };
  
  useEffect(() => {
    if (isActive) {
      const eggTimer = setTimeout(() => {
        setShowEgg(true);
      }, 20000);
      
      return () => clearTimeout(eggTimer);
    }
  }, [isActive]);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const simulateLoading = async (message: string, duration: number = 2000) => {
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      setLoadingProgress(i * 10);
      await new Promise(resolve => setTimeout(resolve, duration / steps));
      addToHistory('response', `${message} [${'▓'.repeat(i)}${'░'.repeat(steps-i)}] ${i*10}%`);
    }
    setLoadingProgress(0);
  };
  
  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commandInput.trim()) {
      addToHistory('response', '$ ');
      return;
    }
    
    const fullCommand = commandInput.trim();
    addToHistory('command', fullCommand);
    setCommandInput('');
    
    if (!isLoggedIn) {
      if (!userInfo) {
        // Handle initial name input
        setUserInfo({ name: fullCommand });
        await simulateLoading('INITIALIZING MAINFRAME ACCESS', 1500);
        addToHistory('response', loginMessages[Math.floor(Math.random() * loginMessages.length)]);
        setIsLoggedIn(true);
        addToHistory('response', '$ ');
      } else {
        addToHistory('response', 'ERROR: PLEASE ENTER YOUR NAME');
        addToHistory('response', 'ENTER YOUR NAME: ');
      }
      return;
    }
    
    // Process command
    const parts = fullCommand.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    switch (command) {
      case 'register':
        if (!userInfo?.email) {
          setRegistrationStep('email');
          addToHistory('response', 'ENTER YOUR EMAIL: ');
        } else {
          addToHistory('response', 'You are already registered.');
          addToHistory('response', '$ ');
        }
        break;
      case 'help':
        showHelp();
        break;
      case 'about':
        showAbout();
        break;
      case 'prizes':
        await showPrizes();
        break;
      case 'judges':
        await showJudges();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'ls':
        listFiles();
        break;
      case 'cat':
        catFile(args[0]);
        break;
      case 'date':
        showDate();
        break;
      case 'whoami':
        showWhoami();
        break;
      case 'man':
        showManual(args[0]);
        break;
      case 'music':
        showMusicEasterEgg();
        break;
      case 'hack':
        showHackEasterEgg();
        break;
      case 'format':
        showFormatEasterEgg(args.join(' '));
        break;
      case 'sponsors':
        if (args.join(' ').toUpperCase() === 'TOP SECRET') {
          showSecretSponsor();
        } else {
          await showSponsors();
        }
        break;
      case 'find':
        if (showEgg && args.join(' ').toLowerCase().includes('easter egg')) {
          findEasterEgg();
        } else {
          addToHistory('response', 'Usage: find [filename]');
          addToHistory('response', 'No files matching pattern.');
          addToHistory('response', '$ ');
        }
        break;
      default:
        addToHistory('response', `Command not found: ${command}`);
        addToHistory('response', 'Type "help" for available commands.');
        addToHistory('response', '$ ');
    }
  };
  
  const addToHistory = (type: 'command' | 'response', text: string) => {
    setCommandHistory(prev => [...prev, { type, text }]);
  };
  
  const showHelp = () => {
    addToHistory('response', 'Available commands:');
    Object.entries(availableCommands).forEach(([cmd, desc]) => {
      addToHistory('response', `  ${cmd.padEnd(10)} - ${desc}`);
    });
    
    if (showEgg) {
      addToHistory('response', '  find       - Find files (hidden feature)');
    }
    
    addToHistory('response', '$ ');
  };
  
  const showAbout = () => {
    addToHistory('response', '==== WORLD\'S LARGEST HACKATHON ====');
    addToHistory('response', 'The premier global programming competition');
    addToHistory('response', 'Dates: November 15-17, 1975');
    addToHistory('response', 'Venue: Silicon Valley Computing Center');
    addToHistory('response', 'Participants: 100,000+');
    addToHistory('response', 'Languages: FORTRAN, COBOL, C, Pascal, Assembly');
    addToHistory('response', 'Contact: hackathon@mainframe.net');
    addToHistory('response', '$ ');
  };
  
  const showPrizes = async () => {
    await simulateLoading('RETRIEVING PRIZE DATA', 1500);
    addToHistory('response', '---------------------------------');
    addToHistory('response', 'GRAND PRIZE: $1,000,000');
    addToHistory('response', 'SECOND PLACE: $500,000');
    addToHistory('response', 'INNOVATION AWARD: $100,000');
    addToHistory('response', '---------------------------------');
    addToHistory('response', 'PRESS ENTER TO CONTINUE...');
    addToHistory('response', '$ ');
  };
  
  const showJudges = async () => {
    await simulateLoading('LOADING JUDGE PROFILES', 1500);
    Object.entries(judgeASCII).forEach(([name, info]) => {
      addToHistory('response', info.ascii);
      addToHistory('response', info.description);
      addToHistory('response', '');
    });
    addToHistory('response', '$ ');
  };
  
  const showWhoami = () => {
    if (userInfo) {
      addToHistory('response', `Current user: ${userInfo.name}`);
      if (userInfo.email) {
        addToHistory('response', `Email: ${userInfo.email}`);
      }
    } else {
      addToHistory('response', 'Not logged in');
    }
    addToHistory('response', '$ ');
  };
  
  const showManual = (command: string) => {
    if (!command) {
      addToHistory('response', 'What manual page do you want?');
      addToHistory('response', '$ ');
      return;
    }
    
    if (command in availableCommands) {
      addToHistory('response', `MANUAL: ${command.toUpperCase()}`);
      addToHistory('response', `NAME`);
      addToHistory('response', `       ${command} - ${availableCommands[command as keyof typeof availableCommands]}`);
      addToHistory('response', `DESCRIPTION`);
      addToHistory('response', `       This command is part of the Hackathon Terminal interface.`);
      addToHistory('response', `       It allows participants to interact with the World's Largest Hackathon.`);
    } else {
      addToHistory('response', `No manual entry for ${command}`);
    }
    
    addToHistory('response', '$ ');
  };

  const showMusicEasterEgg = async () => {
    addToHistory('response', 'ACTIVATING DISCO MODE...');
    await simulateLoading('INITIALIZING FLOPPY DRIVE', 1000);
    addToHistory('response', 'ERROR: FLOPPY DRIVE OVERLOADED');
    addToHistory('response', '$ ');
  };

  const showHackEasterEgg = async () => {
    addToHistory('response', 'INITIATING SECURITY BREACH...');
    await simulateLoading('OVERRIDING MAINFRAME ACCESS', 1000);
    addToHistory('response', 'ERROR: PERMISSION DENIED - NICE TRY!');
    addToHistory('response', '$ ');
  };

  const showFormatEasterEgg = (args: string) => {
    addToHistory('response', `WARNING: ALL DATA WILL BE LOST ON ${args.toUpperCase()}`);
    addToHistory('response', 'JUST KIDDING.');
    addToHistory('response', '$ ');
  };

  const showSponsors = async () => {
    await simulateLoading('LOADING SPONSORS', 2000);
    addToHistory('response', '----------------------------------');
    addToHistory('response', '    OFFICIAL HACKATHON PARTNER');
    addToHistory('response', '----------------------------------');
    Object.entries(sponsorAds).forEach(([name, ad]) => {
      addToHistory('response', `${name} - "${ad.slogan}"`);
    });
    addToHistory('response', '----------------------------------');
    addToHistory('response', 'PRINTING COMPLETE.');
    addToHistory('response', '$ ');
  };

  const showSecretSponsor = async () => {
    await simulateLoading('ACCESSING CLASSIFIED FILES', 2000);
    addToHistory('response', '==== CLASSIFIED COMPANY PROFILE ====');
    addToHistory('response', 'COMPANY: DIGITAL DREAMS INC.');
    addToHistory('response', 'FOUNDED: 1975');
    addToHistory('response', 'LOCATION: SILICON VALLEY');
    addToHistory('response', 'SPECIALTY: PERSONAL COMPUTING');
    addToHistory('response', 'STATUS: TOP SECRET');
    addToHistory('response', '$ ');
  };
  
  const findEasterEgg = () => {
    if (!eggFound) {
      addToHistory('response', '==== SECRET FILE CONTENTS ====');
      addToHistory('response', 'Congratulations! You\'ve found the hidden easter egg.');
      addToHistory('response', 'The first text-based adventure game, "Colossal Cave Adventure,"');
      addToHistory('response', 'was created by Will Crowther in 1975-76 as a simulation of the');
      addToHistory('response', 'Mammoth Cave system in Kentucky.');
      addToHistory('response', '');
      addToHistory('response', 'YOU HAVE COLLECTED THE TERMINAL ERA EASTER EGG!');
      onEggCollect('terminal-egg');
      setEggFound(true);
      
      try {
        const audio = new Audio('/sounds/terminal-egg.mp3');
        audio.play().catch(error => {
          console.log('Error playing sound:', error);
        });
      } catch (error) {
        console.log('Error creating audio:', error);
      }
    } else {
      addToHistory('response', 'You\'ve already found this easter egg.');
    }
    addToHistory('response', '$ ');
  };
  
  const showRegister = async () => {
    if (!userInfo?.email) {
      setRegistrationStep('email');
      addToHistory('response', 'ENTER YOUR EMAIL: ');
      return;
    }

    await simulateLoading('PROCESSING REGISTRATION REQUEST', 1500);
    addToHistory('response', 'REGISTRATION CONFIRMED');
    addToHistory('response', `OPERATOR ID: #H4CK3R${Math.floor(1000 + Math.random() * 9000)}`);
    addToHistory('response', `NAME: ${userInfo.name}`);
    addToHistory('response', `EMAIL: ${userInfo.email}`);
    addToHistory('response', 'WELCOME TO THE WORLD\'S LARGEST HACKATHON.');
    addToHistory('response', '$ ');
  };

  // Handle email input during registration
  useEffect(() => {
    if (registrationStep === 'email' && commandInput.trim()) {
      const email = commandInput.trim();
      setUserInfo(prev => prev ? { ...prev, email } : null);
      setRegistrationStep(null);
      showRegister();
    }
  }, [commandInput, registrationStep]);

  const clearTerminal = () => {
    setCommandHistory([
      { type: 'response', text: '=====================================' },
      { type: 'response', text: '  MAINFRAME TERMINAL v1.0 (c) 1975' },
      { type: 'response', text: '=====================================' },
      { type: 'response', text: 'ENTER YOUR NAME: ' },
    ]);
    setUserInfo(null);
    setIsLoggedIn(false);
  };
  
  const listFiles = () => {
    addToHistory('response', 'total 7');
    addToHistory('response', 'drwxr-xr-x 2 user group 4096 Jan 1 1975 .hackathon');
    addToHistory('response', '-rw-r--r-- 1 user group 2584 Jan 1 1975 about.txt');
    addToHistory('response', '-rw-r--r-- 1 user group 1842 Jan 1 1975 prizes.txt');
    addToHistory('response', '-rw-r--r-- 1 user group 3271 Jan 1 1975 judges.txt');
    addToHistory('response', '-rw-r--r-- 1 user group 5782 Jan 1 1975 register.sh');
    
    if (showEgg) {
      addToHistory('response', '-rw------- 1 root root    42 Jan 1 1975 .secret');
    }
    
    addToHistory('response', '$ ');
  };
  
  const catFile = (filename: string) => {
    if (!filename) {
      addToHistory('response', 'Usage: cat [filename]');
      addToHistory('response', '$ ');
      return;
    }
    
    if (filename === 'about.txt') {
      showAbout();
    } else if (filename === 'prizes.txt') {
      showPrizes();
    } else if (filename === 'judges.txt') {
      showJudges();
    } else if (filename === 'register.sh') {
      addToHistory('response', '#!/bin/bash');
      addToHistory('response', '# Registration Script');
      addToHistory('response', 'echo "Registering participant..."');
      addToHistory('response', 'sleep 2');
      addToHistory('response', 'echo "Registration complete!"');
      addToHistory('response', '$ ');
    } else if (filename === '.secret' && showEgg) {
      findEasterEgg();
    } else {
      addToHistory('response', `cat: ${filename}: No such file or directory`);
      addToHistory('response', '$ ');
    }
  };
  
  const showDate = () => {
    addToHistory('response', 'Thu Jan 1 00:00:00 UTC 1975');
    addToHistory('response', '$ ');
  };

  return (
    <div className="terminal-era min-h-screen bg-black text-[#33ff33] font-mono">
      <motion.div 
        className="container mx-auto py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* CRT Monitor Effect */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(51,255,51,0.1)] to-transparent animate-scan"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
        </div>

        {/* Terminal Window */}
        <motion.div
          className="bg-black border-2 border-[#33ff33] rounded-lg overflow-hidden shadow-[0_0_15px_rgba(51,255,51,0.5)] max-w-4xl mx-auto"
          initial={{ y: 20 }}
          animate={{ y: isActive ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal Header */}
          <div className="bg-[#33ff33] text-black p-2 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm font-bold">mainframe@1975:~</div>
            <div className="text-xs">80x24</div>
          </div>
          
          {/* Terminal Output */}
          <div 
            ref={terminalRef}
            className="bg-black p-4 h-[70vh] overflow-y-auto font-mono text-sm leading-relaxed"
          >
            {commandHistory.map((entry, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {entry.type === 'command' ? '$ ' + entry.text : entry.text}
              </div>
            ))}
            
            <form onSubmit={handleCommand} className="flex items-center">
              <span className="mr-1">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#33ff33] caret-[#33ff33]"
                autoFocus={isActive}
                spellCheck={false}
              />
            </form>
          </div>
          
          {/* Terminal Footer */}
          <div className="bg-[#1a1a1a] border-t border-[#33ff33] p-2 text-xs flex justify-between">
            <div>Terminal v1.0</div>
            <div className="animate-pulse">Ready</div>
            <div>{showEgg ? "Try 'find easter egg' or 'cat .secret'" : "Type 'help' for commands"}</div>
          </div>
        </motion.div>
        
        {/* Loading Bar */}
        {loadingProgress > 0 && (
          <div className="fixed bottom-0 left-0 w-full h-1 bg-[#1a1a1a]">
            <div 
              className="h-full bg-[#33ff33] transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        )}
        
        {/* Terminal Era Info - Hidden but rendered for screen readers */}
        <div className="sr-only">
          <h1>Terminal Era: 1970s</h1>
          <p>
            The era of text-based interfaces and command-line computing. 
            This period saw the rise of UNIX, C programming, and the 
            foundations of modern computing.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalEra; 