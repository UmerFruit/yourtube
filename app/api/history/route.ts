import { Pool } from 'pg';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'youtube',
  password: process.env.POSTGRES_PASSWORD || 'youtube',
  database: process.env.POSTGRES_DB || 'youtube_history',
});

export async function GET() {
  logger.info({ method: 'GET', endpoint: '/api/history' }, 'API request received');
  logger.info('DB query started: SELECT * FROM watch_history');
  try {
    const result = await pool.query(
      'SELECT * FROM watch_history ORDER BY watched_at ASC'
    );
    logger.info({ count: result.rowCount, rowSampleCount: Math.min(result.rows.length, 3) }, 'DB query completed');
    logger.info({ rowCount: result.rows.length }, 'Returning rows to client');
    return NextResponse.json({ rows: result.rows });
  } catch (e: any) {
    logger.error({ err: e.message, stack: e.stack, status: 500 }, 'DB connection/query failed');
    logger.info({ status: 500 }, 'Returning error response');
    return NextResponse.json(
      { error: { kind: 'error', message: e.message || 'DB connection failed' } },
      { status: 500 }
    );
  }
}
