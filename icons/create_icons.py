#!/usr/bin/env python3
"""
创建PreviewHub插件图标的Python脚本
使用PIL库生成不同尺寸的图标
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("请先安装PIL库: pip install Pillow")
    exit(1)

def create_icon(size):
    """创建指定尺寸的图标"""
    # 创建透明背景的图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 设置颜色
    bg_color = (9, 105, 218, 255)  # GitHub蓝色
    icon_color = (255, 255, 255, 255)  # 白色
    
    # 绘制圆角矩形背景
    corner_radius = size // 8
    draw.rounded_rectangle(
        [(2, 2), (size-2, size-2)], 
        radius=corner_radius, 
        fill=bg_color
    )
    
    # 计算图标区域
    margin = size // 6
    icon_size = size - 2 * margin
    
    # 绘制相机/预览图标
    # 主体矩形
    rect_margin = margin + icon_size // 8
    rect_width = icon_size - 2 * (icon_size // 8)
    rect_height = rect_width * 3 // 4
    rect_y = margin + (icon_size - rect_height) // 2
    
    draw.rounded_rectangle(
        [(rect_margin, rect_y), (rect_margin + rect_width, rect_y + rect_height)],
        radius=max(1, size // 32),
        outline=icon_color,
        width=max(1, size // 24)
    )
    
    # 镜头圆圈
    lens_size = rect_width // 3
    lens_x = rect_margin + (rect_width - lens_size) // 2
    lens_y = rect_y + (rect_height - lens_size) // 2
    
    draw.ellipse(
        [(lens_x, lens_y), (lens_x + lens_size, lens_y + lens_size)],
        outline=icon_color,
        width=max(1, size // 32)
    )
    
    # 内部小圆点
    dot_size = lens_size // 3
    dot_x = lens_x + (lens_size - dot_size) // 2
    dot_y = lens_y + (lens_size - dot_size) // 2
    
    draw.ellipse(
        [(dot_x, dot_y), (dot_x + dot_size, dot_y + dot_size)],
        fill=icon_color
    )
    
    # 顶部小矩形（取景器）
    viewfinder_width = rect_width // 4
    viewfinder_height = max(2, size // 24)
    viewfinder_x = rect_margin + (rect_width - viewfinder_width) // 2
    viewfinder_y = rect_y - viewfinder_height - max(1, size // 48)
    
    draw.rectangle(
        [(viewfinder_x, viewfinder_y), 
         (viewfinder_x + viewfinder_width, viewfinder_y + viewfinder_height)],
        fill=icon_color
    )
    
    return img

def main():
    """生成所有尺寸的图标"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        icon = create_icon(size)
        filename = f'icon{size}.png'
        icon.save(filename, 'PNG')
        print(f'已生成 {filename}')
    
    print('所有图标生成完成！')

if __name__ == '__main__':
    main()
