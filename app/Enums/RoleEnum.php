<?php

namespace App\Enums;

use App\Traits\ExtendEnums;

enum RoleEnum: string
{
    use ExtendEnums;
    case Admin = 'admin';
    case Freelancer = 'freelancer';
    case BusinessOwner = 'business_owner';
    case Employer = 'employer';
    case Staff = 'staff';
    case User = 'user';

}
