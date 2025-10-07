@echo off
echo ========================================
echo Deploying to GitHub Pages
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 goto error

echo.
echo Step 2: Building application...
call npm run build
if errorlevel 1 goto error

echo.
echo Step 3: Initializing git (if needed)...
if not exist .git (
    git init
    git add .
    git commit -m "Initial commit: Predictive Edge of AI in Entrepreneurship"
    git branch -M main
    git remote add origin https://github.com/upocuantitativo/aibridgesGap.git
)

echo.
echo Step 4: Committing changes...
git add .
git commit -m "Update application - %date% %time%"

echo.
echo Step 5: Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Your application will be available at:
echo https://upocuantitativo.github.io/aibridgesGap/
echo.
echo Please wait 2-3 minutes for GitHub Pages to update.
echo.
pause
goto end

:error
echo.
echo ========================================
echo ERROR: Deployment failed!
echo ========================================
echo.
pause

:end
