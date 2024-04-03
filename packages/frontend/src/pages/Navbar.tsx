import logo from "../assets/logo.png";
const Navbar = () => {
    return (    

        <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: '#073763'}}>
            <a href="#" className="d-block w-200"><img src={logo} style={{paddingLeft: '25px', paddingRight:'50px', height: '55px'}}/> </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav"> 
                    <li className="nav-item active">
                        <a className="nav-link" id="navbar_item" href="/">Home<span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="navbar_item" href="/About">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="navbar_item" href="/Provider">Providers</a>
                    </li>
                    {/* <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Dropdown link
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;