# 发布指南 / Publishing Guide

本文档提供了发布 AI Command Sync 扩展到 OpenVSX 市场的详细步骤。

## 📋 发布前检查清单

在发布之前，请确认以下所有项目都已完成：

- [x] **package.json** 配置完整
  - [x] name, displayName, description
  - [x] version 号正确
  - [x] publisher 名称
  - [x] icon 路径
  - [x] repository URL
  - [x] license
  
- [x] **文档齐全**
  - [x] README.md（功能说明和使用指南）
  - [x] CHANGELOG.md（版本更新日志）
  - [x] LICENSE（MIT 许可证）
  - [x] INSTALL.md（安装指南）
  - [x] QUICK-START.md（快速开始）

- [x] **资源文件**
  - [x] icon.png（2048x2048 PNG 格式）
  - [x] .vscodeignore（打包排除配置）

- [ ] **代码质量**
  - [ ] 所有更改已提交到 Git
  - [ ] 编译通过无错误
  - [ ] 测试通过

- [ ] **发布准备**
  - [ ] OpenVSX 账户已注册
  - [ ] Access Token 已创建
  - [ ] Namespace 已注册

## 🚀 发布步骤

### 步骤 1: 注册 OpenVSX 账户

1. 访问 https://open-vsx.org/
2. 点击右上角 "Sign In"
3. 使用 GitHub 账号登录
4. 完成账户设置

### 步骤 2: 创建 Access Token

1. 登录后，点击右上角头像，选择 "Settings"
2. 找到 "Access Tokens" 部分
3. 点击 "Create Access Token"
4. 输入 token 名称（例如：ai-command-sync-publish）
5. 保存生成的 token（**请妥善保管，只显示一次！**）

### 步骤 3: 安装发布工具

```bash
# 安装 ovsx CLI 工具
npm install -g ovsx

# 验证安装
ovsx --version
```

### 步骤 4: 创建 Namespace

```bash
# 创建 publisher namespace（替换 YOUR_TOKEN 为你的 access token）
ovsx create-namespace Genyuan -p YOUR_TOKEN
```

**注意**: 如果 namespace 已被占用，你需要：
- 更改 `package.json` 中的 `publisher` 名称
- 或者联系 OpenVSX 管理员验证所有权

### 步骤 5: 提交代码更改

```bash
# 确保所有更改都已提交
git add .
git commit -m "chore: prepare for v1.0.0 release"
git push origin main
```

### 步骤 6: 编译和测试

```bash
# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 运行测试（可选）
npm test

# 检查编译输出
ls -la out/
```

### 步骤 7: 打包扩展

```bash
# 打包成 VSIX 文件
npm run package

# 会生成: ai-command-sync-1.0.0.vsix
```

### 步骤 8: 发布到 OpenVSX

```bash
# 方式 1: 发布 VSIX 文件（推荐）
ovsx publish ai-command-sync-1.0.0.vsix -p YOUR_TOKEN

# 方式 2: 直接发布（自动打包）
ovsx publish -p YOUR_TOKEN
```

### 步骤 9: 验证发布

1. 访问 https://open-vsx.org/extension/Genyuan/ai-command-sync
2. 确认扩展信息显示正确
3. 检查 README、图标、版本号等

### 步骤 10: 在 Cursor 中测试

1. 打开 Cursor IDE
2. 打开扩展市场（Ctrl/Cmd + Shift + X）
3. 搜索 "AI Command Sync"
4. 安装并测试功能

**注意**: 扩展可能需要几小时到一天的时间才会出现在 Cursor 市场中。

## 🔄 更新已发布的扩展

### 1. 更新版本号

在 `package.json` 中更新版本号：

```json
{
  "version": "1.0.1"  // 或 1.1.0, 2.0.0
}
```

版本号规则：
- **补丁版本** (1.0.x): 修复 bug
- **次版本** (1.x.0): 新增功能（向下兼容）
- **主版本** (x.0.0): 重大变更（可能不兼容）

### 2. 更新 CHANGELOG.md

在 `CHANGELOG.md` 中添加新版本的变更说明。

### 3. 重新打包和发布

```bash
# 编译
npm run compile

# 打包
npm run package

# 发布
ovsx publish ai-command-sync-1.0.1.vsix -p YOUR_TOKEN

# 提交代码
git add .
git commit -m "chore: release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

## 🔧 常见问题

### Q1: 发布失败：Namespace not found

**解决方案**: 使用 `ovsx create-namespace` 创建 namespace。

### Q2: 发布失败：Extension already exists

**解决方案**: 确保更新了版本号，不能发布相同版本。

### Q3: 扩展在 Cursor 中搜索不到

**原因**: 扩展同步需要时间（几小时到一天）。

**解决方案**: 
1. 等待自动同步
2. 或者先手动安装 VSIX 文件测试

### Q4: Token 权限错误

**解决方案**: 
1. 确认 token 有效且未过期
2. 重新创建新的 access token
3. 确保 token 有 "publish" 权限

### Q5: 图标显示异常

**原因**: 
- 图标格式不正确（必须是 PNG）
- 图标尺寸过大或过小
- 图标路径错误

**解决方案**: 
- 使用 PNG 格式
- 推荐尺寸：128x128 或更大（最大 2048x2048）
- 确认 `package.json` 中的 `icon` 路径正确

### Q6: README 图片无法显示

**原因**: OpenVSX 只允许 HTTPS 图片链接。

**解决方案**: 
- 将图片上传到 GitHub 或其他 HTTPS 托管服务
- 使用绝对路径的 HTTPS URL
- 避免使用相对路径

## 📝 发布检查脚本

创建一个 `scripts/pre-publish-check.sh` 脚本来自动检查：

```bash
#!/bin/bash

echo "🔍 Running pre-publish checks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ package.json not found"
  exit 1
fi

# Check if README.md exists
if [ ! -f "README.md" ]; then
  echo "❌ README.md not found"
  exit 1
fi

# Check if icon exists
if [ ! -f "icon.png" ]; then
  echo "❌ icon.png not found"
  exit 1
fi

# Check if compiled
if [ ! -d "out" ]; then
  echo "❌ Extension not compiled. Run: npm run compile"
  exit 1
fi

# Check git status
if [[ -n $(git status -s) ]]; then
  echo "⚠️  Warning: Uncommitted changes detected"
  git status -s
fi

echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. npm run compile"
echo "2. npm run package"
echo "3. ovsx publish ai-command-sync-<version>.vsix -p YOUR_TOKEN"
```

## 🎉 发布成功后

1. **创建 GitHub Release**
   - 在 GitHub 上创建 Release
   - 附加 VSIX 文件
   - 添加 CHANGELOG

2. **宣传推广**
   - 在掘金发布文章
   - 在社交媒体分享
   - 在 Cursor 社区论坛发布

3. **收集反馈**
   - 监控 GitHub Issues
   - 回复用户问题
   - 记录改进建议

## 📚 参考资料

- [OpenVSX 官方文档](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
- [VSCode 扩展发布指南](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [Cursor 社区论坛](https://forum.cursor.com/)

## 💡 小贴士

1. **使用环境变量存储 Token**
   ```bash
   export OVSX_TOKEN="your-token-here"
   ovsx publish -p $OVSX_TOKEN
   ```

2. **自动化发布脚本**
   在 `package.json` 中添加：
   ```json
   {
     "scripts": {
       "publish:ovsx": "ovsx publish -p $OVSX_TOKEN"
     }
   }
   ```

3. **版本号自动递增**
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

---

**祝发布顺利！** 🚀
