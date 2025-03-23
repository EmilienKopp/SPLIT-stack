#!/bin/bash

# Start the Reverb server
echo "Starting Reverb server..."
php artisan reverb:start

# If the server fails to start, provide some troubleshooting tips
if [ $? -ne 0 ]; then
    echo "Failed to start Reverb server. Here are some troubleshooting tips:"
    echo "1. Make sure you have the correct .env configuration:"
    echo "   BROADCAST_CONNECTION=reverb"
    echo "   REVERB_APP_KEY, REVERB_APP_SECRET, REVERB_APP_ID, etc."
    echo "2. Check if port 8080 is already in use:"
    echo "   lsof -i :8080"
    echo "3. Try running with sudo if there are permission issues:"
    echo "   sudo php artisan reverb:start"
    echo "4. Check the Laravel logs for more details:"
    echo "   tail -f storage/logs/laravel.log"
fi
