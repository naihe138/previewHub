#!/bin/bash

# PreviewHub 智能打包脚本
# 支持 .packageignore 文件，自动排除不需要的文件

echo "🚀 PreviewHub 智能打包工具"
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

# 读取 .packageignore 文件
IGNORE_PATTERNS=()
if [ -f ".packageignore" ]; then
    echo "📋 读取 .packageignore 文件..."
    while IFS= read -r line || [ -n "$line" ]; do
        # 跳过空行和注释行
        if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
            IGNORE_PATTERNS+=("$line")
        fi
    done < .packageignore
    echo "   找到 ${#IGNORE_PATTERNS[@]} 个排除规则"
fi

# 函数：检查文件是否应该被忽略
should_ignore() {
    local file="$1"
    for pattern in "${IGNORE_PATTERNS[@]}"; do
        if [[ "$file" == $pattern ]] || [[ "$file" =~ $pattern ]]; then
            return 0  # 应该忽略
        fi
    done
    return 1  # 不应该忽略
}

# 智能复制文件
echo "📋 智能复制文件（排除不需要的文件）..."
copied_files=()
ignored_files=()

# 复制必需的核心文件
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        # 创建目标目录
        target_dir="$RELEASE_DIR/$(dirname "$file")"
        mkdir -p "$target_dir"
        
        # 复制文件
        cp "$file" "$RELEASE_DIR/$file"
        copied_files+=("$file")
        echo "   ✅ $file"
    fi
done

# 检查其他可能需要的文件
other_files=(
    "*.json"
    "*.js"
    "*.css"
    "*.html"
)

for pattern in "${other_files[@]}"; do
    for file in $pattern; do
        if [ -f "$file" ] && ! should_ignore "$file"; then
            # 检查是否已经复制过
            if [[ ! " ${copied_files[@]} " =~ " ${file} " ]]; then
                cp "$file" "$RELEASE_DIR/"
                copied_files+=("$file")
                echo "   ✅ $file"
            fi
        elif [ -f "$file" ]; then
            ignored_files+=("$file")
        fi
    done
done

# 显示排除的文件
if [ ${#ignored_files[@]} -gt 0 ]; then
    echo ""
    echo "🚫 排除的文件:"
    for file in "${ignored_files[@]}"; do
        echo "   - $file"
    done
fi

# 显示统计信息
echo ""
echo "📊 打包统计:"
echo "   ✅ 包含文件: ${#copied_files[@]} 个"
echo "   🚫 排除文件: ${#ignored_files[@]} 个"

# 创建ZIP压缩包
echo ""
echo "📦 创建ZIP压缩包..."
cd "$RELEASE_DIR"
zip -r "../$ZIP_NAME" . -q
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

# 安全检查
echo ""
echo "🔒 安全检查..."
if unzip -l "$ZIP_NAME" | grep -q "\.git/\|\.env\|\.key\|password\|secret"; then
    echo "⚠️  警告: 发现可能的敏感文件，请检查压缩包内容"
else
    echo "✅ 未发现明显的敏感文件"
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
