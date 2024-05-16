import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import EducationalResources from './pages/EduResources';
import Footer from './components/Footer';
import MapV2 from './modules/MapV2';
import QuickSightDashboard from './modules/QuickSightDashboard';
import CarbonFootprintCalculator from './pages/CarbonEmissionsCalculator';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DocumentsDashboard from './pages/DocumentsDashboard';
import DeleteEducationalResources from './pages/deleteEduResource';
import AddEducationalResource from './pages/addEduResource';
import AddConsultants from './pages/addConsultants';
import DeleteConsulantant from './pages/deleteConsultant';
import AddContractor from './pages/addContractor';
import DeleteContractor from './pages/deleteContractor';
import Reports from './pages/Reports';
import { Authenticator } from './modules/Authenticator';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import { Hub } from 'aws-amplify/utils';

function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name

  Hub.listen('auth', ({ payload }) => {
    switch (payload.event) {
      case 'signedIn':
        console.log('user have been signedIn successfully.');
        setIsLoggedIn(true);
        setShowLogin(true);
        break;
      case 'signedOut':
        console.log('user have been signedOut successfully.');
        setIsLoggedIn(false);
        setShowLogin(false);
        break;
    }
  });

  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      if (Object.keys(user).length !== 0) {
        setIsLoggedIn(true);
        setShowLogin(true);
        console.log("yes");
      }
    } catch (err) {
      setIsLoggedIn(false);
      setShowLogin(false);
      console.log("no");
    }
  }

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  function handleLoginButton() {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      signOut({ global: true });
      setIsLoggedIn(false);
      setShowLogin(false);
    }
  }

  function closeLoginDialog() {
    setShowLogin(false);
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(7, 55, 99)',
      },
      secondary: {
        main: 'rgb(255, 0, 24)',
      },
    },
    typography: {
      fontFamily: 'Quicksand, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <NavBar isLoggedIn={isLoggedIn} onLogInButton={handleLoginButton} />
          {showLogin && (
            <Authenticator onCloseClick={closeLoginDialog}>
              <main>
                <Routes>
                  <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
                  <Route path="/DocumentsDashboard" element={<DocumentsDashboard />} />
                  <Route path="/deleteEduResource" element={<DeleteEducationalResources />} />
                  <Route path="/addEduResource" element={<AddEducationalResource />} />
                  <Route path="/addConsultants" element={<AddConsultants />} />
                  <Route path="/addContractor" element={<AddContractor />} />
                  <Route path="/deleteConsultant" element={<DeleteConsulantant />} />
                  <Route path="/deleteContractor" element={<DeleteContractor />} />
                  <Route path="/Reports" element={<Reports />} />
                </Routes>
              </main>
            </Authenticator>
          )}
          <Box component="main" flexGrow={1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />} />
              <Route path="/Provider" element={<Providers isLoggedIn={isLoggedIn} />} />
              <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
              <Route path="/DocumentUpload" element={<DocumentUpload />} />
              <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
              <Route path="/Terms" element={<Terms />} />
              <Route path="/Privacy" element={<Privacy />} />
              <Route path="/EducationalResources" element={<EducationalResources isLoggedIn={isLoggedIn} />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
