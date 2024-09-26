/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/telegram-webhook',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/telegram-web-app.js',
        destination: 'https://telegram.org/js/telegram-web-app.js',
      },
    ];
  },
};

export default nextConfig;