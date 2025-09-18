#!/bin/bash

# PreviewHub 插件商店打包脚本
# 用于创建Chrome Web Store和Edge Add-ons的发布包

echo "🚀 PreviewHub 插件打包工具"
echo "================================"

# 创建发布目录
RELEASE_DIR="previewhub-release"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_NAME="previewhub-v1.0.0-${TIMESTAMP}.zip"

# 清理旧的发布文件
if [ -d "$RELEASE_DIR" ]; then
    echo "🧹 清理旧的发布文件..."
    rm -rf "$RELEASE_DIR"
fi

# 创建发布目录
echo "📁 创建发布目录..."
mkdir -p "$RELEASE_DIR"

# 检查必需文件是否存在
echo "✅ 检查必需文件..."
required_files=(
    "manifest.json"
    "content.js"
    "styles.css"
    "popup.html"
    "popup.js"
    "icons/icon16.png"
    "icons/icon48.png"
    "icons/icon128.png"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ 缺少必需文件:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ 所有必需文件都存在"

# 复制必需文件到发布目录
echo "📋 复制文件到发布目录..."
cp manifest.json "$RELEASE_DIR/"
cp content.js "$RELEASE_DIR/"
cp styles.css "$RELEASE_DIR/"
cp popup.html "$RELEASE_DIR/"
cp popup.js "$RELEASE_DIR/"

# 创建icons目录并只复制必需的图标文件
echo "🖼️  复制图标文件..."
mkdir -p "$RELEASE_DIR/icons"
cp icons/icon16.png "$RELEASE_DIR/icons/"
cp icons/icon48.png "$RELEASE_DIR/icons/"
cp icons/icon128.png "$RELEASE_DIR/icons/"

# 排除的文件列表
echo "🚫 排除的开发文件:"
excluded_files=(
    "README.md"
    "PROJECT_SUMMARY.md" 
    "STORE_UPLOAD_GUIDE.md"
    "STORE_CHECKLIST.md"
    "INSTALL.md"
    "TEST.md"
    "LICENSE"
    "package.json"
    ".gitignore"
    ".git/"
    ".DS_Store"
    "package-for-store.sh"
    "create_icons.html"
    "icons/create_*.html"
    "icons/create_*.py"
    "icons/generate_*.js"
    "icons/icon.svg"
    "*.zip"
)

for file in "${excluded_files[@]}"; do
    echo "   - $file"
done

# 创建ZIP压缩包
echo ""
echo "📦 创建ZIP压缩包..."
cd "$RELEASE_DIR"
zip -r "../$ZIP_NAME" .
cd ..

# 计算文件大小
ORIGINAL_SIZE=$(du -sh . | cut -f1)
PACKAGE_SIZE=$(du -h "$ZIP_NAME" | cut -f1)
FILE_COUNT=$(unzip -l "$ZIP_NAME" | tail -1 | awk '{print $2}')

# 显示打包结果
echo ""
echo "🎉 打包完成!"
echo "📦 压缩包: $ZIP_NAME"
echo "📊 原始目录大小: $ORIGINAL_SIZE"
echo "📦 压缩包大小: $PACKAGE_SIZE"
echo "📁 包含文件数: $FILE_COUNT 个文件"
echo ""

# 显示压缩包内容
echo "📋 压缩包内容:"
unzip -l "$ZIP_NAME"

# 验证压缩包
echo ""
echo "✅ 验证压缩包内容..."
if unzip -t "$ZIP_NAME" >/dev/null 2>&1; then
    echo "✅ 压缩包完整性检查通过"
else
    echo "❌ 压缩包损坏，请重新打包"
    exit 1
fi

# 检查压缩包大小限制
PACKAGE_SIZE_BYTES=$(stat -f%z "$ZIP_NAME" 2>/dev/null || stat -c%s "$ZIP_NAME" 2>/dev/null)
MAX_SIZE_BYTES=10485760  # 10MB

if [ "$PACKAGE_SIZE_BYTES" -gt "$MAX_SIZE_BYTES" ]; then
    echo "⚠️  警告: 压缩包大小超过10MB限制 ($(($PACKAGE_SIZE_BYTES / 1024 / 1024))MB)"
    echo "   建议优化文件大小或移除不必要的文件"
else
    echo "✅ 压缩包大小符合商店要求 (< 10MB)"
fi

echo ""
echo "🌐 上传指南:"
echo "Chrome Web Store: https://chrome.google.com/webstore/devconsole/"
echo "Edge Add-ons: https://partner.microsoft.com/en-us/dashboard/microsoftedge"
echo ""
echo "📖 详细上传步骤请查看: STORE_UPLOAD_GUIDE.md"

# 清理临时目录
rm -rf "$RELEASE_DIR"

echo "✨ 准备完成，祝您上架成功!"
