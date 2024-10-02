// import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, zIndex }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[zIndex * 25 + i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[zIndex * 25 + i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">Layer {zIndex + 1}</div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: 5 }).map((_, col) => (
            <Square
              key={col}
              value={squares[zIndex * 25 + row * 5 + col]}
              onSquareClick={() => handleClick(row * 5 + col)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(125).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {Array.from({ length: 5 }).map((_, zIndex) => (
          <Board
            key={zIndex}
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            zIndex={zIndex}
          />
        ))}
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [];

  // Add 3D lines (horizontal, vertical, depth, and diagonals) to the lines array
  for (let z = 0; z < 5; z++) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // Horizontal lines
        if (col <= 1) {
          lines.push([
            z * 25 + row * 5 + col,
            z * 25 + row * 5 + (col + 1),
            z * 25 + row * 5 + (col + 2),
            z * 25 + row * 5 + (col + 3),
            z * 25 + row * 5 + (col + 4),
          ]);
        }
        // Vertical lines
        if (row <= 1) {
          lines.push([
            z * 25 + row * 5 + col,
            z * 25 + (row + 1) * 5 + col,
            z * 25 + (row + 2) * 5 + col,
            z * 25 + (row + 3) * 5 + col,
            z * 25 + (row + 4) * 5 + col,
          ]);
        }
        // Depth lines
        if (z <= 1) {
          lines.push([
            z * 25 + row * 5 + col,
            (z + 1) * 25 + row * 5 + col,
            (z + 2) * 25 + row * 5 + col,
            (z + 3) * 25 + row * 5 + col,
            (z + 4) * 25 + row * 5 + col,
          ]);
        }
        // Diagonal lines in various directions (e.g., 3D diagonals)
        if (z <= 1 && row <= 1 && col <= 1) {
          lines.push([
            z * 25 + row * 5 + col,
            (z + 1) * 25 + (row + 1) * 5 + (col + 1),
            (z + 2) * 25 + (row + 2) * 5 + (col + 2),
            (z + 3) * 25 + (row + 3) * 5 + (col + 3),
            (z + 4) * 25 + (row + 4) * 5 + (col + 4),
          ]);
          lines.push([
            z * 25 + row * 5 + (4 - col),
            (z + 1) * 25 + (row + 1) * 5 + (3 - col),
            (z + 2) * 25 + (row + 2) * 5 + (2 - col),
            (z + 3) * 25 + (row + 3) * 5 + (1 - col),
            (z + 4) * 25 + (row + 4) * 5 + (0 - col),
          ]);
        }
      }
    }
  }

  for (const line of lines) {
    const [a, b, c, d, e] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}
