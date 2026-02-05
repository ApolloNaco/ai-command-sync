#!/bin/bash

# AI Command Sync 发布脚本
# 用于自动化发布流程

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查必需的工具
check_requirements() {
    print_info "检查必需工具..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi
    print_success "npm: $(npm --version)"
    
    # 检查 git
    if ! command -v git &> /dev/null; then
        print_error "Git 未安装"
        exit 1
    fi
    print_success "Git: $(git --version)"
    
    # 检查 ovsx
    if ! command -v ovsx &> /dev/null; then
        print_warning "ovsx CLI 未安装"
        read -p "是否现在安装 ovsx? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g ovsx
            print_success "ovsx 安装完成"
        else
            print_error "需要 ovsx CLI 工具才能发布"
            exit 1
        fi
    fi
    print_success "ovsx: $(ovsx --version)"
    
    echo ""
}

# 检查文件
check_files() {
    print_info "检查必需文件..."
    
    required_files=("package.json" "README.md" "LICENSE" "CHANGELOG.md" "icon.png" ".vscodeignore")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "缺少文件: $file"
            exit 1
        fi
        print_success "✓ $file"
    done
    
    echo ""
}

# 检查 Git 状态
check_git_status() {
    print_info "检查 Git 状态..."
    
    if [[ -n $(git status -s) ]]; then
        print_warning "存在未提交的更改:"
        git status -s
        echo ""
        read -p "是否继续发布? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "发布已取消"
            exit 0
        fi
    else
        print_success "工作目录干净"
    fi
    
    echo ""
}

# 获取版本号
get_version() {
    version=$(node -p "require('./package.json').version")
    echo "$version"
}

# 编译项目
compile_project() {
    print_info "编译项目..."
    
    if ! npm run compile; then
        print_error "编译失败"
        exit 1
    fi
    
    print_success "编译完成"
    echo ""
}

# 打包扩展
package_extension() {
    print_info "打包扩展..."
    
    if ! npm run package; then
        print_error "打包失败"
        exit 1
    fi
    
    version=$(get_version)
    vsix_file="ai-command-sync-${version}.vsix"
    
    if [ ! -f "$vsix_file" ]; then
        print_error "VSIX 文件不存在: $vsix_file"
        exit 1
    fi
    
    print_success "打包完成: $vsix_file"
    echo ""
}

# 发布到 OpenVSX
publish_to_openvsx() {
    print_info "准备发布到 OpenVSX..."
    
    version=$(get_version)
    vsix_file="ai-command-sync-${version}.vsix"
    
    # 检查环境变量中的 token
    if [ -z "$OVSX_TOKEN" ]; then
        print_warning "未设置 OVSX_TOKEN 环境变量"
        read -p "请输入 OpenVSX Access Token: " -s token
        echo
        export OVSX_TOKEN="$token"
    fi
    
    if [ -z "$OVSX_TOKEN" ]; then
        print_error "未提供 Access Token"
        exit 1
    fi
    
    print_info "开始发布..."
    
    if ovsx publish "$vsix_file" -p "$OVSX_TOKEN"; then
        print_success "发布成功！🎉"
        print_info "扩展将在几小时内出现在 OpenVSX 和 Cursor 市场"
        print_info "查看扩展: https://open-vsx.org/extension/Genyuan/ai-command-sync"
    else
        print_error "发布失败"
        exit 1
    fi
    
    echo ""
}

# 创建 Git 标签
create_git_tag() {
    version=$(get_version)
    tag="v${version}"
    
    print_info "创建 Git 标签: $tag"
    
    if git rev-parse "$tag" >/dev/null 2>&1; then
        print_warning "标签 $tag 已存在"
        read -p "是否删除并重新创建? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git tag -d "$tag"
            git tag "$tag"
            print_success "标签已重新创建"
        fi
    else
        git tag "$tag"
        print_success "标签创建成功: $tag"
    fi
    
    read -p "是否推送标签到远程? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin "$tag"
        print_success "标签已推送到远程"
    fi
    
    echo ""
}

# 显示发布总结
show_summary() {
    version=$(get_version)
    
    echo ""
    print_success "==============================================="
    print_success "   AI Command Sync v${version} 发布完成！🚀"
    print_success "==============================================="
    echo ""
    
    print_info "下一步建议:"
    echo "  1. 在 GitHub 上创建 Release"
    echo "  2. 附加 VSIX 文件到 Release"
    echo "  3. 在掘金等平台宣传推广"
    echo "  4. 监控用户反馈和 Issues"
    echo ""
    
    print_info "链接:"
    echo "  • OpenVSX: https://open-vsx.org/extension/Genyuan/ai-command-sync"
    echo "  • GitHub: https://github.com/ApolloNaco/ai-command-sync"
    echo ""
}

# 主流程
main() {
    echo ""
    print_info "=========================================="
    print_info "   AI Command Sync 发布脚本"
    print_info "=========================================="
    echo ""
    
    # 显示当前版本
    version=$(get_version)
    print_info "当前版本: v${version}"
    echo ""
    
    # 运行检查
    check_requirements
    check_files
    check_git_status
    
    # 编译和打包
    compile_project
    package_extension
    
    # 询问是否发布
    read -p "是否立即发布到 OpenVSX? (y/n) " -n 1 -r
    echo ""
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        publish_to_openvsx
        
        # 询问是否创建标签
        read -p "是否创建 Git 标签? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            create_git_tag
        fi
        
        show_summary
    else
        print_info "已跳过发布步骤"
        print_info "手动发布命令:"
        echo "  ovsx publish ai-command-sync-${version}.vsix -p \$OVSX_TOKEN"
        echo ""
    fi
}

# 运行主流程
main
