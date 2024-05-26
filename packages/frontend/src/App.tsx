import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import NavBar from './components/NavBar';
import Home from './pages/Homepage/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import EducationalResources from './pages/EduResources/EduResources';
import Footer from './components/Footer';
import MapV2 from './modules/MapV2';
import QuickSightDashboard from './modules/QuickSightDashboard';
import CarbonFootprintCalculator from './pages/CarbonEmissionsCalculator';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DocumentsDashboard from './pages/DocumentsDashboard';
import DeleteEducationalResources from './pages/deleteEduResource';
import AddEducationalResource from './pages/EduResources/addEduResource';
import AddConsultants from './pages/addConsultants';
import DeleteConsulantant from './pages/deleteConsultant';
import AddContractor from './pages/addContractor';
import DeleteContractor from './pages/deleteContractor';
import Reports from './pages/Reports';
import CalculationReccomendation from './components/CalculationRec';
import CalcUsageStats from './components/CalculatorUsageStats';
import AdminMapAnalytics from './pages/AdminMapAnalytics/AdminMapAnalytics';

import { Authenticator } from './modules/Authenticator';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import { Hub } from 'aws-amplify/utils';
import Chatbot from './components/AmazonLexSolarMapChatbot';
import Inquiry from './pages/Inquiry';
import AdminMap from './pages/AdminMap';

function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name

  Hub.listen('auth', ({ payload }) => {
    switch (payload.event) {
      case 'signedIn':
        console.log('User has been signed in successfully.');
        setIsLoggedIn(true);
        setShowLogin(false);
        break;
      case 'signedOut':
        console.log('User has been signed out successfully.');
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
        setShowLogin(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setShowLogin(false);
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

  const authRoutes = (
    <Routes>
      <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
      <Route path="/DocumentsDashboard" element={<DocumentsDashboard />} />
      <Route path="/calcUsageStats" element={<CalcUsageStats />} />
      <Route path="/deleteEduResource" element={<DeleteEducationalResources />} />
      <Route path="/addEduResource" element={<AddEducationalResource />} />
      <Route path="/addConsultants" element={<AddConsultants />} />
      <Route path="/addContractor" element={<AddContractor />} />
      <Route path="/deleteConsultant" element={<DeleteConsulantant />} />
      <Route path="/deleteContractor" element={<DeleteContractor />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/CalculationRec" element={<CalculationReccomendation />} />
      <Route path="/AdminMap" element={<AdminMap />} />
      <Route path="/AdminMapAnalytics" element={<AdminMapAnalytics />} />
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Provider" element={<Providers isLoggedIn={isLoggedIn} />} />
      <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
      <Route path="/DocumentUpload" element={<DocumentUpload />} />
      <Route path="/EducationalResources" element={<EducationalResources isLoggedIn={isLoggedIn} />} />
      <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/Privacy" element={<Privacy />} />
      <Route path="/Inquiry" element={<Inquiry />} />
      <Route path="*" element={<About />} />
    </Routes>
  );

  const normRoutes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/Provider" element={<Providers isLoggedIn={isLoggedIn} />} />
      <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
      <Route path="/DocumentUpload" element={<DocumentUpload />} />
      <Route path="/EducationalResources" element={<EducationalResources isLoggedIn={isLoggedIn} />} />
      <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/Privacy" element={<Privacy />} />
      <Route path="/Inquiry" element={<Inquiry />} />
      <Route path="*" element={<About />} />
    </Routes>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <NavBar isLoggedIn={isLoggedIn} onLogInButton={handleLoginButton} />
          {showLogin && (
            <Box position="fixed" top={0} left={0} width="100%" height="100%" zIndex={9999} display="flex" justifyContent="center" alignItems="center" bgcolor="rgba(0, 0, 0, 0.4)">
              <Authenticator onCloseClick={closeLoginDialog} />
            </Box>
          )}
          <Box component="main" flexGrow={1}>
            {isLoggedIn ? authRoutes : normRoutes}
          </Box>
          <Footer />
          <Chatbot />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
