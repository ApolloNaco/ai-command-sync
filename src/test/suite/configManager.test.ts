import * as assert from 'assert';
import { ConfigManager } from '../../configManager';

suite('ConfigManager Test Suite', () => {
  let configManager: ConfigManager;

  setup(() => {
    configManager = new ConfigManager();
  });

  test('Should get default configuration', () => {
    const config = configManager.getConfig();

    assert.strictEqual(config.gitRepo, 'https://github.com/ApolloNaco/AITools.git');
    assert.strictEqual(config.remotePath, 'cursor/commands');
    assert.strictEqual(config.localPath, '.cursor/commands');
    assert.strictEqual(config.branch, 'master');
    assert.strictEqual(config.autoSync, false);
    assert.strictEqual(config.autoSyncInterval, 7);
    assert.strictEqual(config.showNotification, true);
    assert.strictEqual(config.enablePrompt, true);
  });

  test('Should get specific value', () => {
    const gitRepo = configManager.getValue('gitRepo', '');
    assert.ok(gitRepo.length > 0);
  });
});
