'use client';

import { useGameStore } from '@/stores/gameStore';

/**
 * ScoreDisplay - Shows current score and active power-ups
 */
export default function ScoreDisplay() {
  const { score, combo, hasShield, hasSpeedBoost, hasSlowMotion } = useGameStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '20px',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Score: {Math.floor(score)}
          </div>
          {combo > 0 && (
            <div style={{ fontSize: '16px', color: '#ffff00' }}>
              Combo: {combo}x
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
          {hasShield && (
            <div
              style={{
                padding: '5px 10px',
                background: '#00ffff',
                color: '#000',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              SHIELD
            </div>
          )}
          {hasSpeedBoost && (
            <div
              style={{
                padding: '5px 10px',
                background: '#00ff00',
                color: '#000',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              SPEED
            </div>
          )}
          {hasSlowMotion && (
            <div
              style={{
                padding: '5px 10px',
                background: '#ff00ff',
                color: '#000',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              SLOW-MO
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
