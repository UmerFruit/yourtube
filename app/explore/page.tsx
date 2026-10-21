'use client';
import Link from 'next/link';

const features = [
  { name: 'Day Journey', desc: 'A random day and its channel hops', href: '/explore/day' },
  { name: 'First Encounters', desc: 'When you met your favorite channels', href: '/explore/first' },
  { name: 'Filter', desc: 'Find videos by word or channel', href: '/explore/filter' },
  { name: 'Trends', desc: 'How attention moved over time', href: '/explore/trends' },
  { name: 'Memory', desc: 'A random moment from history', href: '/explore/memory' },
  { name: 'Strangers', desc: 'Channels you watched only once', href: '/explore/strangers' },
  { name: 'Constellation', desc: 'Channel hop connections', href: '/explore/constellation' },
  { name: 'What did I miss?', desc: 'The longest gap in your archive', href: '/explore/gap' },
];

export default function ExploreIndexPage() {
  return (
    <main className="min-h-screen bg-[#140E14] text-[#F0EBD8] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.85]">Explore</h1>
        <p className="mt-6 text-[#C0B0A0] text-lg">Eight ways into your archive</p>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="group block rounded-2xl bg-[#1C131C] border border-[#231E1A] p-8 hover:border-[#8A5A3A]/40 transition-colors">
              <h3 className="font-display text-2xl leading-tight">{f.name}</h3>
              <p className="mt-3 text-sm text-[#C0B0A0]">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
