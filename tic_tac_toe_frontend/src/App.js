import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Main App component for Tic Tac Toe game.
 * Implements two-player mode, responsive layout, win/draw detection,
 * score display, reset/restart controls, and modern/minimal UI.
 */
// PUBLIC_INTERFACE
function App() {
  // 0: empty, 1: X, 2: O
  const emptyBoard = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  const [theme, setTheme] = useState("light");
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState(""); // "X wins", "O wins", "Draw"
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [moveCount, setMoveCount] = useState(0);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (row, col) => {
    if (board[row][col] || status) return; // Ignore if cell filled or game ended
    const updatedBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? (xIsNext ? "X" : "O") : cell))
    );
    const newMoveCount = moveCount + 1;
    setBoard(updatedBoard);
    setMoveCount(newMoveCount);
    const winner = calculateWinner(updatedBoard);
    if (winner) {
      setStatus(`${winner} wins!`);
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
    } else if (newMoveCount === 9) {
      setStatus("Draw");
    }
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(emptyBoard);
    setStatus("");
    setXIsNext(true); // Always X starts after restart for clarity
    setMoveCount(0);
  };

  // PUBLIC_INTERFACE
  const handleResetScores = () => {
    setScores({ X: 0, O: 0 });
    handleRestart();
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Winner/calculate
  function calculateWinner(board) {
    const lines = [
      // rows
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      // columns
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      // diagonals
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];
    for (let line of lines) {
      const [[a1, a2], [b1, b2], [c1, c2]] = line;
      if (
        board[a1][a2] &&
        board[a1][a2] === board[b1][b2] &&
        board[a1][a2] === board[c1][c2]
      ) {
        return board[a1][a2];
      }
    }
    return null;
  }

  // Board Rendering
  const renderBoard = () => (
    <div className="ttt-board">
      {board.map((row, i) => (
        <div key={i} className="ttt-row">
          {row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              className={`ttt-cell ${
                cell ? (cell === "X" ? "x-cell" : "o-cell") : ""
              }`}
              onClick={() => handleSquareClick(i, j)}
              disabled={Boolean(cell) || status}
              tabIndex={cell || status ? -1 : 0}
              aria-label={`${
                cell ? cell : (xIsNext ? "X" : "O") + " move"
              } cell ${i * 3 + j + 1}`}
            >
              {cell}
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  // Control panel
  const renderControls = () => (
    <div className="ttt-controls">
      <button className="ttt-btn accent" onClick={handleRestart}>
        Restart Game
      </button>
      <button className="ttt-btn secondary" onClick={handleResetScores}>
        Reset Scores
      </button>
    </div>
  );

  // Score/heading
  const renderScoreboard = () => (
    <div className="ttt-scoreboard">
      <span className="score X" aria-label="Player X score">
        X: {scores.X}
      </span>
      <span className="score O" aria-label="Player O score">
        O: {scores.O}
      </span>
    </div>
  );

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <header className="ttt-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite">
          {status
            ? status
            : `Turn: ${xIsNext ? "X" : "O"}`}
        </div>
        {renderScoreboard()}
      </header>
      <main className="ttt-main">
        <div className="ttt-board-container">{renderBoard()}</div>
        {renderControls()}
      </main>
      <footer className="ttt-footer">
        <span>
          &copy; {new Date().getFullYear()} | Simple Tic Tac Toe by Kavia
        </span>
      </footer>
    </div>
  );
}

export default App;
