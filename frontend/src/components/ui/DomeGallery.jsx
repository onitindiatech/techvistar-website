import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const DEFAULT_TILES = [
  { type: 'icon', icon: 'instrex',   title: 'INSTREX' },
  { type: 'icon', icon: 'cloudcost', title: 'CloudCost' },
  { type: 'icon', icon: 'arikap',    title: 'Arikap' },
  { type: 'icon', icon: 'ambikhub',  title: 'Ambik Hub' },
  { type: 'icon', icon: 'clonevox',  title: 'Clone Vox' },
  { type: 'icon', icon: 'arikap',    title: 'Arikap' },
  { type: 'icon', icon: 'instrex',   title: 'INSTREX' },
  { type: 'icon', icon: 'cloudcost', title: 'CloudCost' },
  { type: 'icon', icon: 'clonevox',  title: 'Clone Vox' },
  { type: 'icon', icon: 'ambikhub',  title: 'Ambik Hub' },
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  segments: 35
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

function renderEcosystemIcon(iconType) {
  switch (iconType) {

    /* ──────────────────────────────────────────────────────────────────
       INSTREX  –  Stylised "I" pillar mark, dark-navy brand colour
    ────────────────────────────────────────────────────────────────── */
    case 'instrex':
      return (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top horizontal bar */}
          <rect x="8" y="6" width="24" height="5" rx="2.5" fill="#0b2859"/>
          {/* Vertical shaft */}
          <rect x="16.5" y="10.5" width="7" height="19" rx="2" fill="#1a3d6e"/>
          {/* Bottom horizontal bar */}
          <rect x="8" y="29" width="24" height="5" rx="2.5" fill="#0b2859"/>
        </svg>
      );

    /* ──────────────────────────────────────────────────────────────────
       CloudCost  –  Cloud outline with orange + blue + green accent dots
    ────────────────────────────────────────────────────────────────── */
    case 'cloudcost':
      return (
        <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud body */}
          <path d="M32 28H14a8 8 0 1 1 1.07-15.93A10 10 0 0 1 34 20a6 6 0 0 1-2 8z" fill="#e8eef8" stroke="#1a3d6e" strokeWidth="1.6"/>
          {/* Orange accent dot */}
          <circle cx="16" cy="32" r="3.5" fill="#f97316"/>
          {/* Blue accent dot */}
          <circle cx="24.5" cy="34" r="3.5" fill="#2563eb"/>
          {/* Green accent dot */}
          <circle cx="33" cy="31" r="3.5" fill="#22c55e"/>
        </svg>
      );

    /* ──────────────────────────────────────────────────────────────────
       Arikap  –  Geometric "A" lettermark, angular, dark-navy
    ────────────────────────────────────────────────────────────────── */
    case 'arikap':
      return (
        <svg className="w-8 h-8 sm:w-9 sm:h-9" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left leg */}
          <polygon points="20,5 7,35 13,35 20,14" fill="#0b2859"/>
          {/* Right leg */}
          <polygon points="20,5 33,35 27,35 20,14" fill="#1a3d6e"/>
          {/* Crossbar */}
          <rect x="12" y="22" width="16" height="4" rx="2" fill="#0b2859"/>
          {/* Apex highlight */}
          <polygon points="20,5 17,13 23,13" fill="#3b82f6" opacity="0.6"/>
        </svg>
      );

    /* ──────────────────────────────────────────────────────────────────
       Ambik Hub  –  Wings / V-chevron mark, dark navy + accent blue
    ────────────────────────────────────────────────────────────────── */
    case 'ambikhub':
      return (
        <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left wing */}
          <path d="M4 12 L22 32 L22 22 L10 9 Z" fill="#0b2859"/>
          {/* Right wing */}
          <path d="M40 12 L22 32 L22 22 L34 9 Z" fill="#1a3d6e"/>
          {/* Centre V-point accent */}
          <path d="M17 27 L22 34 L27 27" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );

    /* ──────────────────────────────────────────────────────────────────
       Clone Vox  –  Cloud silhouette with coloured highlight bars
    ────────────────────────────────────────────────────────────────── */
    case 'clonevox':
      return (
        <svg className="w-9 h-9 sm:w-10 sm:h-10" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud body */}
          <path d="M33 26H13a9 9 0 0 1 0-18 9.1 9.1 0 0 1 1.35.1A9 9 0 0 1 33 18a7 7 0 0 1 0 8z" fill="#dbeafe" stroke="#1a3d6e" strokeWidth="1.5"/>
          {/* Coloured bar 1 – orange */}
          <rect x="13" y="29" width="8" height="3.5" rx="1.75" fill="#f97316"/>
          {/* Coloured bar 2 – blue */}
          <rect x="23" y="29" width="8" height="3.5" rx="1.75" fill="#2563eb"/>
          {/* Coloured bar 3 – green, narrow */}
          <rect x="16" y="34" width="12" height="3" rx="1.5" fill="#16a34a"/>
        </svg>
      );

    default:
      return (
        <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}

