import 'dotenv/config'

export default {
  name: 'Po Meste',
  owner: 'bratislava',
  slug: 'hybaj',
  version: '1.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.bratislava.hybaj',
    supportsTablet: false,
    buildNumber: '17',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Allow the app to use your location to show it on map and suggest navigation.',
    },
    config: {
      usesNonExemptEncryption: false,
      googleMapsApiKey: process.env.GOOGLE_IOS_API_KEY,
    },
  },
  locales: {
    sk: './languages/slovak.json',
  },
  android: {
    softwareKeyboardLayoutMode: 'pan',
    package: 'com.bratislava.hybaj',
    versionCode: 17,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_ANDROID_API_KEY,
      },
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    apiHost: 'https://live-dev.planner.bratislava.sk',
    googleIOsPlacesApiKey: process.env.GOOGLE_IOS_API_KEY,
    googleAndroidPlacesApiKey: process.env.GOOGLE_ANDROID_API_KEY,
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
