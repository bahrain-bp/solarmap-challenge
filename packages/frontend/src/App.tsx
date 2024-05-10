import { useState, useEffect } from 'react';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import EducationalResources from './pages/EduResources';
import Footer from './pages/Footer'
// import Map from './pages/Map'
import MapV2 from './components/MapV2'; // Import InitializeMap component
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import QuickSightDashboard from './components/QuickSightDashboard';
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
import CalcUsageStats from './components/CalculatorUsageStats';


import { Authenticator } from './components/Authenticator';
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


  // vars for login check
  const [showLogin, setShowLogin] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // reuse this function to recheck if there is a signed in user (in each page that needs login)
  async function currentAuthenticatedUser() {
    try {
      const user = await getCurrentUser();
      if (Object.keys(user).length !== 0)
      {
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

  // this b3d for recheck
  useEffect(() => {
    currentAuthenticatedUser();
  }, []);


  // 1. add check for login (const)

  function handleLoginButton()
  {
    // check if logged in first, if so, logout and set to false, flip if login (if not logged in )
    if (!isLoggedIn)
    {
      setShowLogin(true);
    }
    else
    {
      signOut({ global: true });
      setIsLoggedIn(false);
      setShowLogin(false);
    }

  }

  function closeLoginDialog()
  {
    setShowLogin(false);
  }


  return (
    <BrowserRouter>
      <div className="App">
        {/* pass in actual log stats to navbar (to change from login and logout in the text) */}
        <Navbar isLoggedIn={isLoggedIn} onLogInButton={handleLoginButton}/>
        { showLogin &&
            <Authenticator onCloseClick={closeLoginDialog} >
                  <main>
                    <Routes>
                    <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
                    <Route path="/DocumentsDashboard" element={<DocumentsDashboard/>}/>
                    <Route path="/calcUsageStats" element={<CalcUsageStats />} />
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
        }

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Provider" element={<Providers isLoggedIn={isLoggedIn} />} />
            <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName}/>}/>
            <Route path="/Terms" element={<Terms/>}/>
            <Route path="/Privacy" element={<Privacy/>}/>
            <Route path="/EducationalResources" element={<EducationalResources isLoggedIn={isLoggedIn} />} />
          </Routes>

        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;