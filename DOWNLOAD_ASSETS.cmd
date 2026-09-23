@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0DOWNLOAD_ASSETS.ps1"
pause
