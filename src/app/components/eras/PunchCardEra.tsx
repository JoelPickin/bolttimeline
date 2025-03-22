'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PunchCardEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const PunchCardEra: React.FC<PunchCardEraProps> = ({ onEggCollect, isActive }) => {
  const [nameInput, setNameInput] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [showEgg, setShowEgg] = useState(false);
  const [playingAnnouncement, setPlayingAnnouncement] = useState(false);
  const [openJudgeCard, setOpenJudgeCard] = useState<number | null>(null);
  const [switchStates, setSwitchStates] = useState([false, false, false, false, false, false]);
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState<number | null>(null);
  const [showSecretMemo, setShowSecretMemo] = useState(false);
  const [playTypewriterSound, setPlayTypewriterSound] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (isActive) {
      const eggTimer = setTimeout(() => {
        setShowEgg(true);
      }, 20000);
      
      return () => clearTimeout(eggTimer);
    }
  }, [isActive]);
  
  const handleSwitchToggle = (index: number) => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = !newSwitchStates[index];
    setSwitchStates(newSwitchStates);
    
    // Play mechanical click sound with error handling
    try {
      const audio = new Audio('/sounds/switch-click.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Error playing sound:', error);
      });
    } catch (error) {
      console.log('Error creating audio:', error);
    }
  };
  
  const generatePunchCard = (text: string) => {
    // Convert text to a visual representation of holes in a punch card
    const rows = 12;
    const cols = Math.max(40, text.length * 2); // Ensure minimum width
    
    return (
      <div className="bg-[#F2E6D0] border-2 border-[#8B7355] p-1 w-full overflow-x-auto">
        <div className="flex">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="text-[6px] text-center w-3">
              {colIndex % 10 === 0 ? colIndex : ''}
            </div>
          ))}
        </div>
        
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex h-3">
            <div className="text-[6px] w-3 flex items-center justify-center">
              {rowIndex}
            </div>
            {Array.from({ length: cols }).map((_, colIndex) => {
              // Determine if this position should have a hole based on the input text
              const charIndex = Math.floor(colIndex / 2);
              const isPunched = text.length > charIndex && 
                ((text.charCodeAt(charIndex) + rowIndex) % 12 === rowIndex % 3);
              
              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className={`w-3 h-3 border border-[#D2B48C] flex items-center justify-center ${isPunched ? 'bg-white rounded-full' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    // Simulate 1950s AI responses
    let response = '';
    const normalizedInput = aiInput.toLowerCase();
    
    if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
      response = 'GREETING ACKNOWLEDGED. STATE YOUR QUERY.';
    } else if (normalizedInput.includes('name')) {
      response = 'THIS UNIT IS DESIGNATED: ELECTRONIC NUMERICAL INTEGRATOR AND COMPUTER.';
    } else if (normalizedInput.includes('hackathon') || normalizedInput.includes('event')) {
      response = 'ERROR: HACKATHON CONCEPT EXCEEDS CURRENT COMPUTING PARADIGM. REFER TO MANUAL.';
    } else if (normalizedInput.includes('prize') || normalizedInput.includes('money')) {
      response = 'CALCULATION COMPLETE: PRIZE VALUE = $1,000,000. REGISTER TO PARTICIPATE.';
    } else if (normalizedInput.includes('easter egg') && showEgg) {
      response = 'EASTER EGG DETECTED. ACCESS GRANTED TO SPECIAL ANNOUNCEMENT.';
      onEggCollect('punchcard-egg');
    } else {
      response = 'ERROR: COMPUTING POWER LIMITED. REQUEST EXCEEDS AVAILABLE VACUUM TUBES.';
    }
    
    setAiInput('');
    
    // Simulate typing effect
    let tempResponse = '';
    const typewriter = setInterval(() => {
      if (tempResponse.length < response.length) {
        tempResponse += response[tempResponse.length];
        setAiResponse(tempResponse);
      } else {
        clearInterval(typewriter);
      }
    }, 50);
  };
  
  const playAnnouncement = () => {
    if (audioRef.current) {
      setPlayingAnnouncement(true);
      audioRef.current.play();
      onEggCollect('punchcard-egg');
    }
  };
  
  const sponsors = [
    { 
      name: 'Universal Computing', 
      logo: '🏢', 
      year: '1954',
      tagline: 'Powering Innovation Since 1954!',
      description: 'Leading the way in business computing solutions with our revolutionary punch card systems.'
    },
    { 
      name: 'Vacuum Tube Tech', 
      logo: '💡', 
      year: '1951',
      tagline: 'The Future Is Electronic!',
      description: 'Our vacuum tubes power the most reliable computing systems in government and industry.'
    },
    { 
      name: 'DataSort Systems', 
      logo: '🔌', 
      year: '1948',
      tagline: 'Sorting Tomorrow\'s Data Today',
      description: 'Specializing in high-speed data processing for the modern business world.'
    },
    { 
      name: 'National Electronics', 
      logo: '🛡️', 
      year: '1952',
      tagline: 'Defense-Grade Computing Power',
      description: 'Providing strategic computing resources to industry leaders and government projects.'
    },
    { 
      name: 'TOP SECRET - CONFIDENTIAL', 
      logo: '🔒', 
      year: 'CLASSIFIED',
      tagline: 'GOVERNMENT PROJECT X-11',
      description: 'Details of this sponsor are classified under federal directive 7734-B.'
    }
  ];
  
  const judges = [
    {
      name: 'Dr. Alan Computing',
      title: 'Chief Researcher',
      organization: 'IBM Research',
      photo: '👨‍🔬',
      bio: 'Leading mathematician and computing theorist. Pioneer in algorithmic design and systems architecture. Previously worked on wartime code-breaking machines.',
      redacted: false
    },
    {
      name: 'Elizabeth Numbers',
      title: 'Senior Mathematician',
      organization: 'Bell Labs',
      photo: '👩‍🏫',
      bio: 'Specialized in numerical analysis and programming logic. Developed key subroutines used in telephony systems. Holds three patents in computational methods.',
      redacted: false
    },
    {
      name: 'Robert Circuitry',
      title: 'Hardware Engineer',
      organization: 'National Electronics',
      photo: '👨‍💼',
      bio: 'Expert in vacuum tube design and electronic circuit optimization. Previously designed navigation systems for military applications. Pioneering work in miniaturization.',
      redacted: false
    },
    {
      name: 'Dr. Margaret Programmer',
      title: 'Professor of Mathematics',
      organization: 'University Research',
      photo: '👩‍🎓',
      bio: 'Distinguished academic specializing in computational theory. Author of "Algorithmic Principles for Business Machines" and advisor to multiple government computing initiatives.',
      redacted: false
    },
    {
      name: '[REDACTED]',
      title: '[REDACTED]',
      organization: '[CLASSIFIED]',
      photo: '❓',
      bio: 'CLASSIFIED – INFORMATION RESTRICTED BY FEDERAL DIRECTIVE 7734-B. ACCESS LEVEL ALPHA REQUIRED. ALL INQUIRIES MUST BE SUBMITTED TO DEPARTMENT J.',
      redacted: true
    }
  ];
  
  const playTypewriter = () => {
    try {
      const audio = new Audio('/sounds/punch.mp3'); // Using existing sound as typewriter
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Error playing sound:', error);
      });
      setPlayTypewriterSound(true);
      setTimeout(() => setPlayTypewriterSound(false), 2000);
    } catch (error) {
      console.log('Error creating audio:', error);
    }
  };
  
  const nextSponsor = () => {
    setCurrentSponsorIndex((prev) => (prev + 1) % sponsors.length);
  };
  
  const prevSponsor = () => {
    setCurrentSponsorIndex((prev) => (prev - 1 + sponsors.length) % sponsors.length);
  };
  
  const handleSponsorClick = (index: number) => {
    if (index === 4) { // TOP SECRET card
      setShowSecretMemo(true);
      onEggCollect('punchcard-sponsor-egg');
    }
  };
  
  const handleJudgeClick = (index: number) => {
    setSelectedJudge(selectedJudge === index ? null : index);
    
    if (index === 4 && judges[index].redacted) { // Mystery judge
      playTypewriter();
      onEggCollect('punchcard-judge-egg');
    }
  };
  
  return (
    <div className="punch-card-era min-h-screen bg-[#E8E0D0] text-black">
      {/* Background animation of punch cards */}
      <div className="fixed inset-0 -z-10 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute bg-[#F2E6D0] border border-[#8B7355] w-32 h-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20%`,
              }}
              animate={{
                top: '120%',
                rotate: [0, 5, -5, 0],
                x: [0, 10, -10, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 15,
                repeat: Infinity,
                delay: index * 2
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-20 py-8 pb-28">
          {/* Main Machine Panel */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            id="machine-section"
          >
            <motion.div
              className="bg-[#9B876C] border-8 border-[#6F5E4C] rounded-lg p-6 shadow-xl"
              initial={{ y: 50 }}
              animate={{ y: isActive ? 0 : 50 }}
              transition={{ duration: 0.7 }}
            >
              {/* Machine Header */}
              <div className="flex justify-between items-center bg-[#8B7355] p-4 rounded-t-lg border-b-4 border-[#6F5E4C]">
                <div className="flex items-center">
                  {/* Control lights */}
                  {switchStates.map((isOn, index) => (
                    <div 
                      key={index}
                      className={`w-6 h-6 rounded-full mx-1 border-2 border-gray-800 ${isOn ? 'bg-red-500' : 'bg-gray-500'}`}
                    />
                  ))}
                </div>
                <h1 className="text-center text-2xl md:text-4xl font-bold font-mono text-[#F2E6D0] tracking-wide">
                  IBM COMPUTING MACHINE
                </h1>
                <div className="w-24 h-8 bg-[#6F5E4C] rounded flex items-center justify-center">
                  <span className="font-mono text-[#F2E6D0]">MODEL 650</span>
                </div>
              </div>
              
              {/* Machine Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-[#B8A88A]">
                {/* Left Panel - Name Input and Punch Card */}
                <div className="bg-[#A99878] p-4 border-4 border-[#8B7355] rounded">
                  <h2 className="font-mono text-xl mb-4 text-center border-b-2 border-[#6F5E4C] pb-2">
                    PUNCH CARD GENERATOR
                  </h2>
                  
                  <div className="mb-6">
                    <label className="font-mono block mb-2 text-sm">ENTER NAME OR DATA:</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-[#F2E6D0] border-2 border-[#6F5E4C] p-2 font-mono"
                      maxLength={20}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <div className="font-mono text-sm mb-2">RESULTING PUNCH CARD:</div>
                    {generatePunchCard(nameInput || 'SAMPLE DATA')}
                  </div>
                  
                  {/* Control Switches */}
                  <div className="grid grid-cols-6 gap-2 mt-6">
                    {switchStates.map((isOn, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-14 bg-[#6F5E4C] rounded relative cursor-pointer ${isOn ? 'bg-[#8B7355]' : ''}`}
                          onClick={() => handleSwitchToggle(index)}
                        >
                          <motion.div 
                            className="absolute w-6 h-6 bg-gray-300 rounded-full left-1"
                            animate={{ top: isOn ? '2px' : 'calc(100% - 8px)' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          />
                        </div>
                        <span className="font-mono text-xs mt-1">{`SW-${index+1}`}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Register Button */}
                  <div className="mt-6 border-t-2 border-[#6F5E4C] pt-4">
                    <div className="bg-[#F2E6D0] p-3 rounded text-center">
                      <button 
                        className="bg-[#8B7355] hover:bg-[#6F5E4C] font-mono p-3 rounded w-full text-white border-2 border-gray-700 transform active:translate-y-1"
                        onClick={() => {
                          try {
                            const audio = new Audio('/sounds/punch.mp3');
                            audio.play().catch(error => {
                              console.log('Error playing sound:', error);
                            });
                          } catch (error) {
                            console.log('Error creating audio:', error);
                          }
                        }}
                      >
                        REGISTER AS A HACKER
                      </button>
                      <div className="text-xs mt-2 font-mono">
                        PRESS BUTTON TO PUNCH IN YOUR PARTICIPATION
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Simulated AI and Information */}
                <div className="space-y-6">
                  {/* 1950s AI Simulation */}
                  <div className="bg-[#A99878] p-4 border-4 border-[#8B7355] rounded">
                    <h2 className="font-mono text-xl mb-4 text-center border-b-2 border-[#6F5E4C] pb-2">
                      ELECTRONIC BRAIN INTERFACE
                    </h2>
                    
                    <div className="bg-black h-40 p-3 font-mono text-[#33FF33] overflow-y-auto mb-4 border-2 border-gray-600">
                      <div className="animate-pulse mb-2">READY FOR INPUT...</div>
                      {aiResponse && (
                        <div className="mt-2 leading-relaxed">
                          {'> '}{aiResponse}
                        </div>
                      )}
                    </div>
                    
                    <form onSubmit={handleAiSubmit}>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          className="flex-1 bg-[#F2E6D0] border-2 border-[#6F5E4C] p-2 font-mono"
                          placeholder="TALK TO THE MACHINE..."
                        />
                        <button
                          type="submit"
                          className="bg-[#8B7355] hover:bg-[#6F5E4C] font-mono p-2 rounded text-white border-2 border-gray-700"
                        >
                          PROCESS
                        </button>
                      </div>
                    </form>
                    
                    <div className="text-xs mt-2 font-mono text-center">
                      NOTE: COMPUTING POWER LIMITED TO BASIC RESPONSES
                    </div>
                  </div>
                  
                  {/* Prize Money Ledger */}
                  <div className="bg-[#F2E6D0] p-4 border-4 border-[#8B7355] rounded relative">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-[#A99878] flex items-center justify-center">
                      <span className="font-mono text-sm">OFFICIAL LEDGER</span>
                    </div>
                    <div className="pt-6">
                      <table className="w-full border-collapse font-mono text-sm">
                        <thead>
                          <tr className="border-b border-[#8B7355]">
                            <th className="p-2 text-left">AWARD CATEGORY</th>
                            <th className="p-2 text-right">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#8B7355]">
                            <td className="p-2">GRAND PRIZE</td>
                            <td className="p-2 text-right">$500,000.00</td>
                          </tr>
                          <tr className="border-b border-[#8B7355]">
                            <td className="p-2">PROGRAMMING EFFICIENCY</td>
                            <td className="p-2 text-right">$200,000.00</td>
                          </tr>
                          <tr className="border-b border-[#8B7355]">
                            <td className="p-2">ALGORITHMIC INNOVATION</td>
                            <td className="p-2 text-right">$150,000.00</td>
                          </tr>
                          <tr className="border-b border-[#8B7355]">
                            <td className="p-2">STUDENT ACHIEVEMENT</td>
                            <td className="p-2 text-right">$150,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold">TOTAL PRIZE MONEY</td>
                            <td className="p-2 text-right font-bold">$1,000,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="mt-2 text-right text-xs italic">
                        Certified by Accounting Department - 05/12/1954
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Sponsors Rolodex Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            id="sponsors-section"
            className="relative"
          >
            <div className="bg-[#8B4513] p-8 rounded-lg shadow-xl">
              <h2 className="font-mono text-xl mb-2 text-center text-[#F2E6D0] pb-2 border-b-2 border-[#D2B48C]">
                OUR VALUED SPONSORS
              </h2>
              <p className="text-[#F2E6D0] text-sm font-mono italic text-center mb-6">
                "Executives in the 1950s stored their most important business contacts in a Rolodex."
              </p>
              
              {/* Wooden desk background */}
              <div className="relative bg-[#A0522D] rounded-lg p-6 border-8 border-[#8B4513] shadow-inner">
                {/* Rolodex base */}
                <div className="bg-[#D2B48C] rounded-lg h-64 p-4 mx-auto max-w-2xl relative shadow-2xl border-4 border-[#8B7355]">
                  
                  {/* Rolodex mechanism */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#A0522D] rounded-full border-2 border-[#8B4513] z-10"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -mt-4 w-2 h-8 bg-[#8B4513] z-0"></div>
                  
                  {/* Navigation buttons */}
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
                    <button 
                      onClick={prevSponsor}
                      className="bg-[#A0522D] text-[#F2E6D0] w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#8B4513] hover:bg-[#8B4513] transition-colors shadow-md"
                    >
                      ←
                    </button>
                  </div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
                    <button 
                      onClick={nextSponsor}
                      className="bg-[#A0522D] text-[#F2E6D0] w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#8B4513] hover:bg-[#8B4513] transition-colors shadow-md"
                    >
                      →
                    </button>
                  </div>
                  
                  {/* Cards container */}
                  <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
                    <div className="absolute top-4 left-0 w-full flex justify-center">
                      <div className="w-3/4 h-4 bg-[#A0522D] rounded-full"></div>
                    </div>
                    
                    {/* Card fan animation */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSponsorIndex}
                        initial={{ rotateX: -60, y: 20, opacity: 0 }}
                        animate={{ rotateX: 0, y: 0, opacity: 1 }}
                        exit={{ rotateX: 60, y: -20, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-64 h-40 bg-[#F5F5DC] border-2 border-[#8B7355] rounded shadow-lg relative z-10"
                        onClick={() => handleSponsorClick(currentSponsorIndex)}
                        style={{ filter: "sepia(30%)" }}
                      >
                        {/* Card hole */}
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-transparent border-2 border-[#8B7355] rounded-full"></div>
                        
                        {/* Card content */}
                        <div className="pt-10 p-4 text-center font-mono">
                          <div className="text-4xl mb-2 filter grayscale">
                            {sponsors[currentSponsorIndex].logo}
                          </div>
                          <div className={`text-sm font-bold ${currentSponsorIndex === 4 ? 'text-red-800' : ''}`}>
                            {sponsors[currentSponsorIndex].name}
                          </div>
                          <div className="text-xs mt-1 italic border-t border-b border-[#8B7355] py-1 mx-8">
                            {sponsors[currentSponsorIndex].tagline}
                          </div>
                          
                          {/* Read more tab */}
                          <div className="absolute bottom-2 right-2">
                            <div className="bg-[#D2B48C] text-xs px-2 py-1 rounded shadow-sm border border-[#8B7355] font-mono hover:bg-[#C2A078] cursor-pointer">
                              READ MORE
                            </div>
                          </div>
                          
                          {/* Year */}
                          <div className="absolute bottom-2 left-2 text-xs opacity-70">
                            Est. {sponsors[currentSponsorIndex].year}
                          </div>
                          
                          {/* Confidential stamp for secret card */}
                          {currentSponsorIndex === 4 && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] border-2 border-red-800 text-red-800 px-2 py-1 rounded font-bold text-sm opacity-90">
                              CONFIDENTIAL
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Card counter */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#8B7355] px-3 py-1 rounded-full text-xs text-[#F2E6D0] font-mono">
                      {currentSponsorIndex + 1} / {sponsors.length}
                    </div>
                  </div>
                </div>
                
                {/* Desk accessories */}
                <div className="absolute bottom-2 left-4">
                  <div className="w-16 h-8 bg-[#8B4513] rounded-sm"></div>
                </div>
                <div className="absolute top-2 right-8">
                  <div className="w-8 h-12 bg-[#D2B48C] rounded-sm border border-[#8B7355]"></div>
                </div>
              </div>
              
              {/* Secret memo popup */}
              {showSecretMemo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-[#F5F5DC] p-4 max-w-md w-full rounded border-4 border-[#8B7355] shadow-2xl font-mono relative"
                    style={{ filter: "sepia(30%)" }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-6 bg-[#8B7355] flex items-center justify-center">
                      <div className="text-[#F2E6D0] font-bold text-sm">TOP SECRET MEMORANDUM</div>
                    </div>
                    <div className="mt-8 p-4">
                      <div className="text-center mb-4">
                        <div className="font-bold">EYES ONLY - PROJECT HACKATHON</div>
                        <div className="text-xs">DECLASSIFICATION DATE: 06/12/2074</div>
                      </div>
                      <p className="text-sm mb-3">TO: DIRECTOR OF COMPUTING</p>
                      <p className="text-sm mb-3">FROM: DEPARTMENT J</p>
                      <p className="text-sm mb-4">
                        Our analysis confirms the viability of a globally connected network of computing machines. Early prototypes have successfully transmitted data between two terminals at a distance of 500 yards.
                      </p>
                      <p className="text-sm mb-4">
                        We believe this "inter-net" technology could revolutionize information exchange. The attached schematics show our proposed expansion to link computers across national laboratories.
                      </p>
                      <p className="text-sm mb-4">
                        Budget estimates for fiscal year 1955 enclosed. Request immediate approval as Soviet advances in similar technology have been reported.
                      </p>
                      <div className="border-t border-[#8B7355] pt-3 flex justify-between items-center">
                        <div className="text-xs">REF: XJ-1138-HACKATHON</div>
                        <button 
                          className="bg-[#8B7355] hover:bg-[#6F5E4C] text-[#F2E6D0] px-3 py-1 rounded text-sm"
                          onClick={() => setShowSecretMemo(false)}
                        >
                          CLOSE FILE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Judges Filing Cabinet */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="judges-section"
            className="relative"
          >
            <div className="bg-[#6B7280] p-6 rounded-lg shadow-xl">
              <h2 className="font-mono text-xl mb-2 text-center text-[#F2E6D0] pb-2 border-b-2 border-[#9CA3AF]">
                HACKATHON JUDGES
              </h2>
              <p className="text-[#F2E6D0] text-sm font-mono italic text-center mb-6">
                "In the 1950s, corporate offices organized important personnel records in large metal filing cabinets."
              </p>
              
              {/* Filing cabinet */}
              <div className="w-full max-w-4xl mx-auto relative">
                {/* Cabinet body */}
                <div className="bg-[#4B5563] rounded-md p-4 border-2 border-[#374151] shadow-xl">
                  {/* Drawer */}
                  <div className="bg-[#6B7280] rounded mb-3 overflow-hidden">
                    {/* Drawer handle and label */}
                    <div 
                      className="flex items-center px-4 py-2 bg-[#4B5563] cursor-pointer hover:bg-[#374151] transition-colors"
                      onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                      <div className="w-12 h-6 bg-[#9CA3AF] rounded-sm flex items-center justify-center mr-4 border border-[#374151] shadow">
                        <div className="w-8 h-2 bg-[#374151]"></div>
                      </div>
                      <div className="text-[#F2E6D0] font-mono">
                        <div className="text-sm font-bold">HACKATHON JUDGES</div>
                        <div className="text-xs">DOSSIERS - CONFIDENTIAL</div>
                      </div>
                      <div className="ml-auto text-[#F2E6D0]">
                        {drawerOpen ? '▼' : '▶'}
                      </div>
                    </div>
                    
                    {/* Drawer contents */}
                    <motion.div 
                      animate={{ height: drawerOpen ? 'auto' : 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#9CA3AF] p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {judges.map((judge, index) => (
                            <motion.div
                              key={index}
                              className="cursor-pointer"
                              onClick={() => handleJudgeClick(index)}
                              whileHover={{ y: -5 }}
                            >
                              <motion.div
                                className={`bg-[#F5F5DC] p-3 rounded border-2 ${judge.redacted ? 'border-red-800' : 'border-[#8B7355]'} shadow relative h-48`}
                                style={{ filter: "sepia(20%)" }}
                                animate={{
                                  rotateY: selectedJudge === index ? 180 : 0,
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                {/* Front of card */}
                                <div 
                                  className="absolute inset-0 p-3 backface-hidden"
                                  style={{ backfaceVisibility: 'hidden' }}
                                >
                                  {/* Folder tab at top */}
                                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D2B48C] text-[#8B7355] px-4 py-1 rounded-t text-xs font-mono font-bold border-2 border-[#8B7355] border-b-0">
                                    FILE #{1000 + index}
                                  </div>
                                  
                                  {/* Folder clip */}
                                  <div className="absolute top-2 right-2 w-6 h-10">
                                    <div className="w-full h-3 bg-[#A0522D] rounded-t-sm"></div>
                                    <div className="w-2 h-10 bg-[#A0522D] absolute right-2 rounded-b-sm"></div>
                                  </div>
                                  
                                  {/* Polaroid style photo */}
                                  <div className="flex justify-center mb-3 mt-2">
                                    <div className="w-20 h-24 bg-white p-1 border border-[#8B7355] shadow-sm" style={{ transform: 'rotate(-2deg)' }}>
                                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-4xl filter grayscale">
                                        {judge.photo}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Typewritten name and title */}
                                  <div className="font-mono text-center">
                                    <div className={`text-sm font-bold mb-1 ${judge.redacted ? 'bg-black text-black' : ''}`}>
                                      {judge.name}
                                    </div>
                                    <div className={`text-xs ${judge.redacted ? 'bg-black text-black' : ''}`}>
                                      {judge.title}, {judge.organization}
                                    </div>
                                  </div>
                                  
                                  {/* Approval stamp */}
                                  <div className="absolute bottom-3 right-3 transform rotate-[-12deg]">
                                    <div className="text-xs text-red-800 border-2 border-red-800 rounded-sm px-1 font-bold">
                                      APPROVED: HACKATHON 1954
                                    </div>
                                  </div>
                                  
                                  {/* Redaction marks for mystery judge */}
                                  {judge.redacted && (
                                    <>
                                      <div className="absolute top-1/4 left-1/4 w-3/4 h-2 bg-black"></div>
                                      <div className="absolute top-1/3 left-1/3 w-1/2 h-2 bg-black"></div>
                                      <div className="absolute top-1/2 left-1/6 w-2/3 h-2 bg-black"></div>
                                      <div className="absolute top-2/3 left-1/4 w-1/2 h-2 bg-black"></div>
                                    </>
                                  )}
                                </div>
                                
                                {/* Back of card */}
                                <div 
                                  className="absolute inset-0 p-3 backface-hidden bg-[#F5F5DC]"
                                  style={{ 
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)'
                                  }}
                                >
                                  {/* Folder tab at top */}
                                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D2B48C] text-[#8B7355] px-4 py-1 rounded-t text-xs font-mono font-bold border-2 border-[#8B7355] border-b-0">
                                    DOSSIER
                                  </div>
                                  
                                  <div className="font-mono h-full flex flex-col">
                                    <div className={`text-sm font-bold mb-2 pb-2 border-b border-[#8B7355] ${judge.redacted ? 'bg-black text-black' : ''}`}>
                                      {judge.name}
                                    </div>
                                    
                                    {judge.redacted ? (
                                      <div className="flex-1 flex items-center justify-center">
                                        <div className={`text-sm font-mono ${playTypewriterSound ? 'animate-pulse' : ''}`}>
                                          CLASSIFIED – ALL ACCESS RESTRICTED UNTIL FINALS.
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-xs font-mono leading-relaxed flex-1">
                                        {judge.bio}
                                      </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center pt-2 border-t border-[#8B7355] text-xs">
                                      <div>FILE #JDG-{1000 + index}</div>
                                      <div className="opacity-70">SECURITY: LEVEL A</div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Other drawers for decoration */}
                  {[1, 2].map((drawer) => (
                    <div key={drawer} className="bg-[#6B7280] rounded mb-3">
                      <div className="flex items-center px-4 py-2 bg-[#4B5563]">
                        <div className="w-12 h-6 bg-[#9CA3AF] rounded-sm flex items-center justify-center mr-4 border border-[#374151] shadow">
                          <div className="w-8 h-2 bg-[#374151]"></div>
                        </div>
                        <div className="text-[#F2E6D0] font-mono">
                          <div className="text-sm font-bold">
                            {drawer === 1 ? 'ADMINISTRATIVE' : 'ARCHIVES'}
                          </div>
                          <div className="text-xs">
                            {drawer === 1 ? 'PERSONNEL RECORDS' : 'HISTORICAL DATA'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Cabinet base */}
                  <div className="h-4 bg-[#374151] rounded-b-md"></div>
                </div>
                
                {/* Cabinet shadow */}
                <div className="h-4 bg-black opacity-20 mx-8 blur-sm"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Easter Egg Drawer */}
      {showEgg && (
        <div className="fixed bottom-0 right-4 z-40">
          <motion.div
            className="bottom-0 right-4 w-16 h-6 bg-[#6F5E4C] rounded-t-lg cursor-pointer overflow-hidden"
            whileHover={{ y: -2 }}
            onClick={playAnnouncement}
          >
            <div className="w-4 h-2 bg-[#F2E6D0] mx-auto mt-1 rounded-full" />
          </motion.div>
          <audio 
            ref={audioRef} 
            src="/sounds/1950s-announcement.mp3" 
            onError={(e) => console.log('Error loading audio:', e)}
            onEnded={() => setPlayingAnnouncement(false)}
          />
          {playingAnnouncement && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-[#F2E6D0] p-8 max-w-md rounded-lg">
                <h3 className="font-mono text-xl mb-4 text-center">1950s Radio Announcement</h3>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#8B7355] flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-[#6F5E4C]" />
                  </div>
                </div>
                <p className="font-mono text-sm text-center">
                  "And now, a special announcement about the future of computing..."
                </p>
                <div className="mt-6 text-center">
                  <button 
                    className="bg-[#8B7355] hover:bg-[#6F5E4C] font-mono p-2 rounded text-white border-2 border-gray-700"
                    onClick={() => setPlayingAnnouncement(false)}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PunchCardEra; 