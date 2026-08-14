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

echo [1/3] staging changes
git add -A
git status --short
echo.

echo [2/3] commit
git commit -m "%MSG%"
if errorlevel 1 goto NOCHANGE
echo.

echo [3/3] push
git push
if errorlevel 1 goto FAILED

echo.
echo ==========================================
echo   DONE. Vercel will redeploy in 2-3 min.
echo ==========================================
echo.
pause
exit /b 0

:NOCHANGE
echo.
echo Nothing to commit - already up to date.
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
