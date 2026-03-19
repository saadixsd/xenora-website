import NeuralCanvas from '@/components/NeuralCanvas';
import WaitlistForm from '@/components/WaitlistForm';

const Index = () => {
  return (
    <div className="min-h-[100svh] bg-background relative overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-10">
      <NeuralCanvas />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center space-y-8 sm:space-y-10 lg:space-y-12">
        {/* Logo */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Xenora
          </h1>
          <p className="text-base sm:text-lg lg:text-xl font-light tracking-wide text-muted-foreground">
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
