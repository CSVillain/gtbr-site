# GTBR Site

Static GTBR portfolio site.

## Stack

- HTML (`index.html`)
- CSS (`base.css`)
- JavaScript (`main.js`)

No framework build step is required for the current web site.

## Project Structure

- `index.html`: page structure and section anchors
- `base.css`: global styling, layout, animations, and component styles
- `main.js`: interaction logic, animated effects, and data-driven project cards

## Projects Section (Data-Driven)

Project cards are rendered from `PROJECTS` in `main.js`, not hardcoded in `index.html`.

Update these in `main.js`:

- `PROJECTS`: card content (title, status, summary, objectives, milestones, stack)
- `PROJECT_STACK_ICONS`: SVG icon map used by stack items

Icon colouring is controlled in `base.css` via `.stack-icon-*` classes.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static file server.

Example (PowerShell with Python installed):

```powershell
python -m http.server 4173
```

Then visit `http://127.0.0.1:4173`.

## Editing Notes

- Keep British English in copy.
- Keep project status labels aligned with `data-stage` values:
  - `design`
  - `dev`
  - `prod`
  - `concept`
- After JS edits, run:

```powershell
node --check main.js
```
