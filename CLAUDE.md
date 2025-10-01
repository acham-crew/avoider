# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GIWA Dodge** is a retro-style 2D arcade web game where players dodge falling Korean roof tiles (Giwa - 瓦).

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
    layout.tsx                  # Root layout
    page.tsx                    # Main game page with canvas
  /components
    /game                       # Phaser 3 game code
      /scenes                   # Game scenes (state machines)
        PreloaderScene.ts       # Asset loading
        GameScene.ts            # Main gameplay
        UIScene.ts              # HUD overlay
        GameOverScene.ts        # End screen
      /objects                  # Game entities
        Player.ts               # Player character with acceleration-based movement
        Giwa.ts                 # Falling tile obstacle
        Item.ts                 # Collectible items (Chest, Shoes, Shield, Clock)
      /utils                    # Helper functions
    /ui                         # React UI components
      StartMenu.tsx             # Landing page with "Start Game"
      ScoreDisplay.tsx          # Top-of-screen score counter
      GameOver.tsx              # Game over overlay with retry
  /lib
    /web3                       # Web3 integration (placeholder)
      wallet.ts                 # connectWallet(), signScore() stubs
  /stores                       # Zustand state management
    gameStore.ts                # Game state (score, status, etc.)
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
1. Landing page with "Start Game" button
2. Game starts immediately, score visible at top
3. Game over shows final score and "Retry" button over paused scene

## Architecture Notes

- Phaser scenes handle game logic and rendering
- React components provide UI overlay (non-game elements)
- Zustand bridges state between Phaser and React
- Web3 module is isolated and should not couple with core game logic
- Use simple retro 2D art style (pixel art or clean vectors)
- Giwa tiles can be represented with `瓦` character or geometric shape
