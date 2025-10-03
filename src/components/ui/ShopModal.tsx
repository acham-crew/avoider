'use client';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopModal({ isOpen, onClose }: ShopModalProps) {
  if (!isOpen) return null;

  const shopItems = [
    { id: 1, name: 'Knight', type: 'character', price: 1000, image: '🛡️' },
    { id: 2, name: 'Wizard', type: 'character', price: 1500, image: '🧙' },
    { id: 3, name: 'Ninja', type: 'character', price: 2000, image: '🥷' },
    { id: 4, name: 'Red', type: 'color', price: 500, image: '🔴' },
    { id: 5, name: 'Blue', type: 'color', price: 500, image: '🔵' },
    { id: 6, name: 'Gold', type: 'color', price: 800, image: '🟡' },
    { id: 7, name: 'Cape', type: 'costume', price: 1200, image: '🦸' },
    { id: 8, name: 'Hat', type: 'costume', price: 600, image: '🎩' },
  ];

  const handlePurchase = (itemId: number, itemName: string) => {
    console.log(`[Shop] Purchasing item: ${itemName} (ID: ${itemId})`);
    // TODO: 구매 로직 구현
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #00ff00',
          borderRadius: '12px',
          width: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          padding: '30px',
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '2px solid #00ff00',
          paddingBottom: '15px',
        }}>
          <h2 style={{
            color: '#00ff00',
            margin: 0,
            fontSize: '28px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            ⚔️ SHOP ⚔️
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#00ff00',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Player Points */}
        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #00ff00',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '25px',
          textAlign: 'center',
        }}>
          <span style={{ color: '#888', fontSize: '14px' }}>YOUR POINTS</span>
          <div style={{ color: '#00ff00', fontSize: '32px', fontWeight: 'bold' }}>0</div>
        </div>

        {/* Shop Categories */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            color: '#fff',
            fontSize: '16px',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Characters
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '30px',
          }}>
            {shopItems.filter(item => item.type === 'character').map(item => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ff00';
                  e.currentTarget.style.backgroundColor = '#1f1f1f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
                onClick={() => handlePurchase(item.id, item.name)}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.image}</div>
                <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>{item.name}</div>
                <div style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>{item.price} PTS</div>
              </div>
            ))}
          </div>

          <h3 style={{
            color: '#fff',
            fontSize: '16px',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Colors
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '30px',
          }}>
            {shopItems.filter(item => item.type === 'color').map(item => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ff00';
                  e.currentTarget.style.backgroundColor = '#1f1f1f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
                onClick={() => handlePurchase(item.id, item.name)}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.image}</div>
                <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>{item.name}</div>
                <div style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>{item.price} PTS</div>
              </div>
            ))}
          </div>

          <h3 style={{
            color: '#fff',
            fontSize: '16px',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Costumes
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
          }}>
            {shopItems.filter(item => item.type === 'costume').map(item => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00ff00';
                  e.currentTarget.style.backgroundColor = '#1f1f1f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.backgroundColor = '#2a2a2a';
                }}
                onClick={() => handlePurchase(item.id, item.name)}
              >
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.image}</div>
                <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>{item.name}</div>
                <div style={{ color: '#00ff00', fontSize: '16px', fontWeight: 'bold' }}>{item.price} PTS</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
