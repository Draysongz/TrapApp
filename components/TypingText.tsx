import React, { useState, useEffect, useRef } from 'react';

const TypeWriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const i = useRef(0); // Using useRef to keep track of the current index

  useEffect(() => {
    const interval = setInterval(() => {
      if (i.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i.current)); // Append the next character
        i.current++; // Move to the next character
      } else {
        clearInterval(interval); // Clear interval once the text is fully typed
      }
    }, speed);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [text, speed]);

  return <div>{displayedText}</div>; // Display the typed text
};

export default TypeWriter;
