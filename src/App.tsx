import React, { useState, useEffect } from 'react';
import { RefreshCw, Award, Trash2 } from 'lucide-react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameHistory from './components/GameHistory';
import { calculateWinner, checkDraw } from './utils/gameLogic';

type HistoryItem = {
  winner: string | null;
  board: (string | null)[];
  date: Date;
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<HistoryItem[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  // Player names and game start
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // Load names from localStorage
  useEffect(() => {
    const storedPlayer1 = localStorage.getItem('player1');
    const storedPlayer2 = localStorage.getItem('player2');
    if (storedPlayer1 && storedPlayer2) {
      setPlayer1(storedPlayer1);
      setPlayer2(storedPlayer2);
      setGameStarted(true);
    }
  }, []);

  // Watch board for win/draw
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setGameStatus('won');
      setWinningLine(result.line);
      setWinner(result.winner);

      setScores(prev => ({
        ...prev,
        [result.winner]: prev[result.winner as keyof typeof prev] + 1,
      }));

      setGameHistory(prev => [
        ...prev,
        { winner: result.winner, board: [...board], date: new Date() },
      ]);
    } else if (checkDraw(board)) {
      setGameStatus('draw');

      setScores(prev => ({
        ...prev,
        draws: prev.draws + 1,
      }));

      setGameHistory(prev => [
        ...prev,
        { winner: null, board: [...board], date: new Date() },
      ]);
    }
  }, [board]);

  // Handlers
  const handleClick = (index: number) => {
    if (board[index] || gameStatus !== 'playing') return;
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('playing');
    setWinningLine(null);
    setWinner(null);
  };

  const resetStats = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameHistory([]);
  };

  const startGame = () => {
    if (player1.trim() && player2.trim()) {
      localStorage.setItem('player1', player1);
      localStorage.setItem('player2', player2);
      setGameStarted(true);
    } else {
      alert('Please enter names for both players.');
    }
  };

  const clearNames = () => {
    localStorage.removeItem('player1');
    localStorage.removeItem('player2');
    setPlayer1('');
    setPlayer2('');
    setGameStarted(false);
    resetStats();
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return `🎉 ${winner === 'X' ? player1 : player2} wins!`;
    } else if (gameStatus === 'draw') {
      return "🤝 It's a draw!";
    } else {
      return `Next player: ${xIsNext ? player1 || 'X' : player2 || 'O'}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="p-6 bg-indigo-600 text-white text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Award className="h-8 w-8" />
            Tic Tac Toe
          </h1>
          <p className="text-indigo-200 mt-1">A classic game reimagined</p>
        </div>

        {!gameStarted ? (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4 text-indigo-800">Enter Player Names</h2>
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <input
                type="text"
                placeholder="Player 1 (X)"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Player 2 (O)"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={startGame}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
              >
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-semibold text-indigo-800">{getStatusMessage()}</h2>
              </div>

              <Board
                squares={board}
                onClick={handleClick}
                winningLine={winningLine}
              />

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Game
                </button>

                <button
                  onClick={resetStats}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Reset All
                </button>

                <button
                  onClick={clearNames}
                  className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Players
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <ScoreBoard scores={scores} player1={player1} player2={player2} />
              <GameHistory history={gameHistory} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
