# 📋 GitHub Release 发布指南

## 🎯 发布状态

✅ **Git标签已创建**: v1.1.0  
✅ **代码已推送**: GitHub仓库已更新  
✅ **发布包已准备**: previewhub-v1.1.0-20250918-151201.zip  
✅ **发布说明已生成**: release-notes.md  

## 🚀 创建GitHub Release

### 方法一：网页界面操作（推荐）

1. **访问Release页面**
   ```
   https://github.com/naihe138/previewHub/releases/new?tag=v1.1.0
   ```

2. **填写Release信息**
   - **标签**: `v1.1.0` (已自动选择)
   - **标题**: `PreviewHub v1.1.0 - 全面Markdown支持`
   - **描述**: 复制下方的发布说明内容

3. **上传文件**
   - 拖拽或点击上传: `previewhub-v1.1.0-20250918-151201.zip`

4. **发布设置**
   - ✅ 勾选 "Set as the latest release"
   - ✅ 勾选 "Create a discussion for this release" (可选)

5. **点击 "Publish release"**

### 方法二：GitHub CLI（需要安装）

如果你想使用命令行，可以安装GitHub CLI：

```bash
# macOS
brew install gh

# 登录GitHub
gh auth login

# 自动创建Release
./create-github-release.sh
```

## 📝 发布说明内容

请复制以下内容到GitHub Release的描述框中：

```markdown
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
```

## 📎 需要上传的文件

- **文件名**: `previewhub-v1.1.0-20250918-151201.zip`
- **大小**: 28KB
- **内容**: 完整的v1.1.0插件包，包含所有新功能

## ✅ 发布后的验证

发布完成后，请验证：

1. **Release页面**: https://github.com/naihe138/previewHub/releases/tag/v1.1.0
2. **下载链接**: 确保ZIP文件可以正常下载
3. **版本标签**: 确保显示为"Latest"
4. **发布说明**: 确保格式正确，链接有效

## 🎯 后续步骤

1. **更新Chrome Web Store**: 上传新版本到商店
2. **更新Edge Add-ons**: 同步更新Edge商店
3. **社交媒体宣传**: 在相关社区分享新功能
4. **用户通知**: 通过适当渠道通知现有用户

---

**准备就绪，立即发布！** 🚀
