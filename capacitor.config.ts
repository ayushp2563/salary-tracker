import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ebf5c10c4a194af4acaa6525b3044f43',
  appName: 'salarytracker',
  webDir: 'dist',
  server: {
    url: 'https://ebf5c10c-4a19-4af4-acaa-6525b3044f43.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
