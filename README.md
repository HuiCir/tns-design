# tns-design

Open Design × TNS multi-threaded design swarm. Clone and run.

## Example Outputs

### Dashboard (dashboard.html)
![Dashboard](example/dashboard.png)

### SaaS Landing (landing.html)
![Landing](example/business.png)

### Pitch Deck (pitch.html)
![Pitch Deck](example/ppt-combined.png)

### Dashboard Report
![Report](example/report.png)

## Quickstart

```bash
git clone https://github.com/HuiCir/tns-design.git ./my-designs
cd ./my-designs

# Register Open Design skills as a TNS skillbase source
tns skill source-add \
  --path "/Applications/Open Design.app/Contents/Resources/open-design/skills" \
  --id "open-design" \
  --kind "skills_dir" \
  --priority 50

# Compile the parallel orchestration program
tns compile --synthesize --apply

# Run the swarm (3 sections × 4 threads)
tns run --once

# Check results
tns status
ls *.html
```

## How It Works

```
task.md                    →  3 independent design sections
tns_config.json            →  4-thread swarm + OD skill injection
tns compile --apply        →  FSM parallel plan (all sections in one batch)
tns run --once             →  3 executors run concurrently, each with OD skills
```

Each section maps to one design artifact:
- **Section 1** → landing.html (saas-landing skill)
- **Section 2** → dashboard.html (dashboard skill)  
- **Section 3** → pitch.html (html-ppt-pitch-deck skill, press S for presenter mode)

## Prerequisites

- Node.js 22+, `tns` CLI, `claude` CLI
- [Open Design](https://github.com/nexu-io/open-design) macOS app

## Customization

Edit `task.md` sections with your own product brief, then edit `tns_config.json`:
- `threads` / `parallel.max_threads` — match your section count
- `injections.profiles.executor_task.skills` — add the OD skills you need
- `externals.skills` — declare required skills per section

## License

MIT
