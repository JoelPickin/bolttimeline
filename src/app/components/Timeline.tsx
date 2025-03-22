'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Timeline Era Components
import PunchCardEra from './eras/PunchCardEra';
import TerminalEra from './eras/TerminalEra';
import DotComEra from './eras/DotComEra';
import Web2Era from './eras/Web2Era';
import TimelineDivider from './TimelineDivider';

// Temporary dummy components for missing eras
const DummyEra = ({ onEggCollect, isActive }: any) => (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl mb-4">Coming Soon</h2>
      <p>This era is under development</p>
    </div>
  </div>
);

const WebEra = DummyEra;
const AIEra = DummyEra;

// Types
type EraId = 'punchcard' | 'terminal' | 'dotcom' | 'web2' | 'ai';
type DividerId = 'divider-1950s' | 'divider-1970s' | 'divider-1990s' | 'divider-2000s' | 'divider-2025' | 'divider-future';

interface Era {
  id: EraId;
  title: string;
  years: string;
  component: React.FC<EraProps>;
}

interface TimelineDividerInfo {
  id: DividerId;
  period: string;
  description?: string;
}

interface EraProps {
  onEggCollect: (eggId: string) => void;
  isActive: boolean;
}

const Timeline = () => {
  const [activeEra, setActiveEra] = useState<EraId>('punchcard');
  const [collectedEggs, setCollectedEggs] = useState<string[]>([]);
  const [eggNotification, setEggNotification] = useState<{show: boolean, message: string}>({
    show: false,
    message: ''
  });
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const eraRefs = useRef<{ [key in EraId]?: HTMLDivElement }>({});
  const dividerRefs = useRef<{ [key in DividerId]?: HTMLDivElement }>({});
  
  const dividers: TimelineDividerInfo[] = [
    {
      id: 'divider-1950s',
      period: '1950s',
      description: 'The Dawn of Computing'
    },
    {
      id: 'divider-1970s',
      period: '1970s',
      description: 'Command Line Revolution'
    },
    {
      id: 'divider-1990s',
      period: '1990s',
      description: 'The Internet Takes Off'
    },
    {
      id: 'divider-2000s',
      period: '2000s',
      description: 'Social Media Transforms the Web'
    },
    {
      id: 'divider-2025',
      period: '2025',
      description: 'AI Revolutionizes Everything'
    },
    {
      id: 'divider-future',
      period: 'The Future',
      description: 'What comes next?'
    }
  ];

  const eras: Era[] = [
    {
      id: 'punchcard',
      title: 'Punch Card Era',
      years: '1950s-1960s',
      component: PunchCardEra
    },
    {
      id: 'terminal',
      title: 'Terminal Era',
      years: '1970s-1980s',
      component: TerminalEra
    },
    {
      id: 'dotcom',
      title: 'Dot-Com Boom Era',
      years: '1990s - The wild west of the early internet',
      component: DotComEra
    },
    {
      id: 'web2',
      title: 'Web 2.0 Era',
      years: '2000s - The social media revolution',
      component: Web2Era
    },
    {
      id: 'ai',
      title: 'AI Era',
      years: '2010s-Future',
      component: AIEra
    }
  ];
  
  const eggMessages: Record<string, string> = {
    'punchcard-egg': 'You found a punch card from the first computer program!',
    'terminal-egg': 'You discovered the first text-based adventure game!',
    'pc-egg': 'You uncovered a hidden Easter egg from the early GUI days!',
    'web-egg': 'You found a hidden comment in the HTML source code!',
    'web2-egg-1': 'You found a MySpace profile customization Easter egg!',
    'web2-egg-2': 'You discovered the classic "Friend Request Pending" message!',
    'web2-egg-3': 'You found the "Share to Wall" feature from early social media!',
    'web2-egg-4': 'You encountered a classic Web 2.0 comment bug!',
    'web2-egg-5': 'You found the infamous auto-playing profile song!',
    'web2-egg-6': 'You discovered the Facebook poke feature!',
    'ai-egg': 'You discovered the prompt that built this webpage!'
  };
  
  // Track which era is visible as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      // Find which era is most visible in the viewport
      let maxVisibleArea = 0;
      let mostVisibleEraId: EraId = activeEra;
      
      Object.entries(eraRefs.current).forEach(([eraId, element]) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - 
                            Math.max(rect.top, 0);
        
        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          mostVisibleEraId = eraId as EraId;
        }
      });
      
      if (mostVisibleEraId !== activeEra) {
        setActiveEra(mostVisibleEraId);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeEra]);
  
  // Handle egg collection
  const handleEggCollect = (eggId: string) => {
    if (!collectedEggs.includes(eggId)) {
      setCollectedEggs(prev => [...prev, eggId]);
      
      // Show notification
      setEggNotification({
        show: true,
        message: eggMessages[eggId] || 'You found an easter egg!'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setEggNotification({show: false, message: ''});
      }, 3000);
    }
  };
  
  // Navigate to a specific era
  const navigateToEra = (eraId: EraId) => {
    const element = eraRefs.current[eraId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Navigate to a specific divider
  const navigateToDivider = (dividerId: DividerId) => {
    const element = dividerRefs.current[dividerId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="timeline relative w-full">
      {/* Navigation sidebar */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="space-y-8">
          {/* Time period navigation */}
          <div className="mb-8 pb-4 border-b border-gray-700">
            <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">Time Periods</h3>
            <div className="space-y-4">
              {dividers.map((divider) => (
                <div 
                  key={divider.id}
                  className="timeline-nav flex items-center cursor-pointer group"
                  onClick={() => navigateToDivider(divider.id)}
                >
                  <div 
                    className="w-2 h-2 rounded-full bg-[#ff00ff] opacity-50 group-hover:opacity-100 transition-all duration-300"
                  />
                  <div 
                    className="ml-3 text-sm font-medium text-gray-500 group-hover:text-[#ff00ff] transition-all duration-300"
                  >
                    {divider.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Era navigation */}
          <h3 className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">Computing Eras</h3>
          {eras.map((era) => (
            <div 
              key={era.id}
              className="timeline-nav flex items-center cursor-pointer group"
              onClick={() => navigateToEra(era.id)}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeEra === era.id 
                    ? 'bg-[#00f2ff] scale-125' 
                    : 'bg-gray-400 group-hover:bg-[#00f2ff]'
                }`}
              />
              <div 
                className={`ml-3 text-sm font-medium transition-all duration-300 ${
                  activeEra === era.id 
                    ? 'text-[#00f2ff]' 
                    : 'text-gray-500 group-hover:text-[#00f2ff]'
                }`}
              >
                <div>{era.title}</div>
                <div className="text-xs opacity-75">{era.years}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main timeline content */}
      <div className="w-full">
        {/* First divider before any content */}
        <div ref={el => { if (el) dividerRefs.current['divider-1950s'] = el; }}>
          <TimelineDivider 
            period={dividers[0].period} 
            description={dividers[0].description}
            era="punchcard"
          />
        </div>
        
        {/* First era */}
        <div 
          ref={el => { if (el) eraRefs.current['punchcard'] = el; }}
          className="w-full"
        >
          <PunchCardEra 
            onEggCollect={handleEggCollect} 
            isActive={activeEra === 'punchcard'} 
          />
        </div>
        
        {/* 1970s divider */}
        <div ref={el => { if (el) dividerRefs.current['divider-1970s'] = el; }}>
          <TimelineDivider 
            period={dividers[1].period} 
            description={dividers[1].description}
            era="terminal"
          />
        </div>
        
        {/* Terminal era */}
        <div 
          ref={el => { if (el) eraRefs.current['terminal'] = el; }}
          className="w-full"
        >
          <TerminalEra 
            onEggCollect={handleEggCollect} 
            isActive={activeEra === 'terminal'} 
          />
        </div>
        
        {/* 1990s divider */}
        <div ref={el => { if (el) dividerRefs.current['divider-1990s'] = el; }}>
          <TimelineDivider 
            period={dividers[2].period} 
            description={dividers[2].description}
            era="dotcom"
          />
        </div>
        
        {/* Dot-Com era */}
        <div 
          ref={el => { if (el) eraRefs.current['dotcom'] = el; }}
          className="w-full"
        >
          <DotComEra 
            onEggCollect={handleEggCollect} 
            isActive={activeEra === 'dotcom'} 
          />
        </div>
        
        {/* 2000s divider */}
        <div ref={el => { if (el) dividerRefs.current['divider-2000s'] = el; }}>
          <TimelineDivider 
            period={dividers[3].period} 
            description={dividers[3].description}
            era="web2"
          />
        </div>
        
        {/* Web 2.0 era */}
        <div 
          ref={el => { if (el) eraRefs.current['web2'] = el; }}
          className="w-full"
        >
          <Web2Era 
            onEggCollect={handleEggCollect} 
            isActive={activeEra === 'web2'} 
          />
        </div>
        
        {/* 2025 divider */}
        <div ref={el => { if (el) dividerRefs.current['divider-2025'] = el; }}>
          <TimelineDivider 
            period={dividers[4].period} 
            description={dividers[4].description}
            era="ai"
          />
        </div>
        
        {/* AI era */}
        <div 
          ref={el => { if (el) eraRefs.current['ai'] = el; }}
          className="w-full"
        >
          <AIEra 
            onEggCollect={handleEggCollect} 
            isActive={activeEra === 'ai'} 
          />
        </div>
        
        {/* The Future divider */}
        <div ref={el => { if (el) dividerRefs.current['divider-future'] = el; }}>
          <TimelineDivider 
            period={dividers[5].period} 
            description={dividers[5].description}
            era="ai"
          />
        </div>
        
        {/* Final blank space for future content */}
        <div className="h-32 md:h-64 w-full bg-gradient-to-b from-black to-transparent" />
      </div>
      
      {/* Easter egg notification */}
      {eggNotification.show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-black/80 text-white px-6 py-4 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center">
            <span className="text-[#00f2ff] mr-2">✨</span>
            <span>{eggNotification.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Timeline; 