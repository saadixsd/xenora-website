interface XenoraLogoProps {
  className?: string;
}

const XenoraLogo = ({ className = "" }: XenoraLogoProps) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="text-2xl font-bold">
        <span className="text-orange-500">Xenora</span>
        <span className="text-purple-500">AI</span>
      </span>
    </div>
  );
};

export default XenoraLogo;