#!/bin/bash
# 生成缩略图：宽600，高自适应landscape（匹配手动效果）
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick not found. Run: sudo apt install imagemagick"
    exit 1
fi
echo "ImageMagick OK"

# cd到thumbnails/（你的嵌套位置）
cd static/images/gallery/thumbnails || { echo "Error: Cannot cd to static/images/gallery/thumbnails"; mkdir -p static/images/gallery/thumbnails && cd $_; }
echo "Working in: $(pwd)"
rm -f *_t.*  # 清空旧_t（包括方形版）
echo "Cleared old thumbs"

# 检查gallery/文件数
image_count=$(ls ../*.{jpg,png} 2>/dev/null | wc -l)
echo "Found $image_count images in gallery/ (expected 19)"

# 逐张生成：宽600，高自适应（无extent，方形）
count=0
for img in ../*.{jpg,png}; do
    if [ -f "$img" ]; then
        base=$(basename "$img" | sed 's/\.[^.]*$//')
        output="${base}_t.jpg"
        echo "Processing: $(basename "$img")"
        convert "$img" -resize 600x -quality 92 "$output"  # 核心：宽600，高自适应，无填充
        if [ $? -eq 0 ]; then
            echo "Generated: $output (宽600, 高自适应<600, landscape)"
            ((count++))
        else
            echo "Failed: $output"
        fi
    fi
done

echo "Thumbnails generated! $count files (expected 19, all landscape)"
ls -la *_t.* 2>/dev/null | wc -l || echo "No thumbs (check errors)"