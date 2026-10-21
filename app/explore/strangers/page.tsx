'use client';
import { useEffect, useState } from 'react';

export default function StrangersPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading strangers...</div>;

  const rows = data.rows || [];
  const counts = new Map();
  rows.forEach((r: any) => counts.set(r.channel_name, (counts.get(r.channel_name) || 0) + 1));
  const strangers = [...counts.entries()].filter(([_, c]) => c === 1).map(([name]) => {
    const row = rows.find((r: any) => r.channel_name === name && r.watched_at);
    return { name, row };
  }).sort((a,b) => {
    const ta = a.row?.watched_at ? new Date(a.row.watched_at).getTime() : 0;
    const tb = b.row?.watched_at ? new Date(b.row.watched_at).getTime() : 0;
    return ta - tb;
  });

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Strangers</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">Channels you met once and never returned to</p>
        <div className="mt-16 space-y-3">
          {strangers.map((s: any) => (
            <a key={s.name} href={s.row?.video_url || '#'} className="block rounded-xl bg-[#1C131C] border border-[#231E1A] p-6 hover:border-[#8A5A3A]/40 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-xl">{s.name}</p>
                  <p className="text-sm text-[#C0B0A0] mt-1">{s.row?.video_title}</p>
                </div>
                <span className="text-xs text-[#8A5A3A] whitespace-nowrap">{s.row?.watched_at ? new Date(s.row.watched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Unknown'}</span>
              </div>
            </a>
          ))}
          {strangers.length === 0 && <p className="text-[#C0B0A0]">No strangers found — every channel has been revisited.</p>}
        </div>
      </div>
    </main>
  );
}
