# 更新日志

所有 Cursor Sync 扩展的重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2026-02-03

### 🎉 首次发布

这是 Cursor Sync 的首个正式版本！

### ✨ 新增功能

#### 核心功能
- **Git 仓库同步**: 从 Git 仓库同步 Cursor AI 自定义命令
- **智能增量同步**: 使用 MD5 哈希比对，只同步变更文件
- **文件保护机制**: 不删除本地独有文件，保护本地修改
- **浅克隆优化**: 使用 `--depth=1` 参数，加快克隆速度

#### 自动化功能
- **自动同步**: 支持定时自动同步，可配置间隔天数（默认 7 天）
- **启动提示**: 首次打开工作区时智能提示同步
- **定时检查**: 每小时自动检查是否需要同步

#### 用户界面
- **状态栏显示**: 实时显示同步状态和上次同步时间
- **快捷菜单**: 点击状态栏图标快速访问常用功能
- **命令面板**: 提供 5 个命令面板命令
- **同步历史**: 查看最近 20 条同步记录

#### 通知系统
- **同步成功通知**: 显示新增、更新、未变更文件统计
- **同步失败通知**: 显示错误信息并提供重试选项
- **进度提示**: 同步过程中显示当前步骤

#### 配置选项
- **仓库配置**: 自定义 Git 仓库、分支、远程路径
- **本地配置**: 自定义本地同步路径
- **通知配置**: 控制是否显示各类通知
- **自动同步配置**: 配置自动同步间隔

### 📦 命令列表

- `cursorSync.syncNow` - 立即执行同步
- `cursorSync.viewHistory` - 查看同步历史记录
- `cursorSync.openSettings` - 打开扩展设置
- `cursorSync.toggleAutoSync` - 切换自动同步开关
- `cursorSync.showQuickPick` - 显示快捷菜单（内部命令）

### ⚙️ 配置项

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

### 🛠️ 技术实现

- **开发语言**: TypeScript 5.0
- **目标平台**: VSCode ^1.80.0
- **核心依赖**: simple-git ^3.19.0
- **构建工具**: TypeScript Compiler
- **测试框架**: Mocha

### 📚 文档

- **README.md**: 完整的功能介绍和使用指南（200+ 行）
- **INSTALL.md**: 详细的安装指南（400+ 行）
- **QUICK-START.md**: 5 分钟快速入门教程（100+ 行）
- **DEVELOPMENT.md**: 开发者文档和贡献指南（待完成）
- **CHANGELOG.md**: 本更新日志

### 🧪 测试

- 扩展激活测试
- 命令注册测试
- 配置管理器测试
- 同步管理器测试
- MD5 哈希计算测试

### 📊 统计信息

- **源代码**: 约 800+ 行
- **测试代码**: 约 150+ 行
- **文档**: 约 2500+ 行
- **文件数量**: 40+ 个文件
- **VSIX 大小**: 约 115 KB

### 🔒 安全性

- 所有文件操作都在工作区内进行
- 临时文件自动清理
- 不删除用户本地文件
- 支持私有 Git 仓库（通过 Git 凭证）

### 🌐 兼容性

- **操作系统**: Windows, macOS, Linux
- **VSCode 版本**: 1.80.0 及以上
- **Git 版本**: 2.0 及以上

### 📝 已知限制

- 每次只能配置一个同步仓库
- 不支持 Git 子模块
- 需要系统安装 Git
- 大仓库首次克隆可能较慢

### 🙏 致谢

感谢所有在开发过程中提供反馈和建议的用户！

---

## 未来计划

以下功能计划在后续版本中实现：

### [1.1.0] - 计划中

- [ ] 支持多仓库同步
- [ ] 同步前后钩子脚本
- [ ] 冲突解决策略配置
- [ ] 更详细的同步日志
- [ ] 同步历史导出功能

### [1.2.0] - 计划中

- [ ] 图形化配置界面
- [ ] 文件级别的同步控制（包含/排除规则）
- [ ] 支持 SSH 协议
- [ ] 同步性能优化
- [ ] WebView 历史记录查看器

### [2.0.0] - 长期计划

- [ ] 双向同步支持
- [ ] 自动提交本地更改
- [ ] 团队协作功能
- [ ] 云端配置同步
- [ ] 多工作区支持

---

## 版本号说明

版本号格式：`主版本号.次版本号.修订号`

- **主版本号**: 不兼容的 API 修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

---

## 反馈渠道

如果您有任何建议或发现问题，欢迎：

- 提交 [GitHub Issue](https://github.com/ApolloNaco/cursor-sync/issues)
- 访问 [掘金主页](https://juejin.cn/user/143390347639064) 留言
- 发起 [Pull Request](https://github.com/ApolloNaco/cursor-sync/pulls)

---

**感谢使用 Cursor Sync！** 🎉
