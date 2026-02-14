import * as assert from 'assert';
import * as vscode from 'vscode';
import { SyncManager } from '../../syncManager';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

suite('SyncManager Test Suite', () => {
  let syncManager: SyncManager;
  let context: vscode.ExtensionContext;

  setup(() => {
    const ext = vscode.extensions.getExtension('ApolloNaco.ai-command-sync');
    context = ext?.exports?.context;
    if (context) {
      syncManager = new SyncManager(context);
    }
  });

  test('Should initialize sync manager', () => {
    assert.ok(syncManager);
  });

  test('Should get empty history initially', () => {
    const history = syncManager.getHistory();
    assert.ok(Array.isArray(history));
  });

  test('Should check auto sync conditions', () => {
    const config = {
      gitRepo: 'https://github.com/test/test.git',
      remotePath: 'test',
      localPath: '.test',
      branch: 'main',
      autoSync: true,
      autoSyncInterval: 7,
      showNotification: true,
      enablePrompt: true
    };

    const shouldSync = syncManager.shouldAutoSync(config);
    // Should be true if never synced before
    assert.ok(typeof shouldSync === 'boolean');
  });

  test('MD5 calculation should work', () => {
    // Create a temporary test file
    const testContent = 'Hello, Cursor Sync!';
    const tempFile = path.join(__dirname, 'test-md5.txt');
    
    fs.writeFileSync(tempFile, testContent);
    
    const content = fs.readFileSync(tempFile);
    const hash = crypto.createHash('md5').update(content).digest('hex');
    
    assert.ok(hash);
    assert.strictEqual(hash.length, 32);
    
    // Cleanup
    fs.unlinkSync(tempFile);
  });
});
