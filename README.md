# GIWA Dodge (기와 피하기)

A retro-style 2D arcade web game where you dodge falling Korean roof tiles (Giwa - 瓦).

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Game Engine:** Phaser 3
- **State Management:** Zustand
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

### Build for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## How to Play

### Controls

- **Desktop:** Use `←` and `→` arrow keys to move left and right. Press `R` to retry after game over.
- **Mobile:** Tap/hold the left half of the screen to move left, right half to move right.

### Game Mechanics

- Dodge falling Giwa tiles (red rectangles with 瓦 character)
- Collect items to gain power-ups and score bonuses
- Survive as long as possible as the difficulty increases

### Items

- 🟡 **Treasure Chest (Yellow):** +500 bonus score
- 🟢 **Shoes (Green):** Speed boost for 6-8 seconds
- 🔵 **Shield (Cyan):** 2 seconds of invincibility
- 🟣 **Clock (Purple):** Slows down all falling objects for 3 seconds

### Scoring

- **Base Score:** Increases with survival time (10 points per 0.1 second)
- **Item Bonuses:** Collect treasure chests for bonus points
- **Combo Bonus:** Collect 3 items in a row without getting hit for extra points

## Project Structure

```
/src
  /app                  # Next.js App Router pages
  /components
    /game              # Phaser 3 game code
      /scenes          # Game scenes (Preloader, Game, GameOver)
      /objects         # Game entities (Player, Giwa, Item)
      /utils           # Helper functions (ObjectPool, SoundManager)
    /ui                # React UI components
  /stores              # Zustand state management
  /lib
    /web3              # Web3 integration (placeholder)
```

## Development Notes

- The game uses **Object Pooling** for optimal performance
- Fixed timestep game loop runs at 60Hz for consistent physics
- Web3 module contains placeholder functions for future blockchain integration

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/giwa-dodge)

## License

MIT
