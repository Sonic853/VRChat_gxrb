#!/bin/bash

# 获取输入参数：PDF 文件夹路径和输出 JPG 文件夹路径
inputFolder="$1"
outputFolder="$2"

# 如果输出文件夹不存在，则创建它
if [ ! -d "$outputFolder" ]; then
    mkdir -p "$outputFolder"
fi

# 遍历输入文件夹中的所有 PDF 文件并转换为 JPG
for pdfFile in "$inputFolder"/*.pdf; do
    echo "convert $pdfFile"
    outputFile="$outputFolder/$(basename "${pdfFile%.pdf}").jpg"
    magick -density 300 "$pdfFile" -resize x2048 -quality 100 "$outputFile"
done

echo "Done!"
