"use client";

import { useState } from "react";
import LandingHeader from './components/LandingHeader';
import Timeline from './components/Timeline';
import SoundController from "./components/SoundController";

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  
  // Toggle sound mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <main className="min-h-screen">
      <LandingHeader />
      
      {/* Sound Controller */}
      <div className="fixed top-4 right-4 z-50">
      <SoundController 
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
              </div>
              
      {/* Main Timeline Component */}
      <Timeline />
    </main>
  );
}
