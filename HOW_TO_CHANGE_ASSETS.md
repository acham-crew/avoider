# 게임 에셋 변경 가이드

## 1. 이미지 파일 준비

### 필요한 이미지 파일들

| 오브젝트 | 파일명 | 권장 크기 | 설명 |
|---------|--------|-----------|------|
| 플레이어 | `player.png` | 80x80 픽셀 | 게임 캐릭터 |
| 기와 타일 | `giwa.png` | 100x60 픽셀 | 떨어지는 장애물 |
| 보물 상자 | `item-chest.png` | 60x60 픽셀 | 점수 +500 |
| 신발 | `item-shoes.png` | 60x60 픽셀 | 속도 증가 |
| 방패 | `item-shield.png` | 60x60 픽셀 | 무적 상태 |
| 시계 | `item-clock.png` | 60x60 픽셀 | 슬로우 모션 |

### 이미지 제작 팁
- **포맷**: PNG (투명 배경 권장)
- **스타일**: 픽셀 아트, 카툰, 또는 미니멀 디자인
- **색상**: 어두운 배경(#0a0a0a)과 대비되는 밝은 색상
- **해상도**: 레티나 디스플레이를 위해 실제 크기의 2배로 제작

## 2. 파일 배치

아래 경로에 이미지 파일을 저장하세요:

```
public/
  assets/
    game/
      player.png
      giwa.png
      item-chest.png
      item-shoes.png
      item-shield.png
      item-clock.png
```

## 3. 코드 수정

### PreloaderScene.ts 수정

`src/components/game/scenes/PreloaderScene.ts` 파일에서:

#### 현재 코드 (그래픽 생성)
```typescript
private createPlaceholderGraphics() {
  // 현재는 코드로 그래픽을 생성
}
```

#### 변경 후 코드 (이미지 로드)
```typescript
preload() {
  // ... 기존 로딩 바 코드 ...

  // 이미지 파일 로드
  this.load.image('player', '/assets/game/player.png');
  this.load.image('giwa', '/assets/game/giwa.png');
  this.load.image('item-chest', '/assets/game/item-chest.png');
  this.load.image('item-shoes', '/assets/game/item-shoes.png');
  this.load.image('item-shield', '/assets/game/item-shield.png');
  this.load.image('item-clock', '/assets/game/item-clock.png');

  // createPlaceholderGraphics() 호출 제거 또는 주석 처리
}
```

## 4. 이미지가 없을 때 대비

이미지 파일이 없으면 현재처럼 자동 생성된 그래픽이 사용됩니다.

### 하이브리드 방식 (이미지 우선, 없으면 그래픽)

```typescript
preload() {
  // ... 로딩 바 코드 ...

  // 이미지 로드 시도
  this.load.on('loaderror', (file: any) => {
    console.warn(`Failed to load: ${file.key}, using placeholder`);
  });

  this.load.image('player', '/assets/game/player.png');
  this.load.image('giwa', '/assets/game/giwa.png');
  this.load.image('item-chest', '/assets/game/item-chest.png');
  this.load.image('item-shoes', '/assets/game/item-shoes.png');
  this.load.image('item-shield', '/assets/game/item-shield.png');
  this.load.image('item-clock', '/assets/game/item-clock.png');
}

create() {
  // 이미지 로드 실패 시 그래픽 생성
  if (!this.textures.exists('player')) {
    this.createPlayerGraphic();
  }
  // ... 다른 에셋들도 동일하게 처리 ...

  this.scene.start('GameScene');
}

private createPlayerGraphic() {
  const graphics = this.add.graphics();
  graphics.fillStyle(0x00bfff, 1);
  graphics.fillRect(0, 0, 40, 40);
  graphics.generateTexture('player', 40, 40);
  graphics.destroy();
}
```

## 5. 크기 조정

### 게임 내 크기 변경

`src/components/game/config.ts` 파일에서 크기를 조정할 수 있습니다:

```typescript
export const GAME_CONFIG = {
  // ... 기타 설정 ...
  playerSize: { width: 40, height: 40 },  // 플레이어 크기
  giwaSize: { width: 50, height: 30 },    // 기와 크기
  itemSize: { width: 30, height: 30 },    // 아이템 크기
}
```

### 개별 오브젝트에서 크기 설정

#### Player.ts
```typescript
constructor(scene: Phaser.Scene, x: number, y: number) {
  super(scene, x, y, 'player');
  // ... 기존 코드 ...

  // 이미지 크기 조정
  this.setDisplaySize(40, 40);
  // 또는 스케일 조정
  this.setScale(0.5); // 50% 크기
}
```

## 6. 무료 리소스 사이트

이미지를 직접 제작하기 어렵다면:

- **itch.io**: https://itch.io/game-assets/free
- **OpenGameArt**: https://opengameart.org/
- **Kenney**: https://kenney.nl/assets (픽셀 아트)
- **Flaticon**: https://www.flaticon.com/ (아이콘)

## 7. 플레이어 애니메이션 추가

플레이어가 움직일 때 애니메이션을 추가하려면:
- **스프라이트 시트 (Sprite Sheet)** 필요
- 자세한 내용은 `HOW_TO_ADD_ANIMATION.md` 참조

간단 요약:
1. 여러 프레임을 하나의 이미지에 배치 (예: idle 2프레임 + move 4프레임)
2. `player-spritesheet.png`로 저장
3. `this.load.spritesheet()` 사용
4. `this.anims.create()`로 애니메이션 정의
5. `this.play('animation-name')`로 재생

## 8. 변경 후 확인

1. 이미지 파일을 `public/assets/game/` 폴더에 배치
2. PreloaderScene.ts 수정
3. 개발 서버 재시작: `npm run dev`
4. 브라우저에서 확인

## 9. 예제: 간단한 에셋 적용

```typescript
// src/components/game/scenes/PreloaderScene.ts

preload() {
  // 로딩 바 UI 코드...

  // 이미지 파일 로드
  this.load.image('player', '/assets/game/player.png');
  this.load.image('giwa', '/assets/game/giwa.png');
  this.load.image('item-chest', '/assets/game/item-chest.png');
  this.load.image('item-shoes', '/assets/game/item-shoes.png');
  this.load.image('item-shield', '/assets/game/item-shield.png');
  this.load.image('item-clock', '/assets/game/item-clock.png');

  // createPlaceholderGraphics() 메서드 호출 제거
}

create() {
  this.scene.start('GameScene');
}
```

이렇게 수정하면 이미지 파일이 자동으로 로드되어 게임에 적용됩니다!
