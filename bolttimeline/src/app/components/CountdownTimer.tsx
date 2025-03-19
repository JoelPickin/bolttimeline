import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const calculateTimeLeft = () => {
    const difference = targetDate.getTime() - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  const addLeadingZero = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };
  
  return (
    <div className={`countdown-wrapper ${className}`}>
      <div className="flex justify-center gap-4">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, index) => {
          const value = timeLeft[unit.toLowerCase() as keyof TimeLeft];
          return (
            <div key={unit} className="time-unit">
              <div className="time-value">{addLeadingZero(value)}</div>
              <div className="time-label">{unit}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CountdownTimer; 