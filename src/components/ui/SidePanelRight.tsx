'use client';

import { useState } from 'react';
import CharacterPreview from './CharacterPreview';
import ShopModal from './ShopModal';

export default function SidePanelRight() {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div
      style={{
        width: '25%',
        height: '100%',
        padding: '20px',
        borderLeft: '1px solid #444',
        color: '#fff',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}
    >
      <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px', marginBottom: '30px' }}>CHARACTER</h3>
      <CharacterPreview />

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => setIsShopOpen(true)}
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto',
            fontSize: '36px',
            cursor: 'pointer',
            backgroundColor: '#2a2a2a',
            color: '#00ff00',
            border: '2px solid #00ff00',
            borderRadius: '50%',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00ff00';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2a2a2a';
            e.currentTarget.style.color = '#00ff00';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.2)';
          }}
        >
          🛒
        </button>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#00ff00', fontWeight: 'bold' }}>SHOP</p>
      </div>

      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
