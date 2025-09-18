// 简单的图标生成脚本
// 在浏览器控制台中运行此脚本来生成图标

function generateIcon(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // 背景
    ctx.fillStyle = '#0969da';
    ctx.fillRect(0, 0, size, size);
    
    // 边框圆角效果
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = '#000';
    ctx.beginPath();
    const radius = size / 8;
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
    
    // 相机图标
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, size / 32);
    
    // 相机主体
    const rectSize = size * 0.6;
    const rectX = (size - rectSize) / 2;
    const rectY = size * 0.3;
    const rectHeight = size * 0.4;
    
    ctx.strokeRect(rectX, rectY, rectSize, rectHeight);
    
    // 镜头
    const centerX = size / 2;
    const centerY = size / 2;
    const lensRadius = size / 8;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, lensRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 镜头中心
    ctx.beginPath();
    ctx.arc(centerX, centerY, lensRadius / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // 取景器
    const viewfinderWidth = size / 4;
    const viewfinderHeight = size / 16;
    const viewfinderX = (size - viewfinderWidth) / 2;
    const viewfinderY = rectY - viewfinderHeight - 2;
    
    ctx.fillRect(viewfinderX, viewfinderY, viewfinderWidth, viewfinderHeight);
    
    return canvas.toDataURL('image/png');
}

// 使用方法：
// 1. 在浏览器中打开开发者工具
// 2. 复制粘贴此脚本到控制台
// 3. 运行以下命令生成图标：

console.log('16x16 图标:');
console.log(generateIcon(16));

console.log('48x48 图标:');
console.log(generateIcon(48));

console.log('128x128 图标:');
console.log(generateIcon(128));

// 创建下载链接的示例用法：
// 取消注释以下代码来下载图标
/*
function downloadIcon(size) {
    const dataUrl = generateIcon(size);
    const link = document.createElement('a');
    link.download = `icon${size}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

downloadIcon(16);
downloadIcon(48);
downloadIcon(128);
*/
