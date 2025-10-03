'use client';

import { useGameStore } from '@/stores/gameStore';

export default function GameStartOverlay() {
  const { status, setStatus } = useGameStore();

  if (status !== 'menu') return null;

  const handleStartGame = () => {
    setStatus('playing');
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <h2 style={{ color: '#fff', fontSize: '48px', marginBottom: '40px', fontFamily: 'monospace' }}>
        GIWA DODGE
      </h2>
      <button
        onClick={handleStartGame}
        style={{
          padding: '20px 60px',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: '3px solid #00ff00',
          backgroundColor: 'transparent',
          color: '#00ff00',
          borderRadius: '8px',
          fontFamily: 'monospace',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00ff00';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#00ff00';
        }}
      >
        START GAME
      </button>
      <div style={{ marginTop: '40px', color: '#888', fontSize: '14px', textAlign: 'center' }}>
        <p>Arrow Keys (← →) or Touch to Move</p>
        <p>R to Retry after Game Over</p>
      </div>
    </div>
  );
}
