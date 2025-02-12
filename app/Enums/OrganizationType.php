<?php

namespace App\Enums;

use Splitstack\EnumFriendly\Traits\ExtendedEnum;


enum OrganizationType: string
{
    use ExtendedEnum;
    case Freelancer = 'freelancer';
    case Corporation = 'corporation';
    case NonProfit = 'non_profit';
    case Government = 'government';
    case Educational = 'educational';
    case Other = 'other';

    
}
