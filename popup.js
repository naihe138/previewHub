// PreviewHub 弹窗脚本
document.addEventListener('DOMContentLoaded', function() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const feedbackLink = document.getElementById('feedbackLink');
  const helpLink = document.getElementById('helpLink');

  // 检查当前标签页状态
  checkCurrentTab();

  // 设置事件监听器
  feedbackLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: 'https://github.com/naice/previewHub/issues'
    });
  });

  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({
      url: 'https://github.com/naice/previewHub#readme'
    });
  });

  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        updateStatus(false, '无法获取当前标签页');
        return;
      }

      const url = tab.url;
      const isGitHub = url.includes('github.com');
      const isGitHubDev = url.includes('github.dev');
      
      if (isGitHub || isGitHubDev) {
        // 检查是否在项目页面
        const isProjectPage = /github\.com\/[^/]+\/[^/]+(?:\/|$)/.test(url) || 
                              /\.github\.dev/.test(url);
        
        if (isProjectPage) {
          // 尝试获取详细状态
          try {
            const status = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
            if (status) {
              const platform = status.isGitHubDev ? 'GitHub.dev' : 'GitHub.com';
              if (status.isActive && status.imageCount > 0) {
                updateStatus(true, `发现 ${status.imageCount} 张图片 (${platform})`);
              } else if (status.isActive) {
                updateStatus(true, `已激活，未发现图片 (${platform})`);
              } else {
                updateStatus(true, `正在加载... (${platform})`);
              }
            } else {
              updateStatus(true, `已激活 (${isGitHubDev ? 'GitHub.dev' : 'GitHub.com'})`);
            }
          } catch {
            // 内容脚本可能还未加载
            updateStatus(true, `正在加载... (${isGitHubDev ? 'GitHub.dev' : 'GitHub.com'})`);
          }
        } else {
          updateStatus(false, '请访问GitHub项目页面');
        }
      } else {
        updateStatus(false, '请访问GitHub页面');
      }
    } catch (error) {
      console.error('检查标签页状态失败:', error);
      updateStatus(false, '状态检查失败');
    }
  }

  function updateStatus(isActive, message) {
    if (isActive) {
      statusIndicator.className = 'status-indicator';
      statusText.textContent = message;
    } else {
      statusIndicator.className = 'status-indicator inactive';
      statusText.textContent = message;
    }
  }

  // 定期更新状态
  setInterval(checkCurrentTab, 2000);
});
