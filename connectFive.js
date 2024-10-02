import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: 5 }).map((_, col) => (
            <Square
              key={col}
              value={squares[row * 5 + col]}
              onSquareClick={() => handleClick(row * 5 + col)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(25).fill(null)]);
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
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [];

  // Horizontal and vertical lines
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (j <= 1) {
        lines.push([i * 5 + j, i * 5 + j + 1, i * 5 + j + 2, i * 5 + j + 3, i * 5 + j + 4]); // horizontal
      }
      if (i <= 1) {
        lines.push([i * 5 + j, (i + 1) * 5 + j, (i + 2) * 5 + j, (i + 3) * 5 + j, (i + 4) * 5 + j]); // vertical
      }
      if (i <= 1 && j <= 1) {
        lines.push([i * 5 + j, (i + 1) * 5 + (j + 1), (i + 2) * 5 + (j + 2), (i + 3) * 5 + (j + 3), (i + 4) * 5 + (j + 4)]); // diagonal \
        lines.push([i * 5 + (4 - j), (i + 1) * 5 + (3 - j), (i + 2) * 5 + (2 - j), (i + 3) * 5 + (1 - j), (i + 4) * 5 + (0 - j)]); // diagonal /
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
