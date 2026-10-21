import csv

import psycopg2

DB_PARAMS = {
    "host": "localhost",
    "port": 5432,
    "dbname": "youtube_history",
    "user": "youtube",
    "password": "youtube",
}


def main():
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    with open("parsed/watch_history.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:

            def clean(v):
                if v is None:
                    return None
                v = v.strip()
                return v if v != "" else None

            cur.execute(
                "INSERT INTO watch_history (video_id, video_title, video_url, channel_id, channel_name, channel_url, watched_at) VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT (video_id) DO NOTHING",
                (
                    clean(row.get("video_id")),
                    clean(row.get("video_title")),
                    clean(row.get("video_url")),
                    clean(row.get("channel_id")),
                    clean(row.get("channel_name")),
                    clean(row.get("channel_url")),
                    clean(row.get("watched_at")),
                ),
            )
    conn.commit()
    cur.close()
    conn.close()
    print("Import complete.")


if __name__ == "__main__":
    main()
