# sathwikaparshaboina.github.io

Personal portfolio for **Sathwika Parshaboina** — AI Software Engineer.

Live at **[sathwikap.com](https://sathwikap.com)**.

## About

A single-page portfolio built as pure static HTML, CSS, and JavaScript —
no framework, no bundler, no package manager. Open `index.html` in a
browser and it runs.

## Sections

* **Hero** — introduction, headline, and key metrics
* **Capabilities** — six areas of AI and backend engineering
* **Projects** — four systems, each linking to a live deployment
* **Contact** — a validated message form

## Projects

| Project | Live |
|---|---|
| AI Financial Intelligence Platform | [fintel-case-study](https://fintel-case-study.onrender.com) |
| Real-Time Voice AI Agent | [voice-reservation-agent](https://voice-reservation-agent.onrender.com/) |
| LLM Fine-Tuning | [mixtral-qlora-console](https://mixtral-qlora-console.onrender.com/) |
| Insurance Cost Estimator | [insurance-cost-estimator](https://insurance-cost-estimator-j5cg.onrender.com) |

## Structure

```
index.html        the entire page — all sections live here
src/styles.css    all styling
src/main.js       animation, scroll, and form logic
src/Images/       portrait and social preview image
```

## Dependencies

Loaded from CDN, nothing installed locally:

* [GSAP](https://gsap.com/) 3.12.5 + ScrollTrigger — reveal animations
* [Lenis](https://lenis.darkroom.engineering/) 1.1.14 — smooth scrolling
* Google Fonts — Instrument Sans, Inter, JetBrains Mono

The page renders fully without JavaScript; the animations are progressive
enhancement, and `prefers-reduced-motion` is respected.

## Development

No build step. Serve the folder and open it:

```bash
python3 -m http.server 5173
```

Then visit <http://127.0.0.1:5173>.

## Deploying

Pushing to `main` publishes to GitHub Pages (custom domain via `CNAME`).

`index.html` loads `src/styles.css?v=2` and `src/main.js?v=2`. **Bump that
version number whenever you change the CSS or JS**, otherwise returning
visitors keep getting the cached copy.
