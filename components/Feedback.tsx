'use client';

import React from 'react';

interface FeedbackProps {
  children: React.ReactNode;
}

export const FeedbackContext = React.createContext<{
  playClick: () => void;
  playSuccess: () => void;
  playError: () => void;
  playStart: () => void;
}>({
  playClick: () => {},
  playSuccess: () => {},
  playError: () => {},
  playStart: () => {},
});

export const Feedback: React.FC<FeedbackProps> = ({ children }) => {
  const playClick = () => {
    console.log('Click feedback');
  };
  const playSuccess = () => {
    console.log('Success feedback');
  };
  const playError = () => {
    console.log('Error feedback');
  };
  const playStart = () => {
    console.log('Start feedback');
  };

  return (
    <FeedbackContext.Provider value={{ playClick, playSuccess, playError, playStart }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => React.useContext(FeedbackContext);