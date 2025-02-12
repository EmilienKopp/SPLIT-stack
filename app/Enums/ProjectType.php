<?php

namespace App\Enums;

use Splitstack\EnumFriendly\Traits\ExtendedEnum;

enum ProjectType: string
{
    use ExtendedEnum;

    case OpenSource = 'open_source';
    case Commercial = 'commercial';
    case Internal = 'internal';
    case Educational = 'educational';
    case POC = 'poc';
    case Prototype = 'prototype';
    case Portfolio = 'portfolio';
    case Research = 'research';
    case Other = 'other';
}
