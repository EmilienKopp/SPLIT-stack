<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('translucid', function ($user) {
    return true;
});

// Broadcast::routes(['middleware' => ['auth:sanctum']]);