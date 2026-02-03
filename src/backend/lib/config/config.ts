import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';
import { FileUtils } from '../filesystem/files';
import { SystemUtils } from '../system/system';

/**
 * Configuration utilities
 */
export namespace ConfigUtils {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  const logger = SystemUtils.createLogger('ConfigUtils');

  /**
   * Loads configuration from file
   * @param defaults - Default configuration values
   * @returns Configuration object
   */
  export function loadConfig<T>(defaults: T): T {
    try {
      if (!fs.existsSync(configPath)) {
        logger.info('Config file does not exist, using defaults');
        saveConfig(defaults);
        return defaults;
      }

      const config = FileUtils.readJsonFile<T>(configPath, defaults);
      logger.info('Configuration loaded successfully');
      return config;
    } catch (error) {
      logger.error('Failed to load configuration, using defaults', error);
      return defaults;
    }
  }

  /**
   * Saves configuration to file
   * @param config - Configuration object to save
   * @returns True if successful
   */
  export function saveConfig<T>(config: T): boolean {
    try {
      const success = FileUtils.writeJsonFile(configPath, config);
      if (success) {
        logger.info('Configuration saved successfully');
      } else {
        logger.error('Failed to save configuration');
      }
      return success;
    } catch (error) {
      logger.error('Failed to save configuration', error);
      return false;
    }
  }

  /**
   * Updates specific configuration values
   * @param updates - Partial configuration updates
   * @returns True if successful
   */
  export function updateConfig<T>(updates: Partial<T>): boolean {
    const currentConfig = loadConfig<T>({} as T);
    const newConfig = { ...currentConfig, ...updates };
    return saveConfig(newConfig);
  }
}

export default ConfigUtils;