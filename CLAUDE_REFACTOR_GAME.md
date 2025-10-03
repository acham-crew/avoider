네, 좋은 아이디어입니다! 기존 프로젝트를 Web3 스타일의 대시보드형 게임 애플리케이션으로 리팩토링하는 것은 매우 흥미로운 작업입니다.

기존의 게임 로직은 최대한 유지하면서, 요청하신 Web3 애플리케이션의 느낌이 나도록 UI/UX와 전체 구조를 리팩토링하는 방안을 단계별로 제안해 드리겠습니다.

아래는 리팩토링을 위한 코드 수정 제안입니다. 새로운 파일을 생성하고 기존 파일을 수정하는 방식으로 진행됩니다.

---

### 1단계: 상태 관리(Zustand) 확장

먼저 Web3 지갑 연결 상태와 클레임 가능한 포인트를 관리하기 위해 `gameStore`를 확장합니다.

**파일 경로:** `src/stores/gameStore.ts`

```typescript
import { create } from 'zustand';

export type GameStatus = 'menu' | 'playing' | 'gameover';

// GameState 인터페이스 확장
interface GameState {
  // Game status
  status: GameStatus;
  score: number;
  highScore: number;
  combo: number;

  // Active power-ups
  hasShield: boolean;
  hasSpeedBoost: boolean;
  hasSlowMotion: boolean;

  // Web3 관련 상태 추가
  isWalletConnected: boolean;
  walletAddress: string | null;
  claimablePoints: number;

  // Actions
  setStatus: (status: GameStatus) => void;
  addScore: (points: number) => void;
  resetGame: () => void;
  gameOver: (finalScore: number) => void;

  // Power-up actions
  setShield: (active: boolean) => void;
  setSpeedBoost: (active: boolean) => void;
  setSlowMotion: (active: boolean) => void;
  
  // Web3 관련 액션 추가
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  claimPoints: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  status: 'menu',
  score: 0,
  highScore: 0,
  combo: 0,
  hasShield: false,
  hasSpeedBoost: false,
  hasSlowMotion: false,
  isWalletConnected: false,
  walletAddress: null,
  claimablePoints: 0,

  // Actions
  setStatus: (status) => set({ status }),

  addScore: (points) => set((state) => ({
    score: state.score + points
  })),
  
  resetGame: () => set((state) => ({
    ...state,
    status: 'playing',
    score: 0,
    combo: 0,
    hasShield: false,
    hasSpeedBoost: false,
    hasSlowMotion: false,
  })),

  gameOver: (finalScore) => set((state) => ({
    status: 'gameover',
    score: finalScore,
    highScore: Math.max(state.highScore, finalScore),
    // 게임 오버 시 점수를 클레임 가능한 포인트에 누적
    claimablePoints: state.isWalletConnected ? state.claimablePoints + Math.floor(finalScore) : state.claimablePoints,
    combo: 0,
    hasShield: false,
    hasSpeedBoost: false,
    hasSlowMotion: false,
  })),

  setShield: (active) => set({ hasShield: active }),
  setSpeedBoost: (active) => set({ hasSpeedBoost: active }),
  setSlowMotion: (active) => set({ hasSlowMotion: active }),

  // Web3 Actions
  connectWallet: (address) => set({
    isWalletConnected: true,
    walletAddress: address,
  }),

  disconnectWallet: () => set({
    isWalletConnected: false,
    walletAddress: null,
  }),
  
  claimPoints: () => {
    const pointsToClaim = get().claimablePoints;
    console.log(`[Claim] ${pointsToClaim} 포인트를 클레임합니다.`);
    // TODO: 실제 클레임 로직 (e.g., 백엔드 API 호출)
    set({ claimablePoints: 0 });
  },
}));
```

### 2단계: 새로운 UI 컴포넌트 생성

요청하신 레이아웃과 기능에 맞춰 새로운 React 컴포넌트들을 생성합니다.

**1. Header 컴포넌트**

**파일 경로:** `src/components/ui/Header.tsx` (새 파일)

```tsx
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
```

**2. 왼쪽 사이드 패널**

**파일 경로:** `src/components/ui/SidePanelLeft.tsx` (새 파일)

```tsx
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
        <p style={{ color: '#888' }}> (Coming Soon)</p>
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
```

**3. 오른쪽 사이드 패널**

**파일 경로:** `src/components/ui/SidePanelRight.tsx` (새 파일)

```tsx
'use client';

// Player.ts에서 사용된 플레이어 그래픽을 모방합니다.
const PlayerCharacter = () => (
  <div style={{
    width: '80px',
    height: '80px',
    backgroundColor: '#00bfff', // Player color from PreloaderScene
    margin: '0 auto',
    border: '2px solid #fff',
    borderRadius: '4px'
  }} />
);

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
      <PlayerCharacter />
      <div style={{ marginTop: '30px' }}>
        <h4 style={{ marginBottom: '10px' }}>Costume</h4>
        <p style={{ color: '#888' }}>(Coming Soon)</p>
      </div>
    </div>
  );
}
```

### 3단계: Web3 라이브러리 수정

