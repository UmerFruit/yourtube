'use client';
import { useEffect, useState } from 'react';

export default function TrendsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading trends...</div>;

  const rows = data.rows || [];
  const byMonth = new Map();
  rows.forEach((r: any) => {
    if (!r.watched_at) return;
    const d = new Date(r.watched_at);
    const k = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2,'0')}`;
    byMonth.set(k, (byMonth.get(k) || 0) + 1);
  });
  const sorted = [...byMonth.entries()].sort((a,b) => a[0].localeCompare(b[0]));

  const max = Math.max(...sorted.map(s => s[1]));

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Trends</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">How your attention moved over time</p>
        <div className="mt-16 space-y-6">
          {sorted.map(([month, count]) => {
            const pct = Math.round((count / max) * 100) || 1;
            return (
              <div key={month} className="flex items-end gap-4">
                <div className="w-24 text-xs text-[#8A5A3A] uppercase tracking-wider">{month}</div>
                <div className="flex-1 h-8 bg-[#1C131C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8A5A3A]/80 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-12 text-right text-sm text-[#C0B0A0]">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
