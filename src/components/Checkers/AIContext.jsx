import { createContext, useContext, useEffect, useState } from "react";

/*blue piece => 1*/
/*red piece => 2*/
/*blue queen => 3*/
/*red queen => 4*/

const AIContext = createContext();
export function useAI() {
    return useContext(AIContext)
}

export function AIProvider({ children }) {

    function isWinner(pieces) {
        let blue = 0;
        let red = 0;

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            if (piece & 1) {
                blue++;
                if (blue === 12) { return false}
                if (red > 0) { return false}
            } 
            else if (piece) {
                red++;
                if (red === 12) { return false}
                if (blue > 0) {return false}
            }
        }
        return true;
    }

    function evaluate(pieces) {
        let blue = 0;
        let red = 0;

        const pieceValues = {
            1: 5,
            2: 5,
            3: 10,
            4: 10
        }

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            if (piece) {
                if (piece & 1) { blue += pieceValues[piece]; }
                else { red += pieceValues[piece] }
            }
        }

        return red - blue;
    }

    function validMoves(piecesArray, startPosition) {
        const possibleMoves = [];
        const piece = piecesArray[startPosition];
        const pieceIsQueen = piece > 2;

        const BOARD_MAX = 32;
        const BOARD_ROW = 4;
        const isRedColor = piece % 2 === 0;

        //CONDITION FUNCTIONS
        const isQueening = (pos) => (isRedColor && pos < BOARD_ROW) || (!isRedColor && pos >= BOARD_MAX - BOARD_ROW);
        const isEnemy = (pos) => piecesArray[pos] && piecesArray[pos] % 2 !== piece % 2;
        const isEmpty = (pos) => !piecesArray[pos];
        //MOVES
        function moveDefault(isRight, position, direction) {
            const borderOffset = isRight ? 3 : 4;
            if ((position & 7) === borderOffset) { return false }
            const rowOffset = (position >> 2) & 1 ? (isRight ? 0 : -1) : (isRight ? 1 : 0);
            const newPosition = position + direction * BOARD_ROW + rowOffset;
            if (newPosition < 0 || newPosition >= BOARD_MAX) { return false; }
            if (isEmpty(newPosition)) {
                if (pieceIsQueen) { possibleMoves.push([startPosition, newPosition, 0, false]) }
                else { possibleMoves.push([startPosition, newPosition, 0, isQueening(newPosition)]) }
                return false;
            }
            return true;
        }
        function moveCapture(isRight, position, direction, captures, isQueen) {
            const borderOffset = isRight ? 3 : 4;
            if ((position & 7) === borderOffset) { return false }
            const rowOffset = (position >> 2) & 1 ? (isRight ? [0, 1] : [-1, 0]) : (isRight ? [1, 0] : [0, -1]);
            const enemyPosition = position + direction * BOARD_ROW + rowOffset[0];
            const newPosition = enemyPosition + direction * BOARD_ROW + rowOffset[1];
            if (newPosition < 0 || newPosition >= BOARD_MAX || (enemyPosition & 7) === borderOffset) {
                return false;
            }
            if (!isEnemy(enemyPosition) || !isEmpty(newPosition)) {
                return false
            }
            //loop check
            if (captures.length >= 4) {
                if (captures.some(capture => { return capture === enemyPosition })) { return true }
            }

            captures.push(enemyPosition);
            if (isQueen) {
                possibleMoves.push([startPosition, newPosition, [...captures], false]);
                moveCapture(true, newPosition, direction, [...captures], isQueen);
                moveCapture(false, newPosition, direction, [...captures], isQueen);
                moveCapture(isRight, newPosition, -direction, [...captures], isQueen);
                return true;
            }
            else {
                const isQueen = isQueening(newPosition);
                possibleMoves.push([startPosition, newPosition, [...captures], isQueen]);
                moveCapture(true, newPosition, direction, [...captures], isQueen);
                moveCapture(false, newPosition, direction, [...captures], isQueen);
                return true;
            }

        }
        switch (piece) {
            case 1:
                if (moveDefault(true, startPosition, 1)) {
                    moveCapture(true, startPosition, 1, [], false);
                }
                if (moveDefault(false, startPosition, 1)) {
                    moveCapture(false, startPosition, 1, [], false);
                }
                break;
            case 2:
                if (moveDefault(true, startPosition, -1)) {
                    moveCapture(true, startPosition, -1, [], false);
                }
                if (moveDefault(false, startPosition, -1)) {
                    moveCapture(false, startPosition, -1, [], false);
                }
                break;
            default:
                if (moveDefault(true, startPosition, -1)) {
                    moveCapture(true, startPosition, -1, [], true);
                }
                if (moveDefault(false, startPosition, -1)) {
                    moveCapture(false, startPosition, -1, [], true);
                }
                if (moveDefault(true, startPosition, 1)) {
                    moveCapture(true, startPosition, 1, [], true);
                }
                if (moveDefault(false, startPosition, 1)) {
                    moveCapture(false, startPosition, 1, [], true);
                }
                break;
        }
        return possibleMoves;
    }

    function getBoard(move, piecesArray) {
        const newPieces = [...piecesArray];
        const [startPosition, newPosition, captures, isQueen] = move;

        const piece = newPieces[startPosition];
        newPieces[startPosition] = null;
        newPieces[newPosition] = isQueen ? piece + 2 : piece;

        for (let i = 0; i < captures.length; i++) {
            newPieces[captures[i]] = null;
        }

        return newPieces;
    }

    function getAllMoves(pieces, isRedTurn) {
        const allMoves = [];
        let nonCaptureMoves = [];

        for (let i = 0; i < pieces.length; i++) {
            const piece = pieces[i];
            if (piece && (piece % 2 === 0) === isRedTurn) {
                const newMoves = validMoves(pieces, i);
                if (newMoves.some(move => move[2].length > 0)) {
                    allMoves.push(...newMoves.filter(move => move[2].length > 0));
                }
                else {
                    nonCaptureMoves.push(...newMoves);
                }
            }
        }
        return allMoves.length > 0 ? allMoves : nonCaptureMoves;
    }

    function allPossibleBoards(pieces, isRedTurn) {
        const allBoards = [];
        const allMoves = getAllMoves(pieces, isRedTurn);

        allMoves.forEach(move => {
            allBoards.push(getBoard(move, pieces));
        })

        return allBoards
    }

    function minimax(pieces, depth, maxPlayer) {
        if (depth === 0 || isWinner(pieces)) {
            const evaluation = evaluate(pieces);
            return { evaluation: evaluation, move: null };
        }
        
        if (maxPlayer) {
            let alpha = Number.NEGATIVE_INFINITY;
            let beta = Number.POSITIVE_INFINITY;
            let maxEval = Number.NEGATIVE_INFINITY;
            let bestMove = null;
            const moves = allPossibleBoards(pieces, maxPlayer);

            for (let i = 0; i < moves.length; i++) {
                const { evaluation } = minimax(moves[i], depth - 1, false);
                if (maxEval < evaluation) {
                    maxEval = evaluation;
                    bestMove = moves[i];
                }
                //alpha beta
                alpha = Math.max(alpha, evaluation);
                if (alpha >= beta) {
                    break;
                }
            }

            return { evaluation: maxEval, move: bestMove };
        }
        else {
            let alpha = Number.NEGATIVE_INFINITY;
            let beta = Number.POSITIVE_INFINITY;
            let minEval = Number.POSITIVE_INFINITY;
            let bestMove = null;
            const moves = allPossibleBoards(pieces, maxPlayer);

            for (let i = 0; i < moves.length; i++) {
                const { evaluation } = minimax(moves[i], depth - 1, true);
                if (minEval > evaluation) {
                    minEval = evaluation;
                    bestMove = moves[i];
                }
                //alpha beta
                beta = Math.min(beta, evaluation);
                if (alpha >= beta) {
                    break;
                }
            }

            return { evaluation: minEval, move: bestMove };
        }
    }

    const value = {
        evaluate,
        minimax,
        getBoard,
        getAllMoves
    }

    return (
        <AIContext.Provider value={value}>
            {children}
        </AIContext.Provider>
    )
}