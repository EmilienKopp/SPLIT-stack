@echo off
echo Starting Reverb server...
php artisan reverb:start

if %ERRORLEVEL% neq 0 (
    echo Failed to start Reverb server. Here are some troubleshooting tips:
    echo 1. Make sure you have the correct .env configuration:
    echo    BROADCAST_CONNECTION=reverb
    echo    REVERB_APP_KEY, REVERB_APP_SECRET, REVERB_APP_ID, etc.
    echo 2. Check if port 8080 is already in use
    echo 3. Check the Laravel logs for more details:
    echo    type storage\logs\laravel.log
)
