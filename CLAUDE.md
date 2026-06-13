# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

No build step required. Open `index.html` directly in a browser, or use the VS Code Live Server extension (right-click `index.html` → "Open with Live Server"). The site is deployed to GitHub Pages at `sathwikap.com` (custom domain via `CNAME`).

## Architecture

This is a **pure static single-page portfolio** — no framework, no bundler, no package manager.

- **`index.html`** — the entire site. All sections (Home, About, Experience, Projects, Skills, Education, Contact) are in this one file. Content changes always happen here.
- **`src/styles.css`** — all styling. The primary brand color is `--green: #2cb9a7` (defined as a CSS custom property at `:root`).
- **`src/script.js`** — jQuery-only; handles the mobile hamburger menu toggle (`.fa-bars` / `.fa-times`).
- **`src/Images/`** — all images referenced inline in `index.html`.

### Layout model

The sidebar (`header`) is `position: fixed; left: 0; width: 35rem` on desktop. The main content has `padding-left: 35rem` on `body` to compensate. At ≤991px the sidebar slides off-screen (`left: -120%`) and a `#menu` hamburger button appears. Breakpoints: 1200px, 991px, 768px, 400px.

### External dependencies (CDN only)

- jQuery 3.6.0
- Font Awesome 5.15.4
- Google Fonts: Poppins + Nunito

No `node_modules`, no lockfile, no local dependencies to install.

## Adding content

- **New project card**: copy an existing `.cards` block inside `.projects .maincards` in `index.html` and drop a matching image in `src/Images/`.
- **New skill icon**: add a `.c` div with `<img>` and `<h8>` inside the relevant `.cards .row` in the Skills section.
- **New experience entry**: add a `.cards` block inside `.experience .maincards`.
