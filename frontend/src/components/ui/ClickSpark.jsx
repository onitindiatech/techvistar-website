import React, { useEffect, useRef } from "react";

export const ClickSpark = ({
  sparkColor = "#14B8A6",
  sparkSize = 8,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  extraScale = 1,
  easing = "ease-out",
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId = null;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const easeOutQuad = (t) => t * (2 - t);
    const easeOutCubic = (t) => (--t) * t * t + 1;
    const easeOutQuart = (t) => 1 - (--t) * t * t * t;

    const getEasing = (t) => {
      if (easing === "ease-out") return easeOutQuad(t);
      if (easing === "ease-out-cubic") return easeOutCubic(t);
      if (easing === "ease-out-quart") return easeOutQuart(t);
      return t;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeVal = getEasing(progress);

        if (progress >= 1) return false;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";

        const currentDistance = sparkRadius * easeVal * extraScale;
        const startX = spark.x + Math.cos(spark.angle) * (currentDistance - sparkSize * (1 - easeVal));
        const startY = spark.y + Math.sin(spark.angle) * (currentDistance - sparkSize * (1 - easeVal));
        const endX = spark.x + Math.cos(spark.angle) * currentDistance;
        const endY = spark.y + Math.sin(spark.angle) * currentDistance;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        ctx.globalAlpha = 1 - progress;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        animationId = null;
      }
    };

    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const startTime = Date.now();

      for (let i = 0; i < sparkCount; i++) {
        const angle = (i * 2 * Math.PI) / sparkCount + (Math.random() * 0.2 - 0.1);
        sparksRef.current.push({
          x,
          y,
          angle,
          startTime,
        });
      }

      if (!animationId) {
        animationId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, extraScale, easing]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
};

export default ClickSpark;
