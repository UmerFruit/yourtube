import logger from './logger';
import {
  type WatchHistoryRow,
  type AllHistory,
  type ChannelStat,
  type TimelineBucket,
  type ConnectionGraph,
  type DiscoveryFacts,
  type HistoryError,
  type ChannelLink,
} from './database';

export async function fetchHistory(): Promise<{ data: AllHistory | null; error: HistoryError | null }> {
  logger.info('fetchHistory called');
  try {
    const res = await fetch('/api/history', { cache: 'no-store' });
    if (!res.ok) {
      const err = await res.json();
      return { data: null, error: { kind: 'error', message: err.error?.message || 'Failed to load history' } };
    }
    const payload = await res.json();
    const rows: WatchHistoryRow[] = (payload.rows || []).slice(0, 5);
    if (rows.length === 0) {
      return { data: null, error: { kind: 'empty' } };
    }
    const channels = buildChannelStats(rows);
    const timeline = buildTimeline(rows);
    const connections = buildConnections(rows);
    const facts = buildFacts(rows, channels);
    logger.info({ totalVideos: rows.length, totalChannels: channels.length }, 'History data built');
    return { data: { rows, channels, timeline, connections, facts }, error: null };
  } catch (e: any) {
    logger.error({ err: e.message, stack: e.stack }, 'fetchHistory failed');
    return { data: null, error: { kind: 'error', message: e.message || 'Network error' } };
  }
}

function buildChannelStats(rows: WatchHistoryRow[]): ChannelStat[] {
  logger.info({ rowCount: rows.length }, 'buildChannelStats started');
  const map = new Map<string, ChannelStat>();
  for (const r of rows) {
    const key = r.channel_name;
    let stat = map.get(key);
    if (!stat) {
      stat = {
        name: r.channel_name,
        channel_url: r.channel_url,
        count: 0,
        firstWatchedAt: r.watched_at,
        lastWatchedAt: r.watched_at,
        firstVideo: null,
      };
      map.set(key, stat);
    }
    stat.count += 1;
    if (r.watched_at < stat.firstWatchedAt) {
      stat.firstWatchedAt = r.watched_at;
      stat.firstVideo = { title: r.video_title, url: r.video_url, watchedAt: r.watched_at };
    }
    if (r.watched_at > stat.lastWatchedAt) {
      stat.lastWatchedAt = r.watched_at;
    }
  }
  for (const stat of map.values()) {
    if (!stat.firstVideo) {
      const first = rows.find(
        (r) => r.channel_name === stat.name && r.watched_at === stat.firstWatchedAt
      );
      if (first) {
        stat.firstVideo = { title: first.video_title, url: first.video_url, watchedAt: first.watched_at };
      }
    }
  }
  const result = [...map.values()].sort((a, b) => b.count - a.count);
  logger.info({ channelCount: result.length }, 'buildChannelStats completed');
  return result;
}

function buildTimeline(rows: WatchHistoryRow[]): TimelineBucket[] {
  logger.info({ rowCount: rows.length }, 'buildTimeline started');
  const byDay = new Map<string, number>();
  for (const r of rows) {
    const d = new Date(r.watched_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const keys = [...byDay.keys()].sort();
  if (keys.length === 0) return [];
  const start = new Date(keys[0] + 'T00:00:00Z');
  const end = new Date(keys[keys.length - 1] + 'T00:00:00Z');
  const buckets: TimelineBucket[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}-${String(cursor.getUTCDate()).padStart(2, '0')}`;
    const label = cursor.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    buckets.push({ label, date: key, count: byDay.get(key) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  logger.info({ bucketCount: buckets.length }, 'buildTimeline completed');
  return buckets;
}

function buildConnections(rows: WatchHistoryRow[]): ConnectionGraph {
  logger.info({ rowCount: rows.length }, 'buildConnections started');
  const sorted = [...rows].sort((a, b) => (a.watched_at ?? '').localeCompare(b.watched_at ?? ''));
  const links = new Map<string, ChannelLink>();
  const counts = new Map<string, number>();
  let prev: string | null = null;
  for (const r of sorted) {
    counts.set(r.channel_name, (counts.get(r.channel_name) ?? 0) + 1);
    if (prev && prev !== r.channel_name) {
      const k = `${prev}\u0001${r.channel_name}`;
      const existing = links.get(k);
      if (existing) existing.weight += 1;
      else links.set(k, { from: prev, to: r.channel_name, weight: 1 });
    }
    prev = r.channel_name;
  }
  const channels = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const result = { channels, links: [...links.values()].sort((a, b) => b.weight - a.weight) };
  logger.info({ linkCount: result.links.length, channelCount: result.channels.length }, 'buildConnections completed');
  return result;
}

function buildFacts(rows: WatchHistoryRow[], channels: ChannelStat[]): DiscoveryFacts {
  logger.info({ rowCount: rows.length, channelCount: channels.length }, 'buildFacts started');
  const sorted = [...rows].sort((a, b) => (a.watched_at ?? '').localeCompare(b.watched_at ?? ''));
  const singleWatchChannels = channels.filter((c) => c.count === 1);
  const topChannel = channels[0] ?? null;
  const firstVideoFromTopChannel = topChannel
    ? sorted.find((r) => r.channel_name === topChannel.name) ?? null
    : null;
  const result = {
    totalVideos: rows.length,
    totalChannels: channels.length,
    earliestWatch: sorted[0] ?? null,
    latestWatch: sorted[sorted.length - 1] ?? null,
    topChannel,
    singleWatchChannels,
    firstVideoFromTopChannel,
  };
  logger.info({ totalVideos: result.totalVideos, totalChannels: result.totalChannels }, 'buildFacts completed');
  return result;
}

export function formatDate(iso: string): string {
  logger.debug({ iso }, 'formatDate called');
  if (!iso || iso === 'null' || iso === '') return 'Unknown date';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Unknown date';
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatDateShort(iso: string): string {
  logger.debug({ iso }, 'formatDateShort called');
  if (!iso || iso === 'null' || iso === '') return 'Unknown';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function formatTime(iso: string): string {
  logger.debug({ iso }, 'formatTime called');
  if (!iso || iso === 'null' || iso === '') return '--';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '--';
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
}
