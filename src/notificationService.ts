import * as vscode from 'vscode';
import { SyncResult } from './types';

/**
 * Notification service for user feedback
 */
export class NotificationService {
  /**
   * Show sync success notification
   */
  public showSyncSuccess(result: SyncResult): void {
    const message = `同步成功！新增 ${result.added} 个，更新 ${result.updated} 个，未变更 ${result.unchanged} 个。`;
    vscode.window.showInformationMessage(message);
  }

  /**
   * Show sync failure notification
   */
  public showSyncFailure(error: string): void {
    const message = `同步失败：${error}`;
    vscode.window.showErrorMessage(message, '查看日志', '重试').then(selection => {
      if (selection === '查看日志') {
        vscode.commands.executeCommand('workbench.action.output.toggleOutput');
      } else if (selection === '重试') {
        vscode.commands.executeCommand('aiCommandSync.syncNow');
      }
    });
  }

  /**
   * Show sync progress notification
   */
  public async showProgress<T>(
    title: string,
    task: (progress: vscode.Progress<{ message?: string; increment?: number }>) => Promise<T>
  ): Promise<T> {
    return vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: title,
        cancellable: false
      },
      async (progress) => {
        return await task(progress);
      }
    );
  }

  /**
   * Show auto sync prompt on startup
   */
  public async showAutoPrompt(): Promise<'sync' | 'later' | 'auto' | 'never' | undefined> {
    const result = await vscode.window.showInformationMessage(
      'AI Command Sync: 检测到您的自定义命令可能需要同步。',
      '立即同步',
      '稍后提醒',
      '启用自动同步',
      '不再提示'
    );

    switch (result) {
      case '立即同步':
        return 'sync';
      case '稍后提醒':
        return 'later';
      case '启用自动同步':
        return 'auto';
      case '不再提示':
        return 'never';
      default:
        return undefined;
    }
  }

  /**
   * Show configuration error notification
   */
  public showConfigError(message: string): void {
    vscode.window.showErrorMessage(
      `AI Command Sync 配置错误：${message}`,
      '打开设置'
    ).then(selection => {
      if (selection === '打开设置') {
        vscode.commands.executeCommand('aiCommandSync.openSettings');
      }
    });
  }

  /**
   * Show info message
   */
  public showInfo(message: string): void {
    vscode.window.showInformationMessage(`AI Command Sync: ${message}`);
  }

  /**
   * Show warning message
   */
  public showWarning(message: string): void {
    vscode.window.showWarningMessage(`AI Command Sync: ${message}`);
  }

  /**
   * Show error message
   */
  public showError(message: string): void {
    vscode.window.showErrorMessage(`AI Command Sync: ${message}`);
  }

  /**
   * Ask for confirmation
   */
  public async confirm(message: string): Promise<boolean> {
    const result = await vscode.window.showInformationMessage(
      message,
      { modal: true },
      '确认',
      '取消'
    );
    return result === '确认';
  }
}
