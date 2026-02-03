/**
 * Sync status enumeration
 */
export enum SyncStatus {
  NotSynced = 'notSynced',
  Syncing = 'syncing',
  Success = 'success',
  Failed = 'failed'
}

/**
 * Sync configuration interface
 */
export interface SyncConfig {
  /** Git repository URL */
  gitRepo: string;
  /** Remote path in the repository */
  remotePath: string;
  /** Local path relative to workspace */
  localPath: string;
  /** Git branch to sync from */
  branch: string;
  /** Enable automatic synchronization */
  autoSync: boolean;
  /** Auto sync interval in days */
  autoSyncInterval: number;
  /** Show notifications after sync */
  showNotification: boolean;
  /** Show sync prompt on startup */
  enablePrompt: boolean;
}

/**
 * Sync result statistics
 */
export interface SyncResult {
  /** Number of files added */
  added: number;
  /** Number of files updated */
  updated: number;
  /** Number of files unchanged */
  unchanged: number;
  /** Sync timestamp */
  timestamp: number;
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Sync history entry
 */
export interface SyncHistoryEntry {
  /** Sync timestamp */
  timestamp: number;
  /** Sync result */
  result: SyncResult;
}
