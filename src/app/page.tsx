'use client';

import dynamic from 'next/dynamic';
import ScoreDisplay from '@/components/ui/ScoreDisplay';

// Dynamically import PhaserGame to avoid SSR issues
const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ScoreDisplay />
      <PhaserGame />
    </main>
  );
}
