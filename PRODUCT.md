# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 + React 18 + TypeScript + Tailwind CSS + database

## Users

People exploring their personal YouTube watch history. They want to see patterns, connections, and memories in their viewing behavior.

## Product Purpose

Yourtube turns a linear list of watched videos into an interactive archive that reveals which channels you returned to, the strangers you met once, and how your attention moved over time.

## Positioning

The archive is a story, not a spreadsheet. It treats viewing history as personal memory.

## Operating Context

Web browser, desktop-first but responsive. User has imported their `watch_history.csv` into a database database via the import script.

## Capabilities and Constraints

- Reads from `/api/history` (database)
- Components: Hero, ChannelsView, TimeView, ConnectionsView, FilterPills, ThemeSwitcher
- Routes: `/` (Archive Scroll), `/explore` (Split Explorer prototype), `/layout/split`, `/layout/mosaic`, `/layout/timeline` (planned)
- Design must work with existing data schema (`AllHistory`, `ConnectionGraph`, `Timeline`, `Channels`)
- CSS variables (`--cream`, `--sand`, `--terracotta`, `--teal`, `--amber`, `--ink`, `--subtle`) control the current palette

## Brand Commitments

Product name: Yourtube. Voice: personal, reflective, editorial. The user explicitly rejected the current warm archive design and wants a fresh, beautiful visual world.

## Evidence on Hand

- `yourtube/app/page.tsx` — current archive scroll
- `yourtube/app/explore/page.tsx` — split explorer prototype
- `yourtube/components/history/` — data views
- `yourtube/app/globals.css` — D theme (`film`) variables

## Product Principles

1. Personal history is worth exploring slowly.
2. Connections between channels tell a story.
3. The interface should feel like discovering a memory, not analyzing a dataset.

## Accessibility & Inclusion

Web. Must maintain readable contrast, keyboard navigation, and responsive layout.
