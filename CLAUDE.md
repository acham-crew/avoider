# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GIWA Dodge** is a Web3-style 2D arcade game where players dodge falling Korean roof tiles (Giwa - 瓦).
The game features a modern dashboard layout with wallet integration, point claiming system, and character customization support.

## Technology Stack

- **Game Engine:** Phaser 3
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State Management:** Zustand (for UI state)
- **Deployment:** Vercel

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run type checking
npm run type-check
```

## Project Structure

```
/src
  /app                          # Next.js App Router pages
    layout.tsx                  # Root layout with globals.css
    page.tsx                    # Main dashboard page with 3-column layout
    globals.css                 # Global styles (Dot pattern background)
  /components
    /game                       # Phaser 3 game code
      /scenes                   # Game scenes (state machines)
        PreloaderScene.ts       # Asset loading
        GameScene.ts            # Main gameplay
        GameOverScene.ts        # End screen
      /objects                  # Game entities
        Player.ts               # Player character with acceleration-based movement
        Giwa.ts                 # Falling tile obstacle
        Item.ts                 # Collectible items (Chest, Shoes, Shield, Clock)
      /utils                    # Helper functions
      PhaserGame.tsx            # Phaser game container
      config.ts                 # Phaser configuration
    /ui                         # React UI components
      Header.tsx                # Top header with title and wallet connect button
      SidePanelLeft.tsx         # Left panel: login prompt or user dashboard (high score, points, claim, history)
      SidePanelRight.tsx        # Right panel: character display and costume (Coming Soon)
      ScoreDisplay.tsx          # In-game score counter overlay
  /lib
    /web3                       # Web3 integration
      wallet.ts                 # Wallet connection simulation with dummy address generation
  /stores                       # Zustand state management
    gameStore.ts                # Game state + Web3 state (wallet, points, claim)
```

## Key Game Mechanics

### Player Controls
- **Desktop:** Arrow keys (← →) for movement, R to retry
- **Mobile:** Touch left/right half of screen to move

### Game Objects
- **Player:** Acceleration-based movement with max speed, clamped at screen edges
- **Giwa Tiles:** Main obstacles that spawn at top and fall straight down
- **Items (4 types):**
  - Treasure Chest: +500 bonus score
  - Shoes: Speed boost for 6-8s (non-stacking)
  - Shield: 2s invincibility
  - Clock: 20% slowdown for 3s

### Scoring
- Base: 10 points per 0.1s survival time
- Bonus: Treasure chest items
- Combo: Extra points for 3 items collected in a row without getting hit

### Difficulty Progression
Time-based scaling where `t` = elapsed seconds:
- Spawn rate: `initialRate + 0.05 * t` objects/second
- Fall speed: `initialSpeed + 3 * t` pixels/second
- New falling patterns introduced every 20 seconds

## Technical Requirements

### Performance
- **Object Pooling:** Required for Giwa tiles and items to prevent GC pauses
- **Fixed Timestep:** 60Hz game loop for consistent physics

### UX Flow
1. Dashboard layout with Header (wallet connect) + 3-column layout
2. Left panel shows login prompt (if not connected) or user stats (if connected)
3. Center area displays the game with score overlay
4. Right panel shows character preview and costume options (Coming Soon)
5. Game over accumulates score to claimable points (if wallet connected)
6. Points can be claimed via "Claim" button in left panel

### Web3 Features
- **Wallet Connection:** Simulated wallet connection with dummy address generation
- **Point System:** Game scores accumulate as claimable points when wallet is connected
- **Claim Mechanism:** Players can claim accumulated points (logs to console, ready for backend integration)
- **Demo Mode:** Non-connected users can play but won't accumulate claimable points

## Architecture Notes

- Phaser scenes handle game logic and rendering
- React components provide UI overlay (dashboard, panels, header)
- Zustand bridges state between Phaser and React (game state + Web3 state)
- Web3 module is isolated and should not couple with core game logic
- Dashboard uses dark background with dot pattern (radial-gradient)
- 3-column layout: Left panel (25%) + Game area (50%) + Right panel (25%)
- Use simple retro 2D art style (pixel art or clean vectors)
- Giwa tiles can be represented with `瓦` character or geometric shape

## UI Design Guidelines

- **Color Scheme:** Dark background (#0a0a0a) with white text, neon accents for buttons
- **Background Pattern:** Dot grid using `radial-gradient(#333 1px, transparent 0)` with `background-size: 20px 20px`
- **Typography:** Monospace font for Web3/tech aesthetic
- **Borders:** Subtle borders (#444) to separate panels
- **Buttons:** High contrast (green for active actions, gray for disabled)

## Asset Management

### Image Assets Location
All game images should be placed in: `public/assets/game/`

### Required Assets

| Asset | Filename | Recommended Size | Description |
|-------|----------|------------------|-------------|
| Player | `player.png` | 80x80 px | Main character |
| Giwa Tile | `giwa.png` | 100x60 px | Falling obstacle |
| Chest | `item-chest.png` | 60x60 px | Score bonus (+500) |
| Shoes | `item-shoes.png` | 60x60 px | Speed boost |
| Shield | `item-shield.png` | 60x60 px | Invincibility |
| Clock | `item-clock.png` | 60x60 px | Slow motion |

### Asset Guidelines
- **Format**: PNG with transparent background
- **Style**: Pixel art or clean vector graphics
- **Resolution**: 2x actual size for retina displays
- **Colors**: Bright colors that contrast with dark background (#0a0a0a)

### Loading Assets
- Assets are loaded in `PreloaderScene.ts`
- Currently uses procedurally generated graphics (placeholder)
- To use custom images: Replace `createPlaceholderGraphics()` with `this.load.image()` calls
- See `HOW_TO_CHANGE_ASSETS.md` for detailed instructions

### Animation (Sprite Sheets)
For animated player movement:
- Use sprite sheets (multiple frames in single image)
- Recommended: `player-spritesheet.png` with idle + move-left + move-right frames
- Load with `this.load.spritesheet()` in PreloaderScene
- Create animations with `this.anims.create()`
- Play animations in Player.ts based on movement state
- See `HOW_TO_ADD_ANIMATION.md` for complete guide
