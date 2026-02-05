# 快速发布指南

本文档提供快速发布的简化步骤。详细信息请参考 [PUBLISH.md](PUBLISH.md)。

## 🚀 快速发布（5 分钟）

### 1️⃣ 准备工作（首次发布）

```bash
# 1. 安装 ovsx CLI
npm install -g ovsx

# 2. 注册 OpenVSX 账户
# 访问: https://open-vsx.org/
# 使用 GitHub 登录，创建 Access Token

# 3. 创建 namespace（只需要做一次）
ovsx create-namespace Genyuan -p YOUR_TOKEN

# 4. 设置环境变量（推荐）
export OVSX_TOKEN="your-token-here"
# 或将其添加到 ~/.bashrc 或 ~/.zshrc
```

### 2️⃣ 发布新版本

#### 方式 A：使用自动化脚本（推荐）

```bash
# 运行发布脚本（会自动检查、编译、打包、发布）
npm run publish
```

#### 方式 B：手动步骤

```bash
# 1. 更新版本号（可选）
npm version patch  # 1.0.0 -> 1.0.1
# 或 npm version minor  # 1.0.0 -> 1.1.0
# 或 npm version major  # 1.0.0 -> 2.0.0

# 2. 编译
npm run compile

# 3. 打包
npm run package

# 4. 发布
npm run publish:ovsx
# 或 ovsx publish ai-command-sync-1.0.0.vsix -p $OVSX_TOKEN
```

### 3️⃣ 发布后

```bash
# 1. 创建 Git 标签
git tag v1.0.0
git push origin v1.0.0

# 2. 在 GitHub 创建 Release
# 附加 VSIX 文件
```

## 📝 版本更新流程

每次发布新版本时：

```bash
# 1. 更新版本号
npm version patch  # 或 minor/major

# 2. 更新 CHANGELOG.md
# 添加新版本的更新内容

# 3. 提交更改
git add .
git commit -m "chore: release v1.0.1"
git push

# 4. 发布
npm run publish

# 5. 创建标签
git tag v1.0.1
git push origin v1.0.1
```

## 🔑 环境变量配置

### 方式 1：临时设置

```bash
export OVSX_TOKEN="your-token"
npm run publish:ovsx
```

### 方式 2：永久设置（推荐）

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
export OVSX_TOKEN="your-token-here"
```

然后重新加载配置：

```bash
source ~/.bashrc  # 或 source ~/.zshrc
```

### 方式 3：使用 .env 文件（不推荐用于发布）

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件
# OVSX_TOKEN=your-token-here

# 注意：.env 文件已添加到 .gitignore，不会被提交
```

## ⚡ 快捷命令

```bash
# 完整发布流程（推荐）
npm run publish

# 仅编译
npm run compile

# 仅打包
npm run package

# 仅发布（需要先打包）
npm run publish:ovsx

# 监听编译（开发时使用）
npm run watch
```

## ✅ 发布前检查清单

- [ ] 代码已提交到 Git
- [ ] 版本号已更新（如果需要）
- [ ] CHANGELOG.md 已更新
- [ ] 测试通过（`npm test`）
- [ ] 编译无错误（`npm run compile`）
- [ ] Access Token 已准备好

## 🆘 常见问题

### Q: 发布失败，提示 "Namespace not found"

```bash
# 创建 namespace
ovsx create-namespace Genyuan -p YOUR_TOKEN
```

### Q: 发布失败，提示 "Extension version already exists"

```bash
# 更新版本号
npm version patch
```

### Q: Token 无效或过期

```bash
# 重新登录 OpenVSX，创建新的 Access Token
# 更新环境变量
export OVSX_TOKEN="new-token"
```

### Q: 扩展在 Cursor 中搜索不到

**答**: 扩展发布后需要几小时到一天的时间才会同步到 Cursor 市场。

在此期间，你可以：
1. 直接从 OpenVSX 下载 VSIX：https://open-vsx.org/extension/Genyuan/ai-command-sync
2. 手动拖拽 VSIX 文件到 Cursor 安装

## 📚 相关链接

- 详细发布指南：[PUBLISH.md](PUBLISH.md)
- OpenVSX 市场：https://open-vsx.org/
- 你的扩展：https://open-vsx.org/extension/Genyuan/ai-command-sync
- GitHub 仓库：https://github.com/ApolloNaco/ai-command-sync

---

**发布愉快！** 🎉
