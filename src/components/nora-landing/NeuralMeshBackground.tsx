/**
 * Layered ambient background: grid + soft editorial gradients (depth without neon “AI” clichés).
 */
export const NeuralMeshBackground = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    aria-hidden
  >
    {/* Base depth — near-black with a barely perceptible vertical lift */}
    <div
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(180deg, #060608 0%, #030303 42%, #050506 100%)',
      }}
    />

    {/* Cool ambient — top / center (like soft daylight, not cyan laser) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(130,165,195,0.11),transparent_58%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_25%,rgba(95,125,160,0.06),transparent_50%)]" />

    {/* Warm counterweight — bottom-right (paper / lamplight, very low chroma) */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_92%_88%,rgba(200,175,145,0.045),transparent_55%)]" />

    {/* Floor pool — anchors the page */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_110%,rgba(0,0,0,0.55),transparent_52%)]" />

    {/* Grid — fades out toward edges so gradients read */}
    <div
      className="absolute inset-0 opacity-[0.11] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black,transparent)]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(45deg, rgba(255,255,255,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '56px 56px',
      }}
    />

    {/* Edge vignette — focus center content */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,3,0.72)_72%)]" />

    {/* Film grain — breaks flat digital black */}
    <div
      className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
    />
  </div>
);
