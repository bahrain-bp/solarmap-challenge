import logo from "../assets/logo.png";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


const NavButton = styled(Button)({
    color: '#FFF',
    borderColor: '#FFF',
    '&:hover': {
        backgroundColor: '#062542',
        borderColor: '#FFF',
    },
    marginRight: '20px',  // Add right margin for spacing
});



const Navbar = ({isLoggedIn, onLogInButton}) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#073763' }}>
            <a href="/" className="d-block w-200">
                <img src={logo} alt="Logo" style={{ paddingLeft: '25px', paddingRight: '50px', height: '55px' }} />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav mr-auto" style={{ color: '#FFF' }}>
                    <li className="nav-item active">
                        <a className="nav-link" href="/" style={{ color: '#FFF' }}>Home<span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/About" style={{ color: '#FFF' }}>About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Provider" style={{ color: '#FFF' }}>Providers</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/DocumentUpload" style={{ color: '#FFF' }}>Document Upload</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/EducationalResources" style={{ color: '#FFF' }}>Educational Resources</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/MapV2" style={{ color: '#FFF' }}>Calculator</a>
                    </li>
                    <li>
                        <a className="nav-link" href="/QuickSightDashboard" style={{ color: '#FFF' }}>Business dashboard</a>
                        <a className="nav-link" id="navbar_item" href="/CarbonEmissionsCalculator">Carbon Calculator</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="navbar_item" href="/QuickSightDashboard">Business dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" id="navbar_item" href="/DocumentsDashboard">Documents Dashboard</a>
                    </li>

                    {/* juts act as if these are the admin */}

                    {
                        isLoggedIn &&

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Dropdown link
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    }
                </ul>
                <NavButton variant="outlined" onClick={onLogInButton}>
                    {isLoggedIn ? (<>Logout</>) : (<>Login</>)}
                </NavButton>
            </div>
        </nav>
    );
}


export default Navbar;