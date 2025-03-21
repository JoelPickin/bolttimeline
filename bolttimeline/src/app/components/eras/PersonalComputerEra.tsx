'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PersonalComputerEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const PersonalComputerEra: React.FC<PersonalComputerEraProps> = ({ onEggCollect, isActive }) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    project: ''
  });
  const [hasRegistered, setHasRegistered] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date());
  
  // Reset state and update clock when era becomes active
  useEffect(() => {
    if (isActive) {
      const startupSequence = setTimeout(() => {
        setActiveWindow('welcome');
      }, 800);
      
      const timeInterval = setInterval(() => {
        setSystemTime(new Date());
      }, 1000);
      
      return () => {
        clearTimeout(startupSequence);
        clearInterval(timeInterval);
      };
    } else {
      setActiveWindow(null);
      setShowStartMenu(false);
    }
  }, [isActive]);
  
  const handleOpenWindow = (windowName: string) => {
    setActiveWindow(windowName);
    setShowStartMenu(false);
  };
  
  const handleCloseWindow = () => {
    setActiveWindow(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegistrationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setHasRegistered(true);
  };
  
  // Hidden easter egg in the system
  const handleEasterEgg = () => {
    onEggCollect('personalcomputer-egg');
  };
  
  return (
    <div className="personal-computer-era h-full bg-teal-100 flex flex-col">
      {/* Era Title Header */}
      <motion.div 
        className="era-header text-center py-4 bg-gradient-to-r from-teal-800 to-blue-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-md">
          Personal Computer Era: 1980s-1990s
        </h2>
        <p className="text-teal-100 mt-1">
          When computing came home and changed everything
        </p>
      </motion.div>
      
      {/* Desktop Environment */}
      <div className="flex-1 bg-teal-200 p-4 relative overflow-hidden">
        {/* Desktop Icons */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:grid-cols-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="desktop-icon flex flex-col items-center cursor-pointer"
            onClick={() => handleOpenWindow('welcome')}
          >
            <div className="w-12 h-12 bg-blue-700 flex items-center justify-center text-white text-2xl mb-1 shadow-md">
              i
            </div>
            <span className="text-xs font-bold text-center">Welcome</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="desktop-icon flex flex-col items-center cursor-pointer"
            onClick={() => handleOpenWindow('hackathon')}
          >
            <div className="w-12 h-12 bg-red-600 flex items-center justify-center text-white text-2xl mb-1 shadow-md">
              H
            </div>
            <span className="text-xs font-bold text-center">Hackathon Info</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="desktop-icon flex flex-col items-center cursor-pointer"
            onClick={() => handleOpenWindow('prizes')}
          >
            <div className="w-12 h-12 bg-yellow-500 flex items-center justify-center text-white text-2xl mb-1 shadow-md">
              $
            </div>
            <span className="text-xs font-bold text-center">Prizes</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="desktop-icon flex flex-col items-center cursor-pointer"
            onClick={() => handleOpenWindow('register')}
          >
            <div className="w-12 h-12 bg-green-600 flex items-center justify-center text-white text-2xl mb-1 shadow-md">
              R
            </div>
            <span className="text-xs font-bold text-center">Register</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="desktop-icon flex flex-col items-center cursor-pointer"
            onClick={handleEasterEgg}
          >
            <div className="w-12 h-12 bg-purple-600 flex items-center justify-center text-white text-2xl mb-1 shadow-md">
              ?
            </div>
            <span className="text-xs font-bold text-center">Secret</span>
          </motion.div>
        </div>
        
        {/* Windows */}
        {activeWindow === 'welcome' && (
          <Window
            title="Welcome to Hackathon '95"
            onClose={handleCloseWindow}
            color="bg-blue-700"
            isActive={isActive}
          >
            <div className="p-4 h-full overflow-auto">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">Welcome to the Desktop Era!</h3>
                <p className="mb-4">The 1980s-90s saw the rise of personal computing with iconic systems like the IBM PC, Apple Macintosh, and home Windows computers.</p>
              </div>
              
              <div className="border border-gray-400 p-3 mb-4 bg-blue-50">
                <h4 className="font-bold">Historical Context:</h4>
                <p className="mt-2 text-sm">
                  This era revolutionized computing by bringing powerful machines into homes and businesses worldwide. 
                  With graphical user interfaces replacing command lines, computing became accessible to everyone - not just specialists.
                </p>
                <p className="mt-2 text-sm">
                  Key innovations included the mouse, GUI interfaces, desktop publishing, early internet connectivity via dial-up, 
                  and the birth of home productivity software and games.
                </p>
              </div>
              
              <div className="border border-gray-400 p-3 bg-blue-50">
                <h4 className="font-bold">Navigation Help:</h4>
                <p className="text-sm mt-2">Click the desktop icons to explore different applications. You can register for the hackathon, view prize information, and learn more about the event.</p>
                <p className="text-sm mt-2 font-bold">Tip: There might be a hidden Easter egg somewhere on this desktop!</p>
              </div>
            </div>
          </Window>
        )}
        
        {activeWindow === 'hackathon' && (
          <Window
            title="Hackathon Information"
            onClose={handleCloseWindow}
            color="bg-red-600"
            isActive={isActive}
          >
            <div className="p-4 h-full overflow-auto">
              <div className="flex justify-center mb-6">
                <div className="border-4 border-red-600 px-8 py-4 bg-white text-center">
                  <h3 className="text-xl font-bold">WORLD'S LARGEST HACKATHON</h3>
                  <p className="text-sm italic">Version 95.1</p>
                </div>
              </div>
              
              <div className="border border-gray-400 p-3 mb-4 bg-white">
                <h4 className="font-bold mb-2">Event Details:</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="font-bold pr-4">Date:</td>
                      <td>October 15-17, 1995</td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-4">Location:</td>
                      <td>Distributed across BBS networks and dial-up connections</td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-4">Participants:</td>
                      <td>100,000+ globally (New Record!)</td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-4">Theme:</td>
                      <td>Building the Information Superhighway</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="border border-gray-400 p-3 mb-4 bg-white">
                <h4 className="font-bold mb-2">Judges:</h4>
                <ul className="list-disc pl-5 text-sm">
                  <li>Bill Gates - Microsoft Corporation</li>
                  <li>Steve Jobs - Apple Computer, Inc.</li>
                  <li>Tim Berners-Lee - World Wide Web Consortium</li>
                  <li>Linus Torvalds - Linux Developer</li>
                </ul>
              </div>
              
              <div className="border border-gray-400 p-3 bg-white">
                <h4 className="font-bold mb-2">Technical Requirements:</h4>
                <p className="text-sm">Minimum 486 processor, 8MB RAM, 14.4k modem connection</p>
                <p className="text-sm mt-2">Recommended: Pentium processor, 16MB RAM, 28.8k modem</p>
                <p className="text-sm mt-2 italic font-bold">Note: All participants will receive a free 3.5" floppy disk with development resources!</p>
              </div>
            </div>
          </Window>
        )}
        
        {activeWindow === 'prizes' && (
          <Window
            title="Prize Information"
            onClose={handleCloseWindow}
            color="bg-yellow-500"
            isActive={isActive}
          >
            <div className="p-4 h-full overflow-auto bg-white">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">$1,000,000 Prize Pool</h3>
                <p className="italic">The largest hackathon prize allocation in history</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-400 p-3 bg-yellow-100">
                  <h4 className="font-bold">Grand Prize: $500,000</h4>
                  <p className="text-sm mt-1">Best overall project as selected by our panel of judges</p>
                  <p className="text-sm mt-1 italic">Includes distribution deal with major software publisher</p>
                </div>
                
                <div className="border border-gray-400 p-3 bg-yellow-100">
                  <h4 className="font-bold">Innovation Award: $200,000</h4>
                  <p className="text-sm mt-1">Most creative and forward-thinking development</p>
                  <p className="text-sm mt-1 italic">Winner featured in PC Magazine</p>
                </div>
                
                <div className="border border-gray-400 p-3 bg-yellow-100">
                  <h4 className="font-bold">Technical Award: $150,000</h4>
                  <p className="text-sm mt-1">Most impressive technical achievement</p>
                  <p className="text-sm mt-1 italic">Winner receives 486DX2-66 computer system</p>
                </div>
                
                <div className="border border-gray-400 p-3 bg-yellow-100">
                  <h4 className="font-bold">Student Prize: $50,000</h4>
                  <p className="text-sm mt-1">Best project from a student team</p>
                  <p className="text-sm mt-1 italic">Includes university scholarship opportunities</p>
                </div>
              </div>
              
              <div className="mt-6 border border-gray-400 p-3 bg-yellow-100">
                <h4 className="font-bold">How Winners Are Selected:</h4>
                <p className="text-sm mt-2">All submissions will be evaluated based on:</p>
                <ul className="list-disc pl-5 text-sm mt-1">
                  <li>Technical implementation</li>
                  <li>Innovation and creativity</li>
                  <li>User interface design</li>
                  <li>Commercial potential</li>
                  <li>Performance on target systems</li>
                </ul>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm italic">Winners announced on CompuServe and America Online following the event</p>
              </div>
            </div>
          </Window>
        )}
        
        {activeWindow === 'register' && (
          <Window
            title="Hackathon Registration"
            onClose={handleCloseWindow}
            color="bg-green-600"
            isActive={isActive}
          >
            <div className="p-4 h-full overflow-auto">
              {!hasRegistered ? (
                <form onSubmit={handleRegister} className="bg-white p-4 border border-gray-400">
                  <h3 className="text-lg font-bold mb-4 text-center">Register for the World's Largest Hackathon</h3>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-sm font-bold">Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={registrationForm.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-400 p-1 bg-gray-100"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block mb-1 text-sm font-bold">Email/BBS Handle:</label>
                    <input
                      type="text"
                      name="email"
                      value={registrationForm.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-400 p-1 bg-gray-100"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-bold">Project Idea:</label>
                    <textarea
                      name="project"
                      value={registrationForm.project}
                      onChange={handleInputChange}
                      className="w-full border border-gray-400 p-1 bg-gray-100 h-20"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" required />
                      I agree to the terms and conditions
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-1 font-bold hover:bg-green-700"
                    >
                      Register Now
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white p-6 border border-gray-400 text-center">
                  <h3 className="text-xl font-bold mb-4 text-green-700">Registration Complete!</h3>
                  <p className="mb-2">Thank you for registering for the World's Largest Hackathon.</p>
                  <p className="mb-4">You will receive your confirmation and participation details via email/BBS message.</p>
                  <div className="border-t border-gray-300 pt-4 mt-4">
                    <p className="text-sm italic">Your registration ID: HACK-{Math.floor(Math.random() * 9000) + 1000}</p>
                    <p className="text-sm mt-2">Don't forget to check the Prizes section for details on what you can win!</p>
                  </div>
                </div>
              )}
            </div>
          </Window>
        )}
        
        {/* Taskbar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-10 bg-gray-200 border-t border-gray-400 flex items-center px-2"
          initial={{ y: 40 }}
          animate={{ y: isActive ? 0 : 40 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <button
            className={`start-button px-4 py-1 mr-2 font-bold ${showStartMenu ? 'bg-blue-700 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            Start
          </button>
          
          {activeWindow && (
            <div className="task-button px-2 py-1 bg-gray-300 text-sm border border-gray-400 flex-1 max-w-xs truncate">
              {activeWindow === 'welcome' && 'Welcome'}
              {activeWindow === 'hackathon' && 'Hackathon Info'}
              {activeWindow === 'prizes' && 'Prizes'}
              {activeWindow === 'register' && 'Registration'}
            </div>
          )}
          
          <div className="ml-auto px-2 py-1 bg-gray-300 border border-gray-400 text-xs">
            {systemTime.toLocaleTimeString()}
          </div>
          
          {/* Start Menu */}
          {showStartMenu && (
            <div className="absolute bottom-10 left-0 w-48 bg-gray-200 border border-gray-400 shadow-lg">
              <div className="bg-blue-700 text-white p-2 font-bold">Hackathon '95</div>
              <div className="menu-items">
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-blue-100 flex items-center"
                  onClick={() => handleOpenWindow('welcome')}
                >
                  <span className="w-6 h-6 bg-blue-700 flex items-center justify-center text-white text-xs mr-2">i</span>
                  Welcome
                </button>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-blue-100 flex items-center"
                  onClick={() => handleOpenWindow('hackathon')}
                >
                  <span className="w-6 h-6 bg-red-600 flex items-center justify-center text-white text-xs mr-2">H</span>
                  Hackathon Info
                </button>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-blue-100 flex items-center"
                  onClick={() => handleOpenWindow('prizes')}
                >
                  <span className="w-6 h-6 bg-yellow-500 flex items-center justify-center text-white text-xs mr-2">$</span>
                  Prizes
                </button>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-blue-100 flex items-center"
                  onClick={() => handleOpenWindow('register')}
                >
                  <span className="w-6 h-6 bg-green-600 flex items-center justify-center text-white text-xs mr-2">R</span>
                  Register
                </button>
                <div className="border-t border-gray-400 my-1"></div>
                <button 
                  className="w-full text-left px-4 py-1 hover:bg-blue-100"
                  onClick={() => setShowStartMenu(false)}
                >
                  Exit
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Window Component
interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  color: string;
  isActive: boolean;
}

const Window: React.FC<WindowProps> = ({ title, children, onClose, color, isActive }) => {
  return (
    <motion.div
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-11/12 max-w-3xl h-3/4 bg-gray-200 border-2 border-gray-400 shadow-xl flex flex-col"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      style={{ maxHeight: 'calc(100% - 6rem)' }}
    >
      <div className={`window-title flex items-center justify-between p-1 ${color} text-white`}>
        <span className="font-bold text-sm">{title}</span>
        <button 
          onClick={onClose}
          className="w-5 h-5 bg-gray-200 text-gray-800 flex items-center justify-center text-xs font-bold hover:bg-gray-300"
        >
          X
        </button>
      </div>
      <div className="window-menu flex bg-gray-300 border-b border-gray-400 p-1 text-xs">
        <span className="mr-4 cursor-pointer hover:underline">File</span>
        <span className="mr-4 cursor-pointer hover:underline">Edit</span>
        <span className="mr-4 cursor-pointer hover:underline">View</span>
        <span className="cursor-pointer hover:underline">Help</span>
      </div>
      <div className="flex-1 bg-gray-100 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};

export default PersonalComputerEra; 