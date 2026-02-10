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
