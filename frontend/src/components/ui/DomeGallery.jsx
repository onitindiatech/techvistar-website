import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

/* ── Partner logo assets ── */
import cloneVoxLogo   from '@/assets/Clone_vox_logo.jpeg';
import arikapLogo     from '@/assets/Arikap_logo.jpeg';
import ambikHubLogo   from '@/assets/Ambik_hub_logo.jpeg';
import fixCloudCost   from '@/assets/FIX_CLOUDCOST_LOGO.jpeg';
import instrexLogo    from '@/assets/INSTREX_LOGO.jpeg';

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

/**
 * Renders the logo mark for each partner, cropping away wordmark/text
 * using overflow:hidden + object-fit tricks so only the recognisable
 * mark fills the tile — faithful to the uploaded reference images.
 */
function renderEcosystemIcon(iconType) {
  switch (iconType) {

    /* ────────────────────────────────────────────────────────────────
       CLONE VOX — CV waveform + microphone mark (upper portion of asset)
       Asset is ~3:1 landscape; mark sits in top ~42%, full width.
    ──────────────────────────────────────────────────────────────── */
    case 'clonevox':
      return (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4px'
        }}>
          <img
            src={cloneVoxLogo}
            draggable={false}
            alt="Clone Vox"
            style={{
              width: '130%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              marginLeft: '-15%',
              transform: 'scaleY(2.1) translateY(-17%)',
              transformOrigin: 'top center',
              imageRendering: 'auto',
              flexShrink: 0,
            }}
          />
        </div>
      );

    /* ────────────────────────────────────────────────────────────────
       ARIKAP — dark-navy circular badge with A mark (upper portion)
       Asset is ~3:1 landscape; circular mark occupies top ~55%, centered.
    ──────────────────────────────────────────────────────────────── */
    case 'arikap':
      return (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4px'
        }}>
          <img
            src={arikapLogo}
            draggable={false}
            alt="ARIKAP"
            style={{
              width: '90%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              transform: 'scaleY(1.9) translateY(-9%)',
              transformOrigin: 'top center',
              flexShrink: 0,
            }}
          />
        </div>
      );

    /* ────────────────────────────────────────────────────────────────
       AMBIK HUB — stylised A + orange upward-arrow mark (upper portion)
       Asset is ~3:1 landscape; A+arrow mark in top ~52%, centered.
    ──────────────────────────────────────────────────────────────── */
    case 'ambikhub':
      return (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4px'
        }}>
          <img
            src={ambikHubLogo}
            draggable={false}
            alt="Ambik Hub"
            style={{
              width: '90%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              transform: 'scaleY(2.0) translateY(-10%)',
              transformOrigin: 'top center',
              flexShrink: 0,
            }}
          />
        </div>
      );

    /* ────────────────────────────────────────────────────────────────
       FIX CLOUDCOST — multicolor cloud + orange arrow + bar-chart mark
       Asset is ~2.5:1 landscape; cloud mark in top ~57%, centered.
    ──────────────────────────────────────────────────────────────── */
    case 'cloudcost':
      return (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4px'
        }}>
          <img
            src={fixCloudCost}
            draggable={false}
            alt="FlixiCloud"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              transform: 'scaleY(1.85) translateY(-8%)',
              transformOrigin: 'top center',
              flexShrink: 0,
            }}
          />
        </div>
      );

    /* ────────────────────────────────────────────────────────────────
       INSTREX — dark-navy "I" with blue inverted-triangle cap
       Extracted cleanly from existing INSTREX_LOGO asset with original proportions.
    ──────────────────────────────────────────────────────────────── */
    case 'instrex':
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '66%',
            aspectRatio: '55 / 176',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            flexShrink: 0,
          }}>
            <img
              src={instrexLogo}
              draggable={false}
              alt="INSTREX"
              style={{
                width: '1916.36%',
                height: 'auto',
                maxWidth: 'none',
                maxHeight: 'none',
                objectFit: 'fill',
                transform: 'translate(-5.408%, -17.711%)',
                transformOrigin: 'top left',
                display: 'block',
                flexShrink: 0,
              }}
            />
          </div>
        </div>
      );

    default:
      return (
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '4px'
        }}>
          <img
            src={cloneVoxLogo}
            draggable={false}
            alt="Clone Vox"
            style={{
              width: '130%',
              height: 'auto',
              objectFit: 'cover',
              objectPosition: 'center top',
              marginLeft: '-15%',
              transform: 'scaleY(2.1) translateY(-17%)',
              transformOrigin: 'top center',
              imageRendering: 'auto',
              flexShrink: 0,
            }}
          />
        </div>
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
      icon: item.icon || 'instrex',
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

