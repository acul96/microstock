import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ==========================================
// NEO-CYBERPUNK PREMIUM COLOR PALETTE
// ==========================================
const COLORS = {
  primaryNeon: '#00ffff',     // Electric Cyan
  secondaryNeon: '#ff0055',   // Cyber Pink
  accentCore: '#7a00ff',      // Deep Plasma Violet
  plateLight: '#f1f5f9',      // Armor Plate Utama (Terang)
  plateDark: '#cbd5e1',       // Armor Plate Bayangan
  chassisDark: '#1e293b',     // Rangka Mekanikal Dalam
  strokePremium: '#0f172a',   // Ink Stroke Outline
  goldAccent: '#f59e0b',      // Sensor Gold
};

const TOTAL_LOOP_FRAMES = 160; 

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const loopFrame = frame % TOTAL_LOOP_FRAMES;

  // ------------------------------------------
  // CORE MOTION FORMULAS (4K STABILIZED)
  // ------------------------------------------
  const runBobbing = Math.sin((loopFrame / 15) * Math.PI * 2) * 18; 
  const jumpArc = interpolate(
    loopFrame,
    [60, 75, 105, 135, 150], 
    [0, 30, -220, 0, -10],   
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const bodyY = loopFrame >= 60 && loopFrame <= 150 ? jumpArc : runBobbing;

  const runTilt = 8 + Math.sin((loopFrame / 15) * Math.PI * 2) * 3; 
  const jumpTilt = interpolate(
    loopFrame,
    [60, 75, 90, 120, 135, 150],
    [8, 15, -25, 10, 30, 8], 
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const bodyTilt = loopFrame >= 60 && loopFrame <= 150 ? jumpTilt : runTilt;

  const runSwingFL = Math.sin((loopFrame / 15) * Math.PI * 2) * 50;
  const runSwingBR = Math.sin((loopFrame / 15) * Math.PI * 2) * 50;
  const runSwingFR = Math.sin((loopFrame / 15) * Math.PI * 2 + Math.PI) * 50;
  const runSwingBL = Math.sin((loopFrame / 15) * Math.PI * 2 + Math.PI) * 50;

  const jumpLegFL = interpolate(loopFrame, [60, 75, 90, 135, 145, 155], [0, 45, -60, -40, 30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const jumpLegFR = interpolate(loopFrame, [60, 75, 90, 135, 145, 155], [0, 20, -45, -25, 45, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const jumpLegBL = interpolate(loopFrame, [60, 75, 90, 135, 145, 155], [0, -30, 50, 30, -10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const jumpLegBR = interpolate(loopFrame, [60, 75, 90, 135, 145, 155], [0, -15, 65, 45, 0, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const legFL = loopFrame >= 60 && loopFrame <= 155 ? jumpLegFL : runSwingFL;
  const legFR = loopFrame >= 60 && loopFrame <= 155 ? jumpLegFR : runSwingFR;
  const legBL = loopFrame >= 60 && loopFrame <= 155 ? jumpLegBL : runSwingBL;
  const legBR = loopFrame >= 60 && loopFrame <= 155 ? jumpLegBR : runSwingBR;

  const runTail = Math.sin((loopFrame / 15) * Math.PI * 2) * 20;
  const jumpTail = interpolate(loopFrame, [60, 75, 105, 135, 150], [0, 40, -50, 20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tailBaseWag = (loopFrame >= 60 && loopFrame <= 150 ? jumpTail : runTail) - 10;

  const blinkSpring = spring({
    frame: loopFrame % 80,
    fps,
    config: { damping: 10, mass: 0.3 },
  });
  const eyeScaleY = interpolate(blinkSpring, [0, 0.15, 0.3, 1], [1, 0.05, 1, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 4K PERFECT CENTERING CONTAINER */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          // Skala diturunkan ke 2.0 agar karakter tidak terlalu besar dan aman dari batas layar saat melompat
          transform: `translate(-50%, -50%) scale(2.0)`,
          width: '950px', 
          height: '900px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* CHARACTER INNER ROOT */}
        <div
          style={{
            position: 'absolute',
            // Penyesuaian offset vertikal (+220px) agar karakter menapak pas di titik pusat simetris kanvas
            transform: `translate3d(0, ${bodyY + 220}px, 0) rotate(${bodyTilt}deg)`,
            width: '650px',
            height: '450px',
          }}
        >
          {/* ==========================================
              1. RANGKA MEKANIKAL BELAKANG & KAKI (Latar)
              ========================================== */}
          {/* Kaki Belakang Kiri */}
          <div
            style={{
              position: 'absolute',
              left: '130px',
              top: '230px',
              width: '50px',
              height: '140px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '20px',
              border: `4px solid ${COLORS.strokePremium}`,
              transformOrigin: 'top center',
              transform: `rotate(${legBL}deg)`,
            }}
          >
            <div style={{ position: 'absolute', bottom: '10px', left: '4px', width: '34px', height: '70px', backgroundColor: COLORS.plateDark, borderRadius: '10px', borderBottom: `8px solid ${COLORS.secondaryNeon}` }} />
          </div>

          {/* Kaki Depan Kiri */}
          <div
            style={{
              position: 'absolute',
              left: '400px',
              top: '230px',
              width: '50px',
              height: '140px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '20px',
              border: `4px solid ${COLORS.strokePremium}`,
              transformOrigin: 'top center',
              transform: `rotate(${legFL}deg)`,
            }}
          >
            <div style={{ position: 'absolute', bottom: '10px', left: '4px', width: '34px', height: '70px', backgroundColor: COLORS.plateDark, borderRadius: '10px', borderBottom: `8px solid ${COLORS.primaryNeon}` }} />
          </div>

          {/* ==========================================
              2. CYBER TAIL (Ekor Stabilizer)
              ========================================== */}
          <div
            style={{
              position: 'absolute',
              left: '25px',
              top: '130px',
              width: '70px',
              height: '35px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '12px',
              border: `4px solid ${COLORS.strokePremium}`,
              transformOrigin: 'right center',
              transform: `rotate(${tailBaseWag}deg)`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-50px',
                top: '-2px',
                width: '55px',
                height: '27px',
                backgroundColor: COLORS.secondaryNeon,
                borderRadius: '10px',
                border: `3px solid ${COLORS.strokePremium}`,
                transformOrigin: 'right center',
                transform: `rotate(${tailBaseWag * 1.2}deg)`,
                boxShadow: `0 0 15px ${COLORS.secondaryNeon}`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-45px',
                  top: '0px',
                  width: '50px',
                  height: '18px',
                  backgroundColor: COLORS.primaryNeon,
                  borderRadius: '9px',
                  border: `3px solid ${COLORS.strokePremium}`,
                  transformOrigin: 'right center',
                  transform: `rotate(${tailBaseWag * 1.5}deg)`,
                  boxShadow: `0 0 20px ${COLORS.primaryNeon}`,
                }}
              />
            </div>
          </div>

          {/* ==========================================
              3. MECHA CHASSIS & SHIELD (Badan Utama)
              ========================================== */}
          <div
            style={{
              position: 'absolute',
              left: '80px',
              top: '100px',
              width: '380px',
              height: '150px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '40px',
              border: `4px solid ${COLORS.strokePremium}`,
            }}
          >
            <div style={{ position: 'absolute', left: '40px', top: '35px', display: 'flex', gap: '6px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ width: '8px', height: '40px', backgroundColor: COLORS.accentCore, transform: 'skewX(-20deg)', borderRadius: '2px', opacity: 0.7 + Math.sin(frame * 0.15 + i) * 0.3 }} />
              ))}
            </div>
          </div>

          {/* Armor Plate Luar Depan */}
          <div
            style={{
              position: 'absolute',
              left: '110px',
              top: '85px',
              width: '330px',
              height: '150px',
              backgroundColor: COLORS.plateLight,
              borderRadius: '40px 50px 20px 70px',
              border: `4px solid ${COLORS.strokePremium}`,
              boxShadow: 'inset -15px -15px 0px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: '0', right: '60px', width: '25px', height: '100%', backgroundColor: COLORS.secondaryNeon, transform: 'skewX(-30deg)', opacity: 0.8 }} />
            <div style={{ position: 'absolute', top: '0', right: '95px', width: '8px', height: '100%', backgroundColor: COLORS.strokePremium, transform: 'skewX(-30deg)' }} />

            {/* Core Reaktor Neon */}
            <div
              style={{
                position: 'absolute',
                left: '40%',
                top: '40%',
                width: '45px',
                height: '45px',
                backgroundColor: COLORS.primaryNeon,
                borderRadius: '12px',
                transform: 'rotate(45deg)',
                border: `4px solid ${COLORS.strokePremium}`,
                boxShadow: `0 0 20px ${COLORS.primaryNeon}`,
              }}
            />
          </div>

          {/* ==========================================
              4. ADVANCED MECHA HEAD (Kepala Kat-Bot)
              ========================================== */}
          <div
            style={{
              position: 'absolute',
              left: '390px',
              top: '15px',
              width: '200px',
              height: '170px',
            }}
          >
            <div style={{ position: 'absolute', top: '-20px', left: '20px', width: '45px', height: '60px', backgroundColor: COLORS.secondaryNeon, border: `4px solid ${COLORS.strokePremium}`, borderRadius: '10px 30px 0 0', transform: 'skewX(-10deg)' }} />
            <div style={{ position: 'absolute', top: '-30px', right: '40px', width: '55px', height: '75px', backgroundColor: COLORS.plateLight, border: `4px solid ${COLORS.strokePremium}`, borderRadius: '35px 45px 0 0', boxShadow: 'inset -8px 0px 0px rgba(0,0,0,0.1)' }}>
              <div style={{ position: 'absolute', top: '15px', right: '10px', width: '20px', height: '40px', backgroundColor: COLORS.accentCore, borderRadius: '20px' }} />
            </div>

            {/* Kepala Utama */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: COLORS.plateLight,
                borderRadius: '40px 60px 40px 40px',
                border: `4px solid ${COLORS.strokePremium}`,
                boxShadow: 'inset -12px -12px 0px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
            >
              {/* Visor Tactical LED */}
              <div
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '35px',
                  width: '130px',
                  height: '50px',
                  backgroundColor: COLORS.chassisDark,
                  borderRadius: '20px 0 0 20px',
                  border: `4px solid ${COLORS.strokePremium}`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '20px',
                }}
              >
                <div
                  style={{
                    width: '70px',
                    height: '14px',
                    backgroundColor: COLORS.primaryNeon,
                    borderRadius: '4px',
                    transform: `scaleY(${eyeScaleY})`,
                    boxShadow: `0 0 15px ${COLORS.primaryNeon}`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ==========================================
              5. RANGKA MEKANIKAL DEPAN & KAKI (Muka)
              ========================================== */}
          {/* Kaki Belakang Kanan */}
          <div
            style={{
              position: 'absolute',
              left: '180px',
              top: '220px',
              width: '54px',
              height: '150px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '25px',
              border: `4px solid ${COLORS.strokePremium}`,
              transformOrigin: 'top center',
              transform: `rotate(${legBR}deg)`,
              boxShadow: '5px 10px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ position: 'absolute', top: '20px', left: '3px', width: '40px', height: '95px', backgroundColor: COLORS.plateLight, borderRadius: '16px', border: `3px solid ${COLORS.strokePremium}` }}>
              <div style={{ width: '18px', height: '18px', backgroundColor: COLORS.goldAccent, borderRadius: '50%', margin: '10px auto', border: `2px solid ${COLORS.strokePremium}` }} />
            </div>
          </div>

          {/* Kaki Depan Kanan */}
          <div
            style={{
              position: 'absolute',
              left: '450px',
              top: '220px',
              width: '54px',
              height: '150px',
              backgroundColor: COLORS.chassisDark,
              borderRadius: '25px',
              border: `4px solid ${COLORS.strokePremium}`,
              transformOrigin: 'top center',
              transform: `rotate(${legFR}deg)`,
              boxShadow: '5px 10px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ position: 'absolute', top: '20px', left: '3px', width: '40px', height: '95px', backgroundColor: COLORS.plateLight, borderRadius: '16px', border: `3px solid ${COLORS.strokePremium}` }}>
              <div style={{ width: '18px', height: '18px', backgroundColor: COLORS.goldAccent, borderRadius: '50%', margin: '10px auto', border: `2px solid ${COLORS.strokePremium}` }} />
            </div>
          </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};