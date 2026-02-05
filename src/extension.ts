import * as vscode from 'vscode';
import { ConfigManager } from './configManager';
import { SyncManager } from './syncManager';
import { StatusBarManager } from './statusBarManager';
import { NotificationService } from './notificationService';
import { SyncStatus } from './types';

let syncManager: SyncManager;
let statusBarManager: StatusBarManager;
let configManager: ConfigManager;
let notificationService: NotificationService;
let autoSyncTimer: NodeJS.Timeout | undefined;
let extensionContext: vscode.ExtensionContext;

/**
 * Activate the extension
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log('AI Command Sync extension is now active!');

  // Save context
  extensionContext = context;

  // Initialize managers
  configManager = new ConfigManager();
  syncManager = new SyncManager(context);
  statusBarManager = new StatusBarManager();
  notificationService = new NotificationService();

  // Initialize status
  const lastSyncTime = syncManager.getLastSyncTimestamp();
  if (lastSyncTime) {
    statusBarManager.updateStatus(SyncStatus.Success, lastSyncTime);
  }

  // Register commands
  registerCommands(context);

  // Show auto prompt after delay
  setTimeout(async () => {
    await showAutoPrompt(context);
  }, 2000);

  // Start auto sync timer
  startAutoSyncTimer(context);

  // Watch for config changes
  context.subscriptions.push(
    configManager.onConfigChange(() => {
      // Restart auto sync timer when config changes
      stopAutoSyncTimer();
      startAutoSyncTimer(context);
    })
  );

  // Add status bar to subscriptions
  context.subscriptions.push(statusBarManager);
}

/**
 * Register all commands
 */
function registerCommands(context: vscode.ExtensionContext) {
  // Sync now command
  context.subscriptions.push(
    vscode.commands.registerCommand('aiCommandSync.syncNow', async () => {
      await performSync();
    })
  );

  // View history command
  context.subscriptions.push(
    vscode.commands.registerCommand('aiCommandSync.viewHistory', async () => {
      await showSyncHistory();
    })
  );

  // Open settings command
  context.subscriptions.push(
    vscode.commands.registerCommand('aiCommandSync.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'aiCommandSync');
    })
  );

  // Toggle auto sync command
  context.subscriptions.push(
    vscode.commands.registerCommand('aiCommandSync.toggleAutoSync', async () => {
      await toggleAutoSync();
    })
  );

  // Show quick pick command
  context.subscriptions.push(
    vscode.commands.registerCommand('aiCommandSync.showQuickPick', async () => {
      const config = configManager.getConfig();
      const command = await statusBarManager.showQuickPick(config.autoSync);
      if (command) {
        await vscode.commands.executeCommand(command);
      }
    })
  );
}

/**
 * Perform synchronization
 */
async function performSync(): Promise<void> {
  try {
    const config = configManager.getConfig();

    // Update status to syncing
    statusBarManager.updateStatus(SyncStatus.Syncing);

    // Perform sync with progress
    const result = await notificationService.showProgress(
      'AI Command Sync',
      async (progress) => {
        progress.report({ message: '正在克隆仓库...' });
        return await syncManager.sync(config);
      }
    );

    // Update status based on result
    if (result.success) {
      statusBarManager.updateStatus(SyncStatus.Success, result.timestamp);
      if (config.showNotification) {
        notificationService.showSyncSuccess(result);
      }
    } else {
      statusBarManager.updateStatus(SyncStatus.Failed);
      notificationService.showSyncFailure(result.error || '未知错误');
    }
  } catch (error) {
    statusBarManager.updateStatus(SyncStatus.Failed);
    const errorMessage = error instanceof Error ? error.message : String(error);
    notificationService.showSyncFailure(errorMessage);
  }
}

/**
 * Show sync history
 */
async function showSyncHistory(): Promise<void> {
  const history = syncManager.getHistory();

  if (history.length === 0) {
    notificationService.showInfo('暂无同步历史记录');
    return;
  }

  const items: vscode.QuickPickItem[] = history.map((entry) => {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleString('zh-CN');
    const status = entry.result.success ? '✅ 成功' : '❌ 失败';
    const stats = entry.result.success
      ? `新增 ${entry.result.added}，更新 ${entry.result.updated}，未变更 ${entry.result.unchanged}`
      : entry.result.error || '未知错误';

    return {
      label: `${status} - ${dateStr}`,
      description: stats
    };
  });

  await vscode.window.showQuickPick(items, {
    placeHolder: '同步历史记录',
    matchOnDescription: true
  });
}

/**
 * Toggle auto sync
 */
async function toggleAutoSync(): Promise<void> {
  const config = configManager.getConfig();
  const newValue = !config.autoSync;

  await configManager.updateConfig('autoSync', newValue, true);

  notificationService.showInfo(
    newValue ? '自动同步已启用' : '自动同步已禁用'
  );

  // Restart timer
  stopAutoSyncTimer();
  if (newValue) {
    startAutoSyncTimer(extensionContext);
  }
}

/**
 * Show auto prompt on startup
 */
async function showAutoPrompt(context: vscode.ExtensionContext): Promise<void> {
  const config = configManager.getConfig();

  // Check if prompt is enabled
  if (!config.enablePrompt) {
    return;
  }

  // Check if already prompted
  const hasPrompted = context.workspaceState.get<boolean>('aiCommandSync.hasPrompted', false);
  if (hasPrompted) {
    return;
  }

  // Mark as prompted
  await context.workspaceState.update('aiCommandSync.hasPrompted', true);

  // Show prompt
  const action = await notificationService.showAutoPrompt();

  switch (action) {
    case 'sync':
      await performSync();
      break;
    case 'auto':
      await configManager.updateConfig('autoSync', true, true);
      notificationService.showInfo('自动同步已启用');
      startAutoSyncTimer(context);
      break;
    case 'never':
      await configManager.updateConfig('enablePrompt', false, true);
      break;
    case 'later':
      // Reset the flag so it shows again next time
      await context.workspaceState.update('aiCommandSync.hasPrompted', false);
      break;
  }
}

/**
 * Start auto sync timer
 */
function startAutoSyncTimer(context: vscode.ExtensionContext): void {
  const config = configManager.getConfig();

  if (!config.autoSync) {
    return;
  }

  // Check every hour
  autoSyncTimer = setInterval(async () => {
    const currentConfig = configManager.getConfig();
    if (syncManager.shouldAutoSync(currentConfig)) {
      console.log('Auto sync triggered');
      await performSync();
    }
  }, 60 * 60 * 1000); // 1 hour

  // Perform initial check
  setTimeout(async () => {
    if (syncManager.shouldAutoSync(config)) {
      console.log('Initial auto sync triggered');
      await performSync();
    }
  }, 5000);
}

/**
 * Stop auto sync timer
 */
function stopAutoSyncTimer(): void {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer);
    autoSyncTimer = undefined;
  }
}

/**
 * Deactivate the extension
 */
export function deactivate() {
  stopAutoSyncTimer();
  console.log('AI Command Sync extension is now deactivated');
}
