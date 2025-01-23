<?php

namespace App\Enums;

use App\Traits\ExtendEnums;

enum ProjectRole: string
{
    use ExtendEnums;

    case PO = 'Product Owner';
    case PL = 'Project Lead';
    case TL = 'Tech Lead';
    case SM = 'Scrum Master';
    case DEV = 'Developer';
    case QA = 'Quality Assurance';
    case BA = 'Business Analyst';
    case UX = 'User Experience';
    case UI = 'User Interface';
    case SA = 'Solution Architect';
    case DBA = 'Database Administrator';
    case DEVOPS = 'DevOps Engineer';
    case SEC = 'Security Engineer';
    case NET = 'Network Engineer';
    case OPS = 'Operations Engineer';
    case ENG = 'Engineer';
    case ARCH = 'Architect';
    case DES = 'Designer';

}
