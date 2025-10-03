# 플레이어 애니메이션 추가 가이드

## 개요

플레이어가 좌우로 움직일 때 애니메이션을 추가하려면 **스프라이트 시트(Sprite Sheet)**를 사용해야 합니다.

---

## 1. 스프라이트 시트란?

여러 프레임의 이미지를 하나의 이미지 파일에 나란히 배치한 것입니다.

### 예시 구조

```
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │  ← idle (대기)
├─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │  ← move-left (왼쪽 이동)
├─────┼─────┼─────┼─────┤
│  9  │ 10  │ 11  │ 12  │  ← move-right (오른쪽 이동)
└─────┴─────┴─────┴─────┘
```

---

## 2. 스프라이트 시트 제작

### 방법 1: 온라인 툴 사용
- **Piskel**: https://www.piskelapp.com/ (무료, 픽셀 아트)
- **Aseprite**: https://www.aseprite.org/ (유료, 전문가용)
- **LibreSprite**: https://libresprite.github.io/ (무료, Aseprite 오픈소스 버전)

### 방법 2: 이미지 편집기
1. Photoshop, GIMP 등에서 캔버스 생성
2. 각 프레임을 동일한 크기로 그리기
3. 수평 또는 그리드로 배치
4. PNG로 내보내기

### 권장 사양
- **프레임 크기**: 32x32, 64x64, 또는 80x80 픽셀
- **프레임 수**:
  - idle (대기): 2-4 프레임
  - move-left: 4-8 프레임
  - move-right: 4-8 프레임 (또는 move-left 좌우 반전)
- **포맷**: PNG (투명 배경)
- **레이아웃**: 수평 또는 그리드

---

## 3. 파일 배치

### 옵션 1: 단일 스프라이트 시트 (권장)
```
public/
  assets/
    game/
      player-spritesheet.png  # 모든 애니메이션 포함
```

### 옵션 2: 개별 스프라이트 시트
```
public/
  assets/
    game/
      player-idle.png         # 대기 애니메이션
      player-move-left.png    # 왼쪽 이동
      player-move-right.png   # 오른쪽 이동
```

---

## 4. 코드 수정

### 4.1 PreloaderScene.ts - 스프라이트 시트 로드

#### 단일 스프라이트 시트 방식

```typescript
// src/components/game/scenes/PreloaderScene.ts

preload() {
  // ... 로딩 바 코드 ...

  // 스프라이트 시트 로드
  this.load.spritesheet('player', '/assets/game/player-spritesheet.png', {
    frameWidth: 64,   // 각 프레임의 가로 크기
    frameHeight: 64,  // 각 프레임의 세로 크기
  });

  // 다른 에셋들
  this.load.image('giwa', '/assets/game/giwa.png');
  // ...
}

create() {
  // 애니메이션 생성
  this.createPlayerAnimations();

  this.scene.start('GameScene');
}

private createPlayerAnimations() {
  // idle 애니메이션 (프레임 0-3)
  this.anims.create({
    key: 'player-idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 8,      // 초당 8프레임
    repeat: -1         // 무한 반복
  });

  // 왼쪽 이동 애니메이션 (프레임 4-7)
  this.anims.create({
    key: 'player-move-left',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 12,
    repeat: -1
  });

  // 오른쪽 이동 애니메이션 (프레임 8-11)
  this.anims.create({
    key: 'player-move-right',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
    frameRate: 12,
    repeat: -1
  });
}
```

#### 개별 스프라이트 시트 방식

```typescript
preload() {
  this.load.spritesheet('player-idle', '/assets/game/player-idle.png', {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet('player-move', '/assets/game/player-move.png', {
    frameWidth: 64,
    frameHeight: 64,
  });
}

create() {
  // idle 애니메이션
  this.anims.create({
    key: 'player-idle',
    frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });

  // 이동 애니메이션 (좌우 반전으로 재사용)
  this.anims.create({
    key: 'player-move',
    frames: this.anims.generateFrameNumbers('player-move', { start: 0, end: 7 }),
    frameRate: 12,
    repeat: -1
  });

  this.scene.start('GameScene');
}
```

### 4.2 Player.ts - 애니메이션 재생

