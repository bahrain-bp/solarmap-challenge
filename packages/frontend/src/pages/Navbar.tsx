import logo from "../assets/logo.png";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { fetchUserAttributes } from "@aws-amplify/auth";

// Type definition for the props
interface NavbarProps {
    isLoggedIn: boolean;
    onLogInButton: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogInButton }) => {
    const NavButton = styled(Button)({
        color: '#FFF',
        borderColor: '#FFF',
        '&:hover': {
            backgroundColor: '#062542',
            borderColor: '#FFF',
        },
        marginRight: '20px',
    });

    // Explicitly define the type of the state
    const [userName, setUserName] = useState<string | null>(null);

    async function getUserInfo() {
        const data = await fetchUserAttributes();
        // Use optional chaining and nullish coalescing operator to handle undefined
        setUserName(data.given_name ?? null);
    }

    useEffect(() => { getUserInfo(); }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: isLoggedIn ? '#FF0000' : '#073763' }}>
            <a href="/" className="d-block w-200">
                <img src={logo} alt="Logo" style={{ paddingLeft: '25px', paddingRight: '50px', height: '55px' }} />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                    <ul className="navbar-nav mr-auto" style={{ color: '#FFF' }}>
                        {/* Customer Pages */}
                        <li className="nav-item"><a className="nav-link" href="/" style={{ color: '#FFF' }}>Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="/About" style={{ color: '#FFF' }}>About</a></li>
                        <li className="nav-item"><a className="nav-link" href="/Provider" style={{ color: '#FFF' }}>Providers</a></li>
                        <li className="nav-item"><a className="nav-link" href="/DocumentUpload" style={{ color: '#FFF' }}>Document Upload</a></li>
                        <li className="nav-item"><a className="nav-link" href="/EducationalResources" style={{ color: '#FFF' }}>Educational Resources</a></li>
                        <li className="nav-item"><a className="nav-link" href="/MapV2" style={{ color: '#FFF' }}>Calculator</a></li>
                        <li className="nav-item"><a className="nav-link" href="/CarbonEmissionsCalculator" style={{ color: '#FFF' }}>Carbon Calculator</a></li>
                        {/* Admin Pages */}
                    </ul>
                    {isLoggedIn &&
                        <div style={{ marginTop: '20px' }}>
                            <span style={{ color: '#FFF', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Admin Pages</span>
                            <ul className="navbar-nav" style={{ color: '#FFF' }}>
                            <li className="nav-item"><a className="nav-link" href="/Reports" style={{ color: '#FFF' }}>Reports</a></li>
                                <li className="nav-item"><a className="nav-link" href="/QuickSightDashboard" style={{ color: '#FFF' }}>Business dashboard</a></li>
                                <li className="nav-item"><a className="nav-link" href="/DocumentsDashboard" style={{ color: '#FFF' }}>Documents Dashboard</a></li>
                            </ul>
                        </div>
                    }
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isLoggedIn && userName && <p style={{ color: '#FFF', marginRight: '10px' }}>Hello {userName} 👋🏼</p>}
                    <NavButton variant="outlined" onClick={onLogInButton}>
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </NavButton>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