function buildItems(pool, seg) {

  const activePool = pool && pool.length > 0 ? pool : DEFAULT_TILES;
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const normalizedItems = activePool.map(item => {
    if (typeof item === 'string') {
      return { src: item, alt: '', type: 'image' };
    }
    return {
      src: item.src || '',
      alt: item.alt || item.title || '',
      type: item.type || (item.icon ? 'icon' : 'image'),
      icon: item.icon || 'code',
      title: item.title || item.alt || '',
      description: item.description || ''
    };
  });

  return coords.map((c, i) => {
    const item = normalizedItems[i % normalizedItems.length];
    return {
      ...c,
      ...item
    };
  });
}

export default function DomeGallery({
  images = DEFAULT_TILES,
  fit = 0.42,
  fitBasis = 'auto',
  minRadius = 380,
  maxRadius = 500,
  padFactor = 0.25,
  overlayBlurColor = 'transparent',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  imageBorderRadius = '16px',
  grayscale = false,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const lastDragEndAt = useRef(0);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translate3d(0, 0, calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  const lockedRadiusRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);

    let frameId;
    let isVisible = true;
    const root = rootRef.current;

    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
        }, { threshold: 0.05 })
      : null;

    if (root && observer) observer.observe(root);

    const loop = () => {
      frameId = requestAnimationFrame(loop);

      if (!isVisible) return;

      if (!draggingRef.current && !inertiaRAF.current) {
        rotationRef.current.y = wrapAngleSigned(rotationRef.current.y + 0.05);
        applyTransform(rotationRef.current.x, rotationRef.current.y);
      }
    };

    frameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameId);
      if (root && observer) observer.unobserve(root);
    };
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        stopInertia();
        const evt = event;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (!draggingRef.current || !startPosRef.current) return;
        const evt = event;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 16) movedRef.current = true;
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      }
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        '--segments-x': segments,
        '--segments-y': segments,
        '--overlay-blur-color': overlayBlurColor,
        '--tile-radius': imageBorderRadius,
        '--image-filter': grayscale ? 'grayscale(1)' : 'none'
      }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => {
              return (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="item"
                  data-offset-x={it.x}
                  data-offset-y={it.y}
                  data-size-x={it.sizeX}
                  data-size-y={it.sizeY}
                  style={{
                    '--offset-x': it.x,
                    '--offset-y': it.y,
                    '--item-size-x': it.sizeX,
                    '--item-size-y': it.sizeY
                  }}
                >
                  <div
                    className="item__image"
                    aria-label={it.title || it.alt || 'TechVistar'}
                  >
                    {it.type === 'icon' || !it.src ? (
                      <div className="ecosystem-tile-content">
                        <div className="ecosystem-tile-icon">
                          {renderEcosystemIcon(it.icon || 'code')}
                        </div>
                      </div>
                    ) : (
                      <img src={it.src} draggable={false} alt={it.alt} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {overlayBlurColor && overlayBlurColor !== 'transparent' ? (
          <>
            <div className="overlay" />
            <div className="overlay overlay--blur" />
            <div className="edge-fade edge-fade--top" />
            <div className="edge-fade edge-fade--bottom" />
          </>
        ) : null}
      </main>
    </div>
  );
}

