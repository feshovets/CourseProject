import React from "react";
import CrossMark from '../assets/Cross.svg'
import CircleMark from '../assets/Circle.svg'

import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
        {value ==='O'&& <img src={CircleMark}/>}
        {value ==='X'&& <img src={CrossMark}/>}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TikTacToe() {
  const [squares, setSquares] = useState([Array(9).fill("X")]);
  const [xTurn, setXTurn] = useState(true)

  function handleClick(id) {
    if (calculateWinner(squares) ){
      console.log(squares)
      return;
    }
    const newSquares = squares.slice();
    newSquares[id] = xTurn === true? 'X':'O';
    setSquares(newSquares);
    setXTurn(!xTurn);
  }

  return (
    <div className="content">
       <div className="tikBoard">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}
