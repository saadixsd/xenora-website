import React from 'react';

interface GlassFloatingElementsProps {
  className?: string;
}

const GlassFloatingElements: React.FC<GlassFloatingElementsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Large floating glass orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 glass-subtle rounded-full glass-float opacity-30" />
      <div className="absolute top-40 right-16 w-24 h-24 glass rounded-full glass-float-delayed opacity-40" />
      <div className="absolute bottom-32 left-20 w-40 h-40 glass-subtle rounded-full glass-float opacity-25" />
      <div className="absolute bottom-20 right-10 w-28 h-28 glass rounded-full glass-float-delayed opacity-35" />
      
      {/* Medium floating elements */}
      <div className="absolute top-60 left-1/3 w-16 h-16 glass rounded-full glass-float opacity-50" />
      <div className="absolute top-80 right-1/4 w-20 h-20 glass-subtle rounded-full glass-float-delayed opacity-30" />
      <div className="absolute bottom-60 left-3/4 w-18 h-18 glass rounded-full glass-float opacity-45" />
      
      {/* Small glass particles */}
      <div className="absolute top-32 left-1/2 w-8 h-8 glass-strong rounded-full glass-float opacity-60" />
      <div className="absolute top-72 left-2/3 w-6 h-6 glass rounded-full glass-float-delayed opacity-70" />
      <div className="absolute bottom-40 left-1/4 w-10 h-10 glass-subtle rounded-full glass-float opacity-55" />
      <div className="absolute bottom-80 right-1/3 w-12 h-12 glass rounded-full glass-float-delayed opacity-40" />
      
      {/* Rectangular glass panels */}
      <div className="absolute top-16 right-1/4 w-20 h-8 glass-subtle rounded-lg glass-float opacity-30 rotate-12" />
      <div className="absolute bottom-24 left-1/3 w-16 h-6 glass rounded-lg glass-float-delayed opacity-35 -rotate-6" />
      <div className="absolute top-1/2 left-8 w-12 h-20 glass-subtle rounded-lg glass-float opacity-25 rotate-45" />
    </div>
  );
};

export default GlassFloatingElements;