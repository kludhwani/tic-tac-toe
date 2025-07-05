import React, { useState, useEffect } from 'react';
import { RefreshCw, Award } from 'lucide-react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameHistory from './components/GameHistory';
import { calculateWinner, checkDraw } from './utils/gameLogic';

function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState<Array<{
    winner: string | null;
    board: Array<string | null>;
    date: Date;
  }>>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [showNameModal, setShowNameModal] = useState(true);


  // Check for winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    
    if (result) {
      setGameStatus('won');
      setWinningLine(result.line);
      
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [result.winner]: prevScores[result.winner as keyof typeof prevScores] + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: result.winner, board: [...board], date: new Date() }
      ]);
    } else if (checkDraw(board)) {
      setGameStatus('draw');
      
      // Update draw count
      setScores(prevScores => ({
        ...prevScores,
        draws: prevScores.draws + 1
      }));
      
      // Add to history
      setGameHistory(prev => [
        ...prev, 
        { winner: null, board: [...board], date: new Date() }
      ]);
    }
  }, [board]);

  // Handle square click
const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      setShowNameModal(false);
    }
  };

  return (
    <div className="App">
      {showNameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            className="bg-white p-6 rounded shadow-md flex flex-col gap-4"
            onSubmit={handleNameSubmit}
          >
            <h2 className="text-xl font-bold mb-2">Enter Player Names</h2>
            <input
              type="text"
              placeholder="Player 1 Name"
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Player 2 Name"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Start Game
            </button>
          </form>
        </div>
      )}

      {/* ...existing game UI... */}
      {/* Use player1 and player2 variables wherever you display player names */}
    </div>
  );

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus('playing');
    setWinningLine(null);
  };

  // Reset all stats
  const resetStats = () => {
    resetGame();
    setScores({ X: 0, O: 0, draws: 0 });
    setGameHistory([]);
  };

  // Get current game status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      const winner = !xIsNext ? 'X' : 'O';
      return `Player ${winner} wins!`;
    } else if (gameStatus === 'draw') {
      return "It's a draw!";
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  // Handle square click
  function handleClick(index: number) {
    if (board[index] || gameStatus !== 'playing') return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }
}

export default App;