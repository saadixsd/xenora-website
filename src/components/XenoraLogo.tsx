interface XenoraLogoProps {
  className?: string;
}

const XenoraLogo = ({ className = "" }: XenoraLogoProps) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(280,100%,70%)] bg-clip-text text-transparent">
        XenoraAI
      </span>
    </div>
  );
};

export default XenoraLogo;