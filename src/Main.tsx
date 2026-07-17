// src/Main.tsx
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/* ==========================================================================
   COLOR PALETTE — flat, premium, no gradients / shadows / filters
   ========================================================================== */
const COLORS = {
  balloonBase: "#E8734A",
  balloonSeam: "#C85A34",
  balloonCap: "#C85A34",
  skirt: "#3B3A36",
  basket: "#8B5E3C",
  basketDark: "#6E482D",
  rope: "#5A5A52",
  cloud: "#FFFFFF",
  sunCore: "#F4B942",
  sunRay: "#F4B942",
};

/* ==========================================================================
   HELPER — convert degrees to an SVG rotate() transform string
   ========================================================================== */
const rotateAround = (deg: number, cx: number, cy: number) =>
  `rotate(${deg} ${cx} ${cy})`;

/* ==========================================================================
   CLOUD COMPONENT — reusable flat cloud built from overlapping circles
   ========================================================================== */
type CloudProps = {
  x: number;
  y: number;
  scale: number;
};

const Cloud: React.FC<CloudProps> = ({ x, y, scale }) => {
  return (
    <g
      name="cloud"
      transform={`translate(${x} ${y}) scale(${scale})`}
    >
      <ellipse cx={0} cy={0} rx={70} ry={34} fill={COLORS.cloud} />
      <circle cx={-45} cy={-6} r={30} fill={COLORS.cloud} />
      <circle cx={-10} cy={-22} r={38} fill={COLORS.cloud} />
      <circle cx={38} cy={-8} r={28} fill={COLORS.cloud} />
      <circle cx={62} cy={4} r={20} fill={COLORS.cloud} />
    </g>
  );
};

/* ==========================================================================
   SUN COMPONENT — flat circle core with rotating rays
   ========================================================================== */
type SunProps = {
  x: number;
  y: number;
  rotationDeg: number;
};

