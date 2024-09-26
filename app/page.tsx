'use client';

import { AppComponent } from '@/components/app';
import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function Page() {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Uncaught error:', error);
      setHasError(true);
      setErrorMessage(error.message);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h1>Something went wrong. Please try refreshing the page.</h1>
        <p>Error details: {errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
        onError={(e) => {
          console.error('Script load error:', e);
          setHasError(true);
          setErrorMessage('Failed to load Telegram Web App script');
        }}
      />
      <main>
        <AppComponent />
      </main>
    </>
  );
}