# tns-design

TNS Design Swarm — Open Design skillbase × TNS multi-threaded orchestration.

Generate multiple design artifacts (landing pages, dashboards, pitch decks, mobile prototypes)
in parallel using TNS's swarm executor backed by Open Design's 63+ design skills and 139+
brand design systems.

## Architecture

```
tns-design swarm workspace/
├── task.md                    # Multi-section design brief
├── tns_config.json            # Swarm config (4-thread parallel, OD skillbase)
├── .tns/                      # TNS orchestration state
└── [generated outputs]        # HTML/CSS/PPTX design artifacts
```

Each section maps to one design artifact. TNS compiles sections into an FSM parallel plan,
then executes them concurrently with injected Open Design skills.

## Prerequisites

- Node.js 22+
- `tns` CLI (token-never-sleeps) installed globally
- `claude` CLI in PATH
- [Open Design](https://github.com/nexu-io/open-design) macOS app installed (for the skill library)

## Quickstart

```bash
# Install
npm install -g tns-design

# Create a design swarm workspace
tns-design init --workspace ./my-designs

# Register Open Design skills (one-time per workspace)
tns-design setup

# Compile the parallel orchestration program
cd ./my-designs
tns compile --synthesize --apply

# Run the swarm
tns run --once

# Check results
tns status
ls *.html
```

## What's inside the template

| Component | Purpose |
|-----------|---------|
| `task.md` | 3-section design brief (landing, dashboard, pitch deck) |
| `tns_config.json` | 4-thread swarm config with OD skillbase source |
| `scripts/verify_designs.js` | Validates generated HTML output |
| Injections | OD skills pre-loaded in executor_task profile |

## Design skills available

The Open Design skillbase provides 61+ skills including:

- **Pages**: `web-prototype`, `saas-landing`, `pricing-page`, `docs-page`, `dashboard`
- **Mobile**: `mobile-app`, `mobile-onboarding`, `gamified-app`
- **PPT**: `html-ppt` (36 themes, presenter mode), `html-ppt-pitch-deck`, `simple-deck`
- **Media**: `image-poster`, `social-carousel`, `video-shortform`, `hyperframes`
- **Docs**: `blog-post`, `email-marketing`, `finance-report`, `meeting-notes`

Set `externals.skills` in `tns_config.json` and add skills to `injections.profiles.executor_task.skills`
to declare which skills each section needs.

## Swarm configuration

Key settings in `tns_config.json`:

```json
{
  "threads": 4,
  "program": {
    "parallel": { "mode": "auto", "max_threads": 4 }
  },
  "skillbases": {
    "sources": [{
      "id": "open-design",
      "path": "/Applications/Open Design.app/Contents/Resources/open-design/skills",
      "kind": "skills_dir",
      "priority": 50
    }]
  },
  "injections": {
    "profiles": {
      "executor_task": {
        "skills": ["saas-landing", "dashboard", "html-ppt-pitch-deck"]
      }
    }
  }
}
```

Adjust `threads` and `max_threads` to match your section count for full parallelism.

## License

MIT
