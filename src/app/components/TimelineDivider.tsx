'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TimelineDividerProps {
  period: string;
  description?: string;
  era?: 'punchcard' | 'terminal' | 'dotcom' | 'web2' | 'ai' | 'future';
}

const TimelineDivider: React.FC<TimelineDividerProps> = ({ period, description, era }) => {
  const dividerRef = useRef(null);
  const isInView = useInView(dividerRef, { once: false, amount: 0.3 });
  
  // Era-specific styles
  const eraStyles = {
    punchcard: {
      background: 'from-[#E8E0D0] via-[#E8E0D0] to-[#E8E0D0]',
      text: 'from-black to-black',
      border: 'border-[#D0C8B8]',
      accent: '#8B7355'
    },
    terminal: {
      background: 'from-black via-black to-black',
      text: 'from-[#33FF33] to-[#33FF33]',
      border: 'border-[#33FF33]',
      accent: '#33FF33'
    },
    dotcom: {
      background: 'from-blue-950 via-indigo-900 to-blue-950',
      text: 'from-cyan-300 to-indigo-200',
      border: 'border-cyan-600',
      accent: '#38bdf8'
    },
    web2: {
      background: 'from-[#1877F2] via-[#1877F2] to-[#1877F2]',
      text: 'from-white to-white',
      border: 'border-[#166FE5]',
      accent: '#FFFFFF'
    },
    ai: {
      background: 'from-black via-black to-black',
      text: 'from-purple-400 to-cyan-400',
      border: 'border-purple-700',
      accent: '#C084FC'
    },
    future: {
      background: 'from-white via-white to-white',
      text: 'from-black to-black',
      border: 'border-black/30',
      accent: '#000000'
    }
  };

  const currentStyle = eraStyles[era || 'punchcard'];
  
  return (
    <motion.div 
      ref={dividerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`relative w-full bg-gradient-to-r ${currentStyle.background} py-8 md:py-12 px-4 flex flex-col items-center justify-center overflow-hidden`}
    >
      {/* Left divider line for desktop */}
      <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block">
        <motion.div 
          className={`h-full w-full bg-gradient-to-b from-transparent via-[${currentStyle.accent}] to-transparent opacity-30`}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        ></motion.div>
      </div>
      
      {/* Subtle separator line */}
      <div className="w-full max-w-4xl mx-auto relative z-10">
        <motion.div 
          className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[${currentStyle.accent}] to-transparent opacity-20`}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        ></motion.div>
        
        {/* Time period text */}
        <div className="text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`text-3xl md:text-4xl font-medium mb-1 ${
              era === 'punchcard' ? 'font-mono font-bold tracking-wide text-black' : 
              era === 'dotcom' ? 'font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text : 
              era === 'web2' ? 'font-sans font-bold tracking-normal text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text : 
              era === 'future' ? 'text-black' :
              'text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text
            }`}
          >
            {period}
          </motion.h2>
          
          {description && (
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-sm md:text-base max-w-2xl mx-auto ${
                era === 'punchcard' ? 'font-mono font-semibold opacity-90 text-black' : 
                era === 'dotcom' ? 'font-semibold opacity-90 text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text : 
                era === 'web2' ? 'font-sans font-semibold opacity-100 text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text : 
                era === 'future' ? 'text-black opacity-70' :
                'opacity-70 text-transparent bg-clip-text bg-gradient-to-r ' + currentStyle.text
              }`}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <motion.div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 opacity-10 pointer-events-none`}
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${currentStyle.text} blur-xl`}></div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineDivider; 