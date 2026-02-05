# ⚠️ 配置迁移指南


## 重要通知

由于插件从 **Cursor Sync** 更名为 **AI Command Sync**，所有配置项的键名也已更改。

**如果您之前安装过本插件的旧版本**，您的配置将需要手动迁移。

## 🔄 配置项对照表

### 命令 ID 更改

| 旧命令 ID | 新命令 ID |
|-----------|-----------|
| `cursorSync.syncNow` | `aiCommandSync.syncNow` |
| `cursorSync.viewHistory` | `aiCommandSync.viewHistory` |
| `cursorSync.openSettings` | `aiCommandSync.openSettings` |
| `cursorSync.toggleAutoSync` | `aiCommandSync.toggleAutoSync` |
| `cursorSync.showQuickPick` | `aiCommandSync.showQuickPick` |

### 配置键更改

| 旧配置键 | 新配置键 |
|----------|----------|
| `cursorSync.autoSync` | `aiCommandSync.autoSync` |
| `cursorSync.autoSyncInterval` | `aiCommandSync.autoSyncInterval` |
| `cursorSync.showNotification` | `aiCommandSync.showNotification` |
| `cursorSync.enablePrompt` | `aiCommandSync.enablePrompt` |
| `cursorSync.gitRepo` | `aiCommandSync.gitRepo` |
| `cursorSync.remotePath` | `aiCommandSync.remotePath` |
| `cursorSync.localPath` | `aiCommandSync.localPath` |
| `cursorSync.branch` | `aiCommandSync.branch` |

## 📝 如何迁移配置

### 方法一：手动修改 settings.json（推荐）

1. 打开 VSCode/Cursor 设置：
   - Mac: `Cmd+Shift+P` → `Preferences: Open Settings (JSON)`
   - Windows/Linux: `Ctrl+Shift+P` → `Preferences: Open Settings (JSON)`

2. 找到所有 `cursorSync.*` 配置项

3. 将它们改为 `aiCommandSync.*`

**示例：**

```json
// 旧配置（❌ 不再有效）
{
  "cursorSync.gitRepo": "https://github.com/user/repo.git",
  "cursorSync.autoSync": true,
  "cursorSync.autoSyncInterval": 7,
  "cursorSync.branch": "main"
}

// 新配置（✅ 正确）
{
  "aiCommandSync.gitRepo": "https://github.com/user/repo.git",
  "aiCommandSync.autoSync": true,
  "aiCommandSync.autoSyncInterval": 7,
  "aiCommandSync.branch": "main"
}
```

4. 删除旧的 `cursorSync.*` 配置项（可选，但建议删除以保持整洁）

### 方法二：使用 VSCode 设置界面

1. 打开设置：
   - Mac: `Cmd+,`
   - Windows/Linux: `Ctrl+,`

2. 搜索 "Cursor Sync" 找到旧配置

3. 记录下您的配置值

4. 搜索 "AI Command Sync" 找到新配置

5. 重新输入您的配置值

### 方法三：重新配置（最简单）

如果您的配置不多，可以直接重新配置：

1. 按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）

2. 输入 `AI Command Sync: Open Settings`

3. 重新配置您的设置

## 🔍 验证迁移是否成功

迁移完成后，验证配置是否生效：

1. 打开命令面板：`Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）

2. 输入 "AI Command Sync"

3. 应该能看到以下命令：
   - AI Command Sync: Sync Now
   - AI Command Sync: View Sync History
   - AI Command Sync: Open Settings
   - AI Command Sync: Toggle Auto Sync

4. 检查状态栏右下角是否显示 "AI Command Sync" 图标

5. 运行一次同步，确认配置正确

## ⚠️ 常见问题

### Q: 为什么要更改配置项名称？

A: 插件从 "Cursor Sync" 更名为 "AI Command Sync" 以避免商标风险和市场冲突。为了保持一致性，所有配置项也需要更新。

### Q: 我的旧配置还能用吗？

A: 不能。旧的 `cursorSync.*` 配置项将被忽略，您必须迁移到新的 `aiCommandSync.*` 配置项。

### Q: 我的同步历史会丢失吗？

A: 是的，由于内部存储键也更改了，旧的同步历史将无法访问。但这不影响您的实际文件，只是历史记录。

### Q: 我需要重新安装插件吗？

A: 不需要。只需要更新配置即可。

### Q: 可以同时保留两套配置吗？

A: 可以，但旧配置不会生效。建议迁移后删除旧配置以避免混淆。

## 📊 配置示例

### 基础配置

```json
{
  "aiCommandSync.gitRepo": "https://github.com/your-username/your-repo.git",
  "aiCommandSync.remotePath": "cursor/commands",
  "aiCommandSync.localPath": ".cursor/commands",
  "aiCommandSync.branch": "main"
}
```

### 完整配置

```json
{
  // 必填：Git 仓库地址
  "aiCommandSync.gitRepo": "https://github.com/your-username/your-repo.git",
  
  // 仓库中的远程路径
  "aiCommandSync.remotePath": "cursor/commands",
  
  // 本地同步路径（相对于工作区）
  "aiCommandSync.localPath": ".cursor/commands",
  
  // Git 分支
  "aiCommandSync.branch": "main",
  
  // 启用自动同步
  "aiCommandSync.autoSync": true,
  
  // 自动同步间隔（天）
  "aiCommandSync.autoSyncInterval": 7,
  
  // 显示同步通知
  "aiCommandSync.showNotification": true,
  
  // 启动时显示同步提示
  "aiCommandSync.enablePrompt": true
}
```

## 🆘 需要帮助？

如果在迁移过程中遇到问题：

1. 查看 [README.md](README.md) 了解完整配置说明
2. 查看 [QUICK-START.md](QUICK-START.md) 了解快速开始指南
3. 提交 [GitHub Issue](https://github.com/ApolloNaco/ai-command-sync/issues)

## 📝 更新日志

- **2026-02-05**: 配置项从 `cursorSync.*` 更改为 `aiCommandSync.*`
- 原因：插件更名以避免商标风险和市场冲突

---

**感谢您的理解和支持！** 🙏
