import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        // ID unik untuk komponen video utama
        id="CyberMechaCat"
        component={Main}
        
        // Konfigurasi Spesifikasi Premium Adobe Stock (4K UHD)
        width={3840}
        height={2160}
        
        // Frame Rate & Durasi Siklus (Perfect Loop 160 Frame)
        fps={30}
        durationInFrames={300}
        
        // Pengaturan default metadata (opsional)
        defaultProps={{}}
      />
    </>
  );
};