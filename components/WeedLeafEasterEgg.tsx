import React, { useEffect, useState } from 'react';

interface WeedLeafProps {
  isActive: boolean;
}

const WeedLeaf: React.FC = () => {
  const randomRotation = Math.random() * 360;
  const randomDuration = 3 + Math.random() * 7; // 3-10 seconds
  const randomDelay = Math.random() * 5; // 0-5 seconds delay
  const randomSize = 24 + Math.random() * 48; // 24-72px
  const randomOpacity = 0.5 + Math.random() * 0.5; // 0.5-1 opacity

  return (
    <div 
      className="absolute text-green-400 animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        fontSize: `${randomSize}px`,
        opacity: randomOpacity,
        animation: `
          float ${randomDuration}s ease-in-out infinite ${randomDelay}s, 
          rotate ${randomDuration * 0.7}s linear infinite ${randomDelay}s,
          pulse ${randomDuration * 0.5}s ease-in-out infinite ${randomDelay}s
        `,
        transform: `rotate(${randomRotation}deg)`,
      }}
    >
      🍁
    </div>
  );
};

const WeedLeafEasterEgg: React.FC<WeedLeafProps> = ({ isActive }) => {
  const [leaves, setLeaves] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isActive) {
      const newLeaves = Array.from({ length: 100 }, (_, i) => <WeedLeaf key={i} />);
      setLeaves(newLeaves);

      const interval = setInterval(() => {
        setLeaves(prevLeaves => [
          ...prevLeaves.slice(1),
          <WeedLeaf key={Date.now()} />
        ]);
      }, 200); // Add a new leaf every 200ms

      return () => clearInterval(interval);
    } else {
      setLeaves([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {leaves}
    </div>
  );
};

export default WeedLeafEasterEgg;