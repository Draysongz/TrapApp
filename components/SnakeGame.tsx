import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = { 
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE, 
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE 
        };
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
          setScore(prevScore => prevScore + 1);
          return [newHead, ...prevSnake];
        }
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        return [newHead, ...prevSnake.slice(0, -1)];
      });
    };
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00FF00';
    snake.forEach(segment => {
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-green-400 mb-2">Score: {score}</p>
      <canvas 
        ref={canvasRef} 
        width={GRID_SIZE * CELL_SIZE} 
        height={GRID_SIZE * CELL_SIZE}
        className="border border-green-400"
      />
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <p className="text-red-500 text-xl mb-4">Game Over</p>
          <button 
            onClick={resetGame}
            className="px-4 py-2 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-colors duration-300 pixelated text-lg"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;