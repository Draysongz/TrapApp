import { AppComponent } from '@/components/app';
import Script from 'next/script';

export default function Page() {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <main>
        <AppComponent />
      </main>
    </>
  );
}