@echo off
setlocal

@REM pdf2jpg.bat "pdf\rmrb" "paper\rmrb"

@REM ��ȡ���������PDF �ļ���·������� JPG �ļ���·��
set "inputFolder=%~1"
set "outputFolder=%~2"

@REM �������ļ��в����ڣ��򴴽���
if not exist "%outputFolder%" (
    mkdir "%outputFolder%"
)

@REM ���������ļ����е����� PDF �ļ���ת��Ϊ JPG
for %%f in ("%inputFolder%\*.pdf") do (
    echo convert %%f
    magick -density 300 "%%f" -resize x2048 -quality 100 "%outputFolder%\%%~nf.jpg"
)

echo Done!
endlocal
