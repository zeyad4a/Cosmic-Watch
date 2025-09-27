@echo off
echo ========================================
echo    Cosmic Watch - مراقب الفضاء الكوني
echo ========================================
echo.
echo جاري تشغيل التطبيق...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo تم العثور على Python، جاري تشغيل الخادم...
    echo افتح المتصفح على: http://localhost:8000
    echo.
    echo اضغط Ctrl+C لإيقاف الخادم
    echo.
    python -m http.server 8000
) else (
    echo Python غير متوفر، جاري فتح الملف مباشرة...
    echo.
    start index.html
)

pause