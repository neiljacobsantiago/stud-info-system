<?php

// Without this the browser blocks every request from the Vite dev server,
// and the React side just sees a generic network failure.
return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // The Vite dev server. Add the deployed frontend origin here before
    // hosting anywhere; '*' will not work once credentials are involved.
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
