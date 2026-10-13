@echo off
title StaySphere - Hotel Chain Management
cd /d "%~dp0"
if not exist node_modules (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 pause & exit /b 1
)
call npm run dev
pause
