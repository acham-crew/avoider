'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { connectWallet as web3Connect, disconnectWallet as web3Disconnect } from '@/lib/web3/wallet';

const WalletConnectButton = () => {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleConnect = async () => {
    const connection = await web3Connect();
    if (connection.isConnected && connection.address) {
      connectWallet(connection.address);
    }
  };

  const handleDisconnect = () => {
    web3Disconnect();
    disconnectWallet();
  };

  const truncateAddress = (address: string) => {
    if (isMobile) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isWalletConnected && walletAddress) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px' }}>
        <span style={{
          padding: isMobile ? '6px 10px' : '8px 14px',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: 'bold',
          color: '#00ff00',
          backgroundColor: '#1a1a1a',
          border: '1px solid #00ff00',
          borderRadius: '6px',
        }}>
          {truncateAddress(walletAddress)}
        </span>
        {!isMobile && (
          <button
            onClick={handleDisconnect}
            style={{
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#ff0000',
              color: '#fff',
              borderRadius: '6px',
            }}
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      style={{
        padding: isMobile ? '8px 16px' : '10px 20px',
        fontSize: isMobile ? '12px' : '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#00ff00',
        color: '#000',
        borderRadius: '8px',
      }}
    >
      {isMobile ? 'Connect' : 'Connect Wallet'}
    </button>
  );
};

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header
      style={{
        width: '100%',
        padding: isMobile ? '15px' : '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #00ff00',
        backgroundColor: '#0a0a0a',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        boxSizing: 'border-box',
        height: isMobile ? '60px' : '70px',
      }}
    >
      <h1 style={{
        fontSize: isMobile ? '18px' : '24px',
        color: '#00ff00',
        margin: 0,
        fontWeight: 'bold',
        letterSpacing: isMobile ? '1px' : '2px',
      }}>
        GIWA DODGE
      </h1>
      <WalletConnectButton />
    </header>
  );
}
