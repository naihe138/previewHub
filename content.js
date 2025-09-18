// PreviewHub - GitHub图片预览插件
class PreviewHub {
  constructor() {
    this.modal = null;
    this.images = [];
    this.currentIndex = 0;
    this.isGitHubDev = window.location.hostname.includes('github.dev');
    this.init();
  }

  init() {
    this.createPreviewButton();
    this.setupImageClickHandlers();
    this.createModal();
    
    // 监听页面变化（GitHub使用SPA路由）
    this.observePageChanges();
  }

  // 检测页面变化并重新初始化
  observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldReinit = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 检查是否有新的README内容加载
          const hasReadmeContent = Array.from(mutation.addedNodes).some(node => 
            node.nodeType === 1 && 
            (node.querySelector?.('[data-testid="readme"]') || 
             node.classList?.contains('markdown-body'))
          );
          if (hasReadmeContent) {
            shouldReinit = true;
          }
        }
      });
      
      if (shouldReinit) {
        setTimeout(() => {
          this.setupImageClickHandlers();
          this.createPreviewButton();
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

    const readmeContainer = this.getReadmeContainer();
    if (!readmeContainer) return;

    const images = this.findReadmeImages(readmeContainer);
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

    // 插入按钮到README标题附近
    const readmeHeader = readmeContainer.querySelector('h1, h2, .markdown-heading');
    if (readmeHeader) {
      readmeHeader.parentNode.insertBefore(button, readmeHeader.nextSibling);
    } else {
      readmeContainer.insertBefore(button, readmeContainer.firstChild);
    }
  }

  // 获取README容器
  getReadmeContainer() {
    // GitHub主站
    let container = document.querySelector('[data-testid="readme"]');
    if (container) return container;

    // GitHub.dev 编辑器
    container = document.querySelector('.markdown-body');
    if (container) return container;

    // 备用选择器
    container = document.querySelector('#readme, .readme, [class*="readme"]');
    return container;
  }

  // 查找README中的图片
  findReadmeImages(container) {
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
    const readmeContainer = this.getReadmeContainer();
    if (!readmeContainer) return;

    const images = readmeContainer.querySelectorAll('img');
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
              <span class="previewhub-image-counter">1 / 1</span>
              <button class="previewhub-btn previewhub-close-btn" title="关闭">×</button>
            </div>
          </div>
          <div class="previewhub-modal-body">
            <button class="previewhub-nav-btn previewhub-prev-btn" title="上一张">‹</button>
            <div class="previewhub-image-container">
              <img class="previewhub-preview-image" src="" alt="">
              <div class="previewhub-loading">加载中...</div>
            </div>
            <button class="previewhub-nav-btn previewhub-next-btn" title="下一张">›</button>
          </div>
          <div class="previewhub-modal-footer">
            <p class="previewhub-image-info"></p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.setupModalEvents();
  }

  // 设置模态框事件
  setupModalEvents() {
    const overlay = this.modal.querySelector('.previewhub-modal-overlay');
    const closeBtn = this.modal.querySelector('.previewhub-close-btn');
    const prevBtn = this.modal.querySelector('.previewhub-prev-btn');
    const nextBtn = this.modal.querySelector('.previewhub-next-btn');

    // 关闭事件
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closePreview();
    });
    closeBtn.addEventListener('click', () => this.closePreview());

    // 导航事件
    prevBtn.addEventListener('click', () => this.showPrevious());
    nextBtn.addEventListener('click', () => this.showNext());

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
      }
    });
  }

  // 打开预览
  openPreview(startIndex = 0) {
    const readmeContainer = this.getReadmeContainer();
    if (!readmeContainer) return;

    this.images = this.findReadmeImages(readmeContainer);
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

    // 更新计数器
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    
    // 更新导航按钮状态
    prevBtn.style.display = this.images.length > 1 ? 'block' : 'none';
    nextBtn.style.display = this.images.length > 1 ? 'block' : 'none';
    
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

  // 关闭预览
  closePreview() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// 消息监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getImageCount') {
    const readmeContainer = previewHub ? previewHub.getReadmeContainer() : null;
    if (readmeContainer) {
      const images = previewHub.findReadmeImages(readmeContainer);
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
    const readmeContainer = previewHub ? previewHub.getReadmeContainer() : null;
    const isActive = !!readmeContainer;
    const imageCount = readmeContainer ? previewHub.findReadmeImages(readmeContainer).length : 0;
    
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
