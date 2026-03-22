/**
 * Xenora brand geometry: teardrop orb, square prism, triangle — used in watermark and center node.
 */
export const XenoraGeometricLogo = ({
  className = '',
  size = 120,
  muted = false,
}: {
  className?: string;
  size?: number;
  /** Softer strokes for watermark */
  muted?: boolean;
}) => {
  const stroke = muted ? 'rgba(250,250,250,0.35)' : 'rgba(250,250,250,0.9)';
  const fillOrb = muted ? 'rgba(250,250,250,0.08)' : 'rgba(34,211,238,0.12)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Teardrop orb */}
      <path
        d="M38 28c0-14 12-22 22-22s22 8 22 22c0 18-22 44-22 52S38 46 38 28z"
        stroke={stroke}
        strokeWidth="1.6"
        fill={fillOrb}
      />
      {/* Square prism (isometric) */}
      <path
        d="M72 58h20l12 10v24l-12 10H72l-12-10V68l12-10z"
        stroke={stroke}
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M72 58h20v24H72V58z" stroke={stroke} strokeWidth="1.2" opacity={0.6} />
      {/* Triangle */}
      <path d="M24 92l-10-18h20l-10 18z" stroke={stroke} strokeWidth="1.6" fill="rgba(250,250,250,0.04)" />
    </svg>
  );
};

export const XenoraGeometricLogoCompact = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M22 14c0-8 7-13 13-13s13 5 13 13c0 11-13 27-13 32S22 25 22 14z"
      stroke="currentColor"
      strokeWidth="1.4"
      className="text-base-content/90"
      fill="none"
    />
    <path
      d="M38 28h12l8 8v16l-8 8H38l-8-8V36l8-8z"
      stroke="currentColor"
      strokeWidth="1.4"
      className="text-base-content/90"
      fill="none"
    />
    <path d="M12 52l-6-12h12l-6 12z" stroke="currentColor" strokeWidth="1.4" className="text-base-content/90" fill="none" />
  </svg>
);
