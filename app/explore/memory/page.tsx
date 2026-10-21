'use client';
import { useEffect, useState } from 'react';

export default function MemoryPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading memory...</div>;

  const rows = data.rows || [];
  const randomRow = rows[Math.floor(Math.random() * rows.length)] || rows[0];

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Random Memory</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">A single moment from your archive</p>
        <div className="mt-20 rounded-3xl bg-[#1C131C] border border-[#231E1A] p-10 md:p-16 text-center space-y-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A]">{randomRow?.watched_at ? new Date(randomRow.watched_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Unknown date'}</p>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">{randomRow?.video_title}</h2>
          <p className="text-xl text-[#C0B0A0]">{randomRow?.channel_name}</p>
          <a href={randomRow?.video_url || '#'} className="inline-block mt-6 rounded-full bg-[#8A5A3A] px-8 py-3 text-sm font-medium text-[#F0EBD8] hover:bg-[#A85D3A] transition-colors">Watch again</a>
        </div>
      </div>
    </main>
  );
}