```typescript
// src/components/game/objects/Player.ts

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveLeft: boolean = false;
  private moveRight: boolean = false;
  private speedBoostActive: boolean = false;
  private currentDirection: 'idle' | 'left' | 'right' = 'idle'; // 추가

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 기존 설정...
    this.setCollideWorldBounds(true);
    this.setDrag(GAME_CONFIG.playerDrag, 0);
    this.setMaxVelocity(GAME_CONFIG.playerSpeed, 0);

    // 초기 애니메이션 재생
    this.play('player-idle');

    // 입력 설정...
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
    }

    scene.input.on('pointerdown', this.handlePointerDown, this);
    scene.input.on('pointerup', this.handlePointerUp, this);
    scene.input.on('pointermove', this.handlePointerMove, this);
  }

  public update() {
    // 이동 방향 결정
    let isMovingLeft = false;
    let isMovingRight = false;

    // 키보드 입력
    if (this.cursors) {
      if (this.cursors.left.isDown) {
        this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
        isMovingLeft = true;
      } else if (this.cursors.right.isDown) {
        this.setAccelerationX(GAME_CONFIG.playerAcceleration);
        isMovingRight = true;
      } else if (!this.moveLeft && !this.moveRight) {
        this.setAccelerationX(0);
      }
    }

    // 터치 입력
    if (this.moveLeft) {
      this.setAccelerationX(-GAME_CONFIG.playerAcceleration);
      isMovingLeft = true;
    } else if (this.moveRight) {
      this.setAccelerationX(GAME_CONFIG.playerAcceleration);
      isMovingRight = true;
    } else if (this.cursors && !this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.setAccelerationX(0);
    }

    // 애니메이션 업데이트
    this.updateAnimation(isMovingLeft, isMovingRight);
  }

  private updateAnimation(isMovingLeft: boolean, isMovingRight: boolean) {
    // 왼쪽 이동
    if (isMovingLeft) {
      if (this.currentDirection !== 'left') {
        this.play('player-move-left', true);
        this.currentDirection = 'left';
      }
    }
    // 오른쪽 이동
    else if (isMovingRight) {
      if (this.currentDirection !== 'right') {
        this.play('player-move-right', true);
        this.currentDirection = 'right';
      }
    }
    // 대기 (정지)
    else {
      if (this.currentDirection !== 'idle') {
        this.play('player-idle', true);
        this.currentDirection = 'idle';
      }
    }
  }

  // ... 나머지 메서드들 ...
}
```

---

## 5. 스프라이트 시트가 없을 때 (좌우 반전)

스프라이트 시트 제작이 어렵다면 이동 애니메이션 하나만 만들고 좌우 반전으로 재사용할 수 있습니다:

```typescript
// Player.ts

private updateAnimation(isMovingLeft: boolean, isMovingRight: boolean) {
  if (isMovingLeft) {
    this.setFlipX(true);  // 좌우 반전
    if (this.currentDirection !== 'left') {
      this.play('player-move', true);
      this.currentDirection = 'left';
    }
  }
  else if (isMovingRight) {
    this.setFlipX(false); // 원래대로
    if (this.currentDirection !== 'right') {
      this.play('player-move', true);
      this.currentDirection = 'right';
    }
  }
  else {
    if (this.currentDirection !== 'idle') {
      this.play('player-idle', true);
      this.currentDirection = 'idle';
    }
  }
}
```

---

## 6. 간단한 예제 스프라이트 시트

### 최소 구성 (2개 애니메이션)
```
player-spritesheet.png (256x64 픽셀)

┌──────┬──────┬──────┬──────┐
│ idle │ idle │ move │ move │
│  1   │  2   │  1   │  2   │
└──────┴──────┴──────┴──────┘
   64     64     64     64
```

### 코드 예제
```typescript
// PreloaderScene.ts
this.load.spritesheet('player', '/assets/game/player-spritesheet.png', {
  frameWidth: 64,
  frameHeight: 64,
});

this.anims.create({
  key: 'player-idle',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
  frameRate: 4,
  repeat: -1
});

this.anims.create({
  key: 'player-move',
  frames: this.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
  frameRate: 8,
  repeat: -1
});
```

---

## 7. 무료 스프라이트 시트 다운로드

제작이 어렵다면 무료 리소스를 사용할 수 있습니다:

- **itch.io**: https://itch.io/game-assets/free/tag-sprites
- **OpenGameArt**: https://opengameart.org/art-search?keys=spritesheet
- **Kenney**: https://kenney.nl/assets?q=2d (픽셀 아트 스프라이트)
- **Craftpix**: https://craftpix.net/freebies/ (무료 게임 에셋)

---

## 8. 적용 순서

1. ✅ 스프라이트 시트 제작 또는 다운로드
2. ✅ `public/assets/game/player-spritesheet.png` 에 저장
3. ✅ `PreloaderScene.ts` 수정 (spritesheet 로드 + 애니메이션 생성)
4. ✅ `Player.ts` 수정 (애니메이션 재생 로직 추가)
5. ✅ `npm run dev` 재시작
6. ✅ 브라우저에서 확인

---

## 9. 트러블슈팅

### 애니메이션이 보이지 않을 때
- 스프라이트 시트 경로 확인
- `frameWidth`, `frameHeight` 값 확인
- 브라우저 콘솔에서 에러 확인

### 애니메이션이 너무 빠르거나 느릴 때
- `frameRate` 값 조정 (일반적으로 8-15)

### 프레임이 잘못 잘릴 때
- 스프라이트 시트 크기와 `frameWidth/Height` 일치 확인
- 프레임 사이 여백 제거

---

필요하시면 제가 직접 코드를 수정해드릴 수도 있습니다!
