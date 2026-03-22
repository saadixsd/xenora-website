import logoSrc from '@/assets/logo.jpeg';

type Props = {
  className?: string;
  /** Empty alt + aria-hidden (parent supplies label). */
  decorative?: boolean;
};

/**
 * Official Xenora mark — bundled from `src/assets/logo.jpeg` so Vite resolves the URL (works with `base` / hashed assets).
 */
export function XenoraLogo({ className = '', decorative = false }: Props) {
  return (
    <img
      src={logoSrc}
      alt={decorative ? '' : 'XenoraAI'}
      width={256}
      height={256}
      className={`object-contain ${className}`}
      loading={decorative ? 'lazy' : 'eager'}
      decoding="async"
      {...(decorative ? { 'aria-hidden': true as const } : {})}
    />
  );
}
