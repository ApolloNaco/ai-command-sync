import * as vscode from 'vscode';
import { SyncConfig } from './types';

/**
 * Configuration manager for AI Command Sync
 */
export class ConfigManager {
  private readonly configSection = 'aiCommandSync';

  /**
   * Get current sync configuration
   */
  public getConfig(): SyncConfig {
    const config = vscode.workspace.getConfiguration(this.configSection);

    return {
      gitRepo: config.get<string>('gitRepo', 'https://github.com/ApolloNaco/AITools.git'),
      remotePath: config.get<string>('remotePath', 'cursor/commands'),
      localPath: config.get<string>('localPath', '.cursor/commands'),
      branch: config.get<string>('branch', 'master'),
      autoSync: config.get<boolean>('autoSync', false),
      autoSyncInterval: config.get<number>('autoSyncInterval', 7),
      showNotification: config.get<boolean>('showNotification', true),
      enablePrompt: config.get<boolean>('enablePrompt', true)
    };
  }

  /**
   * Update a configuration value
   */
  public async updateConfig<K extends keyof SyncConfig>(
    key: K,
    value: SyncConfig[K],
    global: boolean = false
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.configSection);
    await config.update(key, value, global ? vscode.ConfigurationTarget.Global : vscode.ConfigurationTarget.Workspace);
  }

  /**
   * Watch for configuration changes
   */
  public onConfigChange(callback: (e: vscode.ConfigurationChangeEvent) => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration(this.configSection)) {
        callback(e);
      }
    });
  }

  /**
   * Get a specific configuration value
   */
  public getValue<T>(key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration(this.configSection);
    return config.get<T>(key, defaultValue);
  }
}
