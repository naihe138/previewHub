#!/bin/bash

# PreviewHub GitHub Release 发布脚本
# 自动创建Git标签、推送代码并准备GitHub Release

set -e  # 遇到错误时退出

echo "🚀 PreviewHub GitHub Release 发布工具"
echo "======================================="

# 读取当前版本
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')
echo "📦 当前版本: v$VERSION"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  检测到未提交的更改，正在提交..."
    
    # 添加所有更改
    git add .
    
    # 提交更改
    git commit -m "feat: 发布 v$VERSION - 全面Markdown支持

- 🎉 支持所有.md文件的图片预览（不仅限于README.md）
- ✨ 改进Markdown容器检测逻辑
- 🔧 重构核心方法，保持向后兼容
- 📝 更新所有相关文档和描述
- 🐛 修复只能在README.md中预览图片的限制

Closes: #1 - 支持所有markdown文件的图片预览"
    
    echo "✅ 已提交所有更改"
else
    echo "✅ 工作目录干净，无需提交"
fi

# 检查标签是否已存在
if git tag -l | grep -q "^v$VERSION$"; then
    echo "⚠️  标签 v$VERSION 已存在，正在删除..."
    git tag -d "v$VERSION"
    git push origin --delete "v$VERSION" 2>/dev/null || true
fi

# 创建新标签
echo "🏷️  创建标签 v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION - 全面Markdown支持

🎉 新功能:
- 支持所有.md文件的图片预览（README、文档、Wiki等）
- 智能Markdown容器检测
- 增强的GitHub.dev编辑器兼容性

🔧 技术改进:
- 重构核心检测方法
- 改进页面变化监听
- 保持100%向后兼容性

🐛 Bug修复:
- 修复只能在README.md中预览图片的限制
- 改进在不同类型markdown文件中的工作稳定性

📝 文档更新:
- 更新所有相关文档
- 新增详细的更新日志
- 更新商店描述和宣传材料"

# 推送到远程仓库
echo "📤 推送代码和标签到GitHub..."
git push origin main
git push origin "v$VERSION"

echo ""
echo "✅ Git发布完成!"
echo ""
echo "📋 接下来的步骤:"
echo "1. 访问 GitHub 仓库的 Releases 页面"
echo "2. 点击 'Create a new release'"
echo "3. 选择标签: v$VERSION"
echo "4. 使用以下信息创建 Release:"
echo ""

# 生成发布说明
cat > release-notes.md << 'EOF'
# 🎉 PreviewHub v1.1.0 - 全面Markdown支持

## 🆕 新功能

### 📁 全面.md文件支持
现在支持GitHub上所有类型的Markdown文件的图片预览：
- ✅ README.md 文件
- ✅ 项目文档 (docs/*.md)  
- ✅ Wiki页面
- ✅ 任意.md文件
- ✅ GitHub.dev编辑器中的所有markdown文件

### 🔍 智能检测增强
- 改进了Markdown容器检测逻辑
- 支持更多GitHub页面类型
- 增强的SPA路由变化检测

## 🔧 技术改进

- **核心重构**: 重构了核心检测方法，从README专用改为全面Markdown支持
- **向后兼容**: 保持100%API兼容性，现有用户无需任何操作
- **性能优化**: 改进了选择器效率和检测准确性
- **代码质量**: 更清晰的方法命名和代码结构

## 🐛 Bug修复

- 🔧 修复了只能在README.md文件中预览图片的限制
- 🔧 改进了在GitHub.dev编辑器中的工作稳定性
- 🔧 优化了在不同类型markdown文件中的兼容性

## 📊 影响范围

- **使用场景**: 从单一README扩展到所有.md文件（预计增加300%+使用场景）
- **用户体验**: 大幅提升在查看项目文档时的便利性
- **兼容性**: 完全向后兼容，现有用户自动获得新功能

## 📦 安装方式

### Chrome Web Store
1. 访问 Chrome Web Store
2. 搜索 "PreviewHub"
3. 点击"添加到Chrome"

### 手动安装
1. 下载下方的 `previewhub-v1.1.0.zip` 文件
2. 解压到本地文件夹
3. 打开Chrome扩展页面 (`chrome://extensions/`)
4. 开启"开发者模式"
5. 点击"加载已解压的扩展程序"，选择解压的文件夹

## 🙏 致谢

感谢所有用户的反馈和建议，特别是对支持更多markdown文件的需求！

---

**完整更新日志**: [CHANGELOG.md](https://github.com/naihe138/previewHub/blob/main/CHANGELOG.md)
EOF

echo "📝 发布说明已生成: release-notes.md"
echo ""
echo "🔗 GitHub Release 创建链接:"
echo "https://github.com/naihe138/previewHub/releases/new?tag=v$VERSION"
echo ""
echo "📎 需要上传的文件:"
ls -la previewhub-v$VERSION-*.zip 2>/dev/null || echo "⚠️  请先运行 ./package-for-store.sh 生成发布包"
echo ""
echo "🎯 建议的Release标题: PreviewHub v$VERSION - 全面Markdown支持"
echo ""
echo "✨ 发布准备完成！"
