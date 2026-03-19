import NeuralCanvas from '@/components/NeuralCanvas';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NeuralCanvas />

      {/* Gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(270 40% 12% / 0.6) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, hsl(260 30% 6%) 0%, transparent 50%)',
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Powered by Nora
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground glow-text mb-4 leading-[0.9]">
            XenoraAI
          </h1>

          <p className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground/80 mb-4">
            Know Beyond
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto mb-10">
            Agentic AI for creators & teams — built in Montréal.
          </p>

          <Button
            onClick={scrollToWaitlist}
            size="lg"
            className="h-13 px-10 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300 rounded-full"
          >
            Join Waitlist
          </Button>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="relative z-10 py-24 px-6">
        <WaitlistForm />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
