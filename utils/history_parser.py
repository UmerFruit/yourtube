"""Parse YouTube watch history HTML into CSV/JSON for analysis."""

import csv
import json
import re
from datetime import datetime
from pathlib import Path

from bs4 import BeautifulSoup
from tqdm import tqdm


def parse_watch_history(html_path: str) -> list[dict]:
    """Extract watch history entries from YouTube's HTML export."""
    print(f"Loading HTML file...")
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    cells = soup.find_all("div", class_="outer-cell")
    entries = []

    for cell in tqdm(cells, desc="Parsing entries", unit="entry"):
        content = cell.find(
            "div",
            class_=lambda x: (
                x and "content-cell" in x and "mdl-typography--body-1" in x
            ),
        )
        if not content:
            continue

        text = content.get_text(separator=" ", strip=True)

        # Skip non-watch entries (posts, etc.)
        if not text.startswith("Watched"):
            continue

        # Extract video title and URL
        video_link = content.find("a", href=re.compile(r"youtube\.com/watch\?v="))
        if not video_link:
            continue

        video_title = video_link.get_text(strip=True)
        video_url = video_link["href"]
        video_id = re.search(r"v=([^&]+)", video_url)
        video_id = video_id.group(1) if video_id else None

        # Extract channel name and URL
        channel_link = content.find("a", href=re.compile(r"youtube\.com/channel/"))
        channel_name = channel_link.get_text(strip=True) if channel_link else None
        channel_url = channel_link["href"] if channel_link else None
        channel_id = (
            re.search(r"channel/([^/?]+)", channel_url) if channel_url else None
        )
        channel_id = channel_id.group(1) if channel_id else None

        # Extract timestamp (format: "11 Oct 2026, 19:07:33 PKT")
        time_match = re.search(r"(\d{1,2} \w{3} \d{4}, \d{2}:\d{2}:\d{2} \w+)", text)
        watched_at = None
        if time_match:
            try:
                watched_at = datetime.strptime(
                    time_match.group(1), "%d %b %Y, %H:%M:%S %Z"
                )
            except ValueError:
                # Try without timezone
                try:
                    watched_at = datetime.strptime(
                        time_match.group(1).rsplit(" ", 1)[0], "%d %b %Y, %H:%M:%S"
                    )
                except ValueError:
                    pass

        entries.append(
            {
                "video_id": video_id,
                "video_title": video_title,
                "video_url": video_url,
                "channel_id": channel_id,
                "channel_name": channel_name,
                "channel_url": channel_url,
                "watched_at": watched_at.isoformat() if watched_at else None,
            }
        )

    return entries


def main():
    html_path = Path(__file__).parent / "history" / "watch-history.html"
    output_dir = Path(__file__).parent / "parsed"
    output_dir.mkdir(exist_ok=True)

    print(f"Parsing {html_path}...")
    entries = parse_watch_history(str(html_path))
    print(f"Found {len(entries)} watch entries")

    # Save as JSON
    json_path = output_dir / "watch_history.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    print(f"Saved JSON to {json_path}")

    # Save as CSV
    csv_path = output_dir / "watch_history.csv"
    if entries:
        fieldnames = list(entries[0].keys())
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(entries)
        print(f"Saved CSV to {csv_path}")

    # Quick stats
    unique_channels = len(set(e["channel_name"] for e in entries if e["channel_name"]))
    date_range = [e["watched_at"] for e in entries if e["watched_at"]]
    if date_range:
        print(f"Date range: {min(date_range)} to {max(date_range)}")
    print(f"Unique channels: {unique_channels}")


if __name__ == "__main__":
    main()
