@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title NEO TOURNOIVOLLEY WEB V48
echo ==============================================
echo   NEO TOURNOIVOLLEY WEB V48 - CONSTRUCTION
echo ==============================================
where node.exe >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] Node.js 20 doit etre installe : https://nodejs.org/
  goto :error
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERREUR] npm.cmd introuvable.
  goto :error
)
if not exist "node_modules\.bin\vite.cmd" (
  echo [INFO] Installation dependances npm...
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto :error
)
call npm run build
if errorlevel 1 goto :error
echo [OK] Web V48 compile : dossier dist
pause
exit /b 0
:error
echo [ERREUR] Construction web echouee.
pause
exit /b 1
