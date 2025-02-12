<?php

namespace App\Enums;

use Splitstack\EnumFriendly\Traits\ExtendedEnum;

enum ProjectStatus: string
{
    use ExtendedEnum    ;
    case Active = 'active';
    case Inactive = 'inactive';
    case Archived = 'archived';
    case Deleted = 'deleted';
    case Pending = 'pending';
}
