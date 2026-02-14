# AGENTS.md - AI Command Sync 项目指南

## 项目概述

这是一个 VS Code / Cursor 扩展（Extension），名为 **AI Command Sync**，用于从 Git 仓库自动同步 AI 编辑器的自定义命令和配置文件。核心功能是通过浅克隆（shallow clone）拉取远程仓库，使用 MD5 增量对比只同步变更文件。

## 技术栈

- **语言**: TypeScript 5.0
- **目标环境**: VS Code ^1.80.0（兼容 Cursor）
- **模块系统**: CommonJS, ES2020
- **核心依赖**: `simple-git` ^3.19.0（Git 操作）
- **测试框架**: Mocha + @vscode/test-electron
- **构建**: TypeScript Compiler (`tsc`)
- **发布**: vsce (VS Code Marketplace) + ovsx (Open VSX)

## 架构设计

项目采用模块化设计，各模块职责分离：

```
src/
├── extension.ts          # 入口：激活扩展、注册命令、管理生命周期
├── syncManager.ts        # 核心：Git 操作、文件同步、MD5 对比、同步历史
├── configManager.ts      # 配置：读写 VS Code 设置、监听配置变化
├── statusBarManager.ts   # UI：状态栏显示同步状态、快捷菜单
├── notificationService.ts # 通知：用户反馈、进度展示、错误处理
├── types.ts              # 类型：SyncStatus 枚举、接口定义
└── test/                 # 测试套件
```

### 模块依赖关系

- `extension.ts` 是总协调器，初始化并组合所有其他模块
- `syncManager.ts` 是核心业务逻辑，依赖 `simple-git` 和 `configManager`
- `configManager.ts` 封装 `vscode.workspace.getConfiguration()`
- `statusBarManager.ts` 和 `notificationService.ts` 是纯 UI 层，不含业务逻辑

## 编码规范

### 通用规则
- 使用 TypeScript 严格模式（`strict: true`）
- 所有对外接口必须有类型定义，定义在 `src/types.ts`
- 异步操作统一使用 `async/await`，避免裸 Promise 链
- 错误处理使用 try-catch，通过 `notificationService` 向用户展示

### VS Code API 使用
- 命令注册使用 `vscode.commands.registerCommand`，前缀为 `aiCommandSync.`
- 配置读取通过 `vscode.workspace.getConfiguration('aiCommandSync')`
- 状态持久化使用 `context.globalState`（同步历史等）
- 所有可释放资源（Disposable）必须加入 `context.subscriptions`

### Git 操作
- 使用 `simple-git` 库，不直接调用 git CLI
- 克隆统一使用 `--depth=1` 浅克隆以减少开销
- 临时克隆目录使用系统临时目录 + 随机后缀

### 命名约定
- 文件名：camelCase（如 `syncManager.ts`）
- 类/接口：PascalCase（如 `SyncManager`, `SyncConfig`）
- 枚举值：PascalCase（如 `SyncStatus.Success`）
- 命令 ID：点分格式（如 `aiCommandSync.syncNow`）

## 关键配置项

扩展向用户暴露的配置（在 `package.json` 的 `contributes.configuration` 中）：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `gitRepo` | string | "" | Git 仓库地址（必填） |
| `remotePath` | string | "cursor/commands" | 远程仓库中的路径 |
| `localPath` | string | ".cursor/commands" | 本地保存路径 |
| `branch` | string | "master" | Git 分支 |
| `autoSync` | boolean | false | 是否自动同步 |
| `autoSyncInterval` | number | 7 | 自动同步间隔（天） |

## 常用开发命令

```bash
npm run compile    # 编译 TypeScript
npm run watch      # 监听模式编译
npm test           # 运行测试
npm run package    # 打包为 .vsix
npm run publish    # 执行完整发布流程
```

## 注意事项

- 修改 `package.json` 中的 `contributes` 后需要重新加载扩展才能生效
- 发布前必须更新 `CHANGELOG.md` 和版本号
- `.vscodeignore` 控制 VSIX 包内容，确保不打包源码和测试
- 扩展同时发布到 VS Code Marketplace 和 Open VSX Registry
- UI 文本使用中文（面向中文用户）
