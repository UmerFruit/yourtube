import { Pool } from 'pg';
import logger from './logger';

logger.info('Initializing Postgres pool');

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'youtube',
  password: process.env.POSTGRES_PASSWORD || 'youtube',
  database: process.env.POSTGRES_DB || 'youtube_history',
});

pool.on('connect', () => logger.info('Postgres pool connected'));
pool.on('error', (err: any) => logger.error({ err: err.message, stack: err.stack }, 'Postgres pool error'));

logger.info({ host: process.env.POSTGRES_HOST || 'localhost', db: process.env.POSTGRES_DB || 'youtube_history' }, 'Postgres pool created');

export interface WatchHistoryRow {
  id: string;
  video_id: string;
  video_title: string;
  video_url: string | null;
  channel_id: string | null;
  channel_name: string;
  channel_url: string | null;
  watched_at: string;
  created_at: string;
}

export type HistoryError =
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export interface ChannelStat {
  name: string;
  channel_url: string | null;
  count: number;
  firstWatchedAt: string;
  lastWatchedAt: string;
  firstVideo: { title: string; url: string | null; watchedAt: string } | null;
}

export interface TimelineBucket {
  label: string;
  date: string;
  count: number;
}

export interface ChannelLink {
  from: string;
  to: string;
  weight: number;
}

export interface ConnectionGraph {
  channels: { name: string; count: number }[];
  links: ChannelLink[];
}

export interface DiscoveryFacts {
  totalVideos: number;
  totalChannels: number;
  earliestWatch: WatchHistoryRow | null;
  latestWatch: WatchHistoryRow | null;
  topChannel: ChannelStat | null;
  singleWatchChannels: ChannelStat[];
  firstVideoFromTopChannel: WatchHistoryRow | null;
}

export interface AllHistory {
  rows: WatchHistoryRow[];
  channels: ChannelStat[];
  timeline: TimelineBucket[];
  connections: ConnectionGraph;
  facts: DiscoveryFacts;
}
