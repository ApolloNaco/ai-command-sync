# AI Command Sync 快速开始

5 分钟快速上手 AI Command Sync，让您的 Cursor AI 自定义命令管理变得简单高效。

## 🎯 开始前的准备

在开始之前，请确保：

- ✅ 已安装 AI Command Sync 扩展（查看 [INSTALL.md](INSTALL.md)）
- ✅ 系统已安装 Git 并添加到 PATH
- ✅ 有可访问的 Git 仓库（或使用默认仓库）

## 📚 5 分钟入门教程

### 第 1 步：首次启动（30 秒）

安装扩展后，重新打开 VSCode 或打开任意工作区，您会看到：

1. **状态栏图标**: 右下角显示 "$(cloud-download) AI Command Sync"
2. **启动提示**: 2-3 秒后弹出提示窗口：

```
AI Command Sync: 检测到您的自定义命令可能需要同步。
[立即同步] [稍后提醒] [启用自动同步] [不再提示]
```

**推荐选择**: 点击 "立即同步" 进行首次同步。

### 第 2 步：首次同步（1-2 分钟）

点击 "立即同步" 后：

1. **状态栏变化**: 图标变为 "$(sync~spin) 同步中..."
2. **进度提示**: 显示 "正在克隆仓库..." 通知
3. **同步完成**: 
   - 成功: 显示 "同步成功！新增 X 个，更新 Y 个，未变更 Z 个。"
   - 状态栏: 变为 "$(check) 已同步 (刚刚)"

**查看结果**: 
- 打开工作区目录
- 查看 `.cursor/commands` 文件夹
- 您的自定义命令文件已同步到本地

### 第 3 步：探索功能（1 分钟）

#### 方式 A: 使用状态栏菜单

点击状态栏的 "AI Command Sync" 图标，会弹出快捷菜单：

```
$(sync) 立即同步
  手动执行同步

$(history) 查看同步历史
  查看最近的同步记录

$(gear) 打开设置
  配置 AI Command Sync

$(debug-start) 启用自动同步
  当前状态：已禁用
```

**试试看**: 点击 "查看同步历史"，查看刚才的同步记录。

#### 方式 B: 使用命令面板

按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)，输入 "AI Command Sync"：

- `AI Command Sync: Sync Now` - 立即同步
- `AI Command Sync: View Sync History` - 查看历史
- `AI Command Sync: Open Settings` - 打开设置
- `AI Command Sync: Toggle Auto Sync` - 切换自动同步

### 第 4 步：配置自动同步（1 分钟）

启用自动同步，让扩展定期自动更新您的命令：

#### 方法 1: 通过快捷菜单

1. 点击状态栏的 AI Command Sync 图标
2. 选择 "启用自动同步"
3. 完成！扩展会每隔 7 天自动检查并同步

#### 方法 2: 通过设置

1. 点击状态栏图标 → "打开设置"
2. 找到 "Auto Sync"
3. 勾选复选框
4. 可选：调整 "Auto Sync Interval" (默认 7 天)

### 第 5 步：自定义配置（可选，1 分钟）

如果您想使用自己的 Git 仓库，需要修改配置：

1. **打开设置**: 
   - 快捷键: `Ctrl+,` (Mac: `Cmd+,`)
   - 搜索: "AI Command Sync"

2. **修改关键配置**:

```json
{
  // 您的 Git 仓库地址
  "aiCommandSync.gitRepo": "https://github.com/YOUR_USERNAME/YOUR_REPO.git",
  
  // 仓库中的路径
  "aiCommandSync.remotePath": "cursor/commands",
  
  // 本地同步路径（相对于工作区）
  "aiCommandSync.localPath": ".cursor/commands",
  
  // 分支
  "aiCommandSync.branch": "main"
}
```

3. **测试配置**: 执行一次手动同步验证配置是否正确

## 🎨 使用场景示例

### 场景 1: 团队协作

**需求**: 团队成员共享相同的 Cursor 自定义命令

**步骤**:
1. 创建团队 Git 仓库，存放自定义命令
2. 所有成员配置相同的仓库地址
3. 启用自动同步，保持团队配置一致

**好处**: 
- 新成员快速获取团队配置
- 配置更新自动同步到所有成员
- 统一的工作流程和命令规范

### 场景 2: 多设备同步

**需求**: 在家里和公司的电脑间同步配置

**步骤**:
1. 将自定义命令推送到个人 Git 仓库
2. 在两台电脑上安装 AI Command Sync
3. 配置相同的仓库地址
4. 启用自动同步

