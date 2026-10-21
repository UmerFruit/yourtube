# Yourtube

Your personal YouTube watch history — turned into an interactive archive.

## What it does

Imports your `watch_history.csv` (from Google Takeout) into a local Postgres database, then lets you explore it through reflective, editorial views:

- **Day Journey** — Pick a day, see the sequence of channels you hopped between
- **First Encounters** — When you first discovered your favorite channels
- **Filter** — Search videos by word or channel
- **Trends** — Monthly attention bars
- **Memory** — A random moment from your archive
- **Strangers** — Channels you watched once and never returned to
- **Constellation** — Channel hop graph across your full history
- **What did I miss?** — The longest gap in your viewing, and what broke the silence

## Stack

- Next.js 13 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- PostgreSQL (via `pg`)
- Recharts (trends)

## Setup

```bash
# 1. Clone
git clone <repo>
cd yourtube

# 2. Install
npm install

# 3. Configure database (Postgres)
cp .env.example .env
# Edit .env with your Postgres credentials

# 4. Start Postgres (if not running)
docker compose up -d

# 5. Export your YouTube history from Google Takeout
#    - Go to https://takeout.google.com
#    - Select "YouTube and YouTube Music" → "History"
#    - Download and unzip; you'll get `watch-history.html`

# 6. Place the HTML in utils/history/
cp path/to/watch-history.html utils/history/

# 7. Parse HTML → CSV/JSON
pip install beautifulsoup4 lxml tqdm
python utils/history_parser.py
# Output: utils/parsed/watch_history.csv + .json

# 8. Import into Postgres
pip install psycopg2
python utils/import_data.py
# (or: npm run import — if you add a script)

# 9. Run dev server
npm run dev
```

## Environment

Create `.env` with:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=youtube
POSTGRES_PASSWORD=youtube
POSTGRES_DB=youtube_history
```

## Data privacy

- Your watch history never leaves your machine
- No external APIs, no tracking
- `.gitignore` excludes `watch_history.csv`, `.env`, and any data dumps

## Design

Locked "film" palette — no design changes needed:
- Background: `#140E14`, `#1C131C`
- Cream text: `#F0EBD8`
- Subtle: `#C0B0A0`
- Accent: `#8A5A3A` (terracotta)
- Display: Playfair Display serif
- Body: system sans-serif

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/explore` | Feature index |
| `/explore/day` | Day Journey |
| `/explore/first` | First Encounters |
| `/explore/filter` | Filter |
| `/explore/trends` | Trends |
| `/explore/memory` | Memory |
| `/explore/strangers` | Strangers |
| `/explore/constellation` | Constellation |
| `/explore/gap` | What did I miss? |

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # production server
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```