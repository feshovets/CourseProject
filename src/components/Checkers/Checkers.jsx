import { useEffect, useRef, useState } from "react";
import { useAI } from "./AIContext";
import { Tile, DummyTile } from './Tile';
import EndPanel from './EndPanel';

const defaultBoard = [
   1, 1, 1, 1,
   1, 1, 1, 1,
   1, 1, 1, 1,
   null, null, null, null,
   null, null, null, null,
   2, 2, 2, 2,
   2, 2, 2, 2,
   2, 2, 2, 2
]

function Checkers({ gameStarted, level, color , handleEnd, handleRematch, handleChange}) {
   const [winner, setWinner] = useState(null);

   const [pieces, setPieces] = useState(defaultBoard)
   const [moves, setMoves] = useState(null);

   const [selectedTile, setSelectedTile] = useState(null);
   const [possibleTile, setPossibleTile] = useState(null);
   const [isRedTurn, setIsRedTurn] = useState(true);
   const [AIMoveProcess, setAIMoveProcess] = useState(false);

   const { evaluate, minimax, getAllMoves, getBoard } = useAI();

   function selectPiece(position) {
      if (!gameStarted || AIMoveProcess || selectedTile === position) {
         return;
      }
      const move = moves.find(e => (e[0] === position));
      if (move) {
         setSelectedTile(position);
         const possibleMoves = [];
         moves.forEach(move => {
            if (move[0] === position) {
               possibleMoves.push(move[1]);
            }
         });
         setPossibleTile(possibleMoves);
      }
      else {
         console.log("No moves for selected piece");
         setSelectedTile(null);
         setPossibleTile(null);
      }
   }

   function movePiece(newPosition) {
      if (selectedTile === null) { return }
      const move = moves.find(e => (e[0] === selectedTile && e[1] === newPosition))
      const newPieces = getBoard(move, pieces);
      setPieces(newPieces);
      setPossibleTile(null);
      setSelectedTile(null);
      setIsRedTurn(!isRedTurn);
   }

   function aiMovePiece(depth) {
      if (!gameStarted || AIMoveProcess) { return }

      setAIMoveProcess(true);
      const { evaluation, move } = minimax([...pieces], depth, isRedTurn);

      if (move) {
         setPieces(move);
         setIsRedTurn(!isRedTurn);
         setAIMoveProcess(false);
         console.log("Evaluation: " + evaluation)
         console.log("AI made move");
         return;
      }
      else {
         setAIMoveProcess(false);
         console.log("NO MOVES");
         return;
      }
   }

   function handleClick(button){
      if(button === "change"){
         setWinner(null);
         handleChange();
      }
      if(button === "rematch"){
         setWinner(null);
         handleRematch();
      }
   }

   useEffect(()=>{
      if (gameStarted) {
         setPieces(defaultBoard);
         if(color==="red"){
            setIsRedTurn(true);
         }
         else{
            setIsRedTurn(false);
         }
      }
   }, [gameStarted])

   useEffect(()=>{
      const newMoves = getAllMoves(pieces, isRedTurn);
      if (newMoves.length === 0) {
         const evaluation = evaluate(pieces);
         const winner = evaluation > 0 ? "You" : "AI";
         setWinner(winner);
         handleEnd();
      }
      setMoves(newMoves);
      if (!isRedTurn) {
         aiMovePiece(level);
      }
   }, [pieces, isRedTurn])

   const board = []
   for (let i = 0; i < pieces.length; i++) {
      const condition = (Math.floor(i / 4) % 2 === 0);
      if (condition) {
         board.push(<DummyTile key={`white${i}`} />)
      }
      board.push(<Tile
         key={`black${i}`}
         id={i}
         selectPiece={() => selectPiece(i)}
         movePiece={() => movePiece(i)}
         isSelected={selectedTile === i}
         isMove={possibleTile && possibleTile.some(e => { return e === i })}
         piece={pieces[i]} 
         playerColor={color}
         moves={possibleTile}/>);

      if (!condition) {
         board.push(<DummyTile key={`white${i}`} />)
      }
   }
   return (
      <div id="board">
         {board}
         {winner&&<EndPanel handleClick={handleClick} winner={winner}/>}
      </div>
   )
};

export default Checkers