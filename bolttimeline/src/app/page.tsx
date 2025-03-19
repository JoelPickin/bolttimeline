"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavigationDots from "./components/NavigationDots";
import SoundController from "./components/SoundController";
import CountdownTimer from "./components/CountdownTimer";
import EasterEgg from "./components/EasterEgg";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentEra, setCurrentEra] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [collectedEggs, setCollectedEggs] = useState<number[]>([]);
  const [showEasterEggNotification, setShowEasterEggNotification] = useState(false);
  const [latestEggMessage, setLatestEggMessage] = useState("");
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const eraRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  
  // Easter egg messages for each era
  const easterEggMessages = [
    "You found a punch card from the first computer program!",
    "You discovered a floppy disk with the original BASIC interpreter!",
    "You uncovered a rare GeoCities animator plugin!",
    "You found the first GitHub commit hash!",
    "You discovered the prompt that built this webpage!"
  ];
  
  // Track scroll progress
  const handleScroll = () => {
    if (timelineRef.current) {
      const scrollTop = timelineRef.current.scrollTop;
      const scrollHeight = timelineRef.current.scrollHeight - timelineRef.current.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
      
      // Determine which era is currently in view
      eraRefs.forEach((ref, index) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            setCurrentEra(index);
          }
        }
      });
    }
  };

  // Handle era navigation
  const handleEraChange = (era: number) => {
    if (eraRefs[era]?.current && timelineRef.current) {
      eraRefs[era].current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Toggle sound mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle easter egg collection
  const handleEggCollect = (eraIndex: number) => {
    if (!collectedEggs.includes(eraIndex)) {
      setCollectedEggs([...collectedEggs, eraIndex]);
      setLatestEggMessage(easterEggMessages[eraIndex]);
      setShowEasterEggNotification(true);
      
      // Hide notification after a few seconds
      setTimeout(() => {
        setShowEasterEggNotification(false);
      }, 3000);
    }
  };
  
  // Reveal elements on scroll
  useEffect(() => {
    // Initialize elements as hidden
    const initializeHiddenElements = () => {
      document.querySelectorAll('.vintage-computer, .info-panel, .terminal-frame, .terminal-input, .terminal-commands, .geocities-page, .web2-container, .ai-container, .sponsors-section, h1')
        .forEach(el => {
          el.classList.add('hidden');
        });
    };

    // Set up intersection observer
    const setupObserver = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('show');
            }, 300); // Slight delay for better effect
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      const hiddenElements = document.querySelectorAll('.hidden');
      hiddenElements.forEach(el => observer.observe(el));
      
      return observer;
    };
    
    initializeHiddenElements();
    const observer = setupObserver();
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Add scroll event listener
  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener('scroll', handleScroll);
      return () => timeline.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Era-specific interactions
  const handlePunchCardSubmit = () => {
    alert("PROCESSING PUNCH CARD... WELCOME TO THE HACKATHON!");
  };
  
  const handleTerminalCommand = () => {
    alert("COMMAND ACCEPTED. RETRIEVING HACKATHON DATA...");
  };
  
  const handleGuestbookSign = (e: React.FormEvent) => {
    e.preventDefault();
    alert("THANKS FOR SIGNING OUR GUESTBOOK! YOUR MESSAGE HAS BEEN ADDED TO OUR WEBRING!");
  };
  
  const handleForkHackathon = () => {
    alert("YOU'VE SUCCESSFULLY FORKED THE HACKATHON! COLLABORATIVE CODING INITIATED.");
  };
  
  const handleChatbotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("BOLT-9000: I'm here to assist with your hackathon journey. The event will feature multiple categories including AI, Web3, Mobile, and more!");
  };

  return (
    <div className="timeline-container" ref={timelineRef} onScroll={handleScroll}>
      {/* Navigation Dots */}
      <NavigationDots currentEra={currentEra} onEraChange={handleEraChange} />
      
      {/* Sound Controller */}
      <SoundController 
        currentEra={currentEra}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
      
      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Easter Egg Notification */}
      {showEasterEggNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="font-bold">Easter Egg Found! ({collectedEggs.length}/5)</div>
          <div>{latestEggMessage}</div>
        </div>
      )}

      {/* Era 1: 1950s Punch Card Era */}
      <section 
        ref={eraRefs[0]} 
        className="era relative" 
        style={{ 
          backgroundColor: 'var(--era-1950-bg)',
          color: 'var(--era-1950-accent)'
        }}
      >
        {/* Easter Eggs */}
        <EasterEgg era={0} position="bottom-right" onCollect={handleEggCollect}>
          <div className="w-8 h-12 bg-amber-100 border border-amber-800 relative">
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-6">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="border border-amber-800/30"></div>
              ))}
            </div>
          </div>
        </EasterEgg>
        
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-7xl font-bold text-center mb-4">
            <span className="block">THE WORLD'S</span> 
            <span className="block">LARGEST HACKATHON</span>
          </h1>
          
          <div className="vintage-computer">
            <div className="punch-card-frame p-8 bg-gray-800 rounded-lg border-2 border-gray-600 shadow-lg">
              <h2 className="text-3xl mb-6 text-center font-mono">THE PUNCH CARD ERA - 1950s</h2>
              
              <div className="vintage-form mb-6">
                <label className="block mb-2 font-mono">ENTER YOUR NAME:</label>
                <div className="flex">
                  <input 
                    type="text" 
                    className="bg-black text-white border border-gray-600 p-2 font-mono flex-1"
                    placeholder="JOHN DOE"
                  />
                  <button 
                    className="vintage-button bg-gray-700 border border-gray-500 px-4 py-2 ml-2 hover:bg-gray-600 font-mono"
                    onClick={handlePunchCardSubmit}
                  >
                    PUNCH CARD
                  </button>
                </div>
              </div>
              
              <div className="control-panel grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className="control-switch flex flex-col items-center">
                    <div className="switch-light w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                    <div className="switch-toggle h-8 w-8 bg-red-500 rounded-md mt-2 cursor-pointer hover:bg-red-600"></div>
                    <span className="text-xs mt-1 font-mono">SWITCH {num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="info-panel mt-8 p-6 bg-black/30 rounded-lg border border-gray-700 max-w-3xl">
            <h3 className="text-xl mb-4 font-mono">$1,000,000+ PRIZE POOL</h3>
            <p className="font-mono">A VIRTUAL HACKATHON HOSTED BY BOLT.NEW - THE AI POWERED PLATFORM FOR DEVELOPERS</p>
          </div>
        </div>
      </section>

      {/* Era 2: 1970s Personal Computing */}
      <section 
        ref={eraRefs[1]} 
        className="era relative" 
        style={{ 
          backgroundColor: 'var(--era-1970-bg)',
          color: 'var(--era-1970-text)'
        }}
      >
        {/* Easter Eggs */}
        <EasterEgg era={1} position="top-left" onCollect={handleEggCollect}>
          <div className="w-10 h-10 bg-black border-2 border-gray-700 rounded-sm flex items-center justify-center">
            <div className="w-6 h-6 bg-gray-800 rounded-sm flex items-center justify-center">
              <div className="w-4 h-1 bg-gray-600"></div>
            </div>
          </div>
        </EasterEgg>
        
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="terminal-frame p-8 border-4 border-green-600 bg-black w-full max-w-3xl">
            <div className="terminal-header flex justify-between mb-4">
              <div className="blinking-cursor">C:{'\\'}&gt;</div>
              <div>PERSONAL COMPUTING REVOLUTION - 1970s</div>
            </div>
            
            <div className="terminal-content font-mono">
              <p className="typing-animation">BOOT SEQUENCE INITIATED...</p>
              <p className="typing-animation" style={{ animationDelay: '2s' }}>SYSTEM LOADED.</p>
              <p className="typing-animation" style={{ animationDelay: '3.5s' }}>WELCOME TO THE WORLD'S LARGEST HACKATHON</p>
              
              <div className="terminal-input mt-6" style={{ animationDelay: '5s' }}>
                <p>ENTER YOUR HACKER USERNAME:</p>
                <div className="flex">
                  <input 
                    type="text" 
                    className="bg-black text-green-400 border border-green-600 p-2 font-mono flex-1"
                    placeholder="HACKER_NAME"
                  />
                  <button 
                    className="bg-green-900 border border-green-500 px-4 py-2 ml-2 hover:bg-green-800 font-mono"
                    onClick={handleTerminalCommand}
                  >
                    SUBMIT
                  </button>
                </div>
              </div>
              
              <div className="terminal-commands mt-6" style={{ animationDelay: '6s' }}>
                <p>AVAILABLE COMMANDS:</p>
                <ul className="list-disc pl-6">
                  <li>hackathon --info</li>
                  <li>prizes --list</li>
                  <li>countdown --time</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="info-panel mt-8 p-6 bg-black/30 rounded-lg border border-green-900 max-w-3xl">
            <h3 className="text-xl mb-4 font-mono">JOIN 100,000+ HACKERS GLOBALLY</h3>
            <p className="font-mono">BUILD, EDIT, AND DEPLOY WEB AND MOBILE APPS WITH BOLT.NEW</p>
          </div>
        </div>
      </section>

      {/* Era 3: 1990s Dot-com Boom */}
      <section 
        ref={eraRefs[2]} 
        className="era relative" 
        style={{ 
          backgroundColor: 'var(--era-1990-bg)',
          color: 'white'
        }}
      >
        {/* Easter Eggs */}
        <EasterEgg era={2} position="bottom-left" onCollect={handleEggCollect}>
          <div className="w-10 h-10 rounded-full animate-spin">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
          </div>
        </EasterEgg>
        
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="geocities-page p-6 border-4 border-yellow-400 bg-indigo-800 w-full max-w-4xl">
            <div className="page-header text-center mb-6">
              <h2 className="text-3xl font-bold text-yellow-300" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                ~*~*~ THE WORLD'S LARGEST HACKATHON ~*~*~
              </h2>
              <div className="visitor-counter inline-block bg-black text-white px-3 py-1 rounded mt-2">
                Visitors: 000,042,069
              </div>
              <div className="construction-gif flex justify-center my-4">
                <div className="w-10 h-10 bg-yellow-400 animate-pulse"></div>
                <div className="mx-4 font-bold">UNDER CONSTRUCTION</div>
                <div className="w-10 h-10 bg-yellow-400 animate-pulse"></div>
              </div>
            </div>
            
            <div className="guestbook bg-black/50 p-4 rounded-lg">
              <h3 className="text-xl mb-4 text-pink-400" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                {'{'}{'{'}{'{'}{'}'}{'}'}{'}'} SIGN THE GUESTBOOK {'{'}{'{'}{'{'}{'}'}{'}'}{'}'} 
              </h3>
              
              <form className="guestbook-form" onSubmit={handleGuestbookSign}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-yellow-300">Your Name:</label>
                    <input type="text" className="w-full p-2 border border-pink-400 bg-black text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-yellow-300">Email:</label>
                    <input type="email" className="w-full p-2 border border-pink-400 bg-black text-white" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-yellow-300">Your Message:</label>
                  <textarea className="w-full p-2 border border-pink-400 bg-black text-white" rows={3}></textarea>
                </div>
                
                <div className="text-center">
                  <button type="submit" className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-500">
                    SUBMIT TO GUESTBOOK
                  </button>
                </div>
              </form>
            </div>
            
            <div className="marquee-section text-center mt-6">
              <div className="bg-black text-yellow-300 p-2 overflow-hidden whitespace-nowrap">
                <div className="animate-marquee inline-block">
                  $1,000,000+ IN PRIZES * DATE: TBD * JOIN 100,000+ GLOBAL PARTICIPANTS * HOSTED BY BOLT.NEW * THE FUTURE OF CODING
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Era 4: 2000s Web 2.0 */}
      <section 
        ref={eraRefs[3]} 
        className="era relative" 
        style={{ 
          backgroundColor: 'var(--era-2000-bg)',
          color: 'white'
        }}
      >
        {/* Easter Eggs */}
        <EasterEgg era={3} position="top-right" onCollect={handleEggCollect}>
          <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center">
            <div className="text-xs text-gray-400 font-mono">7f3a</div>
          </div>
        </EasterEgg>
        
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="web2-container p-8 bg-white rounded-xl shadow-2xl w-full max-w-4xl">
            <div className="web2-header text-center mb-8">
              <h2 className="text-4xl font-bold text-blue-600 mb-2" style={{ 
                background: 'linear-gradient(135deg, #4a86e8 0%, #ff9900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                The World's Largest Hackathon
              </h2>
              <p className="text-gray-600">Web 2.0 & Open Source Era - 2000s</p>
            </div>
            
            <div className="profile-section bg-gray-100 p-6 rounded-lg mb-8">
              <h3 className="text-2xl mb-4 text-blue-600">Your Hacker Profile</h3>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="profile-avatar w-32 h-32 bg-gradient-to-br from-blue-400 to-orange-400 rounded-full flex items-center justify-center text-white text-4xl">
                  HD
                </div>
                
                <div className="profile-details flex-1">
                  <div className="mb-4">
                    <label className="block text-gray-600 mb-1">Display Name:</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded" placeholder="HackerDev123" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 mb-1">Skills:</label>
                      <select className="w-full p-2 border border-gray-300 rounded">
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>C++</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Team:</label>
                      <div className="flex">
                        <input type="text" className="flex-1 p-2 border border-gray-300 rounded-l" placeholder="Create or join a team" />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-500">
                          Join
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="fork-section text-center">
              <button 
                className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:from-blue-600 hover:to-orange-600 transition-all shadow-lg"
                onClick={handleForkHackathon}
              >
                Fork The Hackathon
              </button>
              <p className="text-gray-500 mt-2">Join 100,000+ developers in this collaborative event</p>
            </div>
          </div>
        </div>
      </section>

      {/* Era 5: 2020s AI-Powered Era */}
      <section 
        ref={eraRefs[4]} 
        className="era relative" 
        style={{ 
          backgroundColor: 'var(--era-2020-bg)',
          color: 'white'
        }}
      >
        {/* Easter Eggs */}
        <EasterEgg era={4} position="center" onCollect={handleEggCollect}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center">
            <div className="text-white font-bold">AI</div>
          </div>
        </EasterEgg>
        
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
          <div className="ai-container p-8 bg-gray-900 rounded-3xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10 w-full max-w-5xl">
            <div className="ai-header text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                  The World's Largest Hackathon
                </span>
              </h2>
              <p className="text-gray-400">Hosted by Bolt.new - The AI-Powered Era - 2020s</p>
            </div>
            
            <div className="ai-features grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="feature-card bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                <div className="text-emerald-500 text-xl mb-3">$1M+ Prize Pool</div>
                <p className="text-gray-300">Compete for over one million dollars in prizes across multiple categories</p>
              </div>
              
              <div className="feature-card bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                <div className="text-emerald-500 text-xl mb-3">100,000+ Participants</div>
                <p className="text-gray-300">Join the largest global community of developers and creators</p>
              </div>
              
              <div className="feature-card bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                <div className="text-emerald-500 text-xl mb-3">AI-Powered Platform</div>
                <p className="text-gray-300">Build, edit, and deploy web and mobile apps with Bolt.new</p>
              </div>
            </div>
            
            <div className="ai-chatbot bg-black/40 p-6 rounded-xl mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                  <span className="font-bold text-black">B</span>
                </div>
                <h3 className="ml-3 text-xl font-medium">Bolt-9000 Assistant</h3>
              </div>
              
              <div className="chat-messages space-y-4 mb-4">
                <div className="message bg-gray-800 p-3 rounded-lg max-w-md">
                  Hello! I'm Bolt-9000. Ready to help with your hackathon journey. What would you like to know?
                </div>
              </div>
              
              <form className="chat-input flex" onSubmit={handleChatbotSubmit}>
                <input 
                  type="text" 
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white"
                  placeholder="Ask about prizes, categories, or project ideas..."
                />
                <button 
                  type="submit"
                  className="bg-emerald-500 text-black px-4 py-3 rounded-r-lg hover:bg-emerald-400 font-medium"
                >
                  Ask
                </button>
              </form>
            </div>
            
            <div className="cta-section text-center">
              <div className="countdown-timer mb-6">
                <div className="text-gray-400 mb-2">Hackathon Starts In:</div>
                <div className="flex justify-center gap-4">
                  <CountdownTimer 
                    targetDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} 
                    className="flex justify-center gap-4"
                  />
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-emerald-600 hover:to-blue-600 shadow-lg shadow-emerald-500/20">
                Register Now
              </button>
              <p className="text-gray-400 mt-3">TBD - Date to be announced</p>
            </div>
          </div>
          
          <div className="sponsors-section mt-8 text-center w-full max-w-4xl">
            <h3 className="text-2xl mb-6">Judges & Sponsors</h3>
            <div className="sponsors-grid grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div key={num} className="sponsor-card bg-gray-800/50 p-4 rounded-xl hover:bg-gray-800 transition-all">
                  <div className="w-16 h-16 mx-auto bg-gray-700 rounded-full mb-3"></div>
                  <div className="text-sm">Sponsor {num}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="collected-eggs-section mt-8 p-6 bg-black/30 rounded-xl text-center w-full max-w-3xl">
            <h3 className="text-2xl mb-4">Easter Eggs Found: {collectedEggs.length}/5</h3>
            <div className="grid grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((eggIndex) => (
                <div 
                  key={eggIndex}
                  className={`egg-indicator h-16 border rounded-lg flex items-center justify-center ${
                    collectedEggs.includes(eggIndex) 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-300'
                      : 'bg-gray-800/50 border-gray-700'
                  }`}
                >
                  {collectedEggs.includes(eggIndex) ? (
                    <span className="text-2xl">🏆</span>
                  ) : (
                    <span className="text-gray-500">?</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
