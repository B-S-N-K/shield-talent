import React, { useEffect, useRef } from 'react';

export function Radar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let sweepAngle = -Math.PI / 2; // start at top
    const SPEED = 0.008;
    const SIZE = 900; // internal draw resolution
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = SIZE * 0.46;
    
    canvas.width = SIZE;
    canvas.height = SIZE;

    /* blips */
    const blips: { x: number, y: number, baseAngle: number, lit: number }[] = [];
    function seedBlips() {
      blips.length = 0;
      for (let i = 0; i < 24; i++) {
        const radius = R * (0.10 + Math.random() * 0.82);
        const ang = Math.random() * Math.PI * 2;
        blips.push({ x: cx + radius * Math.cos(ang), y: cy + radius * Math.sin(ang), baseAngle: ang, lit: 0 });
      }
    }
    seedBlips();

    let animationFrameId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, SIZE, SIZE);

      /* concentric rings */
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, R * i / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(42,82,152,${0.07 + i * 0.055})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* outer ring */
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56,189,248,0.40)';
      ctx.lineWidth = 2;
      ctx.stroke();

      /* cardinal cross-hairs */
      ctx.save();
      ctx.strokeStyle = 'rgba(56,189,248,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 9]);
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
      ctx.strokeStyle = 'rgba(56,189,248,0.08)';
      const d = R * 0.707;
      ctx.beginPath(); ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      /* bearing tick marks */
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        const big = i % 3 === 0;
        const inner = R * (big ? 0.92 : 0.96);
        ctx.beginPath();
        ctx.moveTo(cx + inner * Math.cos(a), cy + inner * Math.sin(a));
        ctx.lineTo(cx + (R - 1) * Math.cos(a), cy + (R - 1) * Math.sin(a));
        ctx.strokeStyle = `rgba(56,189,248,${big ? 0.40 : 0.15})`;
        ctx.lineWidth = big ? 1.8 : 1;
        ctx.stroke();
      }

      /* sweep trail */
      const trailSpan = Math.PI * 0.65;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R - 2, sweepAngle - trailSpan, sweepAngle, false);
      ctx.closePath();
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grd.addColorStop(0, 'rgba(56,189,248,0.00)');
      grd.addColorStop(0.5, 'rgba(56,189,248,0.05)');
      grd.addColorStop(1, 'rgba(56,189,248,0.20)');
      ctx.fillStyle = grd;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      /* sweep line */
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(sweepAngle), cy + R * Math.sin(sweepAngle));
      ctx.strokeStyle = 'rgba(56,189,248,0.92)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(56,189,248,1)';
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      /* blips */
      blips.forEach(b => {
        const diff = ((sweepAngle - b.baseAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        if (diff < 0.10) b.lit = 1.0;
        const alpha = b.lit * (1 - diff / (Math.PI * 2));
        if (alpha > 0.015) {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${alpha})`;
          ctx.shadowColor = `rgba(56,189,248,${alpha * 0.75})`;
          ctx.shadowBlur = 6 + alpha * 16;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      /* center dot */
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56,189,248,0.95)';
      ctx.shadowColor = 'rgba(56,189,248,0.9)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      sweepAngle = (sweepAngle + SPEED) % (Math.PI * 2);
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[45%] w-[min(1500px,190vw)] h-[min(1500px,190vw)] pointer-events-none z-0"
    />
  );
}
