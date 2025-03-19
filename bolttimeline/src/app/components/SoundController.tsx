import React, { useEffect, useRef, useState } from "react";

interface SoundControllerProps {
  currentEra: number;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundController: React.FC<SoundControllerProps> = ({ 
  currentEra, 
  isMuted, 
  toggleMute 
}) => {
  // Sound references
  const punchCardSound = useRef<HTMLAudioElement | null>(null);
  const terminalSound = useRef<HTMLAudioElement | null>(null);
  const dialupSound = useRef<HTMLAudioElement | null>(null);
  const webClickSound = useRef<HTMLAudioElement | null>(null);
  const aiSound = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio elements
    if (typeof window !== 'undefined') {
      punchCardSound.current = new Audio('/sounds/punchcard.mp3');
      terminalSound.current = new Audio('/sounds/terminal.mp3');
      dialupSound.current = new Audio('/sounds/dialup.mp3');
      webClickSound.current = new Audio('/sounds/webclick.mp3');
      aiSound.current = new Audio('/sounds/ai.mp3');
      
      // Set loop and volume
      [punchCardSound, terminalSound, dialupSound, webClickSound, aiSound].forEach(sound => {
        if (sound.current) {
          sound.current.volume = 0.3;
        }
      });
    }
    
    // Cleanup
    return () => {
      [punchCardSound, terminalSound, dialupSound, webClickSound, aiSound].forEach(sound => {
        sound.current?.pause();
      });
    };
  }, []);
  
  // Play era-specific sound
  const playEraSound = (era: number) => {
    if (isMuted) return;
    
    // Stop all sounds first
    [punchCardSound, terminalSound, dialupSound, webClickSound, aiSound].forEach(sound => {
      sound.current?.pause();
      if (sound.current) sound.current.currentTime = 0;
    });
    
    // Play the appropriate sound
    switch (era) {
      case 0:
        punchCardSound.current?.play();
        break;
      case 1:
        terminalSound.current?.play();
        break;
      case 2:
        dialupSound.current?.play();
        break;
      case 3:
        webClickSound.current?.play();
        break;
      case 4:
        aiSound.current?.play();
        break;
    }
  };
  
  // Play sound when era changes
  useEffect(() => {
    playEraSound(currentEra);
  }, [currentEra, isMuted]);
  
  return (
    <button 
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-black/70 rounded-full flex items-center justify-center"
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
      title={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
};

export default SoundController; 