'use client';

import CharacterPreview from './CharacterPreview';

export default function SidePanelRight() {
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
        <h4 style={{ marginBottom: '10px' }}>Costume</h4>
        <p style={{ color: '#888' }}>(Coming Soon)</p>
      </div>
    </div>
  );
}
