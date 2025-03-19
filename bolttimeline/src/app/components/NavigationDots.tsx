import React from "react";

interface NavigationDotsProps {
  currentEra: number;
  onEraChange: (era: number) => void;
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ currentEra, onEraChange }) => {
  const eraTitles = ["1950s", "1970s", "1990s", "2000s", "2020s"];
  
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-4">
      {eraTitles.map((title, index) => (
        <button
          key={index}
          className={`w-4 h-4 rounded-full ${
            currentEra === index
              ? "bg-white scale-125 shadow-lg shadow-white/20"
              : "bg-white/30 hover:bg-white/70"
          } transition-all duration-300`}
          onClick={() => onEraChange(index)}
          aria-label={`Navigate to ${title} era`}
          title={title}
        />
      ))}
    </div>
  );
};

export default NavigationDots; 