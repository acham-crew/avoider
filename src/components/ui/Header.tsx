'use client';

import { useGameStore } from '@/stores/gameStore';
import { connectWallet as web3Connect, disconnectWallet as web3Disconnect } from '@/lib/web3/wallet';

const WalletConnectButton = () => {
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } = useGameStore();

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

  const truncateAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <button
      onClick={isWalletConnected ? handleDisconnect : handleConnect}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: '2px solid #888',
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: '8px',
      }}
    >
      {isWalletConnected && walletAddress ? `Disconnect (${truncateAddress(walletAddress)})` : 'Connect Wallet'}
    </button>
  );
};

export default function Header() {
  return (
    <header
      style={{
        width: '100%',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #444',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        boxSizing: 'border-box'
      }}
    >
      <h1 style={{ fontSize: '24px', color: '#fff', margin: 0 }}>GIWA Dodge</h1>
      <WalletConnectButton />
    </header>
  );
}
