import React, { useEffect, useRef } from 'react';

const ScrollingText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let position = container.clientWidth;
    const animate = () => {
      position--;
      if (position < -container.scrollWidth) {
        position = container.clientWidth;
      }
      container.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    };

    animate();
  }, [text]);

  return (
    <div className="overflow-hidden w-full">
      <div ref={containerRef} className="whitespace-nowrap">
        {text}
      </div>
    </div>
  );
};

export default ScrollingText;