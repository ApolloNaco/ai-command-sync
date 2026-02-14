# Cursor Sync 插件开发完整需求文档

## 📋 项目概述

开发一个 VSCode/Cursor 扩展，用于自动同步 Git 仓库中的 Cursor 命令配置文件到本地项目。

---

## 🎯 核心功能需求

### 1. 自动提示同步
- **触发时机**：打开项目时（延迟 2-3 秒）
- **提示内容**：检测到项目包含同步配置，是否立即同步 Cursor 命令？
- **用户选项**：
  - "立即同步" - 马上执行一次同步
  - "稍后" - 跳过本次，下次打开仍会提示
  - "自动同步" - 启用自动同步并立即执行
  - "不再提示" - 禁用自动提示功能

### 2. 手动同步
- **触发方式**：
  - 点击状态栏的 Cursor Sync 图标
  - 命令面板：`Cursor Sync: Sync Now`
- **功能**：从 Git 仓库同步配置文件到本地

### 3. 自动同步
- **机制**：后台定时检查（每小时检查一次）
- **判断逻辑**：距上次同步超过配置的间隔天数
- **默认间隔**：7 天
- **配置项**：可在设置中开启/关闭和调整间隔

### 4. 状态栏显示
- **位置**：右下角状态栏
- **状态类型**：
  - 🔵 Not Synced - 未同步（点击可执行同步）
  - 🔄 Syncing - 同步中
  - ✅ Up-to-date - 已同步（显示上次同步时间，如"2小时前"）
  - ❌ Failed - 同步失败（点击查看错误）
- **交互**：点击显示快捷菜单

### 5. 快捷菜单
点击状态栏图标弹出菜单，包含：
- 立即同步
- 查看同步历史
- 打开设置
- 切换自动同步

### 6. 桌面通知
- **同步成功**：显示统计信息（新增 X 个，更新 Y 个，未变更 Z 个）
- **同步失败**：显示错误信息和解决建议
- **可配置**：可在设置中关闭通知

### 7. 同步历史
- **功能**：记录最近 20 次同步记录
- **内容**：时间戳、新增/更新/未变更文件数
- **查看方式**：命令面板 `Cursor Sync: View History`

---

## ⚙️ 配置项要求

### 扩展基本信息
```json
{
  "name": "cursor-sync-extension",
  "displayName": "Cursor Sync",
  "description": "自动同步 Cursor 命令配置文件",
  "version": "1.0.0",
  "publisher": "ApolloNaco",
  "author": {
    "name": "Naco",
    "url": "https://juejin.cn/user/143390347639064"
  }
}
```

### 默认配置值
```json
{
  "cursorSync.autoSync": false,
  "cursorSync.autoSyncInterval": 7,
  "cursorSync.showNotification": true,
  "cursorSync.enablePrompt": true,
  "cursorSync.gitRepo": "https://github.com/ApolloNaco/AITools.git",
  "cursorSync.remotePath": "cursor/commands",
  "cursorSync.localPath": ".cursor/commands",
  "cursorSync.branch": "master"
}
```

### 用户可配置项
| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| Auto Sync | 布尔值 | false | 启用后台自动同步 |
| Auto Sync Interval | 数字 | 7 | 自动同步间隔（天） |
| Show Notification | 布尔值 | true | 同步完成后显示通知 |
| Enable Prompt | 布尔值 | true | 打开项目时显示提示 |
| Git Repo | 字符串 | - | 远程仓库地址 |
| Remote Path | 字符串 | cursor/commands | 远程目录路径 |
| Local Path | 字符串 | .cursor/commands | 本地目标路径 |
| Branch | 字符串 | master | Git 分支 |

---

## 🔧 命令面板命令

需要注册以下命令：

| 命令 ID | 命令名称 | 功能 |
|---------|---------|------|
| `cursorSync.syncNow` | Cursor Sync: Sync Now | 立即执行同步 |
| `cursorSync.viewHistory` | Cursor Sync: View History | 查看同步历史 |
| `cursorSync.openSettings` | Cursor Sync: Open Settings | 打开扩展设置 |
| `cursorSync.toggleAutoSync` | Cursor Sync: Toggle Auto Sync | 切换自动同步开关 |
| `cursorSync.showQuickPick` | （内部命令） | 显示快捷菜单 |

---

## 🏗️ 技术实现要求

### 核心模块架构

