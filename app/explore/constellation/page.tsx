'use client';
import { useEffect, useState } from 'react';

export default function ConstellationPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch('/api/history').then(r => r.json()).then(d => setData(d)); }, []);
  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading constellation...</div>;

  const rows = data.rows || [];
  const sorted = [...rows].sort((a,b) => (a.watched_at ?? '').localeCompare(b.watched_at ?? ''));
  const links = new Map();
  let prev = '';
  sorted.forEach((r: any) => {
    if (prev && prev !== r.channel_name) {
      const k = `${prev} -> ${r.channel_name}`;
      links.set(k, (links.get(k) || 0) + 1);
    }
    prev = r.channel_name;
  });
  const sortedLinks = [...links.entries()].sort((a,b) => b[1] - a[1]);

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Constellation</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">Channel hops across your history</p>
        <div className="mt-16 flex flex-wrap gap-3">
          {sortedLinks.map(([hop, weight]) => (
            <span key={hop} className="inline-flex items-center gap-2 rounded-full bg-[#1C131C] border border-[#231E1A] px-5 py-3 text-sm text-[#C0B0A0] hover:border-[#8A5A3A]/50 transition-colors">
              <span>{hop}</span>
              <span className="text-[#8A5A3A] text-xs">×{weight}</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
