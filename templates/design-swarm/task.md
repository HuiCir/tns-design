# Design Swarm Task

A multi-threaded design project. Each section produces one independent design artifact.
Edit sections to match your own design brief. Keep sections independent so TNS can run
them in parallel.

Global protocol for every section:

- If an Open Design skill is listed, read its SKILL.md from the injected skill profile before acting.
- Read the active design system's DESIGN.md for color/typography tokens.
- Write the output file to the workspace root as a self-contained HTML file.
- Validate HTML: balanced tags, no broken references, no external font/image deps.
- Include used skill names in `skills_used` when reporting.

## Section 1 — SaaS Landing Page

Design a modern SaaS landing page for "[YOUR PRODUCT]" — a [BRIEF DESCRIPTION].
Use the `saas-landing` skill from Open Design with the `stripe` design system.

Requirements:
- Hero section with headline, subheadline, and CTA
- Features grid (4 features)
- Social proof / logos section
- Pricing table (3 tiers)
- Footer with nav links
- Output: `landing.html`

Acceptance criteria:
- File `landing.html` exists and is valid self-contained HTML
- All required sections present
- Uses consistent design system color tokens

Open Design skill: saas-landing
Design system: stripe

## Section 2 — Analytics Dashboard

Design a data analytics dashboard for "[YOUR PRODUCT]".
Use the `dashboard` skill from Open Design with the `linear-app` design system.

Requirements:
- Sidebar navigation with menu items
- KPI stat cards row
- Chart area (SVG/CSS placeholder)
- Activity / data table
- Output: `dashboard.html`

Acceptance criteria:
- File `dashboard.html` exists and is valid self-contained HTML
- Sidebar + KPI cards + chart area + table present
- Uses consistent design system color tokens

Open Design skill: dashboard
Design system: linear-app

## Section 3 — Pitch Deck

Design a 6-slide pitch deck for "[YOUR PRODUCT]".
Use the `html-ppt-pitch-deck` skill from Open Design with your preferred theme.

Requirements:
- Slide 1: Title + tagline
- Slide 2: Problem statement
- Slide 3: Solution overview
- Slide 4: Market opportunity
- Slide 5: Business model + traction
- Slide 6: Team + ask
- Output: `pitch.html`

Acceptance criteria:
- File `pitch.html` exists and is valid self-contained HTML
- 6 distinct slides with presenter mode (press S)
- Consistent theme and typography

Open Design skill: html-ppt-pitch-deck
Theme: minimal-white
