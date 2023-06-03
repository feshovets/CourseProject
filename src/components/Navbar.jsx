import { motion } from "framer-motion"

function Navbar() {
    const logo = "assets/logo.svg";
    return (
      <div id="sidebar">
        <img className="nav-logo" src={logo}></img>
        <ul className="navbar">
          <li/><motion.a whileHover={{ scale: 1.05, backgroundColor: 'var(--clr-dark-85)'}} href='/'>
            <span className="nav-text">Home</span>
            <span className="nav-icon">🏠</span>
            </motion.a>
          <li/><motion.a whileHover={{ scale: 1.05, backgroundColor: 'var(--clr-dark-85)'}} href='/play'>
            <span className="nav-text">Play</span>
            <span className="nav-icon">🎮</span>
            </motion.a>
          <li/><motion.a whileHover={{ scale: 1.05, backgroundColor: 'var(--clr-dark-85)'}} href='/about'>
            <span className="nav-text">About</span>
            <span className="nav-icon">💡</span>
            </motion.a>
        </ul>
      </div>
    );
  }
  
  export default Navbar;
  