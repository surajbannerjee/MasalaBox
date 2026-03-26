module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // NativeWind removed — no extra plugins here.
  };
};
