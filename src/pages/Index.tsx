import NeuralCanvas from '@/components/NeuralCanvas';
import WaitlistForm from '@/components/WaitlistForm';
import { useEffect, useRef, useState } from 'react';

/* ── Scroll reveal hook ── */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-6 blur-[4px]'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ── Problem cards data ── */
const problems = [
  { title: 'You lose 2.1hrs/day to IG at 3pm', desc: 'Your brain craves dopamine at the same time every day. You never notice.' },
  { title: 'Same schedule fails every day', desc: "You plan deep work at 9am but your energy peaks at 11. Static schedules don't adapt." },
  { title: "Manual blockers don't stick", desc: 'You disable them in 3 taps. Willpower is a losing strategy.' },
];

const Index = () => {
  return (
    <div className="min-h-[100svh] bg-background relative overflow-x-hidden">
      <NeuralCanvas />



      <div className="relative z-10">

        {/* ═══ HERO ═══ */}
        <section className="min-h-[85svh] flex flex-col items-center justify-center px-5 sm:px-8 text-center">
          <Reveal>
            <h1 className="text-5xl sm:text-7xl lg:text-[8rem] font-black tracking-tighter text-foreground leading-[0.9]">
              Nora Focus
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto font-light leading-relaxed" style={{ textWrap: 'balance' }}>
              AI learns your focus fails → builds your perfect daily schedule
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-4 text-xs sm:text-sm text-muted-foreground/70 tracking-wide uppercase font-medium">
              Local AI · Playlist lock-in · Behavior patterns → 3× productivity
            </p>
          </Reveal>
          <Reveal delay={320}>
            <a
              href="#waitlist"
              className="mt-8 sm:mt-10 inline-flex items-center px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/85 active:scale-[0.97] transition-all"
            >
              Join Beta Waitlist
            </a>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-6 text-xs text-muted-foreground/60">347 people already waiting</p>
          </Reveal>
        </section>

        {/* ═══ PROBLEM ═══ */}
        <section className="py-20 sm:py-28 px-5 sm:px-8">
          <Reveal>
            <p className="text-center text-xs sm:text-sm uppercase tracking-widest text-primary font-medium mb-4">The problem</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-center text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-14 sm:mb-20 max-w-2xl mx-auto" style={{ lineHeight: '1.1', textWrap: 'balance' }}>
              Your focus is broken. You just don't see it yet.
            </h2>
          </Reveal>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-5 sm:gap-6">
            {problems.map((p, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="glass rounded-2xl p-6 sm:p-8 h-full hover:border-primary/30 transition-colors duration-300">
                  <h3 className="text-foreground font-semibold text-base sm:text-lg mb-2 leading-snug">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══ SOLUTION ═══ */}
        <section className="py-20 sm:py-28 px-5 sm:px-8">
          <Reveal>
            <p className="text-center text-xs sm:text-sm uppercase tracking-widest text-primary font-medium mb-4">How it works</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="text-center text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-14 sm:mb-20 max-w-2xl mx-auto" style={{ lineHeight: '1.1', textWrap: 'balance' }}>
              Nora watches. Nora learns. Nora locks you in.
            </h2>
          </Reveal>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Track', desc: 'Day 1: Nora silently maps when you lose focus, what triggers it, and your real energy cycles.' },
              { step: '02', title: 'Learn', desc: "AI builds your personal focus profile. No two brains are alike — your schedule shouldn't be either." },
              { step: '03', title: 'Lock In', desc: 'Auto-blocks distractions, schedules deep work, and locks your Spotify to a flow playlist.' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="text-center sm:text-left">
                  <span className="text-primary font-mono text-sm font-bold">{s.step}</span>
                  <h3 className="text-foreground font-bold text-xl sm:text-2xl mt-2 mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mockup placeholder */}
          <Reveal delay={200}>
            <div className="mt-16 sm:mt-20 max-w-3xl mx-auto glass rounded-2xl p-1">
              <div className="bg-muted/30 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/15 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
                  </div>
                  <p className="text-sm text-muted-foreground">Product demo coming soon</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ═══ WAITLIST ═══ */}
        <section id="waitlist" className="py-20 sm:py-28 px-5 sm:px-8">
          <div className="max-w-md mx-auto">
            <Reveal>
              <p className="text-center text-xs sm:text-sm uppercase tracking-widest text-primary font-medium mb-4">Beta access</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-foreground mb-3" style={{ lineHeight: '1.1', textWrap: 'balance' }}>
                Get early access
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-center text-muted-foreground text-sm mb-10 max-w-sm mx-auto">
                Mac, iOS & Android. Be first to try Nora Focus when we launch.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="glass rounded-2xl p-6 sm:p-8 glow-teal">
                <WaitlistForm />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF ═══ */}
        <section className="py-16 sm:py-20 px-5 sm:px-8 border-t border-border/30">
          <Reveal>
            <div className="max-w-lg mx-auto text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                Built by <span className="text-foreground font-semibold">Saad Kashif</span> · creator of <span className="text-primary font-medium">XenoraAI</span>
              </p>
              <p className="text-muted-foreground/60 text-xs">10K+ followers across platforms</p>
            </div>
          </Reveal>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="py-10 sm:py-14 px-5 sm:px-8 border-t border-border/20">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-foreground font-bold text-sm">Nora Focus</span>
              <div className="flex gap-2 text-muted-foreground/60 text-xs">
                <span className="px-2 py-1 rounded bg-muted/40 border border-border/30">macOS</span>
                <span className="px-2 py-1 rounded bg-muted/40 border border-border/30">iOS</span>
                <span className="px-2 py-1 rounded bg-muted/40 border border-border/30">Android</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              {[
                { label: 'X', href: 'https://x.com/xenoraai' },
                { label: 'LinkedIn', href: 'https://linkedin.com/company/xenoraai' },
                { label: 'Instagram', href: 'https://instagram.com/xenoraai' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/40">© 2025 XenoraAI</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
