'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FutureEraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

// Create a client-only component with no random values during rendering
const FutureEra: React.FC<FutureEraProps> = ({ onEggCollect, isActive }) => {
  // Use useState for all values
  const [isClient, setIsClient] = useState(false);
  const [currentThought, setCurrentThought] = useState("");
  const [thoughtIndex, setThoughtIndex] = useState(0);

  // Static values 
  const thoughts = [
    "Connecting to Neuralink...",
    "Please think your action.",
    "I love cheese.",
    "Deploying teleportation server...",
    "Why does every project need auth?",
    "Make my brain run Docker.",
    "Is this still a hackathon or are we all NPCs?",
    "Error: thoughts exceeded quota.",
    "Running script: /reality/reset",
    "Just vibing in the quantum realm.",
    "Who let the AI write this section?"
  ];

  // Client-side only effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Start thought sequence only on client-side
  useEffect(() => {
    if (!isClient || !isActive) return;

    // Simple thought sequence
    const thoughtInterval = setInterval(() => {
      setCurrentThought(thoughts[thoughtIndex]);
      setThoughtIndex((prevIndex) => (prevIndex + 1) % thoughts.length);
    }, 3000);

    return () => clearInterval(thoughtInterval);
  }, [isClient, isActive, thoughts, thoughtIndex]);

  // Easter egg
  useEffect(() => {
    if (!isClient || !isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEggCollect('future-egg');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, isActive, onEggCollect]);

  // Show nothing during server-side rendering to avoid hydration mismatches
  if (!isClient) {
    return <div className="min-h-screen bg-white"></div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div 
        key={thoughtIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="font-mono text-xl text-black text-center"
      >
        {currentThought}
      </motion.div>
      
      {/* Blinking cursor */}
      <motion.div
        className="h-5 w-1 bg-black ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Hidden hint */}
      <div className="absolute bottom-4 text-black opacity-5 text-xs">
        Press ESC to exit the thought interface
      </div>
    </div>
  );
};

export default FutureEra; 