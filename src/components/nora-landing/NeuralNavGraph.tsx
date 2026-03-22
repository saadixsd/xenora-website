import { useMemo } from 'react';
import { XenoraGeometricLogoCompact } from './XenoraGeometricLogo';
import { NEURAL_NODES, type NeuralNodeId } from './neuralNavData';

const cx = 50;
const cy = 50;
const R = 34;

const anglesDeg = [-90, -30, 30, 90, 150, 210];

function polar(deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: cx + R * Math.cos(r), y: cy + R * Math.sin(r) };
}

const NodeGlyph = ({
  shape,
  active,
}: {
  shape: 'teardrop' | 'prism' | 'triangle';
  active: boolean;
}) => {
  const stroke = 'currentColor';
  const w = 'h-5 w-5';
  const scale = active ? 'scale-110' : 'scale-100';
  if (shape === 'teardrop') {
    return (
      <span
        className={`${w} inline-flex items-center justify-center text-primary transition-transform duration-300 ${scale}`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3c-3 0-5 2.5-5 5.5C7 14 12 21 12 21s5-7 5-12.5C17 5.5 15 3 12 3z"
            stroke={stroke}
            strokeWidth="1.4"
            fill="none"
          />
        </svg>
      </span>
    );
  }
  if (shape === 'prism') {
    return (
      <span
        className={`${w} inline-flex items-center justify-center text-primary transition-transform duration-300 ${scale}`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M8 6h12l4 4v12l-4 4H8l-4-4V10l4-4z" stroke={stroke} strokeWidth="1.4" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={`${w} inline-flex items-center justify-center text-primary transition-transform duration-300 ${scale}`}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 4L20 20H4L12 4Z" stroke={stroke} strokeWidth="1.4" />
      </svg>
    </span>
  );
};

type Props = {
  activeId: NeuralNodeId | null;
  hoveredId: NeuralNodeId | null;
  onNodeClick: (id: NeuralNodeId) => void;
  onHover: (id: NeuralNodeId | null) => void;
};

export const NeuralNavGraph = ({ activeId, hoveredId, onNodeClick, onHover }: Props) => {
  const points = useMemo(() => anglesDeg.map((deg) => polar(deg)), []);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-2">
      <div className="relative mx-auto aspect-square w-full max-w-[min(100vw,480px)]">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Nora navigation — select a node to jump to a section"
        >
          <defs>
            <linearGradient id="synapse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(34 211 238 / 0.08)" />
              <stop offset="50%" stopColor="rgb(34 211 238 / 0.5)" />
              <stop offset="100%" stopColor="rgb(34 211 238 / 0.08)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {NEURAL_NODES.map((node, i) => {
            const p = points[i];
            const lit = activeId === node.id || hoveredId === node.id;
            return (
              <g key={node.id}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke={lit ? 'rgb(34 211 238 / 0.5)' : 'rgb(34 211 238 / 0.12)'}
                  strokeWidth={lit ? 0.5 : 0.32}
                  filter={lit ? 'url(#glow)' : undefined}
                  className="transition-all duration-300"
                />
                <line
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="url(#synapse)"
                  strokeWidth={0.22}
                  strokeDasharray="3 12"
                  className={lit ? 'animate-pathway-flow opacity-80' : 'opacity-25'}
                />
              </g>
            );
          })}
        </svg>

        {/* Center hub — pulsing logo + tagline */}
        <div className="absolute left-1/2 top-1/2 z-20 flex w-[min(44vw,200px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-full border border-primary/35 bg-base-100/95 px-4 py-4 shadow-[0_0_48px_rgb(34_211_238_/_0.18)] backdrop-blur-sm animate-synapse-pulse">
          <XenoraGeometricLogoCompact className="h-10 w-10 text-primary" />
          <p className="text-center text-[9px] font-semibold uppercase tracking-[0.38em] text-base-content sm:text-[10px]">
            Know Beyond
          </p>
        </div>

        {/* Satellite nodes + labels */}
        {NEURAL_NODES.map((node, i) => {
          const p = points[i];
          const lit = activeId === node.id || hoveredId === node.id;
          const x = (p.x / 100) * 100;
          const y = (p.y / 100) * 100;
          return (
            <a
              key={node.id}
              href={`#${node.sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                onNodeClick(node.id);
              }}
              onMouseEnter={() => onHover(node.id)}
              onMouseLeave={() => onHover(null)}
              className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full outline-none transition-transform duration-300 focus-visible:ring-2 focus-visible:ring-primary/60"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border bg-base-100/95 shadow-sm backdrop-blur-sm transition-all duration-300 ${
                  lit
                    ? 'scale-105 border-primary/70 shadow-[0_0_24px_rgb(34_211_238_/_0.35)]'
                    : 'scale-100 border-base-content/15'
                }`}
              >
                <NodeGlyph shape={node.shape} active={lit} />
              </span>
              <span
                className={`max-w-[6.5rem] text-center text-[9px] font-medium uppercase tracking-[0.12em] sm:max-w-[7.5rem] sm:text-[10px] sm:tracking-[0.14em] ${
                  lit ? 'text-primary' : 'text-base-content/65'
                }`}
              >
                {node.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
