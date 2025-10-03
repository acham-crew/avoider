'use client';

import dynamic from 'next/dynamic';
import ScoreDisplay from '@/components/ui/ScoreDisplay';
import Header from '@/components/ui/Header';
import SidePanelLeft from '@/components/ui/SidePanelLeft';
import SidePanelRight from '@/components/ui/SidePanelRight';
import GameStartOverlay from '@/components/ui/GameStartOverlay';

const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
});

export default function Home() {
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
