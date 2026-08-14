@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo   Rootfinder - push to GitHub
echo ==========================================
echo.

if exist ".git\index.lock" (
  echo [clean] removing stale index.lock
  del /f /q ".git\index.lock" >nul 2>&1
)

if exist ".git\objects" (
  for /r ".git\objects" %%f in (tmp_obj*) do @del /f /q "%%f" >nul 2>&1
)

if exist "_to_delete" rmdir /s /q "_to_delete" >nul 2>&1
if exist "_restore.zip" del /f /q "_restore.zip" >nul 2>&1

set "MSG=%*"
if not defined MSG set "MSG=update from Claude"

echo [1/4] staging changes
git add -A
git status --short
echo.

echo [2/4] commit
git commit -m "%MSG%"
if errorlevel 1 echo   (no new changes - will still push pending commits)
echo.

echo [3/4] sync with remote
git fetch origin
git merge --no-edit -X ours origin/main
if errorlevel 1 (
  echo.
  echo   merge conflict - stopping. Show this screen to Claude.
  echo.
  pause
  exit /b 1
)
echo.

echo [4/4] push
git push
if errorlevel 1 goto FAILED

echo.
git status -sb
echo.
echo ==========================================
echo   DONE. Vercel will redeploy in 2-3 min.
echo ==========================================
echo.
pause
exit /b 0

:FAILED
echo.
echo ==========================================
echo   PUSH FAILED - show this screen to Claude
echo ==========================================
echo.
pause
exit /b 1
