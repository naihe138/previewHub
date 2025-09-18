// PreviewHub - GitHub图片预览插件
class PreviewHub {
  constructor() {
    this.modal = null;
    this.images = [];
    this.currentIndex = 0;
    this.isGitHubDev = window.location.hostname.includes('github.dev');
    
    // 图片缩放和拖拽相关属性
    this.scale = 1;
    this.minScale = 1;
    this.maxScale = 10;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    this.init();
  }

  init() {
    this.createPreviewButton();
    this.setupImageClickHandlers();
    this.createModal();
    this.createOpenIDEButton();
    
    // 监听页面变化（GitHub使用SPA路由）
    this.observePageChanges();
  }

  // 检测页面变化并重新初始化
  observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 检查是否有新的Markdown内容加载（包括README和其他.md文件）
          const hasMarkdownContent = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === 1 && 
            (node.querySelector?.('[data-testid="readme"]') || 
             node.classList?.contains('markdown-body') ||
             node.querySelector?.('.markdown-body') ||
             node.querySelector?.('.js-file-content .markdown-body') ||
             node.classList?.contains('markdown-content') ||
             node.classList?.contains('wiki-content'))
          );
          if (hasMarkdownContent) {
            shouldReinit = true;
          }
        }
      });
      
      if (shouldReinit) {
        setTimeout(() => {
          this.setupImageClickHandlers();
          this.createPreviewButton();
          this.createOpenIDEButton();
        }, 500);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 创建预览按钮
  createPreviewButton() {
    // 移除已存在的按钮
    const existingButton = document.querySelector('#previewhub-button');
    if (existingButton) {
      existingButton.remove();
    }

    const markdownContainer = this.getMarkdownContainer();
    if (!markdownContainer) return;

    const images = this.findMarkdownImages(markdownContainer);
    if (images.length === 0) return;

    const button = document.createElement('button');
    button.id = 'previewhub-button';
    button.className = 'previewhub-preview-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
        <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
      </svg>
      预览图片 (${images.length})
    `;
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      this.openPreview();
    });

    // 插入按钮到Markdown标题附近
    const markdownHeader = markdownContainer.querySelector('h1, h2, .markdown-heading');
    if (markdownHeader) {
      markdownHeader.parentNode.insertBefore(button, markdownHeader.nextSibling);
    } else {
      markdownContainer.insertBefore(button, markdownContainer.firstChild);
    }
  }

  // 获取Markdown容器（支持所有.md文件）
  getMarkdownContainer() {
    // GitHub主站 - README文件
    let container = document.querySelector('[data-testid="readme"]');
    if (container) return container;

    // GitHub主站 - 其他markdown文件
    container = document.querySelector('.markdown-body');
    if (container) return container;

    // GitHub.dev 编辑器 - markdown预览
    container = document.querySelector('.monaco-editor-background + .markdown-body, .markdown-preview-view .markdown-body');
    if (container) return container;

    // 文件查看页面的markdown内容
    container = document.querySelector('[data-target="react-app.embeddedData"] .markdown-body, .js-file-content .markdown-body');
    if (container) return container;

    // 备用选择器 - 包括README和其他markdown文件
    container = document.querySelector('#readme, .readme, [class*="readme"], .markdown-content, .wiki-content');
    return container;
  }

  // 为了保持向后兼容性，保留原方法名
  getReadmeContainer() {
    return this.getMarkdownContainer();
  }

  // 查找Markdown文件中的图片
  findMarkdownImages(container) {
    const images = [];
    const imgElements = container.querySelectorAll('img');
    
    imgElements.forEach((img, index) => {
      let src = img.src;
      
      // 处理相对路径
      if (src.startsWith('./') || src.startsWith('../') || !src.startsWith('http')) {
        src = this.resolveImageUrl(src, img);
      }
      
      if (src && this.isImageUrl(src)) {
        images.push({
          src: src,
          alt: img.alt || `图片 ${index + 1}`,
          title: img.title || img.alt || `图片 ${index + 1}`,
          element: img
        });
      }
    });
    
    return images;
  }

  // 向后兼容方法
  findReadmeImages(container) {
    return this.findMarkdownImages(container);
  }

  // 解析图片URL
  resolveImageUrl(src, _imgElement) {
    if (src.startsWith('http')) return src;
    
    const currentUrl = window.location.href;
    const pathMatch = currentUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    
    if (!pathMatch) return src;
    
    const [, owner, repo] = pathMatch;
    const branch = 'main'; // 可以优化为动态获取当前分支
    
    // 处理相对路径
    if (src.startsWith('./')) {
      src = src.substring(2);
    } else if (src.startsWith('../')) {
      // 简单处理，实际可能需要更复杂的路径解析
      src = src.substring(3);
    } else if (!src.startsWith('/')) {
      // 相对路径，无前缀
    } else {
      src = src.substring(1);
    }
    
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${src}`;
  }

  // 检查是否为图片URL
  isImageUrl(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(url);
  }

  // 设置图片点击处理
  setupImageClickHandlers() {
    const markdownContainer = this.getMarkdownContainer();
    if (!markdownContainer) return;

    const images = markdownContainer.querySelectorAll('img');
    images.forEach((img, index) => {
      // 移除已有的点击处理
      img.removeEventListener('click', this.handleImageClick);
      
      // 添加新的点击处理
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleImageClick(e, index);
      });
      
      // 添加悬停效果
      img.style.cursor = 'pointer';
      img.title = img.title || '点击预览';
    });
  }

  // 处理图片点击
  handleImageClick = (e, index) => {
    e.preventDefault();
    this.openPreview(index);
  }

  // 创建预览模态框
  createModal() {
    if (this.modal) return;

    this.modal = document.createElement('div');
    this.modal.id = 'previewhub-modal';
    this.modal.className = 'previewhub-modal';
    this.modal.innerHTML = `
      <div class="previewhub-modal-overlay">
        <div class="previewhub-modal-content">
          <div class="previewhub-modal-header">
            <h3 class="previewhub-modal-title">图片预览</h3>
            <div class="previewhub-modal-controls">
              <div class="previewhub-zoom-controls">
                <button class="previewhub-zoom-btn previewhub-zoom-out" title="缩小">-</button>
                <span class="previewhub-zoom-level">100%</span>
                <button class="previewhub-zoom-btn previewhub-zoom-in" title="放大">+</button>
                <button class="previewhub-zoom-btn previewhub-zoom-reset" title="重置">⌂</button>
              </div>
              <span class="previewhub-image-counter">1 / 1</span>
              <button class="previewhub-btn previewhub-download-btn" title="下载图片">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75z"></path>
                  <path d="M3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"></path>
                </svg>
              </button>
              <button class="previewhub-btn previewhub-close-btn" title="关闭">×</button>
            </div>
          </div>
          <div class="previewhub-modal-body">
            <button class="previewhub-nav-btn previewhub-prev-btn" title="上一张">‹</button>
            <div class="previewhub-image-container">
              <div class="previewhub-image-wrapper">
                <img class="previewhub-preview-image" src="" alt="">
              </div>
              <div class="previewhub-loading">加载中...</div>
            </div>
            <button class="previewhub-nav-btn previewhub-next-btn" title="下一张">›</button>
          </div>
          <div class="previewhub-modal-footer">
            <p class="previewhub-image-info"></p>
            <p class="previewhub-zoom-hint">滚轮缩放 | 拖拽移动 | 双击重置</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.setupModalEvents();
  }

  // 设置模态框事件
  setupModalEvents() {
    const _overlay = this.modal.querySelector('.previewhub-modal-overlay');
    const closeBtn = this.modal.querySelector('.previewhub-close-btn');
    const prevBtn = this.modal.querySelector('.previewhub-prev-btn');
    const nextBtn = this.modal.querySelector('.previewhub-next-btn');
    const imageContainer = this.modal.querySelector('.previewhub-image-container');
    const _imageWrapper = this.modal.querySelector('.previewhub-image-wrapper');
    const previewImg = this.modal.querySelector('.previewhub-preview-image');
    
    // 缩放控制按钮
    const zoomInBtn = this.modal.querySelector('.previewhub-zoom-in');
    const zoomOutBtn = this.modal.querySelector('.previewhub-zoom-out');
    const zoomResetBtn = this.modal.querySelector('.previewhub-zoom-reset');
    const downloadBtn = this.modal.querySelector('.previewhub-download-btn');

    // 关闭事件（移除点击遮罩层关闭功能）
    closeBtn.addEventListener('click', () => this.closePreview());
    
    // 下载事件
    downloadBtn.addEventListener('click', () => this.downloadCurrentImage());

    // 导航事件
    prevBtn.addEventListener('click', () => this.showPrevious());
    nextBtn.addEventListener('click', () => this.showNext());

    // 缩放控制事件
    zoomInBtn.addEventListener('click', () => this.zoomIn());
    zoomOutBtn.addEventListener('click', () => this.zoomOut());
    zoomResetBtn.addEventListener('click', () => this.resetZoom());

    // 滚轮缩放事件
    imageContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom(delta);
    });

    // 双击重置缩放
    previewImg.addEventListener('dblclick', () => this.resetZoom());

    // 鼠标拖拽事件
    previewImg.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.endDrag());

    // 触摸事件（移动端支持）
    previewImg.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        e.preventDefault();
        this.drag(e.touches[0]);
      }
    });
    document.addEventListener('touchend', () => this.endDrag());

    // 键盘事件
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      switch(e.key) {
        case 'Escape':
          this.closePreview();
          break;
        case 'ArrowLeft':
          this.showPrevious();
          break;
        case 'ArrowRight':
          this.showNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          this.zoomIn();
          break;
        case '-':
          e.preventDefault();
          this.zoomOut();
          break;
        case '0':
          e.preventDefault();
          this.resetZoom();
          break;
      }
    });
  }

  // 打开预览
  openPreview(startIndex = 0) {
    const markdownContainer = this.getMarkdownContainer();
    if (!markdownContainer) return;

    this.images = this.findMarkdownImages(markdownContainer);
    if (this.images.length === 0) return;

    this.currentIndex = Math.max(0, Math.min(startIndex, this.images.length - 1));
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    this.updatePreview();
  }

  // 更新预览内容
  updatePreview() {
    if (this.images.length === 0) return;

    const image = this.images[this.currentIndex];
    const previewImg = this.modal.querySelector('.previewhub-preview-image');
    const loading = this.modal.querySelector('.previewhub-loading');
    const counter = this.modal.querySelector('.previewhub-image-counter');
    const info = this.modal.querySelector('.previewhub-image-info');
    const prevBtn = this.modal.querySelector('.previewhub-prev-btn');
    const nextBtn = this.modal.querySelector('.previewhub-next-btn');

    // 重置缩放和位置
    this.resetZoom();

    // 更新计数器
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    
    // 更新导航按钮状态
    if (this.images.length > 1) {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
    
    // 显示加载状态
    loading.style.display = 'block';
    previewImg.style.display = 'none';
    
    // 加载图片
    const img = new Image();
    img.onload = () => {
      previewImg.src = image.src;
      previewImg.alt = image.alt;
      loading.style.display = 'none';
      previewImg.style.display = 'block';
    };
    img.onerror = () => {
      loading.textContent = '图片加载失败';
      previewImg.style.display = 'none';
    };
    img.src = image.src;
    
    // 更新图片信息
    info.textContent = image.title || image.alt || '无描述';
  }

  // 显示上一张
  showPrevious() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updatePreview();
  }

  // 显示下一张
  showNext() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updatePreview();
  }

  // 缩放功能
  zoom(delta) {
    const newScale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + delta));
    if (newScale !== this.scale) {
      this.scale = newScale;
      this.updateImageTransform();
      this.updateZoomLevel();
      this.constrainPosition();
    }
  }

  zoomIn() {
    this.zoom(0.2);
  }

  zoomOut() {
    this.zoom(-0.2);
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateImageTransform();
    this.updateZoomLevel();
  }

  // 更新图片变换
  updateImageTransform() {
    const previewImg = this.modal.querySelector('.previewhub-preview-image');
    if (previewImg) {
      previewImg.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
      previewImg.style.cursor = this.scale > 1 ? 'grab' : 'default';
      
      if (this.isDragging) {
        previewImg.style.cursor = 'grabbing';
      }
    }
  }

  // 更新缩放级别显示
  updateZoomLevel() {
    const zoomLevel = this.modal.querySelector('.previewhub-zoom-level');
    if (zoomLevel) {
      zoomLevel.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }

  // 开始拖拽
  startDrag(e) {
    if (this.scale <= 1) return; // 只有放大时才能拖拽
    
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.updateImageTransform();
    e.preventDefault();
  }

  // 拖拽中
  drag(e) {
    if (!this.isDragging || this.scale <= 1) return;

    const deltaX = e.clientX - this.lastMouseX;
    const deltaY = e.clientY - this.lastMouseY;
    
    this.translateX += deltaX / this.scale;
    this.translateY += deltaY / this.scale;
    
    this.constrainPosition();
    this.updateImageTransform();
    
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
  }

  // 结束拖拽
  endDrag() {
    this.isDragging = false;
    this.updateImageTransform();
  }

  // 限制拖拽边界
  constrainPosition() {
    if (this.scale <= 1) {
      this.translateX = 0;
      this.translateY = 0;
      return;
    }

    const container = this.modal.querySelector('.previewhub-image-container');
    const previewImg = this.modal.querySelector('.previewhub-preview-image');
    
    if (!container || !previewImg) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = previewImg.getBoundingClientRect();
    
    // 计算图片在当前缩放下的实际尺寸
    const scaledWidth = imgRect.width;
    const scaledHeight = imgRect.height;
    
    // 计算最大允许的偏移量
    const maxTranslateX = Math.max(0, (scaledWidth - containerRect.width) / 2 / this.scale);
    const maxTranslateY = Math.max(0, (scaledHeight - containerRect.height) / 2 / this.scale);
    
    // 限制水平位置
    this.translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, this.translateX));
    
    // 限制垂直位置
    this.translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, this.translateY));
  }

  // 下载当前图片
  async downloadCurrentImage() {
    if (this.images.length === 0) return;
    
    const currentImage = this.images[this.currentIndex];
    const imageUrl = currentImage.src;
    const imageName = this.getImageName(currentImage);
    
    // 创建下载按钮的加载状态
    const downloadBtn = this.modal.querySelector('.previewhub-download-btn');
    const originalContent = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span style="font-size: 12px;">...</span>';
    downloadBtn.disabled = true;
    
    try {
      // 尝试多种下载方法
      const success = await this.tryDownloadMethods(imageUrl, imageName);
      
      if (!success) {
        throw new Error('所有下载方法都失败了');
      }
      
      // 恢复按钮状态
      downloadBtn.innerHTML = originalContent;
      downloadBtn.disabled = false;
      
    } catch (error) {
      console.error('下载图片失败:', error);
      
      // 恢复按钮状态
      downloadBtn.innerHTML = originalContent;
      downloadBtn.disabled = false;
      
      // 显示错误提示
      this.showDownloadError();
    }
  }
  
  // 尝试多种下载方法
  async tryDownloadMethods(imageUrl, imageName) {
    // 方法1: 直接使用Canvas转换（适用于同域图片）
    try {
      const success = await this.downloadViaCanvas(imageUrl, imageName);
      if (success) return true;
    } catch (error) {
      console.log('Canvas方法失败:', error.message);
    }
    
    // 方法2: 尝试fetch请求（可能被CORS阻止）
    try {
      const success = await this.downloadViaFetch(imageUrl, imageName);
      if (success) return true;
    } catch (error) {
      console.log('Fetch方法失败:', error.message);
    }
    
    // 方法3: 使用Chrome下载API（如果可用）
    try {
      const success = await this.downloadViaAPI(imageUrl, imageName);
      if (success) return true;
    } catch (error) {
      console.log('API方法失败:', error.message);
    }
    
    // 方法4: 直接链接下载（备用方案）
    try {
      this.downloadViaLink(imageUrl, imageName);
      return true;
    } catch (error) {
      console.log('Link方法失败:', error.message);
    }
    
    return false;
  }
  
  // 方法1: 通过Canvas下载
  async downloadViaCanvas(imageUrl, imageName) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = imageName;
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              window.URL.revokeObjectURL(url);
              resolve(true);
            } else {
              reject(new Error('无法创建blob'));
            }
          }, 'image/png');
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
      
      img.src = imageUrl;
    });
  }
  
  // 方法2: 通过Fetch下载
  async downloadViaFetch(imageUrl, imageName) {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = imageName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    return true;
  }
  
  // 方法3: 使用Chrome下载API
  async downloadViaAPI(imageUrl, imageName) {
    if (typeof chrome !== 'undefined' && chrome.downloads) {
      return new Promise((resolve, reject) => {
        chrome.downloads.download({
          url: imageUrl,
          filename: imageName,
          saveAs: false
        }, (_downloadId) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(true);
          }
        });
      });
    } else {
      throw new Error('Chrome下载API不可用');
    }
  }
  
  // 方法4: 直接链接下载（备用方案）
  downloadViaLink(imageUrl, imageName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // 获取图片文件名
  getImageName(image) {
    // 从URL中提取文件名
    let fileName = '';
    try {
      const url = new URL(image.src);
      const pathname = url.pathname;
      fileName = pathname.split('/').pop() || 'image';
      
      // 如果没有扩展名，根据URL或alt添加默认扩展名
      if (!fileName.includes('.')) {
        const extension = this.getImageExtension(image.src);
        fileName += extension;
      }
    } catch {
      // 如果URL解析失败，使用alt或默认名称
      fileName = (image.alt || image.title || 'image').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
      fileName += '.png'; // 默认扩展名
    }
    
    return fileName;
  }
  
  // 获取图片扩展名
  getImageExtension(url) {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'];
    const lowerUrl = url.toLowerCase();
    
    for (const ext of extensions) {
      if (lowerUrl.includes(ext)) {
        return ext;
      }
    }
    
    return '.png'; // 默认扩展名
  }
  
  // 显示下载错误提示
  showDownloadError() {
    const info = this.modal.querySelector('.previewhub-image-info');
    const originalText = info.textContent;
    
    info.textContent = '下载失败，可能由于跨域限制。请右键图片选择"图片另存为"';
    info.style.color = '#d1242f';
    
    setTimeout(() => {
      info.textContent = originalText;
      info.style.color = '';
    }, 5000);
  }

  // 创建Open IDE按钮
  createOpenIDEButton() {
    // 只在GitHub.com上显示，不在github.dev上显示
    if (this.isGitHubDev) return;
    
    // 移除已存在的按钮
    const existingButton = document.querySelector('#previewhub-ide-button');
    if (existingButton) {
      existingButton.remove();
    }

    // 查找clone按钮的容器
    const cloneButtonContainer = this.findCloneButtonContainer();
    if (!cloneButtonContainer) return;

    // 创建IDE按钮
    const ideButton = document.createElement('button');
    ideButton.id = 'previewhub-ide-button';
    ideButton.className = 'btn btn-sm btn-outline mr-2';
    ideButton.type = 'button';
    // ideButton.innerHTML = `
    //   <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-code mr-1">
    //     <path fill-rule="evenodd" d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L13.94 8l-3.72-3.72a.75.75 0 0 1 1.06-1.06ZM4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 0 1-1.06 1.06L.47 7.53a.75.75 0 0 1 0-1.06l4.25-4.25Z"></path>
    //   </svg>
    //   Open IDE
    // `;
    ideButton.innerHTML = `Open Web IDE`;
    
    ideButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.openInIDE();
    });

    // 插入按钮到clone按钮的左边
    cloneButtonContainer.parentNode.insertBefore(ideButton, cloneButtonContainer);
  }

  // 查找clone按钮容器
  findCloneButtonContainer() {
    // 尝试多种选择器来找到clone按钮
    const selectors = [
      '[data-testid="download-zip-button"]', // 新版GitHub
      'get-repo-select-menu', // 旧版GitHub
      '[aria-label*="Clone"]', // 通过aria-label查找
      '.js-get-repo-select-menu', // JavaScript选择器
      'summary[data-hotkey="c"]', // 快捷键选择器
      '.btn-group .btn[data-hydro-click*="clone"]' // 通过data属性查找
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        // 如果找到的是按钮本身，返回其最近的容器
        if (element.tagName === 'BUTTON' || element.tagName === 'SUMMARY') {
          return element.closest('.btn-group') || element;
        }
        return element;
      }
    }

    // 备用方案：查找包含"Code"文本的按钮
    const buttons = document.querySelectorAll('button, summary');
    for (const button of buttons) {
      if (button.textContent && button.textContent.trim().includes('Code')) {
        return button.closest('.btn-group') || button;
      }
    }

    return null;
  }

  // 打开在IDE中
  openInIDE() {
    const currentUrl = window.location.href;
    
    // 将github.com替换为github.dev
    const ideUrl = currentUrl.replace('github.com', 'github.dev');
    
    // 在新标签页中打开
    window.open(ideUrl, '_blank', 'noopener,noreferrer');
  }

  // 关闭预览
  closePreview() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
    this.resetZoom(); // 关闭时重置缩放状态
  }
}

