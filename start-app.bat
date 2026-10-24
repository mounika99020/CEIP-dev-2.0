@echo off
title CEIP Customer Intelligence Platform
cd /d "%~dp0"
echo Starting CEIP Dev Server...
echo Your browser will open automatically once the server is ready.
npm run dev
pause
