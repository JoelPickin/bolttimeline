'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LandingHeader = () => {
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollPromptRef.current) {
        const opacity = Math.max(0, 1 - window.scrollY / 300);
        scrollPromptRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Neon Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent opacity-50" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Event Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-[#00f2ff] to-[#ff00ff] text-white text-sm font-semibold shadow-lg shadow-[#00f2ff]/20"
          >
            $1M+ in Prizes • 100,000+ Global Hackers
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00f2ff] via-[#ff00ff] to-[#00f2ff]">
            The World's Largest Hackathon
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
            Timeline of Computing & Innovation
          </h2>
          
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-lg text-gray-600 leading-relaxed">
              Join the world's largest hackathon and be a part of innovation that spans the evolution of computing—from punch cards to AI-driven solutions.
            </p>
          </div>

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 mb-12 text-xl font-bold text-white rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#ff00ff] shadow-lg shadow-[#00f2ff]/30 hover:shadow-[#00f2ff]/50 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Register Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff] to-[#00f2ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          {/* Navigation Instructions */}
          <div ref={scrollPromptRef} className="mt-12">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-500"
            >
              <p className="text-lg mb-2">Explore the Evolution of Computing</p>
              <svg
                className="w-8 h-8 mx-auto text-[#00f2ff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Sponsor Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 flex justify-center items-center space-x-8 opacity-50"
        >
          <div className="w-24 h-12 bg-gray-200 rounded" />
          <div className="w-24 h-12 bg-gray-200 rounded" />
          <div className="w-24 h-12 bg-gray-200 rounded" />
          <div className="w-24 h-12 bg-gray-200 rounded" />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingHeader; 