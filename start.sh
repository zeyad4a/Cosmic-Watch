#!/bin/bash

echo "========================================"
echo "   Cosmic Watch - مراقب الفضاء الكوني"
echo "========================================"
echo ""
echo "جاري تشغيل التطبيق..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "تم العثور على Python3، جاري تشغيل الخادم..."
    echo "افتح المتصفح على: http://localhost:8000"
    echo ""
    echo "اضغط Ctrl+C لإيقاف الخادم"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "تم العثور على Python، جاري تشغيل الخادم..."
    echo "افتح المتصفح على: http://localhost:8000"
    echo ""
    echo "اضغط Ctrl+C لإيقاف الخادم"
    echo ""
    python -m http.server 8000
else
    echo "Python غير متوفر، جاري فتح الملف مباشرة..."
    echo ""
    if command -v xdg-open &> /dev/null; then
        xdg-open index.html
    elif command -v open &> /dev/null; then
        open index.html
    else
        echo "يرجى فتح ملف index.html في المتصفح يدوياً"
    fi
fi