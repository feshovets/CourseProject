function EndPanel({winner, handleClick}) {
    const winStr = winner === "AI" ? "Computer win 🤖": "Human win 🧠";
    return (
        <div className="end-panel">
            <h2 className="winner-label">{winStr}</h2>
            <button onClick={()=>handleClick("rematch")} className="btn-rematch">Rematch</button>
            <h4>or</h4>
            <button onClick={()=>handleClick("change")} className="btn-change"> Change opponent</button>
        </div>
    )
}

export default EndPanel;