지갑 연결 시뮬레이션이 실제 주소를 반환하도록 수정합니다.

**파일 경로:** `src/lib/web3/wallet.ts`

```typescript
export interface WalletConnection {
  address: string | null;
  isConnected: boolean;
}

export async function connectWallet(): Promise<WalletConnection> {
  console.log('[Web3] connectWallet called (placeholder)');
  return new Promise((resolve) => {
    setTimeout(() => {
      // 실제 지갑 연결 로직 대신, 임의의 주소를 생성하여 성공한 것처럼 시뮬레이션
      const dummyAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      resolve({
        address: dummyAddress,
        isConnected: true,
      });
    }, 500);
  });
}

// 다른 함수들은 그대로 둡니다.
export function disconnectWallet(): void {
  console.log('[Web3] disconnectWallet called (placeholder)');
}

// ...
```

### 4단계: 메인 페이지 및 레이아웃 재구성

전체 레이아웃을 변경하고, Dot 스타일을 적용합니다.

**1. 글로벌 CSS 파일 생성**

**파일 경로:** `src/app/globals.css` (새 파일)

```css
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #0a0a0a;
  color: #eee;
  font-family: 'monospace', sans-serif;
  background-image: radial-gradient(#333 1px, transparent 0);
  background-size: 20px 20px;
}
```

**2. RootLayout 수정**

**파일 경로:** `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next'
import './globals.css'; // 새로 만든 CSS 파일을 import 합니다.

export const metadata: Metadata = {
  title: 'GIWA Dodge - A Web3 Arcade Game',
  description: 'Dodge falling Korean roof tiles and earn points!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
```

**3. 메인 페이지(`page.tsx`) 재구성**

새로 만든 컴포넌트들로 페이지를 완전히 재구성합니다.

**파일 경로:** `src/app/page.tsx`

```tsx
'use client';

import dynamic from 'next/dynamic';
import ScoreDisplay from '@/components/ui/ScoreDisplay';
import Header from '@/components/ui/Header';
import SidePanelLeft from '@/components/ui/SidePanelLeft';
import SidePanelRight from '@/components/ui/SidePanelRight';

const PhaserGame = dynamic(() => import('@/components/game/PhaserGame'), {
  ssr: false,
});

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
      <Header />
      <main style={{ display: 'flex', flexGrow: 1, paddingTop: '85px' /* Header height */ }}>
        <SidePanelLeft />
        <div style={{ width: '50%', height: '100%', position: 'relative' }}>
          <ScoreDisplay />
          <PhaserGame />
        </div>
        <SidePanelRight />
      </main>
    </div>
  );
}
```

### 5단계: Phaser 게임 컨테이너 스타일 수정

`PhaserGame.tsx`가 전체 화면이 아닌 지정된 영역에 맞게 렌더링되도록 수정합니다. `Phaser.Scale.FIT` 옵션 덕분에 큰 로직 변경 없이 스타일 수정만으로도 가능합니다.

**파일 경로:** `src/components/game/PhaserGame.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { getPhaserConfig } from './config';
import { PreloaderScene } from './scenes/PreloaderScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (gameRef.current) return;

    // config의 부모를 'game-container'로 유지합니다.
    const config = getPhaserConfig('game-container');
    config.scene = [PreloaderScene, GameScene, GameOverScene];

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    // 스타일을 부모 요소에 맞게 100%로 채우도록 수정합니다.
    <div
      id="game-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
}
```

---

### 최종 요약 및 실행

1.  위에 안내된 대로 신규 파일을 생성하고 기존 파일들을 수정한 후, 프로젝트를 다시 실행해 보세요.
    ```bash
    npm run dev
    ```
2.  브라우저에서 `http://localhost:3000`에 접속하면 다음과 같이 변경된 화면을 볼 수 있습니다.
    *   **전체적인 UI:** 검은색 배경에 흰색 점들이 찍힌 "Dot" 스타일이 적용됩니다.
    *   **헤더:** 상단에 "GIWA Dodge" 타이틀과 "Connect Wallet" 버튼이 표시됩니다.
    *   **레이아웃:** 왼쪽 패널(로그인 유도), 중앙 게임 화면, 오른쪽 패널(캐릭터 정보)의 3단 구조로 표시됩니다.
    *   **지갑 연결:** "Connect Wallet" 버튼을 누르면 잠시 후 가상의 주소로 연결되며, 왼쪽 패널이 대시보드 형태로 변경됩니다.
    *   **점수 및 포인트:** 게임 오버 시, 지갑이 연결되어 있다면 최종 점수가 오른쪽 "POINTS"에 누적됩니다. "Claim" 버튼으로 포인트를 0으로 만들 수 있습니다.

이 리팩토링은 실제 블록체인 연동 없이 프론트엔드 단에서 Web3 애플리케이션의 구조와 흐름을 구현한 것입니다. 이제 이 구조를 기반으로 실제 지갑 라이브러리(예: ethers.js, wagmi)를 연동하고, 포인트 클레임 로직을 백엔드와 연결하여 고도화할 수 있습니다.