import 'dotenv/config'

export default {
  name: 'hybaj',
  owner: 'bratislava',
  slug: 'hybaj',
  version: '1.0.6',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    softwareKeyboardLayoutMode: 'pan',
    package: 'com.bratislava.hybaj',
    versionCode: 6,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    apiHost: 'https://live-dev.planner.bratislava.sk',
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
  },
  packagerOpts: {
    config: 'metro.config.js',
    sourceExts: [
      'expo.ts',
      'expo.tsx',
      'expo.js',
      'expo.jsx',
      'ts',
      'tsx',
      'js',
      'jsx',
      'json',
      'wasm',
      'svg',
    ],
  },
  plugins: ['sentry-expo'],
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'bratislava-city-hall', // Sentry Organization settings tab
          project: 'hybaj-react-native', //Sentry Settings > General Settings tab
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
}
