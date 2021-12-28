module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@components': './components',
            '@screens': './screens',
            '@state': './state',
            '@navigation': './navigation',
            '@hooks': './hooks',
            '@utils': './utils',
            '@images': './assets/images',
            '@fonts': './assets/fonts',
            '@icons': './assets/icons',
            '@types': './types',
          },
        },
      ],
    ],
  }
}
