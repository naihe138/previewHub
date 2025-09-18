# PreviewHub 安装指南

## 📦 安装方法

### 方法一：开发者模式安装（推荐用于测试）

1. **下载源代码**
   ```bash
   git clone https://github.com/naice/previewHub.git
   cd previewHub
   ```

2. **生成图标文件**
   - 打开 `icons/create_base64_icons.html` 文件
   - 点击"下载图标"按钮，将生成的图标保存到 `icons/` 文件夹
   - 确保有以下文件：
     - `icons/icon16.png`
     - `icons/icon48.png`
     - `icons/icon128.png`

3. **加载到Chrome浏览器**
   - 打开Chrome浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `previewHub` 项目文件夹

4. **验证安装**
   - 访问任意GitHub项目页面（如：https://github.com/microsoft/vscode）
   - 查看README.md中是否有图片
   - 点击图片或"预览图片"按钮测试功能

### 方法二：Chrome Web Store（即将推出）

1. 访问 Chrome Web Store 搜索 "PreviewHub"
2. 点击"添加到Chrome"
3. 确认安装

## 🔧 开发环境设置

### 前置要求
- Chrome浏览器 88+ 版本
- 基本的HTML/CSS/JavaScript知识（如需修改）

### 文件结构说明
```
previewHub/
├── manifest.json          # 插件配置文件
├── content.js            # 内容脚本（主要功能）
├── styles.css           # 样式文件
├── popup.html           # 插件弹窗页面
├── popup.js             # 弹窗逻辑
├── icons/               # 图标文件夹
│   ├── icon16.png       # 16x16 图标
│   ├── icon48.png       # 48x48 图标
│   ├── icon128.png      # 128x128 图标
│   └── create_base64_icons.html  # 图标生成工具
├── README.md            # 说明文档
├── LICENSE              # 许可证
└── INSTALL.md           # 本安装指南
```

### 本地开发
1. 修改代码后，在 `chrome://extensions/` 页面点击插件的刷新按钮
2. 重新加载GitHub页面测试功能
3. 使用浏览器开发者工具调试

## ⚠️ 常见问题

### Q: 插件无法加载？
A: 确保：
- Chrome版本足够新（88+）
- 已开启开发者模式
- 选择了正确的项目文件夹
- 所有必需文件都存在

### Q: 图片预览不工作？
A: 检查：
- 是否在GitHub.com或GitHub.dev页面
- README.md中是否包含图片
- 浏览器控制台是否有错误信息

### Q: 图标显示不正常？
A: 
- 使用 `icons/create_base64_icons.html` 重新生成图标
- 确保图标文件格式为PNG
- 检查图标文件大小是否正确

### Q: 在GitHub.dev中不工作？
A: 
- 确保使用的是 `.github.dev` 域名
- 检查是否有README.md文件
- 尝试刷新页面

## 🛠️ 高级配置

### 自定义样式
可以修改 `styles.css` 文件来自定义预览窗口的外观。

### 添加新功能
主要逻辑在 `content.js` 中，可以：
- 添加新的图片格式支持
- 修改图片检测逻辑
- 增加新的快捷键

### 调试技巧
1. 使用 `console.log()` 在内容脚本中输出调试信息
2. 在 `chrome://extensions/` 中查看插件错误
3. 使用Chrome开发者工具的Network面板检查图片加载

## 📞 获取帮助

- 🐛 报告Bug：[GitHub Issues](https://github.com/naice/previewHub/issues)
- 💡 功能建议：[GitHub Discussions](https://github.com/naice/previewHub/discussions)
- 📧 联系作者：通过GitHub

## 🔄 更新

要更新插件：
1. 获取最新代码：`git pull origin main`
2. 在 `chrome://extensions/` 中点击插件的刷新按钮
3. 重新加载使用插件的页面
