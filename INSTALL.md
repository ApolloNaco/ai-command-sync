# AI Command Sync 安装指南

本文档提供详细的 AI Command Sync 扩展安装指南，包括从 VSCode Marketplace 安装和本地 VSIX 文件安装两种方式。

## 📋 前置要求

### 系统要求

- **操作系统**: Windows, macOS, 或 Linux
- **VSCode 版本**: 1.80.0 或更高
- **Git**: 必须安装 Git 并添加到系统 PATH

### 检查 Git 安装

打开终端/命令行，运行：

```bash
git --version
```

如果显示版本号（如 `git version 2.x.x`），说明 Git 已正确安装。

如果未安装，请访问：
- Windows: [Git for Windows](https://git-scm.com/download/win)
- macOS: 运行 `xcode-select --install` 或访问 [Git 官网](https://git-scm.com/)
- Linux: 使用包管理器，如 `sudo apt-get install git`

## 🚀 安装方式

### 方式一：从 VSCode Marketplace 安装（推荐）

这是最简单、最推荐的安装方式。

#### 步骤 1: 打开扩展面板

- **Windows/Linux**: 按 `Ctrl + Shift + X`
- **macOS**: 按 `Cmd + Shift + X`

或者点击 VSCode 左侧活动栏的扩展图标（四个方块的图标）。

#### 步骤 2: 搜索扩展

在扩展搜索框中输入：

```
AI Command Sync
```

#### 步骤 3: 安装

1. 在搜索结果中找到 "AI Command Sync" (作者: Genyuan)
2. 点击 "Install" 按钮
3. 等待安装完成（通常只需几秒钟）

#### 步骤 4: 验证安装

安装完成后，您应该能在：
- 扩展列表中看到 "AI Command Sync"
- 状态栏右下角看到 "$(cloud-download) AI Command Sync" 图标

### 方式二：从 VSIX 文件安装

如果您有 `.vsix` 文件（离线安装包），可以使用此方式。

> 💡 **提示**: 本项目的 VSIX 安装包已放置在 `plugin/` 目录下，您可以直接从该目录获取最新版本的插件文件。

#### 方法 A: 使用 VSCode 界面安装

##### 步骤 1: 打开扩展面板

- **Windows/Linux**: 按 `Ctrl + Shift + X`
- **macOS**: 按 `Cmd + Shift + X`

##### 步骤 2: 打开安装菜单

点击扩展面板右上角的 "..." (更多操作) 按钮，选择 "Install from VSIX..."

![Install from VSIX](https://code.visualstudio.com/assets/docs/editor/extension-gallery/install-from-vsix.png)

##### 步骤 3: 选择 VSIX 文件

在文件选择对话框中，导航到 `.vsix` 文件所在位置，选择文件并点击 "安装"。

##### 步骤 4: 重新加载

安装完成后，点击 "Reload" 或 "重新加载窗口" 使扩展生效。

#### 方法 B: 使用命令行安装

##### 步骤 1: 打开终端

在 VSCode 中打开集成终端：
- **Windows/Linux**: `` Ctrl + ` ``
- **macOS**: `` Cmd + ` ``

或使用系统终端。

##### 步骤 2: 运行安装命令

导航到 `.vsix` 文件所在目录，然后运行：

```bash
code --install-extension ai-command-sync-1.0.0.vsix
```

将 `ai-command-sync-1.0.0.vsix` 替换为您的实际文件名。

##### 步骤 3: 重启 VSCode

安装完成后，重启 VSCode 使扩展生效。

#### 方法 C: 手动安装（高级）

这种方法适用于特殊情况，如企业环境或离线环境。

##### 步骤 1: 找到扩展目录

扩展目录位置：

- **Windows**: `%USERPROFILE%\.vscode\extensions`
- **macOS**: `~/.vscode/extensions`
- **Linux**: `~/.vscode/extensions`

##### 步骤 2: 解压 VSIX 文件

VSIX 文件本质上是 ZIP 文件：

```bash
# 创建临时目录
mkdir temp-extension
cd temp-extension

# 解压 VSIX (重命名为 .zip)
unzip ../ai-command-sync-1.0.0.vsix

# 或使用 7-Zip、WinRAR 等工具解压
```

##### 步骤 3: 复制到扩展目录

将解压后的内容复制到扩展目录：

```bash
# Windows (PowerShell)
Copy-Item -Path ".\extension" -Destination "$env:USERPROFILE\.vscode\extensions\genyuan.ai-command-sync-1.0.0" -Recurse

# macOS/Linux
cp -r ./extension ~/.vscode/extensions/genyuan.ai-command-sync-1.0.0
```

##### 步骤 4: 重启 VSCode

重启 VSCode 以加载新安装的扩展。

## ✅ 验证安装

### 检查扩展是否已安装

1. **打开扩展面板**: `Ctrl+Shift+X` (Mac: `Cmd+Shift+X`)
2. **搜索**: 输入 "AI Command Sync"
3. **确认**: 应该看到扩展已安装，并显示 "已安装" 或 "禁用"/"卸载" 按钮

### 检查扩展是否激活

1. **查看状态栏**: 右下角应显示 "$(cloud-download) AI Command Sync"
2. **打开命令面板**: `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
3. **搜索命令**: 输入 "AI Command Sync"，应该看到相关命令：
   - AI Command Sync: Sync Now
   - AI Command Sync: View Sync History
   - AI Command Sync: Open Settings
   - AI Command Sync: Toggle Auto Sync

### 测试功能

执行一次同步测试：

1. 点击状态栏的 "AI Command Sync" 图标
2. 选择 "立即同步"
3. 观察同步过程和结果通知

如果一切正常，您应该会看到同步进度提示和成功通知。

## 🔧 首次配置

### 默认配置

AI Command Sync 开箱即用，默认配置为：

```json
{
  "cursorSync.gitRepo": "https://github.com/ApolloNaco/AITools.git",
  "cursorSync.remotePath": "cursor/commands",
  "cursorSync.localPath": ".cursor/commands",
  "cursorSync.branch": "master",
  "cursorSync.autoSync": false,
  "cursorSync.autoSyncInterval": 7,
  "cursorSync.showNotification": true,
  "cursorSync.enablePrompt": true
}
```

### 自定义配置

如果您想使用自己的 Git 仓库，请按照以下步骤配置：

#### 步骤 1: 打开设置

- **方式 A**: 点击状态栏图标 → 选择 "打开设置"
- **方式 B**: `Ctrl+,` (Mac: `Cmd+,`) → 搜索 "AI Command Sync"
- **方式 C**: 命令面板 → "AI Command Sync: Open Settings"

#### 步骤 2: 修改配置

根据您的需求修改以下配置：

**仓库配置**:
- `Git Repo`: 您的 Git 仓库地址
- `Remote Path`: 仓库中的路径
- `Branch`: 要同步的分支名

**同步配置**:
- `Auto Sync`: 是否启用自动同步
- `Auto Sync Interval`: 自动同步间隔（天）

**通知配置**:
- `Show Notification`: 是否显示同步通知
- `Enable Prompt`: 是否显示启动提示

#### 步骤 3: 测试配置

修改配置后，执行一次手动同步以验证配置是否正确。

## 🚨 故障排除

### 问题 1: 扩展无法安装

**可能原因**:
- VSCode 版本过低
- 网络连接问题（Marketplace）
- 文件损坏（VSIX）

**解决方案**:
1. 更新 VSCode 到最新版本
2. 检查网络连接或使用 VSIX 文件安装
3. 重新下载 VSIX 文件

### 问题 2: 安装后看不到扩展

**解决方案**:
1. 重启 VSCode
2. 检查扩展是否被禁用：扩展面板 → AI Command Sync → 点击 "启用"
3. 查看输出面板是否有错误信息：`Ctrl+Shift+U` → 选择 "Extension Host"

### 问题 3: Git 未找到

**错误信息**: "Git is not installed" 或类似提示

**解决方案**:
1. 确保 Git 已安装（见前置要求）
2. 将 Git 添加到系统 PATH
3. 重启 VSCode

**验证 Git 路径**:
```bash
# Windows
where git

# macOS/Linux
which git
```

### 问题 4: 权限错误

**错误信息**: "Permission denied" 或无法写入文件

**解决方案**:
1. 确保对工作区目录有写入权限
2. Windows: 以管理员身份运行 VSCode
3. macOS/Linux: 检查目录权限 `ls -la`

### 问题 5: 同步失败

**常见原因**:
- 仓库地址错误
- 分支不存在
- 网络问题
- 远程路径不存在

**解决方案**:
1. 检查配置中的仓库地址和分支
2. 在浏览器中访问仓库确认可访问
3. 检查远程路径是否存在
4. 查看 VSCode 输出面板的详细错误信息

## 🔄 更新扩展

### 从 Marketplace 更新

如果您从 Marketplace 安装，扩展会自动更新（默认设置）。

您也可以手动检查更新：
1. 打开扩展面板
2. 找到 AI Command Sync
3. 如果有更新，会显示 "更新" 按钮
4. 点击更新并重启 VSCode

### 从 VSIX 更新

1. 下载新版本的 VSIX 文件
2. 使用上述 VSIX 安装方法安装新版本
3. VSCode 会自动覆盖旧版本
4. 重启 VSCode

## 🗑️ 卸载扩展

### 完全卸载步骤

#### 步骤 1: 卸载扩展

1. 打开扩展面板: `Ctrl+Shift+X` (Mac: `Cmd+Shift+X`)
2. 找到 AI Command Sync
3. 点击 "卸载" 按钮
4. 重启 VSCode

#### 步骤 2: 清理配置（可选）

如果您想完全删除所有配置和数据：

**清理用户设置**:
1. 打开设置: `Ctrl+,` (Mac: `Cmd+,`)
2. 搜索 "AI Command Sync"
3. 将所有配置恢复为默认值或删除

**清理全局状态** (同步历史等):

扩展的全局状态存储在 VSCode 的内部数据库中，卸载扩展时会自动清理。

**清理本地文件**:

扩展默认同步的文件在 `.cursor/commands` 目录，如需删除：

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force .cursor\commands

# macOS/Linux
rm -rf .cursor/commands
```

## 📞 获取帮助

如果在安装过程中遇到问题，您可以：

1. **查看文档**: 
   - [README.md](README.md) - 功能介绍和基本使用
   - [QUICK-START.md](QUICK-START.md) - 快速入门教程
   - [DEVELOPMENT.md](DEVELOPMENT.md) - 开发者指南

2. **提交问题**:
   - GitHub Issues: [https://github.com/ApolloNaco/ai-command-sync/issues](https://github.com/ApolloNaco/ai-command-sync/issues)

3. **联系作者**:
   - 掘金: [Genyuan的AI工程](https://juejin.cn/user/Genyuan的AI工程)

## 📝 相关链接

- [VSCode 扩展文档](https://code.visualstudio.com/docs/editor/extension-marketplace)
- [Git 安装指南](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
- [simple-git 文档](https://github.com/steveukx/git-js)

---

**祝您安装顺利！如有问题，随时联系我们。** 🎉
