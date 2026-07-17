import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Membagi layar menjadi grid 4x3 lingkaran
  const rows = 3;
  const cols = 4;
  const items = Array.from({ length: rows * cols });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#0d0e15", // Warna background gelap estetik
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        padding: 100,
        boxSizing: "border-box",
        width,
        height,
      }}
    >
      {items.map((_, index) => {
        // Efek animasi bergelombang (delay antar lingkaran berdasarkan posisinya)
        const delay = (index % cols) * 5 + Math.floor(index / cols) * 8;
        
        // Membuat animasi membesar-mengecil yang smooth menggunakan fungsi matematika Sinus
        const scale = interpolate(
          Math.sin((frame - delay) * 0.07),
          [-1, 1],
          [0.3, 1.2]
        );

        // Perubahan warna gradasi neon yang dinamis
        const hue = (index * 15 + frame * 0.5) % 360;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 250,
                height: 250,
                borderRadius: "50%",
                background: `linear-gradient(135deg, hsl(${hue}, 80%, 60%), hsl(${(hue + 60) % 360}, 80%, 40%))`,
                transform: `scale(${scale})`,
                boxShadow: `0 0 50px rgba(0,0,0,0.5)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
