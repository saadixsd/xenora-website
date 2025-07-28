import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d5c966181a294a03af51178a70f6d470',
  appName: 'xenoraai',
  webDir: 'dist',
  server: {
    url: 'https://d5c96618-1a29-4a03-af51-178a70f6d470.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1b23',
      showSpinner: false
    }
  }
};

export default config;