**好处**:
- 配置自动同步，无需手动复制
- 修改后自动推送和拉取
- 始终保持最新配置

### 场景 3: 配置备份

**需求**: 定期备份 Cursor 自定义命令

**步骤**:
1. 创建 Git 仓库作为备份存储
2. 配置 AI Command Sync 同步到仓库
3. 设置较短的自动同步间隔（如 1 天）

**好处**:
- 自动备份，防止配置丢失
- 可回溯历史版本
- 便于恢复和迁移

## 💡 使用技巧

### 技巧 1: 快速访问

**创建键盘快捷键**:

1. `Ctrl+K Ctrl+S` (Mac: `Cmd+K Cmd+S`) 打开键盘快捷键
2. 搜索 "AI Command Sync: Sync Now"
3. 设置快捷键，如 `Ctrl+Alt+S`

现在可以快速执行同步！

### 技巧 2: 查看详细日志

如果同步出现问题，查看详细日志：

1. `Ctrl+Shift+U` (Mac: `Cmd+Shift+U`) 打开输出面板
2. 选择 "Extension Host" 或 "Tasks"
3. 查看 AI Command Sync 的日志输出

### 技巧 3: 选择性同步

**只同步特定文件**:

调整 `remotePath` 配置：

```json
{
  // 只同步 commands 子目录
  "aiCommandSync.remotePath": "cursor/commands/production",
  
  // 或只同步特定项目
  "aiCommandSync.remotePath": "projects/web/cursor"
}
```

### 技巧 4: 本地修改保护

AI Command Sync **不会删除**本地独有文件，所以您可以：

- 在同步的目录中添加本地专属配置
- 修改同步的文件，再次同步时会被覆盖
- 混合使用团队配置和个人配置

**建议**: 将个人专属配置放在单独的目录。

### 技巧 5: 通知管理

**关闭同步通知**（如果觉得打扰）:

```json
{
  "aiCommandSync.showNotification": false
}
```

**关闭启动提示**:

```json
{
  "aiCommandSync.enablePrompt": false
}
```

## 🚨 常见问题速查

### Q1: 同步后文件在哪里？

**A**: 默认在工作区的 `.cursor/commands` 目录。

**查看方法**:
1. 打开 VSCode 资源管理器
2. 导航到 `.cursor/commands`
3. 查看同步的文件

### Q2: 如何强制重新同步？

**A**: 删除本地文件，然后执行同步：

```bash
# 删除本地文件
rm -rf .cursor/commands

# 或在 VSCode 中删除文件夹
```

然后点击 "立即同步"。

### Q3: 同步很慢怎么办？

**A**: 可能是仓库太大，建议：

1. 确保仓库只包含必要文件
2. 使用浅克隆（已默认启用）
3. 检查网络连接

### Q4: 如何知道上次同步时间？

**A**: 
- 查看状态栏: "$(check) 已同步 (X小时前)"
- 或查看同步历史: 点击图标 → "查看同步历史"

### Q5: 可以同步到多个位置吗？

**A**: 当前版本不支持。但您可以：

1. 使用工作区级别的配置
2. 不同工作区配置不同的路径
3. 或手动复制文件

## 📊 状态图标说明

| 图标 | 说明 | 操作建议 |
|------|------|----------|
| 🔵 $(cloud-download) AI Command Sync | 尚未同步 | 点击执行首次同步 |
| 🔄 $(sync~spin) 同步中... | 正在同步 | 等待完成 |
| ✅ $(check) 已同步 (X前) | 同步成功 | 无需操作 |
| ❌ $(error) 同步失败 | 同步出错 | 点击查看错误并重试 |

## 🎓 进阶学习

完成快速开始后，您可以：

1. **深入了解**: 阅读 [README.md](README.md) 了解所有功能
2. **详细配置**: 查看 [INSTALL.md](INSTALL.md) 的配置部分
3. **参与开发**: 阅读 [DEVELOPMENT.md](DEVELOPMENT.md) 贡献代码
4. **查看更新**: 关注 [CHANGELOG.md](CHANGELOG.md) 了解新功能

## 🎉 下一步

恭喜！您已经掌握了 AI Command Sync 的基本使用。现在您可以：

- ✅ 手动执行同步
- ✅ 启用自动同步
- ✅ 查看同步历史
- ✅ 自定义配置

**享受高效的配置管理体验！** 🚀

---

如有任何问题，欢迎：
- 提交 [Issue](https://github.com/ApolloNaco/ai-command-sync/issues)
- 访问 [掘金](https://juejin.cn/user/Genyuan的AI工程) 交流
