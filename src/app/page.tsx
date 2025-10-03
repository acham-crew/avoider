'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import ScoreDisplay from '@/components/ui/ScoreDisplay';
import Header from '@/components/ui/Header';
import SidePanelLeft from '@/components/ui/SidePanelLeft';
import SidePanelRight from '@/components/ui/SidePanelRight';
import GameStartOverlay from '@/components/ui/GameStartOverlay';
import MobileBottomPanel from '@/components/ui/MobileBottomPanel';

const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
});

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    // Mobile Layout
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
        <Header />
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          paddingTop: '70px',
          position: 'relative'
        }}>
          <div style={{ flex: 1, position: 'relative', width: '100%' }}>
            <ScoreDisplay />
            <GameStartOverlay />
            <PhaserGame />
          </div>
          <MobileBottomPanel />
        </main>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <Header />
      <main style={{ display: 'flex', flexGrow: 1, paddingTop: '85px' }}>
        <SidePanelLeft />
        <div style={{ width: '50%', height: '100%', position: 'relative' }}>
          <ScoreDisplay />
          <GameStartOverlay />
          <PhaserGame />
        </div>
        <SidePanelRight />
      </main>
    </div>
  );
}
