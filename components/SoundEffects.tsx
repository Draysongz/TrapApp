import React, { useEffect, useRef } from 'react';

interface SoundEffectsProps {
  children: React.ReactNode;
}

export const SoundContext = React.createContext<{
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

export const SoundEffects: React.FC<SoundEffectsProps> = ({ children }) => {
  const clickSound = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const startSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSound.current = new Audio('/sounds/click.mp3');
    successSound.current = new Audio('/sounds/success.mp3');
    errorSound.current = new Audio('/sounds/error.mp3');
    startSound.current = new Audio('/sounds/start.mp3');
    console.log('Start sound loaded:', startSound.current);
    
    // Add event listeners to check if the audio is loaded correctly
    startSound.current.addEventListener('canplaythrough', () => console.log('Start sound can play through'));
    startSound.current.addEventListener('error', (e) => console.error('Error loading start sound:', e));
  }, []);

  const playClick = () => {
    console.log('Attempting to play click sound');
    clickSound.current?.play().catch(e => console.error('Error playing click sound:', e));
  };
  const playSuccess = () => {
    console.log('Attempting to play success sound');
    successSound.current?.play().catch(e => console.error('Error playing success sound:', e));
  };
  const playError = () => {
    console.log('Attempting to play error sound');
    errorSound.current?.play().catch(e => console.error('Error playing error sound:', e));
  };
  const playStart = () => {
    console.log('Attempting to play start sound');
    if (startSound.current) {
      startSound.current.play()
        .then(() => console.log('Start sound played successfully'))
        .catch(e => console.error('Error playing start sound:', e));
    } else {
      console.error('Start sound not loaded');
    }
  };

  return (
    <SoundContext.Provider value={{ playClick, playSuccess, playError, playStart }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSounds = () => React.useContext(SoundContext);