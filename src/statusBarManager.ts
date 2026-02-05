import * as vscode from 'vscode';
import { SyncStatus } from './types';

/**
 * Status bar manager for displaying sync status
 */
export class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private currentStatus: SyncStatus = SyncStatus.NotSynced;
  private lastSyncTime?: number;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'aiCommandSync.showQuickPick';
    this.updateStatusBar();
    this.statusBarItem.show();
  }

  /**
   * Update status
   */
  public updateStatus(status: SyncStatus, lastSyncTime?: number): void {
    this.currentStatus = status;
    if (lastSyncTime) {
      this.lastSyncTime = lastSyncTime;
    }
    this.updateStatusBar();
  }

  /**
   * Update status bar display
   */
  private updateStatusBar(): void {
    switch (this.currentStatus) {
      case SyncStatus.NotSynced:
        this.statusBarItem.text = '$(cloud-download) AI Command Sync';
        this.statusBarItem.tooltip = '点击查看同步选项';
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = undefined;
        break;

      case SyncStatus.Syncing:
        this.statusBarItem.text = '$(sync~spin) 同步中...';
        this.statusBarItem.tooltip = '正在同步自定义命令';
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = undefined;
        break;

      case SyncStatus.Success:
        const timeAgo = this.lastSyncTime ? this.formatTimeAgo(this.lastSyncTime) : '';
        this.statusBarItem.text = `$(check) 已同步${timeAgo ? ` (${timeAgo})` : ''}`;
        this.statusBarItem.tooltip = `上次同步：${this.formatDateTime(this.lastSyncTime)}`;
        this.statusBarItem.backgroundColor = undefined;
        this.statusBarItem.color = undefined;
        break;

      case SyncStatus.Failed:
        this.statusBarItem.text = '$(error) 同步失败';
        this.statusBarItem.tooltip = '同步失败，点击重试';
        this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
        break;
    }
  }

  /**
   * Format time ago
   */
  private formatTimeAgo(timestamp?: number): string {
    if (!timestamp) {
      return '';
    }

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {
      return '刚刚';
    } else if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      return `${days}天前`;
    }
  }

  /**
   * Format date time
   */
  private formatDateTime(timestamp?: number): string {
    if (!timestamp) {
      return '从未同步';
    }

    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Show quick pick menu
   */
  public async showQuickPick(autoSyncEnabled: boolean): Promise<string | undefined> {
    const items: vscode.QuickPickItem[] = [
      {
        label: '$(sync) 立即同步',
        description: '手动执行同步',
        detail: 'aiCommandSync.syncNow'
      },
      {
        label: '$(history) 查看同步历史',
        description: '查看最近的同步记录',
        detail: 'aiCommandSync.viewHistory'
      },
      {
        label: '$(gear) 打开设置',
        description: '配置 AI Command Sync',
        detail: 'aiCommandSync.openSettings'
      },
      {
        label: autoSyncEnabled ? '$(debug-pause) 关闭自动同步' : '$(debug-start) 启用自动同步',
        description: `当前状态：${autoSyncEnabled ? '已启用' : '已禁用'}`,
        detail: 'aiCommandSync.toggleAutoSync'
      }
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: '选择一个操作',
      matchOnDescription: true,
      matchOnDetail: false
    });

    return selected?.detail;
  }

  /**
   * Dispose
   */
  public dispose(): void {
    this.statusBarItem.dispose();
  }
}
