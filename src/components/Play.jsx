import Checkers from './Checkers/Checkers';
import SidePanel from './Checkers/SidePanel';
import { useState } from 'react';
import { AIProvider } from "./Checkers/AIContext";

function Play() {
    const [isGame, setIsGame] = useState(false);
    const [settingsActive, setSettingsActive] = useState(true);
    const [engineLevel, setEngineLevel] = useState(null);
    const [color, setColor] = useState("red");

    function startGame(level, color) {
        if (!isGame) {
            setEngineLevel(level);
            setColor(color);
            setSettingsActive(false);
            setIsGame(true);
        }
    }
    function restartGame() {
        if (!isGame) {
            setIsGame(true);
        }
    }
    function changeGame() {
        setSettingsActive(true);
    }
    function endGame() {
        if (isGame) {
            setIsGame(false);
        }
    }

    return (
        <AIProvider>
            <div id="play" className="content">
                <Checkers 
                color = {color} 
                gameStarted={isGame} 
                level={engineLevel} 
                handleEnd={endGame} 
                handleRematch={restartGame}
                handleChange={changeGame}/>
                {settingsActive&&<SidePanel handleStart={startGame} handleRematch={restartGame}/>}
            </div>
        </AIProvider>
    );
}

export default Play;