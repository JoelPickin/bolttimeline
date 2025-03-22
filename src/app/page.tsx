"use client";

import { useState, useEffect } from "react";
import LandingHeader from './components/LandingHeader';
import Timeline from './components/Timeline';
import SoundController from "./components/SoundController";

// Using a client component for the entire app
export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // Toggle sound mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Set client-side marker
  useEffect(() => {
    console.log("Page loaded, timeline should be displayed");
    setIsClient(true);
  }, []);

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
              
      {/* Main Timeline Component - Only render on client side */}
      {isClient && <Timeline />}
    </main>
  );
}
