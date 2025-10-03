'use client';

import { useGameStore } from '@/stores/gameStore';

const LoginPrompt = () => (
  <div style={{ textAlign: 'center' }}>
    <h3 style={{ marginBottom: '20px' }}>Connect Wallet</h3>
    <p>지갑을 연결하여 점수를 기록하고<br />포인트를 획득하세요.</p>
    <p style={{ marginTop: '30px', fontSize: '12px', color: '#888' }}>
      (Demo version is running)
    </p>
  </div>
);

const UserDashboard = () => {
  const { highScore, claimablePoints, claimPoints } = useGameStore();

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>HIGH SCORE</h3>
        <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{Math.floor(highScore)}</p>
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>POINTS</h3>
        <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{claimablePoints}</p>
        <button
          onClick={claimPoints}
          disabled={claimablePoints <= 0}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '18px',
            cursor: claimablePoints > 0 ? 'pointer' : 'not-allowed',
            backgroundColor: claimablePoints > 0 ? '#00ff00' : '#555',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            opacity: claimablePoints > 0 ? 1 : 0.5,
          }}
        >
          Claim
        </button>
      </div>
      <div>
        <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>HISTORY</h3>
        <p style={{ color: '#888' }}>(Coming Soon)</p>
      </div>
    </div>
  );
};

export default function SidePanelLeft() {
  const isWalletConnected = useGameStore((state) => state.isWalletConnected);

  return (
    <div
      style={{
        width: '25%',
        height: '100%',
        padding: '20px',
        borderRight: '1px solid #444',
        color: '#fff',
        boxSizing: 'border-box'
      }}
    >
      {isWalletConnected ? <UserDashboard /> : <LoginPrompt />}
    </div>
  );
}
