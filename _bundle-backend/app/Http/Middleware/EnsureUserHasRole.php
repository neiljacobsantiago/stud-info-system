<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

// Route-level gate: Route::middleware('role:admin,staff')
// Policies handle per-record rules; this handles whole route groups.
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'You do not have access to this action.');
        }

        return $next($request);
    }
}
