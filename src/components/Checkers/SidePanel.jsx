import { motion } from "framer-motion"
import { useState } from "react";

const circuit = "assets/circuit.svg";
const redPiece = "assets/piece_r.svg";
const randomPiece = "assets/random.svg";
const bluePiece = "assets/piece_b.svg";

function SidePanel({ handleStart }) {
    const [level, setLevel] = useState(4);
    const [color, setColor] = useState("red");

    const onChangeLevel = (e) => {
        setLevel(e.target.value);
    }
    const onChangeColor = (e) => {
        const color = (e.target.value);
        if (color === "random") {
            const newColor = Math.random() > .5 ? "red" : "blue";
            setColor(newColor);
        }
        else {
            setColor(color);
        }
    }

    return (
        <div id="side-panel">
            <h3 className="level-label">engine level</h3>
            <div className="level-icon" style={{ backgroundImage: `url(${circuit})` }}>
                {level}
            </div>
            <div className="level-selector">
                <input type="range" min={1} max={8} value={level} id="level-slider"
                    onChange={onChangeLevel} className="level-slider" />
            </div>

            <h3 className="pieces-label">i play as</h3>
            <div className="pieces-selectors">
                <motion.div whileHover={{ scale: 1.1}} whileTap={{ scale: .95}}>
                    <label htmlFor="red">
                        <input type="radio" id="red" name="setColor" value="red" onClick={onChangeColor} defaultChecked />
                        <span className="custom-radio" style={{ backgroundImage: `url(${redPiece})` }} />
                    </label>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1}} whileTap={{ scale: .95}}>
                    <label htmlFor="random">
                        <input type="radio" id="random" name="setColor" value="random" onClick={onChangeColor} />
                        <span className="custom-radio" style={{ backgroundImage: `url(${randomPiece})` }} />
                    </label>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1}} whileTap={{ scale: .95}}>
                    <label htmlFor="blue">
                        <input type="radio" id="blue" name="setColor" value="blue" onClick={onChangeColor} />
                        <span className="custom-radio" style={{ backgroundImage: `url(${bluePiece})` }} />
                    </label>
                </motion.div>

            </div>
            <motion.button 
                whileHover={{ scale: 1.05}} whileTap={{ scale: .95}}
                onClick={() => handleStart(level, color)} className="btn-play">
                Play
            </motion.button>
        </div>
    )
}

export default SidePanel;