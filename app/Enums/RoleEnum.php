<?php

namespace App\Enums;

use Splitstack\EnumFriendly\Traits\ExtendedEnum;

enum RoleEnum: string
{
    use ExtendedEnum;
    case Admin = 'admin';
    case Freelancer = 'freelancer';
    case BusinessOwner = 'business_owner';
    case Employer = 'employer';
    case Staff = 'staff';
    case User = 'user';

}
