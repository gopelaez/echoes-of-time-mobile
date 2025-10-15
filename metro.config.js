const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// No workspace setup needed - standalone app
module.exports = config;

