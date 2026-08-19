import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Clock, Award, Star, RotateCcw, CheckCircle2 } from 'lucide-react';

const GRID_SIZE = 13;
const crosswordData = {
  words: [
    { word: 'RECYCLING', clue: '1A. The process of converting waste materials into new products', dir: 'across', row: 0, col: 0, num: 1 },
    { word: 'BIODIVERSITY', clue: '4A. The variety of living organisms in an ecosystem', dir: 'across', row: 4, col: 0, num: 4 },
    { word: 'ECOSYSTEM', clue: '8A. A community of living organisms interacting with their environment', dir: 'across', row: 8, col: 0, num: 8 },
    { word: 'COMPOST', clue: '10A. Decomposed organic matter used to fertilize soil', dir: 'across', row: 10, col: 3, num: 10 },
    { word: 'SOLAR', clue: '2D. Energy from the sun used to generate electricity', dir: 'down', row: 0, col: 2, num: 2 },
    { word: 'CLIMATE', clue: '3D. Long-term weather patterns in a region', dir: 'down', row: 0, col: 6, num: 3 },
    { word: 'FOREST', clue: '5D. A large area covered chiefly with trees', dir: 'down', row: 4, col: 9, num: 5 },
  ],
};

function buildGrid() {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  const nums = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  crosswordData.words.forEach(w => {
    for (let i = 0; i < w.word.length; i++) {
      const r = w.dir === 'across' ? w.row : w.row + i;
      const c = w.dir === 'across' ? w.col + i : w.col;
      if (r < GRID_SIZE && c < GRID_SIZE) {
        grid[r][c] = { letter: w.word[i], filled: false };
        if (i === 0) nums[r][c] = w.num;
      }
    }
  });
  return { grid, nums };
}

export default function CrosswordPage() {
  const [{ grid, nums }] = useState(buildGrid);
  const [userGrid, setUserGrid] = useState(() =>
    grid.map(row => row.map(cell => (cell ? '' : null)))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!started || completed) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [started, completed]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleCellInput = (r, c, val) => {
    if (grid[r][c] === null) return;
    const newGrid = userGrid.map(row => [...row]);
    newGrid[r][c] = val.toUpperCase().slice(-1);
    setUserGrid(newGrid);
    if (!started) setStarted(true);
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c]) {
          total++;
          if (userGrid[r][c] === grid[r][c].letter) correct++;
        }
      }
    }
    const pct = Math.round((correct / total) * 100);
    setScore(pct);
    setCompleted(true);
  };

  const revealAll = () => {
    setUserGrid(grid.map(row => row.map(cell => cell ? cell.letter : null)));
    setScore(100);
    setCompleted(true);
  };

  const resetPuzzle = () => {
    setUserGrid(grid.map(row => row.map(cell => cell ? '' : null)));
    setTimer(0);
    setStarted(false);
    setCompleted(false);
    setScore(0);
  };

  const filledCount = userGrid.flat().filter(c => c && c.length > 0).length;
  const totalCount = grid.flat().filter(c => c !== null).length;
  const progress = Math.round((filledCount / totalCount) * 100);

  const acrossClues = crosswordData.words.filter(w => w.dir === 'across');
  const downClues = crosswordData.words.filter(w => w.dir === 'down');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Puzzle className="w-6 h-6 text-eco-blue" /> Eco Crossword</h1>
          <p className="text-sm text-muted-foreground">Complete the crossword with environmental vocabulary</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" /> {formatTime(timer)}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-sm">
            <Star className="w-4 h-4 text-eco-amber" /> {progress}%
          </div>
        </div>
      </div>

      {completed && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
            className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-3 glow-green">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold mb-1">
            {score === 100 ? '🎉 Perfect!' : score >= 70 ? '👏 Great Job!' : '💪 Keep Trying!'}
          </h2>
          <p className="text-muted-foreground text-sm mb-3">Score: {score}% • Time: {formatTime(timer)}</p>
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
            className="text-2xl font-bold text-eco-green">+{Math.round(score * 0.5 + 50)} Eco Points</motion.p>
          <button onClick={resetPuzzle} className="mt-4 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Play Again
          </button>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Grid */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl p-4 overflow-x-auto">
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(32px, 40px))` }}>
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <div key={`${r}-${c}`} className={`relative aspect-square ${cell ? 'bg-secondary/80 border border-border' : ''} rounded`}>
                    {nums[r][c] && (
                      <span className="absolute top-0 left-0.5 text-[8px] text-muted-foreground font-medium">{nums[r][c]}</span>
                    )}
                    {cell && (
                      <input
                        type="text"
                        maxLength={1}
                        value={userGrid[r][c] || ''}
                        onChange={e => handleCellInput(r, c, e.target.value)}
                        onClick={() => setSelectedCell({ r, c })}
                        className={`w-full h-full text-center uppercase font-bold text-sm bg-transparent outline-none ${
                          completed && userGrid[r][c] === cell.letter ? 'text-eco-green' :
                          completed && userGrid[r][c] && userGrid[r][c] !== cell.letter ? 'text-destructive' : 'text-foreground'
                        }`}
                        disabled={completed}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={checkAnswers}
              disabled={completed}
              className="flex-1 py-3 rounded-xl gradient-primary text-white font-semibold disabled:opacity-50">
              Check Answers
            </motion.button>
            <button onClick={revealAll} disabled={completed}
              className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium disabled:opacity-50">
              Reveal
            </button>
            <button onClick={resetPuzzle}
              className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clues */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3 text-eco-blue">Across →</h3>
            <div className="space-y-2">
              {acrossClues.map(w => (
                <p key={w.num} className="text-xs text-muted-foreground leading-relaxed">{w.clue}</p>
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3 text-eco-purple">Down ↓</h3>
            <div className="space-y-2">
              {downClues.map(w => (
                <p key={w.num} className="text-xs text-muted-foreground leading-relaxed">{w.clue}</p>
              ))}
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-eco-amber" /> Bonus Points</h3>
            <p className="text-xs text-muted-foreground">Complete under 5 minutes for +50 bonus Eco Points!</p>
            <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div animate={{ width: `${progress}%` }} className="h-full gradient-primary rounded-full" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{filledCount}/{totalCount} cells filled</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
