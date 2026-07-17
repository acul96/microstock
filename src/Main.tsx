// Main.tsx
import React from "react";
import { useCurrentFrame } from "remotion";

/* ============================================================
   LOADING BAR WITH RUNNING CAT — Premium Minimal Flat Vector
   4K (3840x2160) · 10s @ 30fps · Seamless Loop · Transparent BG
   ============================================================ */

// ---------- Color Palette ----------
const COLORS = {
  track: "#E8ECEF",
  trackInner: "#D1D8DD",
  progress: "#FF6B6B",
  progressHighlight: "#FF8787",
  catBody: "#FF8C42",
  catLight: "#FFB380",
  catDark: "#E67320",
  catEarInner: "#FFB6C1",
  eye: "#2C3E50",
  nose: "#FF6B9D",
  accent1: "#4ECDC4",
  accent2: "#FFD93D",
  accent3: "#A78BFA",
};

// ---------- Timing ----------
const TOTAL_FRAMES = 300;

// ---------- Floating Decorative Dot ----------
type DotProps = {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  amplitude: number;
  period: number;
};

const FloatingDot: React.FC<DotProps> = ({
  x,
  y,
  size,
  color,
  phase,
  amplitude,
  period,
}) => {
  const frame = useCurrentFrame();
  const offsetY = Math.sin(((frame + phase) / period) * Math.PI * 2) * amplitude;
  const scale = 1 + Math.sin(((frame + phase) / period) * Math.PI * 2) * 0.1;

  return (
    <circle
      cx={x}
      cy={y + offsetY}
      r={size * scale}
      fill={color}
      opacity={0.6}
    />
  );
};

// ---------- Running Cat ----------
type CatProps = {
  x: number;
  y: number;
  opacity: number;
  frame: number;
};

const Cat: React.FC<CatProps> = ({ x, y, opacity, frame }) => {
  // Running bounce (fast cycle)
  const bounceY = Math.sin((frame / 8) * Math.PI * 2) * 18;

  // Leg animations (4 legs with phase offsets)
  const legPhase = (frame / 8) * Math.PI * 2;
  const leg1 = Math.sin(legPhase) * 25;
  const leg2 = Math.sin(legPhase + Math.PI) * 25;
  const leg3 = Math.sin(legPhase + Math.PI / 2) * 25;
  const leg4 = Math.sin(legPhase + (3 * Math.PI) / 2) * 25;

  // Tail wag
  const tailWag = Math.sin((frame / 12) * Math.PI * 2) * 20;

  // Head bob
  const headBob = Math.sin((frame / 8) * Math.PI * 2) * 6;

  return (
    <g
      transform={`translate(${x}, ${y + bounceY})`}
      opacity={opacity}
    >
      {/* === TAIL === */}
      <path
        d={`M -110,-20 Q ${-140 + tailWag},-60 ${-160 + tailWag},-90`}
        stroke={COLORS.catBody}
        strokeWidth={24}
        strokeLinecap="round"
        fill="none"
      />

      {/* === BACK LEGS === */}
      <rect
        x={-70}
        y={50 + leg3}
        width={22}
        height={65}
        rx={11}
        fill={COLORS.catDark}
      />
      <rect
        x={-40}
        y={50 + leg4}
        width={22}
        height={65}
        rx={11}
        fill={COLORS.catDark}
      />

      {/* === BODY === */}
      <ellipse cx={0} cy={0} rx={130} ry={75} fill={COLORS.catBody} />

      {/* Body highlight */}
      <ellipse
        cx={-20}
        cy={-20}
        rx={80}
        ry={40}
        fill={COLORS.catLight}
        opacity={0.5}
      />

      {/* === FRONT LEGS === */}
      <rect
        x={50}
        y={50 + leg1}
        width={22}
        height={65}
        rx={11}
        fill={COLORS.catDark}
      />
      <rect
        x={80}
        y={50 + leg2}
        width={22}
        height={65}
        rx={11}
        fill={COLORS.catDark}
      />

      {/* === HEAD === */}
      <g transform={`translate(110, ${-30 + headBob})`}>
        {/* Head base */}
        <circle cx={0} cy={0} r={65} fill={COLORS.catBody} />

        {/* Left ear */}
        <polygon points="-45,-50 -60,-95 -20,-65" fill={COLORS.catBody} />
        <polygon points="-42,-55 -55,-85 -25,-65" fill={COLORS.catEarInner} />

        {/* Right ear */}
        <polygon points="45,-50 60,-95 20,-65" fill={COLORS.catBody} />
        <polygon points="42,-55 55,-85 25,-65" fill={COLORS.catEarInner} />

        {/* Eyes */}
        <circle cx={-20} cy={-10} r={8} fill={COLORS.eye} />
        <circle cx={20} cy={-10} r={8} fill={COLORS.eye} />
        <circle cx={-17} cy={-13} r={3} fill="#FFFFFF" />
        <circle cx={23} cy={-13} r={3} fill="#FFFFFF" />

        {/* Nose */}
        <ellipse cx={0} cy={10} rx={8} ry={6} fill={COLORS.nose} />

        {/* Mouth */}
        <path
          d="M 0,16 Q -8,22 -12,20"
          stroke={COLORS.eye}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 0,16 Q 8,22 12,20"
          stroke={COLORS.eye}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Cheek blush */}
        <circle cx={-35} cy={5} r={10} fill={COLORS.catEarInner} opacity={0.4} />
        <circle cx={35} cy={5} r={10} fill={COLORS.catEarInner} opacity={0.4} />
      </g>
    </g>
  );
};

