<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

// Laravel 11/12 ships a bare base controller. StudentController calls
// $this->authorizeResource(), so the trait has to be pulled in here.
abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;
}
