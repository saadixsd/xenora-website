import NeuralCanvas from '@/components/NeuralCanvas';
import WaitlistForm from '@/components/WaitlistForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center px-6">
      <NeuralCanvas />

      <div className="relative z-10 w-full max-w-sm mx-auto text-center space-y-10">
        {/* Logo */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground">
            Xenora
          </h1>
          <p className="text-lg sm:text-xl font-light tracking-wide text-muted-foreground">
            Know Beyond
          </p>
        </div>

        {/* Waitlist */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
