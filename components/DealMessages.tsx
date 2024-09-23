import React, { useState, useEffect } from 'react';

const messages = [
  "Yo, got any Purple Haze?",
  "Need that Crystal Blue ASAP",
  "Hook me up with some Green Machine",
  "Looking for that good stuff",
  "Dealer, you there? Need a fix",
  "Got any specials running?",
  "Heard you got the best product in town",
  "Can I get a sample of that new batch?",
  "Where the hell are you? I've been waiting for hours!",
  "You're late again! This is the last time, I swear",
  "If you don't show up in 5, I'm finding a new plug",
  "Answer your damn phone! I need my stuff NOW",
  "You call this customer service? I'm fuming!",
  "Late again? You're killing me, man",
  "I've got cash in hand. Don't keep me waiting!",
  "My patience is wearing thin. Where are you?",
];

const DealMessages: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<{ id: number; message: string; isLeaving: boolean } | null>(null);
  const [nextMessage, setNextMessage] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentMessage) {
        setCurrentMessage(prev => prev ? { ...prev, isLeaving: true } : null);
        setTimeout(() => {
          setCurrentMessage(nextMessage ? { ...nextMessage, isLeaving: false } : null);
          setNextMessage(null);
        }, 500); // Half the interval for smooth transition
      } else {
        setCurrentMessage({
          id: Date.now(),
          message: messages[Math.floor(Math.random() * messages.length)],
          isLeaving: false
        });
      }
    }, 5000);  // New message every 5 seconds

    return () => clearInterval(interval);
  }, [currentMessage, nextMessage]);

  useEffect(() => {
    if (currentMessage && !nextMessage) {
      setTimeout(() => {
        setNextMessage({
          id: Date.now(),
          message: messages[Math.floor(Math.random() * messages.length)]
        });
      }, 4500); // Set next message slightly before current message leaves
    }
  }, [currentMessage, nextMessage]);

  return (
    <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
      {currentMessage && (
        <div 
          key={currentMessage.id}
          className={`absolute w-full bg-green-900 bg-opacity-30 text-green-400 px-4 py-2 border-b border-green-400 pixelated text-sm ${
            currentMessage.isLeaving ? 'animate-swipeUp' : 'animate-slideDown'
          }`}
        >
          {currentMessage.message}
        </div>
      )}
    </div>
  );
};

export default DealMessages;