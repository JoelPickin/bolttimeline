import React, { useState } from 'react';

interface EasterEggProps {
  era: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  children: React.ReactNode;
  onCollect: (era: number) => void;
}

const EasterEgg: React.FC<EasterEggProps> = ({ era, position, children, onCollect }) => {
  const [isCollected, setIsCollected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-10 left-10';
      case 'top-right':
        return 'top-10 right-10';
      case 'bottom-left':
        return 'bottom-10 left-10';
      case 'bottom-right':
        return 'bottom-10 right-10';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return '';
    }
  };
  
  // Handle click on easter egg
  const handleClick = () => {
    if (!isCollected) {
      setIsCollected(true);
      onCollect(era);
      // Play collecting animation
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    }
  };
  
  // Show the easter egg after a delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000 + Math.random() * 3000); // Random delay for more fun
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`absolute ${getPositionClasses()} z-30 cursor-pointer transition-all duration-500 ${
        isCollected 
          ? 'scale-150 opacity-0' 
          : 'hover:scale-110 hover:rotate-12 opacity-60 hover:opacity-100'
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default EasterEgg; 