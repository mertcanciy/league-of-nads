import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const cspDev = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: blob: data:",
  "script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https: blob: data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' ws: wss: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src https:",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const cspProd = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob: data:",
  "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https: blob: data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https: wss: ws: https://*.privy.io https://*.vercel.app https://*.monad.xyz https://testnet.monadexplorer.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https: https://*.privy.io data:",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Only apply CSP in production, not in development
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy',
            value: cspProd,
          }]),
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
