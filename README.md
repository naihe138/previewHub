# PreviewHub - GitHub图片预览插件

🖼️ **PreviewHub** 是一个Chrome浏览器插件，让您在GitHub页面上直接预览README.md中的图片，无需跳转到单独的图片页面。

## ✨ 功能特性

- 🔍 **智能检测**: 自动识别README.md中的所有图片
- 🖱️ **一键预览**: 点击图片或预览按钮即可打开弹窗
- 🔍 **图片缩放**: 支持1-10倍缩放，滚轮缩放，按钮控制
- 🖐️ **拖拽移动**: 放大后可拖拽移动图片，智能边界限制
- 📥 **图片下载**: 一键下载当前预览的图片到本地（支持多种下载方式）
- 📱 **响应式设计**: 支持桌面和移动设备
- ⌨️ **键盘导航**: 支持方向键和ESC键操作
- 🌙 **深色模式**: 自动适配GitHub的深色主题
- 💻 **多平台支持**: 兼容GitHub.com和GitHub.dev编辑器

## 🚀 安装方法

### 方法一：Chrome Web Store（推荐）
1. 访问 [Chrome Web Store](#)
2. 点击"添加到Chrome"
3. 确认安装

### 方法二：开发者模式安装
1. 下载或克隆此仓库
2. 打开Chrome浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 📖 使用说明

1. **访问GitHub项目**: 打开任何GitHub项目页面
2. **查看README**: 确保页面包含README.md文件
3. **预览图片**: 
   - 点击README中的任意图片
   - 或点击"预览图片"按钮
4. **导航浏览**: 
   - 鼠标悬停时显示左右箭头按钮
   - 使用键盘方向键切换图片
   - 点击下载按钮保存图片到本地
   - 点击关闭按钮或按ESC键关闭预览

## ⌨️ 快捷键

- `←` / `→` : 上一张/下一张图片
- `+` / `-` : 放大/缩小图片
- `0` : 重置缩放
- `Esc` : 关闭预览窗口
- **鼠标滚轮** : 缩放图片
- **双击图片** : 重置缩放
- **拖拽** : 移动放大的图片

## 🛠️ 技术栈

- **Manifest V3**: 使用最新的Chrome扩展API
- **Vanilla JavaScript**: 无框架依赖，轻量高效
- **CSS3**: 现代化的响应式设计
- **GitHub API**: 智能解析图片URL

## 📂 项目结构

```
previewHub/
├── manifest.json          # 插件配置文件
├── content.js            # 内容脚本
├── styles.css           # 样式文件
├── popup.html           # 弹窗页面
├── popup.js             # 弹窗脚本
├── icons/               # 图标文件
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # 说明文档
```

## 🎨 界面预览

### 主要功能
- ✅ 自动检测README中的图片
- ✅ 美观的预览弹窗
- ✅ 流畅的图片导航
- ✅ 响应式设计

### 支持的图片格式
- PNG, JPG, JPEG
- GIF, SVG, WebP
- 相对路径和绝对路径
- GitHub raw链接

## 🔧 开发

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/naice/previewHub.git

# 进入目录
cd previewHub

# 在Chrome中加载插件
# 1. 打开 chrome://extensions/
# 2. 开启开发者模式
# 3. 点击"加载已解压的扩展程序"
# 4. 选择项目文件夹
```

### 生成图标
```bash
# 进入图标目录
cd icons

# 打开图标生成器
open create_base64_icons.html
```

## 🔧 故障排除

### 下载功能问题
如果图片下载失败，插件会自动尝试以下方法：
1. **Canvas转换下载**: 适用于大部分图片
2. **Fetch请求下载**: 绕过某些CORS限制
3. **Chrome下载API**: 使用浏览器内置下载功能
4. **直接链接下载**: 备用方案

如果所有方法都失败，请：
- 右键点击图片选择"图片另存为"
- 或直接访问图片原始URL进行下载

### 常见问题
- **图片无法预览**: 确保在GitHub项目页面，且README包含图片
- **按钮不显示**: 检查是否有README.md文件和图片内容
- **缩放不工作**: 尝试刷新页面重新加载插件

## 🤝 贡献

欢迎提交Issue和Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📝 更新日志

### v1.0.0 (2024-12-XX)
- 🎉 首次发布
- ✨ 基础图片预览功能
- ✨ 支持GitHub.com和GitHub.dev
- ✨ 响应式设计和深色模式
- ✨ 键盘导航支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢GitHub提供优秀的开发平台
- 感谢所有贡献者和用户的支持

---

如果这个插件对您有帮助，请给个⭐️支持一下！
