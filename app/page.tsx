'use client';

/*
  Landing page — introduces the archive and leads to the main app.
  Design: committed film identity (DESIGN.md), no generic AI patterns.
  Purpose: this is the entry; the real archive lives on the next page.
*/

import { useEffect, useRef } from 'react';

export default function Home() {
  const exploreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      if (window.scrollY > 5) {
        triggered = true;
        exploreRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--ground)', color: 'var(--ink)' }}>
      {/* Sticky Hero */}
      <section
        className="sticky top-0 z-[1] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 md:px-12"
        style={{ backgroundColor: '#140E14' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
            backgroundSize: '256px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-6 font-sans text-[11px] uppercase tracking-[0.35em] text-[#8A5A3A]">Your archive is a story</p>
          <h1
            className="font-display text-[clamp(3.5rem,13vw,9rem)] leading-[0.82] tracking-[-0.06em] text-[#F0EBD8]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Yourtube<br />
            <span className="italic text-[#C0B0A0]">What&apos;s your story?</span>
          </h1>
          <div className="mt-10 flex flex-col items-center gap-2">
            <a href="#intro" className="text-[#8A5A3A] hover:text-[#F0EBD8] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Cover / intro */}
      <section
        id="intro"
        ref={exploreRef}
        className="relative z-[2] px-6 pb-32 pt-28 md:px-12 md:pb-40 md:pt-36"
        style={{ backgroundColor: '#1C131C' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight tracking-tight text-[#F0EBD8] md:text-6xl">What is Yourtube?</h2>
          <p className="mt-8 text-lg leading-relaxed text-[#C0B0A0] md:text-xl">
            Yourtube turns your YouTube watch history into an interactive archive. See which creators you returned to, the strangers you met once, and how your attention moved between channels over time.
          </p>
          <a
            href="/explore"
            className="mt-10 inline-block rounded-full bg-[#8A5A3A] px-10 py-5 text-base font-medium text-[#F0EBD8] shadow-[0_0_40px_8px_rgba(138,90,58,0.2)] transition-colors hover:bg-[#A85D3A]"
          >
            Open the archive
          </a>
        </div>
      </section>

      <footer className="relative z-[2] border-t border-[#231E1A]/60 px-6 py-14 md:px-12" style={{ backgroundColor: '#140E14' }}>
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-xs tracking-tight text-[#C0B0A0] md:text-sm">
          <p className="font-medium text-[#F0EBD8]">Yourtube — an interactive archive</p>
          <a href="https://github.com/UmerFruit" className="inline-flex items-center gap-1.5 text-[#8A5A3A] hover:text-[#F0EBD8] transition-colors" target="_blank" rel="noopener noreferrer">
            made by umerfruit
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M7 7h10v10"/></svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
