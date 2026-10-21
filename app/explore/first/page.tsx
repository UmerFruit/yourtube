'use client';
import { useEffect, useState } from 'react';

export default function FirstEncounterPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading encounters...</div>;

  const rows = data.rows || [];
  const channels = new Map();
  rows.forEach((r: any) => {
    if (!channels.has(r.channel_name)) channels.set(r.channel_name, { first: r, count: 0 });
    const c = channels.get(r.channel_name);
    c.count++;
    if (r.watched_at && (!c.first?.watched_at || new Date(r.watched_at) < new Date(c.first.watched_at))) c.first = r;
  });
  const favorites = [...channels.values()].filter(c => c.count > 2).sort((a,b) => b.count - a.count).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">First Encounters</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">When you first met your favorite channels</p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((c: any) => (
            <a key={c.first.channel_name} href={c.first.channel_url || '#'} className="group block rounded-2xl bg-[#1C131C] border border-[#231E1A] p-8 hover:border-[#8A5A3A]/40 transition-colors">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A]">Discovered</p>
              <h3 className="mt-3 font-display text-2xl leading-tight">{c.first.channel_name}</h3>
              <p className="mt-2 text-sm text-[#C0B0A0]">First watched: <span className="text-[#F0EBD8]">{c.first?.watched_at ? new Date(c.first.watched_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Unknown'}</span></p>
              <p className="mt-3 text-sm text-[#F0EBD8]">First video: <span className="italic text-[#C0B0A0]">{c.first.video_title}</span></p>
              <p className="mt-4 text-xs text-[#8A5A3A]">Returned {c.count} time{c.count > 1 ? 's' : ''}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
