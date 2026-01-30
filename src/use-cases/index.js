// Export all backend handler modules for easy importing (CommonJS version)
const { registerElectronIntroHandlers } = require('./electron-intro-handler');
const { registerElectronArchitectureHandlers } = require('./electron-architecture-handler');
const { registerElectronSecurityHandlers } = require('./electron-security-handler');
const { registerElectronPackagingHandlers } = require('./electron-packaging-handler');
const { registerElectronNativeApisHandlers } = require('./electron-native-apis-handler');
const { registerElectronPerformanceHandlers } = require('./electron-performance-handler');
const { registerElectronDevelopmentHandlers } = require('./electron-development-handler');
const { registerElectronVersionsHandlers } = require('./electron-versions-handler');

module.exports = {
  registerElectronIntroHandlers,
  registerElectronArchitectureHandlers,
  registerElectronSecurityHandlers,
  registerElectronPackagingHandlers,
  registerElectronNativeApisHandlers,
  registerElectronPerformanceHandlers,
  registerElectronDevelopmentHandlers,
  registerElectronVersionsHandlers
};