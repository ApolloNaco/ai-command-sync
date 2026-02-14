import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('ApolloNaco.ai-command-sync'));
  });

  test('Should register all commands', async () => {
    const commands = await vscode.commands.getCommands();
    
    assert.ok(commands.includes('aiCommandSync.syncNow'));
    assert.ok(commands.includes('aiCommandSync.viewHistory'));
    assert.ok(commands.includes('aiCommandSync.openSettings'));
    assert.ok(commands.includes('aiCommandSync.toggleAutoSync'));
    assert.ok(commands.includes('aiCommandSync.showQuickPick'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('ApolloNaco.ai-command-sync');
    assert.ok(ext);
    await ext?.activate();
    assert.ok(ext?.isActive);
  });
});