```
src/
├── extension.ts              # 扩展入口
├── syncManager.ts            # 同步管理器
├── configManager.ts          # 配置管理
├── statusBarManager.ts       # 状态栏管理
├── notificationService.ts    # 通知服务
└── types.ts                  # 类型定义
```

### 同步逻辑流程

1. **创建临时目录**
   - 使用随机名称避免冲突
   - 位置：系统临时目录

2. **克隆 Git 仓库**
   - 使用 `simple-git` 库
   - 参数：`--depth=1 -b <branch> --single-branch`
   - 只克隆最新提交，减少网络传输

3. **解析远程路径**
   - 尝试直接路径
   - 如果不存在，在子目录中查找

4. **文件比对和同步**
   - 使用 MD5 哈希比对文件内容
   - 只复制新增或变更的文件
   - **不删除**本地独有的文件
   - 递归处理子目录

5. **统计并返回结果**
   - 新增文件数
   - 更新文件数
   - 未变更文件数

6. **清理临时目录**
   - 使用 `try-finally` 确保清理
   - 即使同步失败也要清理

7. **保存同步历史**
   - 存储在 `context.globalState`
   - 保留最近 20 条记录

### 技术栈和依赖

**运行时依赖**：
- `simple-git`: ^3.19.0（Git 操作）

**开发依赖**：
- TypeScript: ^5.0.0
- @types/vscode: ^1.80.0
- @types/node: ^18.0.0
- @vscode/vsce: ^2.19.0（打包工具）

**VSCode API 版本**：
- engines.vscode: ^1.80.0

---

## 🎨 UI/UX 要求

### 状态栏图标和文本
- 使用 VSCode 内置图标
- 根据状态显示不同颜色
- 失败时使用红色背景

### 通知样式
- 使用 VSCode 原生通知
- 成功：信息通知（蓝色）
- 失败：错误通知（红色）
- 提供操作按钮（如"查看详情"）

### 进度显示
- 同步时显示进度通知
- 显示当前步骤（如"克隆远程仓库..."）

---

## 📦 打包要求

### .vscodeignore 配置
```
.vscode/**
.vscode-test/**
src/**
.gitignore
**/tsconfig.json
**/*.map
**/*.ts
node_modules/**/test/**
node_modules/**/.bin/**
node_modules/**/*.md
```

**注意**：不要排除整个 `node_modules/`，需要包含 `simple-git` 依赖

### 打包检查
- ✅ 包含 `out/` 编译输出
- ✅ 包含 `node_modules/simple-git`
- ✅ 包含 README.md
- ✅ 文件大小约 115 KB

---

## 🐛 常见问题和解决方案

### 问题 1：扩展安装后状态栏没有图标

**原因**：
- 打包时排除了 `node_modules/`
- `simple-git` 依赖缺失

**解决方案**：
- 修改 `.vscodeignore`，不要完全排除 `node_modules/`
- 重新打包

### 问题 2：同步失败

**可能原因**：
- 网络问题
- Git 未安装
- 仓库地址错误
- 没有访问权限

**解决方案**：
- 提供详细错误信息
- 在通知中给出检查清单

### 问题 3：打开项目不提示

**可能原因**：
- 已经提示过（使用 `workspaceState` 记录）
- `enablePrompt` 被禁用

**解决方案**：
- 重新打开项目或重启 Cursor
- 检查设置

---

## 📝 文档要求

需要创建以下文档：

1. **README.md** - 功能说明和快速入门
2. **INSTALL.md** - 详细安装指南（400+ 行）
3. **QUICK-START.md** - 5分钟快速上手
4. **CHANGELOG.md** - 版本更新日志
5. **DEVELOPMENT.md** - 开发者文档（500+ 行）

---

## 🧪 测试要求

### 单元测试
- 配置管理器测试
- 文件哈希计算测试
- 命令注册测试

### 集成测试
- 完整同步流程测试
- 错误处理测试
- 自动同步触发测试

---

## 📤 发布要求

### 市场信息
- **发布者**: ApolloNaco
- **作者**: Naco（掘金: NacoStack）
- **仓库**: https://github.com/ApolloNaco/AITools.git

### 添加字段
```json
{
  "icon": "icon.png",
  "repository": {
    "type": "git",
    "url": "https://github.com/ApolloNaco/AITools.git"
  },
  "keywords": [
    "cursor",
    "sync",
    "git",
    "automation",
    "commands"
  ],
  "license": "MIT"
}
```

