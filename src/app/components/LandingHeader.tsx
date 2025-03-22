'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Define particle interface for type safety
interface Particle {
  id: number;
  size: number;
  left: string;
  top: string;
  depth: number;
  duration: number;
  delay: number;
}

const LandingHeader = () => {
  const scrollPromptRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Initialize particles only on client-side
  useEffect(() => {
    setIsClient(true);
    
    // Generate stable particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      depth: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 2
    }));
    
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollPromptRef.current) {
        const opacity = Math.max(0, 1 - window.scrollY / 300);
        scrollPromptRef.current.style.opacity = opacity.toString();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Typewriter animation for paragraph
  const sentence = "Join the world's largest hackathon and shape the next era of innovation. From punch cards to AI copilots—building the future starts by understanding where we've been.";
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(75, 85, 99, 0.4) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating particles with parallax - Only rendered client-side */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div 
              key={particle.id}
              className="absolute rounded-full bg-cyan-500 opacity-20"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: particle.left,
                top: particle.top,
                x: mousePosition.x * 30 * particle.depth,
                y: mousePosition.y * 30 * particle.depth,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: particle.delay
              }}
            />
          ))}
        </div>
      )}
      
      {/* Data pulse animations */}
      <motion.div
        className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
        style={{ top: '30%' }}
        animate={{ 
          left: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          repeatDelay: 5
        }}
      />
      
      <motion.div
        className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent opacity-30"
        style={{ top: '70%' }}
        animate={{ 
          left: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 7,
          repeatDelay: 6, 
          delay: 3
        }}
      />

      {/* Neon Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-70" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
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
            transition={{ 
              delay: 0.2, 
              duration: 0.5,
            }}
            className="inline-block px-6 py-2 mb-8 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 border border-white/10 relative overflow-hidden"
            style={{
              boxShadow: '0 0 15px rgba(0, 242, 255, 0.4), 0 0 30px rgba(0, 242, 255, 0.2)'
            }}
          >
            {/* Shimmer effect */}
            <motion.div 
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 opacity-30"
              animate={{ 
                left: ['-100%', '100%']
              }}
              transition={{ 
                repeat: Infinity,
                duration:.8,
                repeatDelay: 3
              }}
            />
            
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center justify-center gap-1"
            >
              <span role="img" aria-label="money" className="text-yellow-300">💰</span>
              $1M+ in Prizes • 100,000+ Global Hackers
              <span role="img" aria-label="globe" className="text-blue-300">🌐</span>
            </motion.span>
          </motion.div>

          {/* Main Headline with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-3 text-transparent"
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(to right, #00f2ff, #ff00ff, #00f2ff)',
                backgroundSize: '200% auto',
                textShadow: '0 0 20px rgba(0, 242, 255, 0.2), 0 0 10px rgba(255, 0, 255, 0.2)'
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              The World's Largest Hackathon
            </motion.h1>
            
            {/* Subtitle line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl md:text-2xl font-medium mb-6 text-transparent"
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(to right, #00f2ff, #ff00ff)',
                textShadow: '0 0 10px rgba(0, 242, 255, 0.1)'
              }}
            >
              One event. Every era of computing.
            </motion.p>
          </motion.div>

          {/* Subheading */}
          <h2 className="text-2xl md:text-3xl text-gray-200 mb-8 font-light">
            Timeline of Computing & Innovation
          </h2>
          
          {/* Paragraph with improved readability */}
          <div className="max-w-2xl mx-auto mb-12">
            <motion.p 
              className="text-lg text-gray-300 leading-relaxed tracking-wide font-normal"
              style={{ lineHeight: '1.8' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1 }}
            >
              Join the world's largest hackathon and shape the next era of innovation. From punch cards to AI copilots—building the future starts by understanding where we've been.
            </motion.p>
          </div>

          {/* Register Now Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 242, 255, 0.6), 0 0 40px rgba(0, 242, 255, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 mb-12 text-xl font-bold text-white rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 relative overflow-hidden group"
            style={{
              boxShadow: '0 0 15px rgba(0, 242, 255, 0.4), 0 0 30px rgba(0, 242, 255, 0.2)'
            }}
          >
            <span className="relative z-10">Register Now</span>
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              animate={{ backgroundPosition: ['0% center', '200% center'] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% auto' }}
            />
          </motion.button>

          {/* Enhanced Navigation Instructions */}
          <div ref={scrollPromptRef} className="mt-12">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-300"
            >
              <p className="text-lg mb-3 font-medium">Explore the Evolution of Computing</p>
              
              <motion.div
                whileHover={{ scale: 1.2, y: 5 }}
                animate={{ 
                  boxShadow: ['0 0 5px rgba(0, 242, 255, 0.4)', '0 0 20px rgba(0, 242, 255, 0.6)', '0 0 5px rgba(0, 242, 255, 0.4)']
                }}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity },
                  y: { duration: 0.2 }
                }}
                className="mx-auto w-10 h-10 flex items-center justify-center rounded-full p-2"
              >
                <svg
                  className="w-8 h-8 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 242, 255, 0.6))'
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingHeader; 