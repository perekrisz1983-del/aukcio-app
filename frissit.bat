@echo off
git add .
git commit -m "Automatikus frissites: %date% %time%"
git push
echo.
echo Kesz! A kod fent van GitHub-on, a Vercel frissit...
pause