'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WebEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const WebEra: React.FC<WebEraProps> = ({ onEggCollect, isActive }) => {
  const [guestbookEntry, setGuestbookEntry] = useState('');
  const [guestbookEntries, setGuestbookEntries] = useState<string[]>([
    'First! Great hackathon! - WebMaster95',
    'Looking forward to building the future! - JavaDev2000',
    'Web 2.0 is going to change everything! - RubyOnRails',
  ]);
  const [hitCounter, setHitCounter] = useState(12847);
  const [showEgg, setShowEgg] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      setHitCounter(prev => prev + 1);
      const eggTimeout = setTimeout(() => setShowEgg(true), 10000);
      return () => clearTimeout(eggTimeout);
    }
  }, [isActive]);
  
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestbookEntry.trim()) {
      setGuestbookEntries(prev => [...prev, guestbookEntry.trim()]);
      setGuestbookEntry('');
    }
  };
  
  const handleEasterEgg = () => {
    if (showEgg) {
      onEggCollect('web-egg');
    }
  };
  
  return (
    <div className="web-era min-h-screen bg-[#D3D3D3] text-black">
      {/* Marquee Header */}
      <motion.div 
        className="bg-[#000080] text-white py-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
      >
        <div className="animate-marquee whitespace-nowrap">
          🌟 Welcome to The World's Largest Hackathon Web Portal! 🌟 Over $1,000,000 in Prizes! 
          🌟 100,000+ Global Participants! 🌟 Register Today! 🌟
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4">
        <motion.div 
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#FF00FF] via-[#FFFF00] to-[#00FF00] p-1 inline-block">
            <h1 className="text-4xl font-bold bg-[#000080] text-white p-4">
              The World's Largest Hackathon
            </h1>
          </div>
          <div className="mt-2 animate-pulse">
            <img 
              src="/images/new.gif" 
              alt="New!" 
              className="inline-block h-6"
            />
            <span className="text-red-600 font-bold ml-2">
              Registration Now Open!
            </span>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Sidebar */}
          <motion.div 
            className="bg-white border-2 border-gray-800 p-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: isActive ? 0 : -50, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-center bg-[#000080] text-white p-2 mb-4">
              Navigation
            </h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#0000FF] hover:text-[#FF0000] underline">
                  🏠 Home
                </a>
              </li>
              <li>
                <a href="#" className="text-[#0000FF] hover:text-[#FF0000] underline">
                  📝 Register Now!
                </a>
              </li>
              <li>
                <a href="#" className="text-[#0000FF] hover:text-[#FF0000] underline">
                  💰 Prize Information
                </a>
              </li>
              <li>
                <a href="#" className="text-[#0000FF] hover:text-[#FF0000] underline">
                  👥 Meet the Judges
                </a>
              </li>
              <li>
                <a href="#" className="text-[#0000FF] hover:text-[#FF0000] underline">
                  📚 Resources
                </a>
              </li>
            </ul>
            
            <div className="mt-4 text-center">
              <div className="bg-black text-[#00FF00] p-2 font-mono text-sm">
                Visitors: {hitCounter}
              </div>
            </div>
            
            {showEgg && (
              <div 
                className="mt-4 text-center cursor-pointer"
                onClick={handleEasterEgg}
              >
                <div className="text-xs animate-bounce">
                  🔍 Hidden Comment in Source
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Main Content Area */}
          <motion.div 
            className="md:col-span-2 bg-white border-2 border-gray-800 p-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isActive ? 0 : 50, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="text-xl font-bold text-center bg-[#000080] text-white p-2 mb-4">
                About The Hackathon
              </h2>
              <div className="space-y-4">
                <p>
                  Welcome to the World's Largest Hackathon! We're bringing together over 100,000 developers 
                  from around the globe to build the future of the web. With Web 2.0 technologies revolutionizing 
                  how we interact online, this is your chance to be part of history.
                </p>
                <div className="bg-yellow-100 border border-yellow-500 p-4">
                  <h3 className="font-bold text-center mb-2">🏆 Prize Pool: $1,000,000</h3>
                  <ul className="list-disc pl-5">
                    <li>Grand Prize: $500,000</li>
                    <li>Best Web 2.0 Application: $200,000</li>
                    <li>Most Innovative Use of APIs: $150,000</li>
                    <li>Community Choice Award: $100,000</li>
                    <li>Best Student Project: $50,000</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Guestbook */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-center bg-[#000080] text-white p-2 mb-4">
                Sign Our Guestbook!
              </h2>
              <div className="bg-[#F0F0F0] p-4 border border-gray-400">
                <form onSubmit={handleGuestbookSubmit} className="mb-4">
                  <textarea
                    value={guestbookEntry}
                    onChange={(e) => setGuestbookEntry(e.target.value)}
                    className="w-full p-2 border border-gray-400"
                    rows={3}
                    placeholder="Leave your message..."
                  />
                  <div className="text-center mt-2">
                    <button
                      type="submit"
                      className="bg-[#000080] text-white px-4 py-2 hover:bg-[#0000A0]"
                    >
                      Sign Guestbook
                    </button>
                  </div>
                </form>
                <div className="space-y-2">
                  {guestbookEntries.map((entry, index) => (
                    <div 
                      key={index}
                      className="bg-white p-2 border border-gray-400"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-[#000080] text-white p-2">
            <p>© 2000 World's Largest Hackathon. All Rights Reserved.</p>
            <p>Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0</p>
          </div>
          <div className="mt-2 flex justify-center space-x-4">
            <img src="/images/netscape.gif" alt="Netscape" className="h-8" />
            <img src="/images/ie.gif" alt="Internet Explorer" className="h-8" />
            <img src="/images/valid-html.gif" alt="Valid HTML" className="h-8" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebEra; 