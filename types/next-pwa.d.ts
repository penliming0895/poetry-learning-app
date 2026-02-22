declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    sw?: string;
    scope?: string;
    reloadOnOnline?: boolean;
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    publicExcludes?: string[];
    buildExcludes?: string[];
    runtimeCaching?: any[];
    fallbacks?: Record<string, string>;
    cacheOnFrontendNav?: boolean;
    aggressiveFrontEndNavCaching?: boolean;
    disableDevLogs?: boolean;
    workboxOptions?: any;
  }

  export default function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
