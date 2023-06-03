import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react";

const imagePlayerRed = {
  1: "assets/piece_b.svg",
  2: "assets/piece_r.svg",
  3: "assets/queen_b.svg",
  4: "assets/queen_r.svg",
};
const imagePlayerBlue = {
  1: "assets/piece_r.svg",
  2: "assets/piece_b.svg",
  3: "assets/queen_r.svg",
  4: "assets/queen_b.svg",
};

export function Tile({ isSelected, isMove, piece, selectPiece, movePiece, playerColor, moves, id}) {
  const [tileSize, setTileSize] = useState(null);
  const highlightDot = "assets/highlight.svg";
  const image = playerColor === "red" ? imagePlayerRed[piece] || "" : imagePlayerBlue[piece] || "";
  const tileRef = useRef(null);

  const handleClick = () => {
    if (isMove) {
      movePiece();
    }
    else if (piece) {
      selectPiece();
    }
  };


  return (
    <motion.div ref={tileRef} onClick={handleClick} className={`dark-tile ${isSelected ? "selected-tile" : ""}`}>
      {piece && <motion.div style={{ backgroundImage: `url(${image})` }} className="piece"></motion.div>}
      {isMove && <div style={{ backgroundImage: `url(${highlightDot})` }} className="dot-tile"></div>}
    </motion.div>
  )
};

export function DummyTile() {
  return (
    <div className="light-tile">
    </div>
  )
}