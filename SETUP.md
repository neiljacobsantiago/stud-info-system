# Laravel Backend Integration - Student Information System

Everything in this bundle drops into the existing Project 1 app
(`neiljacobsantiago/stud-info-system`). Files under `frontend/` replace or
join files you already have; files under `backend/` go into a fresh Laravel
install.

---

## Repository layout

```
stud-info-system/
├── frontend/        your existing React + Tailwind app (renamed from the repo root)
└── backend/         new Laravel install
```

If you would rather not move the React app, leave it at the repo root and put
Laravel in a `backend/` folder beside it. Nothing here depends on the layout.

---

## Phase 1 - Laravel install

```bash
composer create-project laravel/laravel backend
cd backend
php artisan install:api          # installs Sanctum + creates routes/api.php
```

Create the database, then set `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=stud_info_system
DB_USERNAME=root
DB_PASSWORD=
```

```sql
CREATE DATABASE stud_info_system;
```

Copy `backend/config/cors.php` from this bundle (Laravel 11/12 does not ship
one by default - `php artisan config:publish cors` also creates it).

**Laravel 11/12:** copy `bootstrap/app.php` from this bundle, or just add the
`role` alias inside the existing `withMiddleware()` block.
**Laravel 10:** there is no `bootstrap/app.php`. Register the alias in
`app/Http/Kernel.php` under `$middlewareAliases` instead:

```php
'role' => \App\Http\Middleware\EnsureUserHasRole::class,
```

---

## Phase 2 - Database

Copy these into the Laravel app:

```
backend/database/migrations/     5 files
backend/app/Models/              User, Program, Section, Student, Favorite
backend/database/seeders/        DatabaseSeeder + 4 seeders
```

`User.php` replaces the stock model - it adds `role`, the Sanctum trait, and
the relationships.

The seeder reads your original dataset, so copy it across first:

```bash
mkdir -p backend/database/data
cp frontend/public/students.json backend/database/data/students.json
```

Then:

```bash
php artisan migrate:fresh --seed
```

You should see `Seeded 35 students across 13 sections.`

**Demo accounts** (password for all: `password`)

| Email | Role | Can do |
|---|---|---|
| admin@clsu.edu.ph | admin | everything, including delete |
| delacruz@clsu.edu.ph | staff | edit students in their own sections |
| student@clsu.edu.ph | student | read-only + own favorites |

---

## Phase 3 - Backend logic

```
backend/app/Http/Controllers/Controller.php        (adds AuthorizesRequests)
backend/app/Http/Controllers/Api/                  6 controllers
backend/app/Http/Resources/                        3 resources
backend/app/Http/Middleware/EnsureUserHasRole.php
backend/app/Policies/StudentPolicy.php
backend/routes/api.php
```

Laravel 11/12 auto-discovers `StudentPolicy` from the naming convention. On
Laravel 10, register it in `AuthServiceProvider::$policies`.

```bash
php artisan serve        # http://localhost:8000
```

**Test in Postman before touching React.** Log in first, copy the token, then
send it as `Authorization: Bearer <token>` on everything else.

| Method | URL |
|---|---|
| POST | `/api/login` - `{"email":"admin@clsu.edu.ph","password":"password"}` |
| GET | `/api/registrar/students?q=santos&year_level=1st Year&sort=name-asc&page=1` |
| POST | `/api/registrar/students` |
| PUT | `/api/registrar/students/1` |
| DELETE | `/api/registrar/students/1` |
| GET | `/api/stats` |
| GET | `/api/academics/sections` |
| POST | `/api/account/favorites` - `{"student_id": 2}` |

Two checks worth doing now, because they are the video's best moments:

1. POST a student with `first_name` empty - expect `422` with a per-field
   `errors` object.
2. POST 41 students into one section (capacity 40) - expect `422` with
   `errors.section_id` explaining the section is full.

---

## Phase 4-7 - React

Copy `frontend/src/**` over your existing `src/`, then:

```bash
cd frontend
cp .env.example .env
npm run dev
```

### New files

| Path | Purpose |
|---|---|
| `src/lib/api.js` | fetch wrapper: token header, JSON, `ApiError` with field errors |
| `src/context/AuthContext.jsx` | signed-in user, login/register/logout |
| `src/hooks/useLookups.js` | programs + sections for the selects and filters |
| `src/hooks/useFavorites.js` | the user's filed records |
| `src/hooks/useStats.js` | Home dashboard numbers |
| `src/hooks/useDebouncedValue.js` | stops one request per keystroke |
| `src/pages/Login.jsx` | sign in / register |
| `src/components/StudentForm.jsx` | create + edit modal |
| `src/components/ConfirmDialog.jsx` | delete confirmation |

