declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface WithPWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
  }
  
  export default function withPWA(config: WithPWAConfig): (config: NextConfig) => NextConfig;
}
