'use client';

import { useEffect, useRef } from 'react';

export default function CharacterPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const imageRef = useRef<HTMLImageElement>();
  const currentFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load sprite sheet
    const img = new Image();
    img.src = '/player-spritesheet.png';

    img.onload = () => {
      imageRef.current = img;

      const frameWidth = 32;
      const frameHeight = 32;
      const scale = 3;

      // Always use IDLE animation (front-facing)
      const frames = [0, 1, 2, 3];
      const frameRate = 8;

      const animate = (timestamp: number) => {
        if (!imageRef.current || !canvas) return;

        // Frame timing
        if (timestamp - lastFrameTimeRef.current > 1000 / frameRate) {
          currentFrameRef.current = (currentFrameRef.current + 1) % frames.length;
          lastFrameTimeRef.current = timestamp;
        }

        const frameIndex = frames[currentFrameRef.current];
        const frameX = (frameIndex % 8) * frameWidth;
        const frameY = Math.floor(frameIndex / 8) * frameHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions
        const spriteWidth = frameWidth * scale;
        const spriteHeight = frameHeight * scale;
        const x = (canvas.width - spriteWidth) / 2;
        const y = (canvas.height - spriteHeight) / 2;

        // Draw sprite frame (always front-facing, no flip)
        ctx.drawImage(
          imageRef.current,
          frameX,
          frameY,
          frameWidth,
          frameHeight,
          x,
          y,
          spriteWidth,
          spriteHeight
        );

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '120px',
        height: '120px',
        margin: '0 auto',
        border: '2px solid #444',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={120}
        height={120}
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
