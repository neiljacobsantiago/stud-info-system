<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProgramController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ProgramResource::collection(Program::orderBy('code')->get());
    }

    public function show(Program $program): ProgramResource
    {
        return new ProgramResource($program);
    }
}
