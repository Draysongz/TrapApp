import React, { useState, useEffect } from 'react';

const BlinkingText: React.FC<{ text: string }> = ({ text }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ visibility: visible ? 'visible' : 'hidden' }}>
      {text}
    </span>
  );
};

export default BlinkingText;