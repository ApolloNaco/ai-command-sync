import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as os from 'os';
import simpleGit, { SimpleGit } from 'simple-git';
import { SyncConfig, SyncResult, SyncHistoryEntry } from './types';

/**
 * Sync manager for handling Git synchronization
 */
export class SyncManager {
  private readonly maxHistoryEntries = 20;
  private git: SimpleGit;

  constructor(private context: vscode.ExtensionContext) {
    this.git = simpleGit();
  }

  /**
   * Perform synchronization
   */
  public async sync(config: SyncConfig): Promise<SyncResult> {
    const result: SyncResult = {
      added: 0,
      updated: 0,
      unchanged: 0,
      timestamp: Date.now(),
      success: false
    };

    let tempDir: string | undefined;

    try {
      // Validate configuration
      if (!config.gitRepo || config.gitRepo.trim() === '') {
        throw new Error('Git repository URL is not configured. Please set aiCommandSync.gitRepo in settings.');
      }

      // Get workspace folder
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        throw new Error('No workspace folder opened');
      }

      // Create temporary directory in system temp folder with random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      tempDir = path.join(os.tmpdir(), `cursor-sync-${Date.now()}-${randomSuffix}`);
      fs.mkdirSync(tempDir, { recursive: true });

      // Clone repository with shallow clone
      try {
        await this.git.clone(config.gitRepo, tempDir, [
          '--depth=1',
          `-b`,
          config.branch,
          '--single-branch'
        ]);
      } catch (gitError: any) {
        throw new Error(
          `Failed to clone repository: ${gitError.message}\n\n` +
          'Please check:\n' +
          '1. Git is installed on your system\n' +
          '2. Repository URL is correct\n' +
          '3. You have access to the repository\n' +
          '4. Network connection is stable'
        );
      }

      // Resolve remote path
      const remotePath = path.join(tempDir, config.remotePath);
      if (!fs.existsSync(remotePath)) {
        throw new Error(
          `Remote path "${config.remotePath}" does not exist in repository.\n\n` +
          'Please check the aiCommandSync.remotePath setting.'
        );
      }

      // Resolve local path
      const localPath = path.join(workspaceFolder.uri.fsPath, config.localPath);

      // Ensure local directory exists
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }

      // Sync files
      await this.syncFiles(remotePath, localPath, result);

      result.success = true;

      // Save to history
      await this.saveHistory(result);

      return result;
    } catch (error) {
      result.success = false;
      result.error = error instanceof Error ? error.message : String(error);
      return result;
    } finally {
      // Clean up temporary directory
      if (tempDir && fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('Failed to cleanup temp directory:', cleanupError);
        }
      }
    }
  }

  /**
   * Recursively sync files from remote to local
   */
  private async syncFiles(
    remotePath: string,
    localPath: string,
    result: SyncResult
  ): Promise<void> {
    const remoteFiles = fs.readdirSync(remotePath);

    for (const file of remoteFiles) {
      const remoteFilePath = path.join(remotePath, file);
      const localFilePath = path.join(localPath, file);
      const stat = fs.statSync(remoteFilePath);

      if (stat.isDirectory()) {
        // Recursively sync directories
        if (!fs.existsSync(localFilePath)) {
          fs.mkdirSync(localFilePath, { recursive: true });
        }
        await this.syncFiles(remoteFilePath, localFilePath, result);
      } else {
        // Check if file needs to be copied
        const shouldCopy = await this.shouldCopyFile(remoteFilePath, localFilePath);

        if (shouldCopy.copy) {
          fs.copyFileSync(remoteFilePath, localFilePath);
          if (shouldCopy.isNew) {
            result.added++;
          } else {
            result.updated++;
          }
        } else {
          result.unchanged++;
        }
      }
    }
  }

  /**
   * Check if a file should be copied based on MD5 hash
   */
  private async shouldCopyFile(
    remotePath: string,
    localPath: string
  ): Promise<{ copy: boolean; isNew: boolean }> {
    // File doesn't exist locally, should copy
    if (!fs.existsSync(localPath)) {
      return { copy: true, isNew: true };
    }

    // Calculate MD5 hashes
    const remoteHash = this.calculateMD5(remotePath);
    const localHash = this.calculateMD5(localPath);

    // Copy if hashes differ
    return { copy: remoteHash !== localHash, isNew: false };
  }

  /**
   * Calculate MD5 hash of a file
   */
  private calculateMD5(filePath: string): string {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Get sync history
   */
  public getHistory(): SyncHistoryEntry[] {
    return this.context.globalState.get<SyncHistoryEntry[]>('aiCommandSync.history', []);
  }

  /**
   * Save sync result to history
   */
  private async saveHistory(result: SyncResult): Promise<void> {
    const history = this.getHistory();

    // Add new entry
    history.unshift({
      timestamp: result.timestamp,
      result: result
    });

    // Keep only the latest entries
    if (history.length > this.maxHistoryEntries) {
      history.splice(this.maxHistoryEntries);
    }

    await this.context.globalState.update('aiCommandSync.history', history);
  }

  /**
   * Clear sync history
   */
  public async clearHistory(): Promise<void> {
    await this.context.globalState.update('aiCommandSync.history', []);
  }

  /**
   * Get last sync timestamp
   */
  public getLastSyncTimestamp(): number | undefined {
    const history = this.getHistory();
    return history.length > 0 ? history[0].timestamp : undefined;
  }

  /**
   * Check if auto sync is needed
   */
  public shouldAutoSync(config: SyncConfig): boolean {
    if (!config.autoSync) {
      return false;
    }

    const lastSync = this.getLastSyncTimestamp();
    if (!lastSync) {
      return true;
    }

    const daysSinceSync = (Date.now() - lastSync) / (1000 * 60 * 60 * 24);
    return daysSinceSync >= config.autoSyncInterval;
  }
}
