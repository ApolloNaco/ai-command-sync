# Cursor Sync

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ApolloNaco/cursor-sync)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

一个强大的 VSCode 扩展，用于同步 Cursor AI 的自定义命令和配置文件。通过 Git 仓库自动管理和更新您的 Cursor 自定义命令，让团队协作和配置共享变得简单高效。

## ✨ 功能特性

- 🔄 **自动同步**: 支持定时自动从 Git 仓库同步自定义命令
- 📦 **智能增量**: 使用 MD5 哈希比对，仅复制变更文件，保护本地修改
- 📊 **可视状态**: 状态栏实时显示同步状态和时间
- 📜 **同步历史**: 完整记录每次同步的详细信息
- ⚙️ **灵活配置**: 支持自定义仓库地址、分支、路径等
- 🔔 **智能提醒**: 启动时智能提示同步，可配置关闭
- 🚀 **快捷操作**: 命令面板和快捷菜单，操作便捷

## 📦 安装

### 方式一：从 VSCode Marketplace 安装

> ⚠️ **注意**: 本扩展暂未上架 VSCode Marketplace，请使用方式二进行安装。

### 方式二：从 VSIX 文件安装（推荐）

详细安装步骤请参考 [INSTALL.md](INSTALL.md)

## 🚀 快速开始

安装完成后，扩展会在启动时自动提示您进行首次同步。您可以：

1. **立即同步**: 点击 "立即同步" 开始第一次同步
2. **启用自动同步**: 选择 "启用自动同步" 让扩展定期自动同步
3. **稍后提醒**: 选择 "稍后提醒" 推迟到下次启动
4. **不再提示**: 选择 "不再提示" 关闭自动提醒

更多使用技巧请参考 [QUICK-START.md](QUICK-START.md)

## 📚 使用指南

### 状态栏

扩展会在 VSCode 右下角状态栏显示同步状态：

- 🔵 **$(cloud-download) Cursor Sync**: 尚未同步
- 🔄 **$(sync~spin) 同步中...**: 正在执行同步
- ✅ **$(check) 已同步 (X小时前)**: 同步成功
- ❌ **$(error) 同步失败**: 同步出错（红色背景）

点击状态栏图标可以快速打开操作菜单。

### 命令面板

按 `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）打开命令面板，输入 "Cursor Sync" 查看所有可用命令：

- **Cursor Sync: Sync Now** - 立即执行同步
- **Cursor Sync: View Sync History** - 查看同步历史记录
- **Cursor Sync: Open Settings** - 打开扩展设置
- **Cursor Sync: Toggle Auto Sync** - 切换自动同步开关

### 快捷菜单

点击状态栏的 Cursor Sync 图标，可以快速访问：

1. 立即同步
2. 查看同步历史
3. 打开设置
4. 切换自动同步（显示当前状态）

## ⚙️ 配置选项

在 VSCode 设置中搜索 "Cursor Sync" 可以找到以下配置项：

### 基础配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `cursorSync.gitRepo` | string | `https://github.com/ApolloNaco/AITools.git` | Git 仓库地址 |
| `cursorSync.remotePath` | string | `cursor/commands` | 仓库中的远程路径 |
| `cursorSync.localPath` | string | `.cursor/commands` | 本地同步路径（相对于工作区） |
| `cursorSync.branch` | string | `master` | Git 分支名称 |

### 自动同步配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `cursorSync.autoSync` | boolean | `false` | 是否启用自动同步 |
| `cursorSync.autoSyncInterval` | number | `7` | 自动同步间隔（天） |

### 通知配置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `cursorSync.showNotification` | boolean | `true` | 同步完成后是否显示通知 |
| `cursorSync.enablePrompt` | boolean | `true` | 启动时是否显示同步提示 |

## 🔍 工作原理

1. **浅克隆**: 使用 `--depth=1` 参数克隆 Git 仓库，只获取最新版本
2. **MD5 比对**: 计算文件 MD5 哈希值，只同步有变化的文件
3. **增量更新**: 只添加新文件和更新变化文件，**不删除**本地独有文件
4. **历史记录**: 保存最近 20 条同步记录，方便追踪
5. **定时检查**: 每小时检查一次是否需要自动同步

## 🛠️ 开发指南

如果您想参与开发或自定义扩展，请参考 [DEVELOPMENT.md](DEVELOPMENT.md)

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本更新历史。

## ❓ 常见问题

### Q: 同步会删除我本地的文件吗？

A: 不会。扩展只会添加新文件和更新变化的文件，不会删除您本地独有的文件。

### Q: 同步失败怎么办？

A: 常见原因包括：
- 网络连接问题：检查网络和仓库地址
- Git 未安装：确保系统已安装 Git
- 仓库地址错误：检查配置中的仓库地址和分支
- 权限问题：确保对本地路径有写入权限

### Q: 如何使用自己的 Git 仓库？

A: 在设置中修改 `cursorSync.gitRepo` 为您的仓库地址，并相应调整 `remotePath` 和 `branch` 配置。

### Q: 如何关闭启动提示？

A: 有两种方式：
1. 在提示弹窗中选择 "不再提示"
2. 在设置中将 `cursorSync.enablePrompt` 设为 `false`

### Q: 自动同步的具体逻辑是什么？

A: 启用自动同步后，扩展会：
1. 每小时检查一次距上次同步的时间
2. 如果超过配置的间隔天数（默认 7 天），则自动执行同步
3. 同步完成后更新状态栏显示

## 📄 许可证

[MIT License](LICENSE)

## 👨‍💻 作者

**Naco**
- 掘金：[NacoStack](https://juejin.cn/user/143390347639064)
- GitHub: [ApolloNaco](https://github.com/ApolloNaco)

## 🙏 致谢

感谢所有使用和贡献本扩展的开发者！

## 📧 反馈与支持

如果您在使用过程中遇到问题或有建议，欢迎：

- 提交 [Issue](https://github.com/ApolloNaco/cursor-sync/issues)
- 发起 [Pull Request](https://github.com/ApolloNaco/cursor-sync/pulls)
- 在掘金留言交流

---

**享受高效的 Cursor 配置同步体验！** 🎉
