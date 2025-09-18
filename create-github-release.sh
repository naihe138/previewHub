#!/bin/bash

# 使用GitHub CLI自动创建Release
# 需要先安装GitHub CLI: https://cli.github.com/

set -e

VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
ZIP_FILE=$(ls previewhub-v$VERSION-*.zip | head -1)

echo "🚀 使用GitHub CLI创建Release"
echo "版本: v$VERSION"
echo "文件: $ZIP_FILE"

# 检查是否安装了GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI未安装"
    echo "请访问 https://cli.github.com/ 安装GitHub CLI"
    echo "或者手动访问: https://github.com/naihe138/previewHub/releases/new?tag=v$VERSION"
    exit 1
fi

# 检查是否已登录GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI未登录"
    echo "请先运行: gh auth login"
    exit 1
fi

# 创建Release
echo "📝 创建GitHub Release..."
gh release create "v$VERSION" \
    --title "PreviewHub v$VERSION - 全面Markdown支持" \
    --notes-file release-notes.md \
    --latest \
    "$ZIP_FILE"

echo "✅ GitHub Release创建成功!"
echo "🔗 访问链接: https://github.com/naihe138/previewHub/releases/tag/v$VERSION"