### 发布步骤
1. 创建 Microsoft 账号
2. 在 Azure DevOps 创建 Publisher
3. 生成 Personal Access Token
4. 使用 `vsce login` 登录
5. 执行 `vsce publish` 发布

---

## 🎯 完整开发步骤总结

### 阶段一：项目初始化
1. 创建项目目录 `cursor-sync-extension/`
2. 初始化 `package.json`
3. 配置 `tsconfig.json`
4. 创建 `.vscodeignore`
5. 设置调试配置 `.vscode/launch.json`

### 阶段二：核心功能开发
1. 实现 `types.ts` - 类型定义
2. 实现 `configManager.ts` - 配置管理
3. 实现 `syncManager.ts` - 同步逻辑
4. 实现 `statusBarManager.ts` - 状态栏
5. 实现 `notificationService.ts` - 通知
6. 实现 `extension.ts` - 入口和生命周期

### 阶段三：UI 和交互
1. 实现打开项目时自动提示
2. 实现状态栏快捷菜单
3. 注册命令面板命令
4. 实现进度显示
5. 实现通知反馈

### 阶段四：自动化功能
1. 实现自动同步后台任务
2. 实现定时检查机制（每小时）
3. 实现同步判断逻辑
4. 实现历史记录管理

### 阶段五：测试和优化
1. 编写单元测试
2. 编写集成测试
3. 测试错误处理
4. 性能优化

### 阶段六：打包和发布
1. 完善文档
2. 编译 TypeScript
3. 打包为 .vsix
4. 本地测试安装
5. 发布到市场

---

## 💡 实现技巧和注意事项

### 1. 延迟提示
```typescript
setTimeout(async () => {
  const choice = await NotificationService.showSyncPrompt();
  // 处理用户选择
}, 2000);
```

### 2. 防止重复提示
```typescript
const hasPrompted = context.workspaceState.get('cursorSync.hasPrompted', false);
if (hasPrompted) return;
await context.workspaceState.update('cursorSync.hasPrompted', true);
```

### 3. MD5 文件比对
```typescript
import * as crypto from 'crypto';

async function calculateFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}
```

### 4. 状态持久化
```typescript
// 全局状态（跨工作区）
await context.globalState.update('key', value);

// 工作区状态（当前工作区）
await context.workspaceState.update('key', value);
```

### 5. 错误处理
```typescript
try {
  await syncManager.executeSync();
} catch (error: any) {
  statusBarManager.updateStatus(SyncStatus.Failed);
  NotificationService.showSyncError(error.message);
}
```

---

## 📊 预期成果

### 代码规模
- TypeScript 源代码：约 800+ 行
- 测试代码：约 100+ 行
- 文档：约 2400+ 行
- 总文件数：约 22 个

### 打包大小
- VSIX 文件：约 115 KB
- 包含文件：39 个

### 功能完整性
- ✅ 所有核心功能实现
- ✅ 完整的错误处理
- ✅ 友好的用户体验
- ✅ 详尽的文档

---

## 🔗 参考资源

- [VSCode 扩展 API 文档](https://code.visualstudio.com/api)
- [simple-git 文档](https://github.com/steveukx/git-js)
- [VSCode 扩展发布指南](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

---

## 💬 关键对话问题总结

在家重新实现时，您可以按以下顺序提问：

1. **"我想开发一个 Cursor 扩展，功能是从 Git 仓库自动同步配置文件到本地项目的 .cursor/commands 目录"**
   - 说明基本需求

2. **"扩展需要在打开项目时自动提示用户是否同步，提供4个选项：立即同步、稍后、自动同步、不再提示"**
   - 说明自动提示功能

3. **"扩展需要在状态栏显示同步状态，包括未同步、同步中、已同步、同步失败4种状态"**
   - 说明状态栏功能

4. **"扩展需要支持自动同步，后台每小时检查一次，如果距上次同步超过配置的天数就自动同步"**
   - 说明自动同步功能

5. **"同步逻辑：使用 simple-git 浅克隆仓库，用 MD5 比对文件，只复制新增或变更的文件，不删除本地独有文件"**
   - 说明同步逻辑

6. **"发布者改为 ApolloNaco，默认仓库改为 https://github.com/ApolloNaco/AITools.git，远程路径改为 cursor/commands，作者信息添加掘金：NacoStack"**
   - 说明配置信息

7. **"如何打包和发布到 VSCode Marketplace？"**
   - 询问发布流程

---

**祝您在家顺利实现！** 🚀

有任何问题随时问我！
