'use client';
import { useEffect, useState } from 'react';

export default function GapPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Finding gap...</div>;

  const rows = data.rows || [];
  if (rows.length < 2) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Not enough history to find a gap.</div>;

  const sorted = [...rows].filter((r:any) => r.watched_at).sort((a,b) => new Date(a.watched_at).getTime() - new Date(b.watched_at).getTime());
  let maxGapMs = 0;
  let gapBefore = null;
  for (let i = 1; i < sorted.length; i++) {
    const gap = new Date(sorted[i].watched_at).getTime() - new Date(sorted[i-1].watched_at).getTime();
    if (gap > maxGapMs) { maxGapMs = gap; gapBefore = sorted[i-1]; }
  }
  const gapDays = Math.round(maxGapMs / (1000 * 60 * 60 * 24));

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">What did I miss?</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">The longest silence in your archive</p>
        <div className="mt-20 space-y-8">
          <div className="rounded-3xl bg-[#1C131C] border border-[#231E1A] p-10 md:p-16 space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A]">Longest gap</p>
            <h2 className="font-display text-6xl md:text-8xl tracking-tight text-[#8A5A3A]">{gapDays} day{gapDays > 1 ? 's' : ''}</h2>
            <p className="text-lg text-[#C0B0A0]">Then you came back with:</p>
            <a href={(gapBefore ? sorted[sorted.indexOf(gapBefore) + 1] : sorted[sorted.length-1])?.video_url || '#'} className="block rounded-xl bg-[#140E14] border border-[#231E1A] p-6 hover:border-[#8A5A3A]/40 transition-colors">
              <p className="font-display text-2xl">{(gapBefore ? sorted[sorted.indexOf(gapBefore) + 1] : sorted[sorted.length-1])?.video_title}</p>
              <p className="text-sm text-[#C0B0A0] mt-2">{(gapBefore ? sorted[sorted.indexOf(gapBefore) + 1] : sorted[sorted.length-1])?.channel_name}</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
