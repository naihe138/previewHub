# 📦 PreviewHub 打包说明

## 🎯 打包方式选择

我为你提供了两种打包方式：

### 1️⃣ **简单打包** (推荐)
```bash
./package-for-store.sh
```
- ✅ 自动排除开发文件
- ✅ 只包含必需的运行文件
- ✅ 文件大小验证
- ✅ 压缩包完整性检查

### 2️⃣ **智能打包** (高级)
```bash
./package-smart.sh
```
- ✅ 支持 `.packageignore` 文件
- ✅ 更灵活的文件过滤
- ✅ 详细的统计信息
- ✅ 安全检查

## 📋 打包结果对比

### 原始项目大小
- **总大小**: ~648KB
- **文件数**: 20+ 个文件

### 打包后大小
- **压缩包大小**: ~28KB (压缩率 95%+)
- **包含文件**: 仅 9 个必需文件
- **符合商店要求**: ✅ < 10MB 限制

## 📁 包含的文件

✅ **运行必需文件**:
```
├── manifest.json       # 插件配置
├── content.js          # 主功能脚本  
├── styles.css          # 样式文件
├── popup.html          # 弹窗页面
├── popup.js            # 弹窗脚本
└── icons/              # 图标文件夹
    ├── icon16.png      # 16x16 图标
    ├── icon48.png      # 48x48 图标
    └── icon128.png     # 128x128 图标
```

## 🚫 排除的文件

❌ **开发和文档文件**:
- `README.md` - 项目说明
- `PROJECT_SUMMARY.md` - 项目总结
- `STORE_UPLOAD_GUIDE.md` - 上传指南
- `STORE_CHECKLIST.md` - 检查清单
- `INSTALL.md` - 安装说明
- `TEST.md` - 测试文档
- `LICENSE` - 许可证文件
- `package.json` - 项目配置
- `.gitignore` - Git忽略文件
- `.packageignore` - 打包忽略文件

❌ **构建和开发工具**:
- `package-for-store.sh` - 打包脚本
- `package-smart.sh` - 智能打包脚本
- `create_icons.html` - 图标创建工具
- `icons/create_*.html` - 图标生成工具
- `icons/create_*.py` - Python图标脚本
- `icons/generate_*.js` - JS图标脚本
- `icons/icon.svg` - SVG源文件

❌ **系统和临时文件**:
- `.git/` - Git版本控制
- `.DS_Store` - macOS系统文件
- `*.zip` - 之前的打包文件

## 🔧 自定义排除规则

如果你想排除更多文件，可以编辑 `.packageignore` 文件：

```bash
# 添加新的排除规则
echo "your-file.txt" >> .packageignore
echo "temp-folder/" >> .packageignore
```

## ✅ 打包验证

每次打包都会自动进行以下检查：

1. **文件完整性** - 确保所有必需文件存在
2. **压缩包验证** - 检查ZIP文件完整性
3. **大小限制** - 验证是否超过10MB限制
4. **安全检查** - 检测敏感文件

## 🚀 快速上传

打包完成后，你会得到类似这样的文件：
```
previewhub-v1.0.0-20250918-114205.zip
```

直接上传到：
- **Chrome Web Store**: https://chrome.google.com/webstore/devconsole/
- **Edge Add-ons**: https://partner.microsoft.com/dashboard/microsoftedge

## 💡 小贴士

1. **每次打包都会生成新的时间戳文件名**，避免覆盖
2. **压缩包会自动清理临时文件**，保持目录整洁
3. **如果发现问题，脚本会给出明确的错误提示**
4. **建议在上传前再次测试打包后的插件功能**

---

**祝你上架成功！** 🎉
