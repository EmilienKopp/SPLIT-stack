<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Organization;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    public function index()
    {
        $organizations = Organization::all();
        return Inertia::render('Organization/Index', [
            'organizations' => $organizations,
        ]);
    }
}
