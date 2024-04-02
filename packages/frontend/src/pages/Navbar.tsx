import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return ( 
        <nav className="navbar">
            <h1>SolarMap</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/About">About</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;
