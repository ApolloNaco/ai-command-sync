import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Extension should be present', () => {
    assert.ok(vscode.extensions.getExtension('ApolloNaco.cursor-sync'));
  });

  test('Should register all commands', async () => {
    const commands = await vscode.commands.getCommands();
    
    assert.ok(commands.includes('cursorSync.syncNow'));
    assert.ok(commands.includes('cursorSync.viewHistory'));
    assert.ok(commands.includes('cursorSync.openSettings'));
    assert.ok(commands.includes('cursorSync.toggleAutoSync'));
    assert.ok(commands.includes('cursorSync.showQuickPick'));
  });

  test('Extension should activate', async () => {
    const ext = vscode.extensions.getExtension('ApolloNaco.cursor-sync');
    assert.ok(ext);
    await ext?.activate();
    assert.ok(ext?.isActive);
  });
});