// ---------- Loading Bar ----------
type LoadingBarProps = {
  progress: number;
};

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  const barX = 400;
  const barY = 1040;
  const barWidth = 3040;
  const barHeight = 80;
  const progressWidth = progress * barWidth;

  return (
    <g>
      {/* Track background */}
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        rx={40}
        fill={COLORS.track}
      />

      {/* Track inner shadow (subtle depth) */}
      <rect
        x={barX + 10}
        y={barY + 10}
        width={barWidth - 20}
        height={barHeight - 20}
        rx={30}
        fill={COLORS.trackInner}
        opacity={0.3}
      />

      {/* Progress fill */}
      <rect
        x={barX}
        y={barY}
        width={progressWidth}
        height={barHeight}
        rx={40}
        fill={COLORS.progress}
      />

      {/* Progress highlight (top edge) */}
      <rect
        x={barX + 20}
        y={barY + 15}
        width={Math.max(0, progressWidth - 40)}
        height={20}
        rx={10}
        fill={COLORS.progressHighlight}
        opacity={0.6}
      />

      {/* Progress markers (decorative dots) */}
      {progress > 0.1 && (
        <g>
          <circle
            cx={barX + progressWidth - 40}
            cy={barY + barHeight / 2}
            r={12}
            fill="#FFFFFF"
            opacity={0.8}
          />
          <circle
            cx={barX + progressWidth - 40}
            cy={barY + barHeight / 2}
            r={6}
            fill={COLORS.progress}
          />
        </g>
      )}
    </g>
  );
};

// ---------- Main Composition ----------
const Main: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress animation (0 to 1)
  const progress = frame / TOTAL_FRAMES;

  // Cat position (follows progress)
  const catStartX = 500;
  const catEndX = 3340;
  const catX = catStartX + progress * (catEndX - catStartX);
  const catY = 900;

  // Cat opacity (fade in/out for seamless loop)
  let catOpacity = 1;
  if (frame < 20) {
    catOpacity = frame / 20;
  } else if (frame > 280) {
    catOpacity = (300 - frame) / 20;
  }

  return (
    <svg
      width={3840}
      height={2160}
      viewBox="0 0 3840 2160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: "transparent" }}
    >
      {/* === DECORATIVE FLOATING DOTS === */}
      <FloatingDot
        x={600}
        y={400}
        size={40}
        color={COLORS.accent1}
        phase={0}
        amplitude={30}
        period={180}
      />
      <FloatingDot
        x={3200}
        y={500}
        size={35}
        color={COLORS.accent2}
        phase={60}
        amplitude={25}
        period={200}
      />
      <FloatingDot
        x={800}
        y={1700}
        size={30}
        color={COLORS.accent3}
        phase={120}
        amplitude={35}
        period={160}
      />
      <FloatingDot
        x={3000}
        y={1600}
        size={45}
        color={COLORS.accent1}
        phase={180}
        amplitude={28}
        period={220}
      />

      {/* === LOADING BAR === */}
      <LoadingBar progress={progress} />

      {/* === RUNNING CAT === */}
      <Cat x={catX} y={catY} opacity={catOpacity} frame={frame} />
    </svg>
  );
};

export default Main;