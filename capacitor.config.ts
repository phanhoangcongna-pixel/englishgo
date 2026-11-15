import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.englishgo.app',
  appName: 'EnglishGo',
  webDir: 'www',
  bundledWebRuntime: false,
  backgroundColor: '#142342',
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#142342'
  }
};

export default config;
