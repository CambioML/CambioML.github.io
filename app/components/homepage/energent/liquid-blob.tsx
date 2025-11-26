import style from './liquid-blob.module.css';
import { cn } from '@/lib/cn';

type BlobCircle = { cx: number; cy: number; r: number; a: number };

export interface LiquidBlobProps {
  width?: number;
  height?: number;

  /** CSS color like '#5ab4fa' or 'rgb(90 180 250)' */
  color?: string;

  /** Opacity 0..1 */
  opacity?: number;

  /** Softness in px for Gaussian blur filter */
  blur?: number;

  /** Tailwind or custom classes on the outer wrapper */
  className?: string;

  /** How many circles to stack to form the blob, 1..6 recommended */
  blobCount?: number;

  /** Deterministic seed so SSR = CSR */
  seed?: number;

  /** Enable motion */
  animate?: boolean;

  /** Seconds for full rotation */
  rotateSeconds?: number;

  /** Seconds for one drift cycle */
  driftSeconds?: number;

  /** Drift amplitude as a fraction of the shortest side (0..0.2 typical) */
  driftAmplitude?: number;
}

/** Tiny deterministic RNG so the SVG is stable across server renders */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function LiquidBlob({
  width = 320,
  height = 180,
  color = '#5ab4fa',
  opacity = 1,
  blur = 24,
  className = '',
  blobCount = 4,
  seed = 1,
  animate = true,
  rotateSeconds = 40,
  driftSeconds = 18,
  driftAmplitude = 0.03, // ~3% of the min dimension feels subtle
}: LiquidBlobProps) {
  const w = Math.max(1, Math.floor(width));
  const h = Math.max(1, Math.floor(height));
  const minDim = Math.min(w, h);

  // Build blurred circles deterministically
  const rng = mulberry32(seed);
  const count = Math.max(1, Math.min(6, Math.round(blobCount)));
  const circles: BlobCircle[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2;
    const dist = 0.1 + rng() * 0.18; // keep centers near middle
    const cx = w * (0.5 + Math.cos(theta) * dist);
    const cy = h * (0.5 + Math.sin(theta) * dist);
    const r = (0.18 + rng() * 0.08) * minDim;
    const a = 0.7 + rng() * 0.3; // per-layer alpha for richness
    circles.push({ cx, cy, r, a });
  }

  const dx = `${(minDim * driftAmplitude).toFixed(2)}px`;
  const dy = `${(minDim * driftAmplitude * 0.7).toFixed(2)}px`;

  const rootStyle: React.CSSProperties & {
    '--lb-rotate-s': string;
    '--lb-drift-s': string;
    '--lb-dx': string;
    '--lb-dy': string;
  } = {
    // width: `${w}px`,
    // height: `${h}px`,
    width: '100%',
    height: '100%',
    ['--lb-rotate-s']: `${Math.max(4, rotateSeconds)}s`,
    ['--lb-drift-s']: `${Math.max(2, driftSeconds)}s`,
    ['--lb-dx']: dx,
    ['--lb-dy']: dy,
  };

  const id = `lb-${seed}-${w}x${h}`;

  return (
    <div className={cn(className)}>
      <div className={cn(style.root)} style={rootStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={style.svg}
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label="Decorative liquid blob"
        >
          <defs>
            <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={Math.max(2, Math.round(blur))} />
            </filter>
          </defs>

          {/* We nest groups so we can apply drift on outer and spin on inner */}
          <g className={animate ? style.drift : undefined}>
            <g className={animate ? style.spin : undefined}>
              <g filter={`url(#${id}-blur)`} opacity={opacity}>
                {circles.map((c, i) => (
                  <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={color} fillOpacity={Math.min(1, 0.85 * c.a)} />
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
