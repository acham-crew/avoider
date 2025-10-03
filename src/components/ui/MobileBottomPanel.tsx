'use client';

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import ShopModal from './ShopModal';

export default function MobileBottomPanel() {
  const [activeTab, setActiveTab] = useState<'stats' | 'character'>('stats');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const { highScore, claimablePoints, claimPoints, isWalletConnected } = useGameStore();

  return (
    <>
      <div style={{
        width: '100%',
        backgroundColor: '#1a1a1a',
        borderTop: '2px solid #444',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: '1px solid #444' }}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: activeTab === 'stats' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'stats' ? '#00ff00' : '#888',
              border: 'none',
              borderRight: '1px solid #444',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📊 STATS
          </button>
          <button
            onClick={() => setActiveTab('character')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: activeTab === 'character' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'character' ? '#00ff00' : '#888',
              border: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            👤 CHARACTER
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '15px', height: '150px', overflow: 'auto' }}>
          {activeTab === 'stats' ? (
            <div style={{ color: '#fff' }}>
              {isWalletConnected ? (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>HIGH SCORE</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff00' }}>
                      {Math.floor(highScore)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>POINTS</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff00' }}>
                      {claimablePoints}
                    </div>
                    <button
                      onClick={claimPoints}
                      disabled={claimablePoints <= 0}
                      style={{
                        marginTop: '8px',
                        padding: '6px 20px',
                        fontSize: '14px',
                        cursor: claimablePoints > 0 ? 'pointer' : 'not-allowed',
                        backgroundColor: claimablePoints > 0 ? '#00ff00' : '#555',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        opacity: claimablePoints > 0 ? 1 : 0.5,
                      }}
                    >
                      Claim
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{ fontSize: '14px', color: '#888' }}>
                    지갑을 연결하여 점수를 기록하고<br />포인트를 획득하세요.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 10px',
                backgroundColor: '#2a2a2a',
                border: '2px solid #444',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
              }}>
                🎮
              </div>
              <button
                onClick={() => setIsShopOpen(true)}
                style={{
                  padding: '10px 30px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#00ff00',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                }}
              >
                🛒 SHOP
              </button>
            </div>
          )}
        </div>
      </div>

      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </>
  );
}
