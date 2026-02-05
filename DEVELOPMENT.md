# AI Command Sync 开发者文档

本文档面向想要参与 AI Command Sync 开发、贡献代码或进行二次开发的开发者。

## 📋 目录

- [项目架构](#项目架构)
- [开发环境搭建](#开发环境搭建)
- [项目结构](#项目结构)
- [核心模块](#核心模块)
- [开发工作流](#开发工作流)
- [测试指南](#测试指南)
- [调试技巧](#调试技巧)
- [构建和打包](#构建和打包)
- [贡献指南](#贡献指南)
- [代码规范](#代码规范)

## 🏗️ 项目架构

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                     extension.ts                         │
│                  (扩展入口和生命周期)                      │
└────────────┬────────────────────────────────────────────┘
             │
             ├─── ConfigManager (配置管理)
             │     └─── 读取和监听 VSCode 配置
             │
             ├─── SyncManager (同步管理)
             │     ├─── simple-git (Git 操作)
             │     ├─── fs/crypto (文件和哈希)
             │     └─── globalState (历史记录)
             │
             ├─── StatusBarManager (状态栏)
             │     ├─── 显示同步状态
             │     └─── QuickPick 菜单
             │
             └─── NotificationService (通知)
                   └─── 用户反馈和提示
```

### 数据流

```
用户触发同步
    ↓
extension.ts (performSync)
    ↓
ConfigManager.getConfig() → 获取配置
    ↓
StatusBarManager.updateStatus(Syncing) → 更新状态
    ↓
SyncManager.sync(config)
    ├─── 创建临时目录
    ├─── Git 浅克隆
    ├─── 文件 MD5 比对
    ├─── 复制变更文件
    └─── 清理临时目录
    ↓
SyncResult → 同步结果
    ↓
StatusBarManager.updateStatus(Success/Failed)
    ↓
NotificationService.showNotification() → 显示通知
    ↓
SyncManager.saveHistory() → 保存历史
```

## 🛠️ 开发环境搭建

### 前置要求

- **Node.js**: v18 或更高
- **npm**: v8 或更高
- **Git**: v2.0 或更高
- **VSCode**: v1.80.0 或更高
- **TypeScript**: v5.0 或更高（会自动安装）

### 克隆项目

```bash
git clone https://github.com/ApolloNaco/ai-command-sync.git
cd ai-command-sync
```

### 安装依赖

```bash
npm install
```

这将安装：
- **运行时依赖**: simple-git
- **开发依赖**: TypeScript, @types/*, vsce, mocha 等

### 编译项目

```bash
npm run compile
```

或使用监听模式（推荐开发时使用）：

```bash
npm run watch
```

### 启动调试

1. 在 VSCode 中打开项目
2. 按 `F5` 或点击 "Run and Debug"
3. 选择 "Run Extension"
4. 新窗口会打开，扩展已加载

## 📁 项目结构

```
ai-command-sync/
├── .vscode/
│   └── launch.json          # 调试配置
├── src/
│   ├── extension.ts         # 扩展入口
│   ├── types.ts            # 类型定义
│   ├── configManager.ts    # 配置管理器
│   ├── syncManager.ts      # 同步管理器
│   ├── statusBarManager.ts # 状态栏管理器
│   ├── notificationService.ts # 通知服务
│   └── test/               # 测试文件
│       ├── runTest.ts      # 测试运行器
│       └── suite/          # 测试套件
│           ├── index.ts
│           ├── extension.test.ts
│           ├── configManager.test.ts
│           └── syncManager.test.ts
├── out/                    # 编译输出（自动生成）
├── node_modules/           # 依赖包（自动生成）
├── package.json            # 扩展清单
├── tsconfig.json          # TypeScript 配置
├── .vscodeignore          # 打包排除规则
├── .gitignore             # Git 忽略规则
├── README.md              # 项目说明
├── INSTALL.md             # 安装指南
├── QUICK-START.md         # 快速开始
├── CHANGELOG.md           # 更新日志
├── DEVELOPMENT.md         # 本文档
└── LICENSE                # 许可证
```

### 关键文件说明

#### package.json

扩展清单文件，定义：
- 扩展元数据（名称、版本、作者等）
- 激活事件（`onStartupFinished`）
- 贡献点（命令、配置）
- 依赖包
- 脚本命令

#### tsconfig.json

TypeScript 编译配置：
- `target`: ES2020
- `module`: commonjs
- `outDir`: out
- `rootDir`: src
- `strict`: true

#### .vscodeignore

打包时排除的文件：
- 源代码（保留 `out/`）
- 测试文件
- 开发配置
- **注意**: 必须保留 `node_modules/simple-git/**`

## 🧩 核心模块

### 1. types.ts - 类型定义

定义了整个项目的核心类型：

```typescript
// 同步状态枚举
enum SyncStatus {
  NotSynced, Syncing, Success, Failed
}

// 同步配置接口
interface SyncConfig {
  gitRepo, remotePath, localPath, branch,
  autoSync, autoSyncInterval, showNotification, enablePrompt
}

// 同步结果接口
interface SyncResult {
  added, updated, unchanged, timestamp, success, error?
}

// 同步历史条目
interface SyncHistoryEntry {
  timestamp, result
}
```

### 2. configManager.ts - 配置管理器

**职责**: 管理 VSCode 配置的读取和更新

**核心方法**:
- `getConfig()`: 获取完整配置
- `updateConfig()`: 更新配置项
- `onConfigChange()`: 监听配置变化
- `getValue()`: 获取单个配置值

**实现细节**:
- 使用 `vscode.workspace.getConfiguration('cursorSync')`
- 支持工作区和全局配置
- 提供默认值

### 3. syncManager.ts - 同步管理器

**职责**: 执行 Git 同步和文件管理

**核心方法**:
- `sync(config)`: 执行同步
- `getHistory()`: 获取历史记录
- `shouldAutoSync()`: 判断是否需要自动同步
- `getLastSyncTimestamp()`: 获取上次同步时间

**同步流程**:

```typescript
1. 创建临时目录: .ai-command-sync-${timestamp}
2. Git 浅克隆:
   git clone --depth=1 -b <branch> --single-branch <repo> <tempDir>
3. 验证远程路径存在
4. 确保本地路径存在
5. 递归同步文件:
   - 计算 MD5 哈希
   - 比对文件差异
   - 复制变更文件
6. 保存同步历史
7. 清理临时目录 (finally 块)
```

**关键实现**:

```typescript
// MD5 计算
calculateMD5(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

// 文件比对
shouldCopyFile(remotePath, localPath): {copy, isNew} {
  if (!exists(localPath)) return {copy: true, isNew: true};
  return {
    copy: remoteMD5 !== localMD5,
    isNew: false
  };
}
```

### 4. statusBarManager.ts - 状态栏管理器

**职责**: 管理状态栏显示和快捷菜单

**核心方法**:
- `updateStatus(status, timestamp)`: 更新状态显示
- `showQuickPick()`: 显示快捷菜单

**状态映射**:

| Status | Icon | Text | Color |
|--------|------|------|-------|
| NotSynced | cloud-download | AI Command Sync | 默认 |
| Syncing | sync~spin | 同步中... | 默认 |
| Success | check | 已同步 (X前) | 默认 |
| Failed | error | 同步失败 | 红色背景 |

**时间格式化**:
- < 1 分钟: "刚刚"
- < 60 分钟: "X分钟前"
- < 24 小时: "X小时前"
- ≥ 24 小时: "X天前"

### 5. notificationService.ts - 通知服务

**职责**: 处理所有用户通知和反馈

**核心方法**:
- `showSyncSuccess(result)`: 成功通知
- `showSyncFailure(error)`: 失败通知
- `showProgress(title, task)`: 进度通知
- `showAutoPrompt()`: 自动提示
- `showInfo/Warning/Error()`: 通用通知

**通知类型**:

```typescript
// 成功通知
"同步成功！新增 X 个，更新 Y 个，未变更 Z 个。"

// 失败通知（带操作）
"同步失败：<error>" [查看日志] [重试]

// 自动提示（4 选项）
"检测到您的自定义命令可能需要同步。"
[立即同步] [稍后提醒] [启用自动同步] [不再提示]
```

### 6. extension.ts - 扩展入口

**职责**: 扩展生命周期管理和命令注册

**activate() 流程**:

```typescript
1. 初始化所有管理器
2. 恢复上次同步状态
3. 注册所有命令
4. 延迟 2 秒显示自动提示
5. 启动自动同步定时器
6. 监听配置变化
```

**命令注册**:
- `syncNow`: 手动同步
- `viewHistory`: 查看历史
- `openSettings`: 打开设置
- `toggleAutoSync`: 切换自动同步
- `showQuickPick`: 快捷菜单（内部）

**自动同步逻辑**:

```typescript
// 每小时检查一次
setInterval(async () => {
  if (shouldAutoSync()) {
    await performSync();
  }
}, 60 * 60 * 1000);

// shouldAutoSync 判断
shouldAutoSync(config): boolean {
  if (!config.autoSync) return false;
  const daysSince = (now - lastSync) / (1000*60*60*24);
  return daysSince >= config.autoSyncInterval;
}
```

## 🔄 开发工作流

### 典型开发流程

1. **创建分支**

```bash
git checkout -b feature/your-feature-name
```

2. **编写代码**

- 遵循 TypeScript 严格模式
- 添加必要的类型注解
- 编写清晰的注释

3. **实时编译**

```bash
npm run watch
```

4. **调试测试**

- 按 `F5` 启动调试
- 在扩展开发窗口测试功能
- 查看调试控制台的日志

5. **编写测试**

```typescript
// src/test/suite/yourFeature.test.ts
suite('Your Feature Test', () => {
  test('Should work correctly', () => {
    // 测试代码
  });
});
```

6. **运行测试**

```bash
npm run test
```

7. **提交代码**

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

8. **创建 Pull Request**

### 添加新功能示例

**需求**: 添加一个清除同步历史的功能

**步骤**:

1. **更新 types.ts**（如果需要新类型）

2. **在 SyncManager 添加方法**:

```typescript
// src/syncManager.ts
public async clearHistory(): Promise<void> {
  await this.context.globalState.update('aiCommandSync.history', []);
}
```

3. **在 extension.ts 注册命令**:

```typescript
context.subscriptions.push(
  vscode.commands.registerCommand('aiCommandSync.clearHistory', async () => {
    const confirmed = await notificationService.confirm(
      '确定要清除所有同步历史吗？'
    );
    if (confirmed) {
      await syncManager.clearHistory();
      notificationService.showInfo('同步历史已清除');
    }
  })
);
```

4. **在 package.json 声明命令**:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "aiCommandSync.clearHistory",
        "title": "AI Command Sync: Clear History"
      }
    ]
  }
}
```

5. **添加到快捷菜单**（可选）:

```typescript
// src/statusBarManager.ts
{
  label: '$(trash) 清除历史',
  description: '删除所有同步记录',
  detail: 'aiCommandSync.clearHistory'
}
```

6. **编写测试**:

```typescript
// src/test/suite/syncManager.test.ts
test('Should clear history', async () => {
  await syncManager.clearHistory();
  const history = syncManager.getHistory();
  assert.strictEqual(history.length, 0);
});
```

## 🧪 测试指南

### 测试架构

使用 Mocha 测试框架和 @vscode/test-electron。

### 测试文件结构

```
src/test/
├── runTest.ts              # 测试运行器
└── suite/
    ├── index.ts            # 测试套件入口
    ├── extension.test.ts   # 扩展测试
    ├── configManager.test.ts
    └── syncManager.test.ts
```

### 运行测试

```bash
# 运行所有测试
npm test

# 仅编译不测试
npm run compile
```

### 编写测试

**基本结构**:

```typescript
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Feature Test Suite', () => {
  // 测试前准备
  setup(() => {
    // 初始化
  });

  // 测试后清理
  teardown(() => {
    // 清理
  });

  test('Should do something', () => {
    // 测试代码
    assert.ok(true);
  });

  test('Should do something async', async () => {
    const result = await someAsyncFunction();
    assert.strictEqual(result, expected);
  });
});
```

### Mock 技巧

由于 simple-git 需要真实的 Git 环境，建议：

1. **单元测试**: 测试逻辑，避免实际 Git 操作
2. **集成测试**: 使用真实或测试仓库
3. **Mock 示例**:

```typescript
// Mock simple-git (高级)
const mockGit = {
  clone: async () => { /* mock */ }
};
```

## 🐛 调试技巧

### 使用 VSCode 调试器

1. **设置断点**: 点击行号左侧
2. **启动调试**: `F5`
3. **调试控制**:
   - `F10`: 单步跳过
   - `F11`: 单步进入
   - `Shift+F11`: 单步跳出
   - `F5`: 继续

### 日志输出

```typescript
// 开发时使用 console.log
console.log('Sync starting...', config);

// 生产环境考虑使用输出通道
const outputChannel = vscode.window.createOutputChannel('AI Command Sync');
outputChannel.appendLine('Sync completed');
outputChannel.show();
```

### 调试扩展宿主

查看扩展宿主的日志：
1. `Ctrl+Shift+U` 打开输出面板
2. 选择 "Extension Host"
3. 查看所有扩展的日志

### 调试技巧

**检查扩展是否激活**:

```typescript
const ext = vscode.extensions.getExtension('Genyuan.ai-command-sync');
console.log('Extension active:', ext?.isActive);
```

**检查命令是否注册**:

```typescript
const commands = await vscode.commands.getCommands();
console.log('Sync command registered:', 
  commands.includes('aiCommandSync.syncNow'));
```

**检查配置**:

```typescript
const config = vscode.workspace.getConfiguration('cursorSync');
console.log('Config:', config.get('gitRepo'));
```

## 📦 构建和打包

### 编译生产版本

```bash
npm run compile
```

这会将 TypeScript 编译到 `out/` 目录。

### 生成 VSIX 包

```bash
npm run package
```

或手动：

```bash
npx vsce package
```

这会生成 `ai-command-sync-1.0.0.vsix` 文件。

### 打包检查清单

在打包前确保：

- [ ] 所有 TypeScript 编译无错误
- [ ] 所有测试通过
- [ ] 更新了 CHANGELOG.md
- [ ] 更新了版本号（package.json）
- [ ] README.md 准确无误
- [ ] .vscodeignore 配置正确
- [ ] 包含 node_modules/simple-git

### 打包大小优化

查看打包内容：

```bash
npx vsce ls
```

优化建议：
- 排除所有源文件（`.ts`）
- 排除测试文件
- 排除开发配置
- 只保留必要的依赖

### 发布到 Marketplace

```bash
npx vsce publish
```

需要：
1. 创建发布者账号
2. 获取个人访问令牌（PAT）
3. 登录：`npx vsce login <publisher>`

## 🤝 贡献指南

### 如何贡献

我们欢迎各种形式的贡献：

1. **报告问题**: 提交 GitHub Issues
2. **功能建议**: 提交 Feature Request
3. **代码贡献**: 提交 Pull Request
4. **文档改进**: 完善文档
5. **测试用例**: 添加测试

### Pull Request 流程

1. **Fork 项目**
2. **创建分支**: `git checkout -b feature/amazing-feature`
3. **提交变更**: `git commit -m 'feat: add amazing feature'`
4. **推送分支**: `git push origin feature/amazing-feature`
5. **创建 PR**: 在 GitHub 上创建 Pull Request

### PR 检查清单

- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 所有测试通过
- [ ] 更新了相关文档
- [ ] Commit 信息清晰明确
- [ ] 没有不必要的依赖

### Commit 信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:

```
feat(sync): add support for SSH protocol

- Add SSH key configuration
- Update sync manager to handle SSH URLs
- Add tests for SSH sync

Closes #123
```

## 📐 代码规范

### TypeScript 规范

- 使用严格模式（`strict: true`）
- 明确的类型注解
- 避免 `any` 类型
- 使用接口定义复杂类型

**好的示例**:

```typescript
interface User {
  name: string;
  age: number;
}

function getUser(id: number): User | undefined {
  // 实现
}
```

**不好的示例**:

```typescript
function getUser(id: any): any {
  // 实现
}
```

### 命名规范

- **类**: PascalCase (`ConfigManager`)
- **函数/方法**: camelCase (`getConfig`)
- **常量**: UPPER_SNAKE_CASE (`MAX_HISTORY`)
- **接口**: PascalCase with `I` prefix optional (`SyncConfig`)
- **枚举**: PascalCase (`SyncStatus`)

### 注释规范

```typescript
/**
 * Perform synchronization from Git repository
 * 
 * @param config - Sync configuration
 * @returns Sync result with statistics
 * @throws Error if Git is not installed
 */
public async sync(config: SyncConfig): Promise<SyncResult> {
  // 实现
}
```

### 文件组织

```typescript
// 1. 导入语句
import * as vscode from 'vscode';
import { SyncConfig } from './types';

// 2. 常量定义
const MAX_RETRIES = 3;

// 3. 类型定义（小型）
type Status = 'idle' | 'busy';

// 4. 类/函数实现
export class MyClass {
  // ...
}

// 5. 导出语句
export { MyClass };
```

## 🚀 发布流程

### 版本发布步骤

1. **更新版本号**

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

2. **更新 CHANGELOG.md**

添加新版本的更新内容

3. **提交变更**

```bash
git add .
git commit -m "chore: release v1.1.0"
git tag v1.1.0
git push origin main --tags
```

4. **生成 VSIX**

```bash
npm run package
```

5. **发布到 Marketplace**

```bash
npx vsce publish
```

6. **创建 GitHub Release**

在 GitHub 上创建 Release，附加 VSIX 文件

## 📚 参考资源

### VSCode 扩展开发

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### 依赖库文档

- [simple-git](https://github.com/steveukx/git-js)
- [Node.js fs](https://nodejs.org/api/fs.html)
- [Node.js crypto](https://nodejs.org/api/crypto.html)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

## 💬 联系方式

- **GitHub**: [ApolloNaco](https://github.com/ApolloNaco)
- **掘金**: [Genyuan的AI工程](https://juejin.cn/user/Genyuan的AI工程)
- **Email**: 通过 GitHub Issues 联系

---

**感谢您对 AI Command Sync 的贡献！** 🎉
