'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FilterPage() {
  const params = useSearchParams();
  const qParam = params.get('q') || '';
  const chParam = params.get('channel') || '';

  const [data, setData] = useState<any>(null);
  const [q, setQ] = useState(qParam);
  const [channel, setChannel] = useState(chParam);

  if (!data) {
    fetch('/api/history').then(r => r.json()).then(d => setData(d));
  }

  const rows = data?.rows || [];
  const filtered = useMemo(() => {
    return rows.filter((r: any) => {
      const matchQ = !q || r.video_title?.toLowerCase().includes(q.toLowerCase()) || r.channel_name?.toLowerCase().includes(q.toLowerCase());
      const matchCh = !channel || r.channel_name?.toLowerCase() === channel.toLowerCase();
      return matchQ && matchCh;
    });
  }, [rows, q, channel]);

  const allChannels = useMemo(() => {
    const set = new Set(rows.map((r: any) => r.channel_name));
    return [...set].sort();
  }, [rows]);

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-[0.85]">Filter</h1>
        <p className="mt-6 text-[#C0B0A0]">Find videos by word or channel</p>

        <form className="mt-12 flex flex-wrap gap-4" onSubmit={e => { e.preventDefault(); window.history.pushState({}, '', `?q=${encodeURIComponent(q)}&channel=${encodeURIComponent(channel)}`); }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search words..." className="flex-1 min-w-[16rem] rounded-full bg-[#1C131C] border border-[#231E1A] px-6 py-3 text-sm text-[#F0EBD8] placeholder:text-[#8A5A3A]/60 focus:outline-none focus:border-[#8A5A3A]/60" />
          <select value={channel} onChange={e => setChannel(e.target.value)} className="rounded-full bg-[#1C131C] border border-[#231E1A] px-6 py-3 text-sm text-[#F0EBD8] focus:outline-none focus:border-[#8A5A3A]/60">
            <option value="">Any channel</option>
            {allChannels.map((ch: any) => <option key={ch as string} value={ch as string}>{ch as string}</option>)}
          </select>
        </form>

        <div className="mt-10 space-y-3">
          {filtered.map((r: any) => (
            <a key={r.id} href={r.video_url || '#'} className="block rounded-xl bg-[#1C131C] border border-[#231E1A] p-5 hover:border-[#8A5A3A]/40 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-lg">{r.video_title}</p>
                  <p className="text-xs text-[#8A5A3A] mt-1">{r.channel_name}</p>
                </div>
                <span className="text-xs text-[#C0B0A0] whitespace-nowrap">{r.watched_at ? new Date(r.watched_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '--'}</span>
              </div>
            </a>
          ))}
          {filtered.length === 0 && <p className="text-[#C0B0A0]">No results.</p>}
        </div>
      </div>
    </main>
  );
}