const Sun: React.FC<SunProps> = ({ x, y, rotationDeg }) => {
  const rayCount = 10;
  const rays = Array.from({ length: rayCount }, (_, i) => {
    const angle = (360 / rayCount) * i;
    return (
      <line
        key={`ray-${i}`}
        x1={0}
        y1={-95}
        x2={0}
        y2={-125}
        stroke={COLORS.sunRay}
        strokeWidth={10}
        strokeLinecap="round"
        transform={`rotate(${angle} 0 0)`}
      />
    );
  });

  return (
    <g name="sun" transform={`translate(${x} ${y})`}>
      <g name="sun-rays" transform={rotateAround(rotationDeg, 0, 0)}>
        {rays}
      </g>
      <circle name="sun-core" cx={0} cy={0} r={78} fill={COLORS.sunCore} />
    </g>
  );
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Normalized progress through the loop, 0 -> 1
  const progress = frame / durationInFrames;
  const TAU = Math.PI * 2;

  /* ------------------------------------------------------------------------
     BALLOON + BASKET ANIMATION VALUES (all integer-cycle, seamless loop)
     ------------------------------------------------------------------------ */

  // Whole assembly gently floats up and down — 1 full cycle over the loop
  const verticalFloat = Math.sin(progress * TAU * 1) * 22;

  // Balloon envelope subtly wobbles/rotates around its own center
  const balloonRotation = Math.sin(progress * TAU * 1 + Math.PI / 6) * 1.6;

  // Basket swings like a pendulum, slightly faster than the balloon float,
  // with a phase offset so the motion feels organic rather than mechanical
  const basketSwing = Math.sin(progress * TAU * 2 + Math.PI / 4) * 2.8;

  /* ------------------------------------------------------------------------
     CLOUD DRIFT VALUES — subtle horizontal oscillation, each with a unique
     phase and frequency so the clouds never move in sync
     ------------------------------------------------------------------------ */
  const cloudADrift = Math.sin(progress * TAU * 1) * 45;
  const cloudBDrift = Math.sin(progress * TAU * 1 + Math.PI / 3) * 60;
  const cloudCDrift = Math.sin(progress * TAU * 1 + Math.PI * 1.15) * 38;

  /* ------------------------------------------------------------------------
     SUN ROTATION — one full 360 degree turn per loop (seamless)
     ------------------------------------------------------------------------ */
  const sunRotation = progress * 360;

  /* ------------------------------------------------------------------------
     GEOMETRY CONSTANTS (viewBox space: 1920 x 1080)
     ------------------------------------------------------------------------ */
  const balloonCenterX = 960;
  const balloonTopY = 180;
  const balloonWideY = 460;
  const balloonRadius = 260;
  const neckHalfWidth = 90;
  const neckY = 680;
  const skirtY = 700;

  const basketTopY = 780;
  const basketBottomY = 900;
  const basketTopHalfWidth = 110;
  const basketBottomHalfWidth = 90;

  // Attachment points along the skirt (top of ropes)
  const ropeTopXs = [
    balloonCenterX - neckHalfWidth,
    balloonCenterX - neckHalfWidth / 3,
    balloonCenterX + neckHalfWidth / 3,
    balloonCenterX + neckHalfWidth,
  ];

  // Attachment points along the basket rim (bottom of ropes)
  const ropeBottomXs = [
    balloonCenterX - basketTopHalfWidth,
    balloonCenterX - basketTopHalfWidth / 3,
    balloonCenterX + basketTopHalfWidth / 3,
    balloonCenterX + basketTopHalfWidth,
  ];

  // Balloon envelope outline path (rounded bulb / onion shape)
  const balloonPath = `
    M ${balloonCenterX} ${balloonTopY}
    C ${balloonCenterX + 150} ${balloonTopY} ${balloonCenterX + balloonRadius} ${balloonTopY + 250} ${balloonCenterX + balloonRadius} ${balloonWideY}
    C ${balloonCenterX + balloonRadius} ${balloonWideY + 140} ${balloonCenterX + neckHalfWidth + 60} ${neckY - 40} ${balloonCenterX + neckHalfWidth} ${neckY}
    L ${balloonCenterX - neckHalfWidth} ${neckY}
    C ${balloonCenterX - neckHalfWidth - 60} ${neckY - 40} ${balloonCenterX - balloonRadius} ${balloonWideY + 140} ${balloonCenterX - balloonRadius} ${balloonWideY}
    C ${balloonCenterX - balloonRadius} ${balloonTopY + 250} ${balloonCenterX - 150} ${balloonTopY} ${balloonCenterX} ${balloonTopY}
    Z
  `;

  // Seam lines (gore seams) — subtle curved strokes across the envelope
  const seamOffsets = [-160, -80, 0, 80, 160];
  const seams = seamOffsets.map((offset, i) => {
    const topX = balloonCenterX + offset * 0.55;
    const midX = balloonCenterX + offset;
    const neckX =
      balloonCenterX +
      (offset / 160) * neckHalfWidth * 0.85;
    return (
      <path
        key={`seam-${i}`}
        d={`M ${topX} ${balloonTopY + 15}
            C ${midX} ${balloonTopY + 150} ${midX} ${balloonWideY + 60} ${neckX} ${neckY - 8}`}
        fill="none"
        stroke={COLORS.balloonSeam}
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.55}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <svg
        width={3840}
        height={2160}
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs />

        {/* ================= SUN ================= */}
        <Sun x={260} y={230} rotationDeg={sunRotation} />

        {/* ================= BACKGROUND CLOUDS ================= */}
        <g name="clouds-back">
          <Cloud x={1560 + cloudADrift} y={220} scale={1.15} />
          <Cloud x={1640 + cloudCDrift} y={830} scale={0.95} />
        </g>

        {/* ================= HOT AIR BALLOON ASSEMBLY ================= */}
        <g
          name="balloon-assembly"
          transform={`translate(0 ${verticalFloat})`}
        >
          {/* ----- Balloon envelope (rotates gently around its own center) ----- */}
          <g
            name="balloon-envelope-group"
            transform={rotateAround(
              balloonRotation,
              balloonCenterX,
              balloonWideY
            )}
          >
            <path d={balloonPath} fill={COLORS.balloonBase} />
            <g name="balloon-seams">{seams}</g>
            <ellipse
              name="balloon-cap"
              cx={balloonCenterX}
              cy={balloonTopY + 6}
              rx={26}
              ry={12}
              fill={COLORS.balloonCap}
            />
            <ellipse
              name="balloon-skirt"
              cx={balloonCenterX}
              cy={skirtY}
              rx={neckHalfWidth + 6}
              ry={16}
              fill={COLORS.skirt}
            />
          </g>

          {/* ----- Ropes + basket (swings like a pendulum from the skirt) ----- */}
          <g
            name="basket-rig-group"
            transform={rotateAround(
              basketSwing,
              balloonCenterX,
              skirtY
            )}
          >
            <g name="suspension-ropes">
              {ropeTopXs.map((topX, i) => (
                <line
                  key={`rope-${i}`}
                  x1={topX}
                  y1={skirtY}
                  x2={ropeBottomXs[i]}
                  y2={basketTopY}
                  stroke={COLORS.rope}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
              ))}
            </g>

            <g name="basket">
              <polygon
                points={`
                  ${balloonCenterX - basketTopHalfWidth},${basketTopY}
                  ${balloonCenterX + basketTopHalfWidth},${basketTopY}
                  ${balloonCenterX + basketBottomHalfWidth},${basketBottomY}
                  ${balloonCenterX - basketBottomHalfWidth},${basketBottomY}
                `}
                fill={COLORS.basket}
              />
              {/* Basket weave detail lines */}
              <line
                x1={balloonCenterX - basketTopHalfWidth + 10}
                y1={basketTopY + 30}
                x2={balloonCenterX + basketTopHalfWidth - 10}
                y2={basketTopY + 30}
                stroke={COLORS.basketDark}
                strokeWidth={5}
                opacity={0.6}
              />
              <line
                x1={balloonCenterX - basketTopHalfWidth + 18}
                y1={basketTopY + 65}
                x2={balloonCenterX + basketTopHalfWidth - 18}
                y2={basketTopY + 65}
                stroke={COLORS.basketDark}
                strokeWidth={5}
                opacity={0.6}
              />
              <rect
                name="basket-rim"
                x={balloonCenterX - basketTopHalfWidth - 4}
                y={basketTopY - 10}
                width={(basketTopHalfWidth + 4) * 2}
                height={16}
                rx={8}
                fill={COLORS.basketDark}
              />
            </g>
          </g>
        </g>

        {/* ================= FOREGROUND CLOUD ================= */}
        <g name="clouds-front">
          <Cloud x={260 + cloudBDrift} y={560} scale={1.3} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default Main;