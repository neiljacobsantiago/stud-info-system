# Student Information System

INTECH 3112 First and Second Term Project - a responsive dashboard built with
React, Tailwind CSS, and the Fetch API. Every record is a fictional BSIT
student, each given a Student ID the way DLSU or CLSU would: the ID encodes
the year they enrolled.

## Getting started

You'll need [Node.js](https://nodejs.org/) 18 or later installed.

```bash
npm install
npm run dev
```

Then open the URL Vite prints in the terminal (usually `http://localhost:5173`).

## The data

All 35 records live in `public/students.json` and load with `fetch()` at
runtime - self-created data instead of a third-party API, which the project
brief explicitly allows.

- **30 generic students** - all BSIT, spread across 1st to 4th year, with a
  section, hometown, and short bio each
- **5 blank slots** - marked `"category": "blank"`. Fill in `firstName`,
  `lastName`, `yearLevel`, `section`, `hometown`, `enrollmentYear`, and
  `bio`, then set `"category"` to `"active"`.

**Student ID format:** `ID1` + last two digits of the enrollment year + a
zero-padded sequence number, e.g. a student who enrolled in 2026 with
record id 3 -> `ID126-0003`. This is computed in
`src/utils/studentStyling.js` from the `enrollmentYear` and `id` fields -
no need to store it in the JSON.

Card accent colors are keyed by year level in that same file; an unlisted
year level just falls back to a neutral grey.

## Project structure

```
public/
└── students.json    The dataset - fetched at runtime
src/
├── components/      Reusable UI pieces (Navbar, StudentCard, SearchBar, ...)
├── pages/           The three main views (Home, Browse, About)
├── hooks/           useStudents.js - the fetch/loading/error logic
├── utils/           studentStyling.js - year-level colors, initials, Student ID
├── App.jsx          Owns navigation state and the data
├── main.jsx         React entry point
└── index.css        Tailwind entry point
```

## How it meets the project requirements

- **React** - functional components throughout; `useState` for navigation
  and filters; `useEffect` for the initial fetch; props passed between
  every page and component; event handlers on every button, input, and
  select.
- **Tailwind CSS** - responsive grid/flex layouts, a custom color and type
  theme, cards, buttons, form controls, and a responsive nav bar that
  collapses to a hamburger menu on small screens.
- **Fetch API** - `src/hooks/useStudents.js` calls `fetch()` against
  `/students.json`, with no full-page reload.
- **Navigation** - Home, Browse, and About, switched via state
  in `App.jsx`.
- **Data display** - records shown as cards, with a detail modal for the
  full record.
- **Search / filtering** - live search by name or hometown, plus year
  level and status filters, sorting, and pagination on the Browse page.
- **Error handling** - a dedicated error state with a "Try again" button
  if the fetch fails.
- **Responsive design** - laid out with `sm:` / `md:` / `lg:` breakpoints.
- **Reusable components** - `StudentCard`, `SearchBar`, `Loading`, and
  `Footer` are each used from more than one page.

## Notes

- No API key or backend setup is required.
