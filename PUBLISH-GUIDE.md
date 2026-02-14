# 🚀 发布指南

## 当前状态

你的插件 **AI Command Sync v1.0.0** 已经准备就绪！

- ✅ 插件名称: AI Command Sync
- ✅ 包名: ai-command-sync
- ✅ 版本: 1.0.0
- ✅ Git 仓库: 全新的干净历史（仅1个提交）
- ✅ 文档完整
- ✅ 编译通过

---

## 📋 发布步骤（4步完成）

### 第1步：创建 GitHub 仓库

1. 访问: https://github.com/new

2. 创建新仓库：
   - **Repository name**: `ai-command-sync`
   - **Description**: `Sync AI custom commands and configurations from Git repositories`
   - **Visibility**: Public
   - **不要**勾选 "Initialize this repository with a README"（我们已经有了）

3. 点击 **"Create repository"**

### 第2步：推送代码到 GitHub

```bash
cd /Users/cgy/IdeaProjects/cursor-sync

# 设置远程仓库（如果还没设置）
git remote add origin https://github.com/ApolloNaco/ai-command-sync.git

# 推送代码
git push -u origin main
```

**如果推送失败**，需要配置 Git 凭证：

```bash
# 方法 A: 使用 SSH（推荐）
git remote set-url origin git@github.com:ApolloNaco/ai-command-sync.git
git push -u origin main

# 方法 B: 使用 Personal Access Token
# 1. 访问 https://github.com/settings/tokens/new 创建 token
# 2. 勾选 repo 权限
# 3. 推送时输入用户名和 token
git push -u origin main
```

---

### 第3步：注册 OpenVSX 并发布

#### 3.1 安装工具

```bash
npm install -g ovsx
```

#### 3.2 注册 OpenVSX

1. 访问: https://open-vsx.org/
2. 点击 **"Sign In"** 使用 GitHub 登录
3. 点击右上角头像 → **"Settings"**
4. 创建 **Access Token**（记得保存！）

#### 3.3 创建 Namespace

```bash
# 替换为你的 token
ovsx create-namespace ApolloNaco -p YOUR_TOKEN
```

#### 3.4 发布插件

```bash
# 设置环境变量
export OVSX_TOKEN="your-token-here"

# 一键发布
npm run publish
```

或者手动发布：

```bash
# 编译
npm run compile

# 打包
npm run package

# 发布
ovsx publish ai-command-sync-1.0.0.vsix -p $OVSX_TOKEN
```

---

### 第4步：创建 GitHub Release（可选）

```bash
# 创建版本标签
git tag v1.0.0
git push origin v1.0.0
```

然后访问: https://github.com/ApolloNaco/ai-command-sync/releases/new

创建 Release：
- **Tag**: v1.0.0
- **Title**: AI Command Sync v1.0.0 - Initial Release
- **Description**: 复制 CHANGELOG.md 的内容
- **Attachments**: 上传 ai-command-sync-1.0.0.vsix 文件

---

## ✅ 发布完成后

等待 5-10 分钟，然后验证：

### 检查 OpenVSX
访问: https://open-vsx.org/extension/ApolloNaco/ai-command-sync

### 检查 Cursor 市场
1. 打开 Cursor
2. 按 `Cmd+Shift+X` 打开扩展
3. 搜索 "AI Command Sync"

---

## 📁 项目文件结构

```
ai-command-sync/
├── README.md              # 主文档
├── CHANGELOG.md           # 版本历史
├── LICENSE                # MIT 许可证
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── icon.png               # 插件图标
│
├── .vscode/               # VSCode 配置
├── .gitignore             # Git 忽略文件
├── .vscodeignore          # 打包忽略文件
├── .env.example           # 环境变量示例
│
├── src/                   # 源代码
│   ├── extension.ts       # 主入口
│   ├── configManager.ts   # 配置管理
│   ├── syncManager.ts     # 同步管理
│   ├── statusBarManager.ts# 状态栏管理
│   ├── notificationService.ts # 通知服务
│   ├── types.ts           # 类型定义
│   └── test/              # 测试文件
│
├── scripts/               # 构建脚本
│   └── publish.sh         # 发布脚本
│
└── docs/                  # 文档
    ├── INSTALL.md         # 安装指南
    ├── QUICK-START.md     # 快速开始
    ├── DEVELOPMENT.md     # 开发指南
    ├── PUBLISH.md         # 详细发布指南
    └── QUICK-PUBLISH.md   # 快速发布指南
```

---

## 🆘 常见问题

### Q: 推送失败 "Permission denied"
A: 需要配置 SSH 密钥或使用 Personal Access Token

### Q: namespace 已存在
A: 说明之前创建过，可以直接发布

### Q: 发布失败 "Extension already exists"
A: 检查是否已经发布过，如果是更新版本，需要修改 `package.json` 中的版本号

### Q: Cursor 市场找不到插件
A: OpenVSX 同步到 Cursor 需要几个小时，请耐心等待

---

## 📞 需要帮助？

- 查看详细发布指南: [PUBLISH.md](./PUBLISH.md)
- 提交 Issue: https://github.com/ApolloNaco/ai-command-sync/issues

---

## 🎉 就是这么简单！

只需要 4 个步骤，你的插件就能发布到全世界了！

**祝发布顺利！** 🚀
