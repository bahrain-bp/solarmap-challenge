import { useState } from 'react';
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

import { Authenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name

  const [showLogin, setShowLogin] = useState(false);

  // 1. add check for login (const)

  function handleLoginButton()
  {
    // check if logged in first, if so, logout and set to false, flip if login (if not logged in )
    setShowLogin(true);
    // use navigate to / admin dashboaerd



    // // do logout logic (wrap with if authenticated) (if logged in)
    // signOut();
    // setShowLogin(false);
  }


  return (
    <BrowserRouter>
      <div className="App">
        {/* pass in actual log stats to navbar (to change from login and logout in the text) */}
        <Navbar isLoggedIn={false} onLogInButton={handleLoginButton}/>
        { showLogin &&
            <Authenticator>
              {({ signOut, user }) => (
                  <main>
                    <h1>Hello {user.username}</h1>
                    <button onClick={signOut}>Sign out</button>

                    <Routes>
                      <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
                      <Route path="/Terms" element={<Terms />} />
                      <Route path="/Privacy" element={<Privacy />} />
                      <Route path="/DocumentsDashboard" element={<DocumentsDashboard />} />
                    </Routes>

                  </main>
              )}
            </Authenticator>
        }

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Provider" element={<Providers />} />
            <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
            <Route path="/EducationalResources" element={<EducationalResources />} />
            <Route path="/deleteEduResource" element={<DeleteEducationalResources />} />
            <Route path="/addEduResource" element={<AddEducationalResource />} />
          </Routes>



        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;