// 消息监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getImageCount') {
    const markdownContainer = previewHub ? previewHub.getMarkdownContainer() : null;
    if (markdownContainer) {
      const images = previewHub.findMarkdownImages(markdownContainer);
      sendResponse({ count: images.length, images: images.map(img => ({ src: img.src, alt: img.alt })) });
    } else {
      sendResponse({ count: 0, images: [] });
    }
    return true; // 保持消息通道开放
  }
  
  if (request.action === 'openPreview') {
    if (previewHub) {
      previewHub.openPreview(request.index || 0);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'PreviewHub not initialized' });
    }
    return true;
  }
  
  if (request.action === 'getStatus') {
    const markdownContainer = previewHub ? previewHub.getMarkdownContainer() : null;
    const isActive = !!markdownContainer;
    const imageCount = markdownContainer ? previewHub.findMarkdownImages(markdownContainer).length : 0;
    
    sendResponse({
      isActive,
      imageCount,
      url: window.location.href,
      isGitHub: window.location.hostname === 'github.com',
      isGitHubDev: window.location.hostname.includes('github.dev')
    });
    return true;
  }
});

// 初始化插件
let previewHub = null;

function initPreviewHub() {
  if (previewHub) return;
  
  // 等待页面加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        previewHub = new PreviewHub();
        // 通知popup页面插件已初始化
        chrome.runtime.sendMessage({ action: 'contentScriptReady' }).catch(() => {
          // 忽略错误，popup可能未打开
        });
      }, 1000);
    });
  } else {
    setTimeout(() => {
      previewHub = new PreviewHub();
      // 通知popup页面插件已初始化
      chrome.runtime.sendMessage({ action: 'contentScriptReady' }).catch(() => {
        // 忽略错误，popup可能未打开
      });
    }, 1000);
  }
}

// 检查是否在GitHub页面
if (window.location.hostname === 'github.com' || 
    window.location.hostname.includes('github.dev')) {
  initPreviewHub();
}
