# IEEE ISPA 2026 — Mobile-first Conference Landing Page

A dependency-free promotional website for **IEEE ISPA 2026**, designed as a premium, mobile-first alternative to a dense conference CFP poster.

## Run

No package installation is required.

- Easiest: open `index.html` directly in a modern browser.
- Optional local server: run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## Content structure

The page includes:

- Hero / conference identity
- About ISPA
- Important Dates timeline
- Four expandable Tracks
- Chair / committee category browser with portrait placeholders
- Paper Submission summary and EDAS link
- Publication information
- Four Special Issues
- IEEE AI for Science Congress 2026
- Official sponsor and organizer logos
- Final submission / official-site CTA

## Editing conference content

Most year-specific conference content is centralized in:

`src/data/conference.js`

This keeps the visual code separate from the CFP data and makes future-year updates easier.

## Files

- `index.html` — page shell
- `styles.css` — complete responsive visual system
- `app.js` — rendering and interactions
- `src/data/conference.js` — conference data
- `tests/data.test.cjs` — data integrity tests
- `tests/ui_smoke.py` — browser interaction smoke tests

## Portraits and logos

Chair portraits are deliberately represented by neutral placeholders. Sponsor and organizer logos are sourced from official organization or conference visual-identity materials and are stored in `assets/logos/`.
