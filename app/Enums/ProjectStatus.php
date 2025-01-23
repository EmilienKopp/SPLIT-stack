<?php

namespace App\Enums;

use App\Traits\ExtendEnums;

enum ProjectStatus: string
{
    use ExtendEnums;
    case Active = 'active';
    case Inactive = 'inactive';
    case Archived = 'archived';
    case Deleted = 'deleted';
    case Pending = 'pending';
}
