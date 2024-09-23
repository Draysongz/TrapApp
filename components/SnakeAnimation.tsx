import React, { useEffect, useRef } from 'react';

const SnakeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 10;
    const snake = [{ x: 0, y: 0 }];
    const direction = { x: 1, y: 0 };
    let food = { x: 0, y: 0 };

    const placeFood = () => {
      food = {
        x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize,
      };
    };

    const drawSnake = () => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, cellSize, cellSize);
      });
    };

    const drawFood = () => {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(food.x, food.y, cellSize, cellSize);
    };

    const moveSnake = () => {
      const head = { ...snake[0] };
      head.x += direction.x * cellSize;
      head.y += direction.y * cellSize;

      if (head.x >= canvas.width) head.x = 0;
      if (head.x < 0) head.x = canvas.width - cellSize;
      if (head.y >= canvas.height) head.y = 0;
      if (head.y < 0) head.y = canvas.height - cellSize;

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        placeFood();
      } else {
        snake.pop();
      }
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveSnake();
      drawSnake();
      drawFood();
    };

    placeFood();
    const interval = setInterval(gameLoop, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={300} 
      className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
    />
  );
};

export default SnakeAnimation;