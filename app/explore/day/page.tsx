'use client';
import { useEffect, useState } from 'react';
import { formatDateShort, formatTime } from '@/lib/history';

export default function DayJourneyPage() {
  const [data, setData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yourtube_day') || null;
    }
    return null;
  });
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData({ error: true }));
  }, []);

  useEffect(() => {
    if (selectedDay !== null && typeof window !== 'undefined') {
      localStorage.setItem('yourtube_day', selectedDay);
    }
  }, [selectedDay]);

  if (!data) return <div className="min-h-screen bg-[#140E14] text-[#F0EBD8] p-12">Loading journey...</div>;

  const rows = data.rows || [];
  const byDay = new Map<string, typeof rows>();
  rows.forEach((r: any) => {
    if (!r.watched_at) return;
    const d = new Date(r.watched_at);
    const k = d.toISOString().split('T')[0];
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(r);
  });
  const days = [...byDay.keys()].sort();

  const randomDay = () => days[Math.floor(Math.random() * days.length)] || days[0] || null;
  const currentDay = selectedDay || (picked ? selectedDay : (days.length ? randomDay() : null));

  const handleNewDay = () => {
    setSelectedDay(randomDay());
    setPicked(true);
  };

  const handlePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(e.target.value || null);
    setPicked(true);
  };

  const dayRows = currentDay ? (byDay.get(currentDay) || []) : [];
  const hops = new Map<string, number>();
  let prev = '';
  dayRows.forEach((r: any) => {
    if (prev && prev !== r.channel_name) {
      const key = `${prev} -> ${r.channel_name}`;
      const value = hops.get(key);
      hops.set(key, (value ?? 0) + 1);
    }
    prev = r.channel_name;
  });

  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Day Journey</h1>
            <p className="mt-6 text-[#C0B0A0] text-lg">A single day from your archive</p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={currentDay || ''}
              onChange={handlePicker}
              className="rounded-full bg-[#1C131C] border border-[#231E1A] px-5 py-3 text-sm text-[#F0EBD8] focus:outline-none focus:border-[#8A5A3A]/60"
            />
            <button
              onClick={handleNewDay}
              className="rounded-full bg-[#8A5A3A] px-6 py-3 text-sm font-medium text-[#F0EBD8] hover:bg-[#A85D3A] transition-colors"
            >
              New Day
            </button>
          </div>
        </div>

        {currentDay && (
          <div className="mt-16 space-y-16">
            <section>
              <h2 className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A]">The day</h2>
              <p className="mt-2 text-3xl font-display">{formatDateShort(currentDay + 'T00:00:00Z')}</p>
              <p className="mt-1 text-[#C0B0A0]">{dayRows.length} video{dayRows.length > 1 ? 's' : ''} watched</p>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A] mb-6">Channel hops</h2>
              <svg viewBox="0 0 600 120" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const sequence: string[] = [];
                  dayRows.forEach((r: any) => {
                    if (!r.channel_name) return;
                    if (sequence[sequence.length - 1] !== r.channel_name) sequence.push(r.channel_name);
                  });
                  const nodeCount = sequence.length;
                  if (nodeCount === 0) return null;
                  const spacing = 100;
                  const startX = 60;
                  const y = 60;
                  return (
                    <>
                      {sequence.map((ch, i) => {
                        const chRow = dayRows.find((r: any) => r.channel_name === ch);
                        const url = chRow?.channel_url || '#';
                        let avatarUrl = '';
                        // Try to extract a YouTube channel avatar URL
                        try {
                          const urlObj = new URL(url);
                          const path = urlObj.pathname;
                          const channelIdMatch = path.match(/channel\/([\w-]+)/);
                          if (channelIdMatch) {
                            avatarUrl = `https://yt3.ggpht.com/ytc/${channelIdMatch[1]}=s88-c-k-c0xffffffff-no-rj-mo`;
                          } else {
                            const handleMatch = path.match(/@([\w.-]+)/);
                            if (handleMatch) {
                              avatarUrl = `https://yt3.ggpht.com/ytc/${handleMatch[1]}=s88-c-k-c0xffffffff-no-rj-mo`;
                            }
                          }
                        } catch (e) {}
                        const cx = startX + i * spacing;
                        return (
                          <a key={ch + i} href={url} target="_blank" rel="noopener noreferrer" className="group">
                            <g className="transition-transform duration-200 group-hover:scale-110 origin-center">
                              <circle cx={cx} cy={y} r={18} fill="#1C131C" stroke="#8A5A3A" strokeWidth={2} />
                              <text x={cx} y={y + 5} textAnchor="middle" fill="#F0EBD8" fontSize="10" fontFamily="system-ui">{ch ? ch[0] : '?'}</text>
                              <text x={cx} y={y + 36} textAnchor="middle" fill="#C0B0A0" fontSize="9" fontFamily="system-ui">{ch}</text>
                            </g>
                          </a>
                        );
                      })}
                      {sequence.map((_, i) => {
                        if (i === 0) return null;
                        const x1 = startX + (i - 1) * spacing;
                        const x2 = startX + i * spacing;
                        return <line key={`line-${i}`} x1={x1 + 18} y1={y} x2={x2 - 18} y2={y} stroke="#8A5A3A" strokeWidth={1.5} strokeDasharray="4 3" />;
                      })}
                    </>
                  );
                })()}
              </svg>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-[0.35em] text-[#8A5A3A] mb-6">Videos</h2>
              <div className="space-y-4">
                {dayRows.map((r: any) => (
                  <a key={r.id} href={r.video_url || '#'} className="block rounded-xl bg-[#1C131C] border border-[#231E1A] p-6 hover:border-[#8A5A3A]/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-xl leading-snug">{r.video_title}</p>
                        <p className="mt-1 text-sm text-[#C0B0A0]">{r.channel_name}</p>
                      </div>
                      <span className="text-xs text-[#8A5A3A] whitespace-nowrap">{formatTime(r.watched_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
