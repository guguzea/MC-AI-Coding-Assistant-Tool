@echo off
:: Forge 1.20.1 项目校验工具
:: 使用方法：将本文件放到模组项目根目录，双击运行
:: 或在命令行：validate_project.bat [项目路径]

python "%~dp0validate_project.py" %*
pause
