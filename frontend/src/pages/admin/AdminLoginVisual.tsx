import { useRef, useCallback, Suspense, lazy } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const AdminLoginWorkspace = lazy(() =>
  import("./AdminLoginWorkspace").then((m) => ({ default: m.AdminLoginWorkspace }))
);

const WorkspaceFallback = () => (
  <div className="flex h-full w-full items-center justify-center bg-[#eef1ef]">
    <div className="h-8 w-8 animate-pulse rounded-full bg-emerald-500/20" />
  </div>
);

export const AdminLoginVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const parallaxX = useTransform(springX, [-1, 1], [-8, 8]);
  const parallaxY = useTransform(springY, [-1, 1], [-5, 5]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set(((e.clientX - left) / width) * 2 - 1);
      mouseY.set(((e.clientY - top) / height) * 2 - 1);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden bg-[#eef1ef]"
    >
      {/* Ambient office lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_30%,rgba(254,249,195,0.35),transparent_55%)]" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(14,165,233,0.08),transparent_50%)]"
          animate={{ opacity: [0.6, 0.9, 0.7] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>



      <motion.div className="absolute inset-0" style={{ x: parallaxX, y: parallaxY }}>
        <Suspense fallback={<WorkspaceFallback />}>
          <AdminLoginWorkspace />
        </Suspense>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="pointer-events-none absolute bottom-8 left-8 right-8 z-10 hidden max-w-md lg:block xl:bottom-10 xl:left-10"
      >
        <p className="font-display text-xl font-semibold tracking-tight text-slate-800">
          Enterprise technology, delivered with precision.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Trusted by teams building modern digital infrastructure.
        </p>
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#eef1ef]/80 to-transparent md:w-16 lg:w-24" />
    </div>
  );
};
