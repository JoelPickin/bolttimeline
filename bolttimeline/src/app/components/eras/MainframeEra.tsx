'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MainframeEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const MainframeEra: React.FC<MainframeEraProps> = ({ onEggCollect, isActive }) => {
  const [command, setCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'SYSTEM READY.',
    'TYPE "HELP" FOR AVAILABLE COMMANDS.',
    '>'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Reset terminal and focus input when era becomes active
  useEffect(() => {
    if (isActive) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      setTerminalOutput([
        'MAINFRAME SYSTEM v3.2.1 INITIALIZED',
        'COPYRIGHT (C) 1981 UNIVERSAL COMPUTING CORP.',
        'ALL RIGHTS RESERVED.',
        '',
        'CONNECTING TO HACKATHON DATABASE...',
        'CONNECTION ESTABLISHED.',
        '',
        'SYSTEM READY.',
        'TYPE "HELP" FOR AVAILABLE COMMANDS.',
        '>'
      ]);
    }
  }, [isActive]);
  
  // Scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);
  
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    const cmd = command.trim().toUpperCase();
    let response: string[] = [];
    
    // Process different commands
    switch (cmd) {
      case 'HELP':
        response = [
          'AVAILABLE COMMANDS:',
          '--------------------',
          'HELP - DISPLAY THIS HELP MESSAGE',
          'INFO - DISPLAY HACKATHON INFORMATION',
          'PRIZES - VIEW PRIZE CATEGORIES',
          'JUDGES - LIST HACKATHON JUDGES',
          'REGISTER - REGISTER FOR THE HACKATHON',
          'CLEAR - CLEAR TERMINAL SCREEN',
          'DIR - LIST AVAILABLE FILES',
          'RUN EASTEREGG - ???',
          '',
          'SYSTEM IS WAITING FOR YOUR COMMAND.'
        ];
        break;
        
      case 'INFO':
        response = [
          '------------------------',
          'HACKATHON INFORMATION',
          '------------------------',
          'NAME: THE WORLD\'S LARGEST HACKATHON',
          'DATE: BATCH PROCESSING STARTS ON 10-15-1981',
          'LOCATION: DISTRIBUTED SYSTEM NETWORK',
          'PARTICIPANTS: 100,000+ REGISTERED USERS',
          'TOTAL PRIZE POOL: $1,000,000',
          '',
          'FOR REGISTRATION INFORMATION, TYPE "REGISTER"'
        ];
        break;
        
      case 'PRIZES':
        response = [
          '------------------------',
          'PRIZE ALLOCATIONS',
          '------------------------',
          'GRAND PRIZE: $500,000',
          'RUNNER-UP: $200,000',
          'INNOVATION AWARD: $150,000',
          'TECHNICAL EXCELLENCE: $100,000',
          'STUDENT DIVISION: $50,000',
          '',
          'ALL PRIZES PAID IN COMPUTER CREDITS AND MAGNETIC TAPE ALLOCATION'
        ];
        break;
        
      case 'JUDGES':
        response = [
          '------------------------',
          'HACKATHON JUDGES',
          '------------------------',
          'DR. MARGARET HAMILTON - APOLLO GUIDANCE COMPUTER SYSTEMS',
          'PROF. JAMES GOSLING - PROGRAMMING LANGUAGES DIVISION',
          'DR. ROBERT DENNARD - MEMORY SYSTEMS EXPERT',
          'GRACE HOPPER - COMPILER SYSTEMS PIONEER',
          '',
          'JUDGES WILL EVALUATE ALL SUBMISSIONS VIA MAGNETIC TAPE REVIEW'
        ];
        break;
        
      case 'REGISTER':
        response = [
          '------------------------',
          'REGISTRATION PROTOCOL',
          '------------------------',
          'REGISTRATION COMPLETE!',
          '',
          'WELCOME TO THE WORLD\'S LARGEST HACKATHON.',
          'YOU HAVE BEEN ALLOCATED 2MB OF STORAGE AND 4 HOURS OF CPU TIME.',
          'YOUR PARTICIPANT ID IS: USR-' + Math.floor(Math.random() * 9000 + 1000),
          '',
          'REPORT TO YOUR SYSTEM ADMINISTRATOR FOR ACCESS CODES.'
        ];
        break;
        
      case 'CLEAR':
        setTerminalOutput(['SYSTEM READY.', '>']);
        setCommand('');
        return;
        
      case 'DIR':
        response = [
          'DIRECTORY LISTING:',
          '--------------------',
          'HACKATHON.SYS         <DIR>    10-10-1981',
          'README.TXT            2.4KB    10-05-1981',
          'REGISTER.EXE          18KB     09-28-1981',
          'PRIZES.DAT            4.2KB    10-01-1981',
          'RULES.TXT             8.6KB    10-03-1981',
          'EASTEREGG.BAS         1.2KB    [HIDDEN]',
          '',
          '6 FILE(S) LISTED, 4.1MB FREE SPACE'
        ];
        break;
        
      case 'RUN EASTEREGG.BAS':
      case 'RUN EASTEREGG':
        response = [
          'LOADING PROGRAM...',
          '10 PRINT "CONGRATULATIONS, YOU FOUND THE EASTER EGG!"',
          '20 PRINT "THE FIRST DISK OPERATING SYSTEM WAS CREATED IN 1974"',
          '30 END',
          'PROGRAM EXECUTED SUCCESSFULLY.'
        ];
        setTimeout(() => {
          onEggCollect('mainframe-egg');
        }, 500);
        break;
        
      default:
        response = [`COMMAND NOT RECOGNIZED: ${cmd}`, 'TYPE "HELP" FOR AVAILABLE COMMANDS.'];
    }
    
    // Update terminal output
    setTerminalOutput(prev => [
      ...prev.slice(0, -1), // Remove the last '>' line
      `> ${command}`,       // Add the command with >
      ...response,          // Add the response
      '>'                   // Add a new prompt
    ]);
    
    // Clear command input
    setCommand('');
  };
  
  return (
    <div className="mainframe-era h-full bg-black text-green-500 flex flex-col font-mono">
      {/* Era Title */}
      <motion.div 
        className="era-header text-center py-4 bg-green-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl uppercase tracking-widest text-green-400">
          Mainframe Era: 1970s-1980s
        </h2>
        <p className="text-green-300 mt-2">
          The era of green screens, command lines, and the birth of modern computing
        </p>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-4">
        {/* Historical Background */}
        <motion.div 
          className="md:w-1/3 p-4 border border-green-700 bg-black/50 mb-4 md:mb-0 md:mr-4"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="prose prose-invert max-w-none text-green-400">
            <h3 className="uppercase border-b border-green-700 pb-2 mb-4 text-green-500">
              Historical Context
            </h3>
            <p className="text-green-400">
              The 1970s-80s saw mainframe computers dominate computing, with systems like the IBM System/370 
              and DEC VAX serving multiple users simultaneously through terminals. This era introduced time-sharing, 
              allowing many people to use the same machine through command-line interfaces.
            </p>
            <p className="text-green-400">
              During this period, key innovations emerged: the first email was sent, Unix was developed, 
              and database systems became critical for businesses. These text-based, green-on-black interfaces 
              required users to memorize commands but offered unprecedented power to those who mastered them.
            </p>
            
            {/* Hackathon Information styled for the era */}
            <div className="border border-green-600 p-4 mt-6 bg-black">
              <pre className="text-green-500 whitespace-pre overflow-auto">
{`
+----------------------------------+
|   WORLD'S LARGEST HACKATHON      |
|   SYSTEM NOTIFICATION 81-2A     |
+----------------------------------+
| REGISTRATION: NOW OPEN           |
| ENTRANTS: 100,000+ [NEW RECORD]  |
| PRIZE ALLOCATION: $1,000,000     |
| STORAGE ALLOCATION: 2MB/USER     |
+----------------------------------+
| AUTHORIZED BY: SYS ADMIN 0xFF    |
+----------------------------------+
`}
              </pre>
            </div>
          </div>
        </motion.div>
        
        {/* Interactive Terminal Section */}
        <motion.div 
          className="md:w-2/3 flex flex-col h-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Terminal Window */}
          <div className="flex-1 border-2 border-green-700 bg-black p-2 flex flex-col">
            <div className="border-b border-green-700 py-1 px-2 text-sm mb-2">
              UNIVERSAL COMPUTING MAINFRAME - TERMINAL #3278
            </div>
            
            <div 
              ref={terminalRef}
              className="flex-1 font-mono text-green-500 overflow-auto whitespace-pre pb-2"
              style={{ fontFamily: 'Consolas, monospace' }}
            >
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="terminal-line">
                  {line}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleCommand} className="flex border-t border-green-700 pt-2">
              <span className="mr-2">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent text-green-500 focus:outline-none"
                spellCheck="false"
                autoComplete="off"
              />
            </form>
          </div>
          
          {/* System Status */}
          <motion.div 
            className="mt-4 border border-green-700 p-2 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex justify-between border-b border-green-700 pb-1 mb-1">
              <span>SYSTEM STATUS: ONLINE</span>
              <span>CPU LOAD: 42%</span>
              <span>MEMORY: 64KB</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>HACKATHON DATABASE: CONNECTED</span>
              <span>SESSION ID: 8F2A-C391</span>
              <span>TIME: {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MainframeEra; 