### Replaced files

| Path | What changed |
|---|---|
| `src/App.jsx` | wraps in `AuthProvider`, adds Favorites + Login views |
| `src/hooks/useStudents.js` | full rewrite: server-side query + create/update/delete |
| `src/pages/Browse.jsx` | filters became query params; New/Edit/Delete added |
| `src/pages/Home.jsx` | stats come from `/api/stats` instead of counting an array |
| `src/pages/Favorites.jsx` | now reachable and backed by the favorites table |
| `src/components/Navbar.jsx` | Favorites tab, user badge, sign in/out |
| `src/components/StudentCard.jsx` | bookmark toggle + role-gated Edit/Delete |
| `src/components/FilterBar.jsx` | `category` (active/blank) became `status` (active/inactive) |
| `src/components/StudentModal.jsx` | shows adviser and enrollment year |
| `src/utils/studentStyling.js` | `studentId()` returns the stored `student_no` |

### Delete these

```bash
rm frontend/src/utils/departmentColors.js
rm frontend/public/students.json          # after seeding - it is now in backend/database/data/
```

`departmentColors.js` was already dead: it keyed off a `department` field your
data never had, and its palette used `bg-manila` / `bg-brass-light` classes
that are not in `tailwind.config.js`.

### Unchanged

`main.jsx`, `index.css`, `tailwind.config.js`, `postcss.config.js`,
`vite.config.js`, `index.html`, `About.jsx`, `SearchBar.jsx`,
`Pagination.jsx`, `StatTab.jsx`, `Loading.jsx`, `ErrorMessage.jsx`,
`Footer.jsx`.

---

## Design notes worth being able to explain

**The API speaks camelCase.** The database is snake_case, but
`StudentResource` renames the keys on the way out, so `StudentCard` and
`StudentModal` keep reading `student.firstName` and `student.yearLevel`
exactly as they did in Project 1. That is why so few components changed.

**`category: "blank"` is gone.** A relational database represents an empty
seat as the absence of a row, not a placeholder row. `sections.capacity` now
carries that idea, and the Home page's "Open slots" is
`SUM(capacity) - COUNT(students)`. The seeder skips any `blank` records.

**`student_no` is stored, not derived.** The old `studentId()` built
`ID126-0003` from the array position, which shifts the moment a record is
deleted. The `Student` model stamps it once on insert and it never moves.

**Filtering moved to SQL.** The Browse controls now send `q`, `year_level`,
`status`, `sort` and `page` to Laravel. `Student::scopeYearLevel()` uses
`whereRelation('section', ...)` so the filter travels through the
relationship instead of duplicating `year_level` onto every student row.

**The whole app requires sign-in.** Every data route sits behind
`auth:sanctum`. If your instructor would rather Browse be public, move the
`stats`, `academics.*` and `students index/show` routes out of the
`auth:sanctum` group and make `viewAny`/`view` in `StudentPolicy` accept
`?User $user`.

---

## Demo video checklist

Requirements 2 through 9 are all covered by one create, so record that as a
single unbroken take:

1. Sign in as `admin@clsu.edu.ph`, show the New record button
2. Fill the form, open DevTools Network before you submit
3. Show the `POST /api/registrar/students` request and its JSON response
4. Show `routes/api.php` -> the `registrar` group
5. Show `StudentController@store` -> `$request->validate()`
6. Show `Student.php` (`$fillable`, `belongsTo`) and the students migration
7. Show the new row in phpMyAdmin
8. Submit again with a blank last name -> the red field error (requirement 9)
9. Pick a full section -> the capacity error, which React could not enforce alone
10. Edit a record, then delete it - watch the row disappear from MySQL
11. Sign out, sign in as `student@clsu.edu.ph`: no New/Edit/Delete buttons.
    Then `DELETE /api/registrar/students/1` in Postman with that token -> 403.
    That is the point to make out loud: the UI hides, the policy enforces.
12. File a favorite as the student, refresh, show it persisted to the account

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| "Unable to reach the server" | `php artisan serve` not running, or `VITE_API_URL` wrong |
| CORS error in console | origin missing from `config/cors.php`, then `php artisan config:clear` |
| 401 on every request | token missing - check `localStorage.sis_token` |
| 403 on edit as staff | correct: that adviser does not own the section |
| Seeder says file missing | `students.json` not copied to `backend/database/data/` |
| `.env` change ignored | restart `npm run dev`; Vite reads env at startup |
