<?php

namespace App\Enums;

use App\Traits\ExtendEnums;
use Illuminate\Support\Traits\EnumeratesValues;

enum OrganizationType: string
{
    use ExtendEnums;
    case Freelancer = 'freelancer';
    case Corporation = 'corporation';
    case NonProfit = 'non_profit';
    case Government = 'government';
    case Educational = 'educational';
    case Other = 'other';

    
}
