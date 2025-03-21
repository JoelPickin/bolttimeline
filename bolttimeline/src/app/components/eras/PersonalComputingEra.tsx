'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonalComputingEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const PersonalComputingEra: React.FC<PersonalComputingEraProps> = ({ onEggCollect, isActive }) => {
  const [time, setTime] = useState(new Date());
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showEgg, setShowEgg] = useState(false);
  const [eggFound, setEggFound] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Desktop icons
  const icons = [
    { id: 'hackathon', name: 'Hackathon Info', icon: '🏆' },
    { id: 'prizes', name: 'Prize Money', icon: '💰' },
    { id: 'judges', name: 'Judges', icon: '👨‍⚖️' },
    { id: 'register', name: 'Register Now', icon: '✏️' },
    { id: 'help', name: 'Help', icon: '❓' },
    { id: 'notepad', name: 'Notepad', icon: '📝' },
  ];
  
  // Easter egg icon that appears after timeout
  const easterEggIcon = { id: 'secret', name: 'Secret', icon: '🔎' };
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      
      const eggTimeout = setTimeout(() => {
        setShowEgg(true);
      }, 15000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(eggTimeout);
      };
    }
  }, [isActive]);
  
  const handleIconClick = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
    setActiveWindow(id);
    
    if (id === 'secret' && showEgg && !eggFound) {
      setEggFound(true);
      onEggCollect('pc-egg');
      
      // Optional: Play a sound with error handling
      try {
        const audio = new Audio('/sounds/pc-egg.mp3');
        audio.play().catch(error => {
          console.log('Error playing sound:', error);
        });
      } catch (error) {
        console.log('Error creating audio:', error);
      }
    }
  };
  
  const handleCloseWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenWindows(openWindows.filter(windowId => windowId !== id));
    if (activeWindow === id) {
      setActiveWindow(openWindows.filter(windowId => windowId !== id)[0] || null);
    }
  };
  
  const bringToFront = (id: string) => {
    setActiveWindow(id);
  };
  
  const getWindowContent = (id: string) => {
    switch (id) {
      case 'hackathon':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center underline">World's Largest Hackathon</h2>
            <div className="text-sm space-y-4">
              <p>
                Welcome to the 1995 World's Largest Hackathon! This groundbreaking event brings together
                programmers, designers, and innovators from around the globe.
              </p>
              <p>
                <b>Date:</b> October 15-17, 1995<br />
                <b>Location:</b> Silicon Valley Convention Center<br />
                <b>Participants:</b> 100,000+ from 50 countries
              </p>
              <p>
                The hackathon will feature cutting-edge technologies including Visual Basic,
                Delphi, Java, and early web development tools. Competitors will have 48 hours to build
                innovative software solutions for desktop environments.
              </p>
              <div className="text-center mt-4">
                <button className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 px-4 py-1">
                  Click to Register
                </button>
              </div>
            </div>
          </div>
        );
      case 'prizes':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center underline">Prize Information</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#000080] text-white">
                  <th className="border border-gray-600 p-2">Category</th>
                  <th className="border border-gray-600 p-2">Prize Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2">Grand Prize</td>
                  <td className="border border-gray-400 p-2 text-right">$500,000</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-400 p-2">Best GUI Application</td>
                  <td className="border border-gray-400 p-2 text-right">$200,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2">Best Algorithm</td>
                  <td className="border border-gray-400 p-2 text-right">$150,000</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-400 p-2">Most Creative Solution</td>
                  <td className="border border-gray-400 p-2 text-right">$100,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2">Student Award</td>
                  <td className="border border-gray-400 p-2 text-right">$50,000</td>
                </tr>
                <tr className="bg-yellow-100">
                  <td className="border border-gray-400 p-2 font-bold">Total Prize Pool</td>
                  <td className="border border-gray-400 p-2 text-right font-bold">$1,000,000</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-sm text-gray-600">
              * All prizes will be distributed within 30 days of the event conclusion
            </div>
          </div>
        );
      case 'judges':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center underline">Distinguished Judges</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { name: 'Bill Gates', title: 'Microsoft Founder', img: '👨‍💼' },
                { name: 'Steve Jobs', title: 'Apple CEO', img: '👨‍💼' },
                { name: 'Linus Torvalds', title: 'Linux Creator', img: '👨‍💻' },
                { name: 'Tim Berners-Lee', title: 'WWW Inventor', img: '👨‍🔬' }
              ].map((judge, index) => (
                <div key={index} className="border border-gray-400 p-2 bg-gray-50">
                  <div className="flex items-center">
                    <div className="text-4xl mr-2">{judge.img}</div>
                    <div>
                      <div className="font-bold">{judge.name}</div>
                      <div className="text-xs">{judge.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="inline-block bg-yellow-200 p-2 text-xs">
                All judges have extensive experience in software development and innovation
              </div>
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center underline">Registration Form</h2>
            <form className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">First Name:</label>
                  <input type="text" className="w-full border border-gray-400 p-1" />
                </div>
                <div>
                  <label className="block mb-1">Last Name:</label>
                  <input type="text" className="w-full border border-gray-400 p-1" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Email Address:</label>
                <input type="email" className="w-full border border-gray-400 p-1" />
              </div>
              <div>
                <label className="block mb-1">Programming Experience:</label>
                <select className="w-full border border-gray-400 p-1">
                  <option>Beginner (0-2 years)</option>
                  <option>Intermediate (3-5 years)</option>
                  <option>Advanced (5+ years)</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Preferred Technologies:</label>
                <div className="grid grid-cols-2">
                  <div>
                    <input type="checkbox" id="vb" className="mr-1" />
                    <label htmlFor="vb">Visual Basic</label>
                  </div>
                  <div>
                    <input type="checkbox" id="c" className="mr-1" />
                    <label htmlFor="c">C/C++</label>
                  </div>
                  <div>
                    <input type="checkbox" id="java" className="mr-1" />
                    <label htmlFor="java">Java</label>
                  </div>
                  <div>
                    <input type="checkbox" id="web" className="mr-1" />
                    <label htmlFor="web">HTML/JavaScript</label>
                  </div>
                </div>
              </div>
              <div className="text-center pt-2">
                <button className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 px-4 py-1">
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        );
      case 'help':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center underline">Help & FAQ</h2>
            <div className="text-sm space-y-4">
              <div>
                <h3 className="font-bold">How do I use this interface?</h3>
                <p>Click on any desktop icon to open its corresponding window. You can move windows by dragging their title bars and close them using the X button.</p>
              </div>
              <div>
                <h3 className="font-bold">How do I register for the hackathon?</h3>
                <p>Click on the "Register Now" icon on the desktop and fill out the form.</p>
              </div>
              <div>
                <h3 className="font-bold">What are the prizes?</h3>
                <p>Click on the "Prize Money" icon to see the full breakdown of the $1,000,000 prize pool.</p>
              </div>
              <div>
                <h3 className="font-bold">Who are the judges?</h3>
                <p>Click on the "Judges" icon to see the list of distinguished industry experts who will be judging the hackathon.</p>
              </div>
              {showEgg && (
                <div className="text-red-600 animate-pulse">
                  <h3 className="font-bold">Are there any hidden features?</h3>
                  <p>Look carefully at your desktop for any unusual icons that may appear...</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'notepad':
        return (
          <div className="p-4 h-full flex flex-col">
            <div className="mb-2 flex justify-between text-sm">
              <div>
                <button className="mr-2 px-2 py-0.5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-gray-800">File</button>
                <button className="mr-2 px-2 py-0.5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-gray-800">Edit</button>
                <button className="px-2 py-0.5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-gray-800">Help</button>
              </div>
            </div>
            <textarea
              className="flex-1 border border-gray-400 p-2 text-sm font-mono w-full resize-none"
              placeholder="Type your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        );
      case 'secret':
        return (
          <div className="p-4 bg-black text-green-400 font-mono text-sm h-full overflow-auto">
            <div className="mb-4">
              <div className="text-center mb-6">
                <h3 className="text-xl">🔒 SECRET FILE FOUND 🔒</h3>
                <p>CONGRATULATIONS HACKER!</p>
              </div>
              <p className="mb-2">You've discovered the secret Easter Egg!</p>
              <p className="mb-4">
                Did you know? The term "Easter egg" for a hidden feature in software 
                originated with Atari's 1979 game "Adventure," where programmer Warren Robinett 
                hid his name in a secret room to protest Atari's policy of not crediting developers.
              </p>
              <div className="text-center mt-8 animate-pulse">
                <p className="mb-2">YOU HAVE FOUND THE PC ERA EASTER EGG!</p>
                <p className="text-xs">(This will be recorded in your collection)</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Window content not found</div>;
    }
  };
  
  return (
    <div className="personal-computing-era min-h-screen bg-[#008080] text-black overflow-hidden">
      {/* Desktop */}
      <motion.div 
        className="min-h-screen p-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desktop Icons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-16">
          {icons.map((icon) => (
            <motion.div
              key={icon.id}
              className="flex flex-col items-center cursor-pointer text-white"
              onClick={() => handleIconClick(icon.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-1">{icon.icon}</div>
              <div className="text-center text-sm bg-[#008080] px-1">{icon.name}</div>
            </motion.div>
          ))}
          
          {/* Easter Egg Icon (appears after timeout) */}
          {showEgg && (
            <motion.div
              className="flex flex-col items-center cursor-pointer text-white"
              onClick={() => handleIconClick(easterEggIcon.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-1 animate-pulse">{easterEggIcon.icon}</div>
              <div className="text-center text-sm bg-[#008080] px-1">{easterEggIcon.name}</div>
            </motion.div>
          )}
        </div>
        
        {/* Windows */}
        <AnimatePresence>
          {openWindows.map((windowId) => {
            const icon = [...icons, easterEggIcon].find(i => i.id === windowId);
            if (!icon) return null;
            
            return (
              <motion.div
                key={windowId}
                className={`absolute top-1/4 left-1/4 w-4/5 sm:w-3/5 md:w-2/5 h-96 bg-[#c0c0c0] shadow-xl border-2 ${
                  activeWindow === windowId ? 'border-[#000080] z-50' : 'border-gray-400 z-40'
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  left: `${20 + (openWindows.indexOf(windowId) * 20)}px`,
                  top: `${50 + (openWindows.indexOf(windowId) * 20)}px`,
                }}
                onClick={() => bringToFront(windowId)}
              >
                {/* Window Title Bar */}
                <div className={`flex items-center justify-between p-1 ${
                  activeWindow === windowId ? 'bg-[#000080] text-white' : 'bg-gray-400 text-gray-100'
                }`}>
                  <div className="flex items-center">
                    <span className="mr-2">{icon.icon}</span>
                    <span className="text-sm">{icon.name}</span>
                  </div>
                  <div className="flex">
                    <button 
                      className="w-5 h-5 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-gray-800 text-black flex items-center justify-center text-xs"
                      onClick={(e) => handleCloseWindow(windowId, e)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                {/* Window Content */}
                <div className="bg-white border-t border-l border-gray-400 border-b border-r border-white h-[calc(100%-24px)] overflow-auto">
                  {getWindowContent(windowId)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Taskbar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 shadow-inner"
          initial={{ y: 50 }}
          animate={{ y: isActive ? 0 : 50 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 px-4 py-1 flex items-center text-sm">
            <span className="mr-1">🖥️</span> Start
          </button>
          
          {/* Open Window Buttons */}
          <div className="flex-1 flex ml-2 space-x-1 overflow-x-auto">
            {openWindows.map((windowId) => {
              const icon = [...icons, easterEggIcon].find(i => i.id === windowId);
              if (!icon) return null;
              
              return (
                <button 
                  key={windowId} 
                  className={`px-2 py-1 text-sm flex items-center overflow-hidden max-w-[150px] ${
                    activeWindow === windowId 
                      ? 'bg-[#dedede] border-t border-l border-gray-800 border-b border-r border-white' 
                      : 'bg-[#c0c0c0] border-t border-l border-white border-b border-r border-gray-800'
                  }`}
                  onClick={() => bringToFront(windowId)}
                >
                  <span className="mr-1">{icon.icon}</span>
                  <span className="truncate">{icon.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Clock */}
          <div className="bg-[#c0c0c0] border-t border-l border-gray-800 border-b border-r border-white px-2 py-1 text-sm">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PersonalComputingEra; 