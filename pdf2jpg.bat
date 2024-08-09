@echo off
setlocal

@REM pdf2jpg.bat "pdf\rmrb" "paper\rmrb"

@REM 获取输入参数：PDF 文件夹路径和输出 JPG 文件夹路径
set "inputFolder=%~1"
set "outputFolder=%~2"

@REM 如果输出文件夹不存在，则创建它
if not exist "%outputFolder%" (
    mkdir "%outputFolder%"
)

@REM 遍历输入文件夹中的所有 PDF 文件并转换为 JPG
for %%f in ("%inputFolder%\*.pdf") do (
    echo convert %%f
    magick -density 300 "%%f" -resize x2048 -quality 100 "%outputFolder%\%%~nf.jpg"
)

echo Done!
endlocal
