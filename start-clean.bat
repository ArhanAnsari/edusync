@echo off
echo ================================
echo   Clearing Next.js Cache...
echo ================================
echo.

if exist .next (
    rmdir /s /q .next
    echo [OK] Cache cleared!
) else (
    echo [INFO] No cache to clear
)

echo.
echo ================================
echo   Starting Dev Server...
echo ================================
echo.

npm run dev
