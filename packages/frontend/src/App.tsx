import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import EducationalResources from './pages/EduResources';
import { Authenticator } from './components/Authenticator';
import Footer from './pages/Footer'
// import Map from './pages/Map'
import MapV2 from './components/MapV2'; // Import InitializeMap component
import { BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from 'aws-amplify/auth';
import QuickSightDashboard from './components/QuickSightDashboard';
<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { Authenticator } from './components/Authenticator';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { useEffect, useState } from 'react';



>>>>>>> f659227b86b18a773bc2c364644ec791fa66674d



function RequireAuth({ children }: {children:React.ReactNode}) {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(0);

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsAuth(1))
      .catch(() => {
        navigate("/Authenticator")
      })
  }, [])
    
  return isAuth && children;
}

function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function handleFetchUserAttributes() {
    try {
      const userAttributes = await fetchUserAttributes();
      console.log(userAttributes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      handleFetchUserAttributes();
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  })

  return (
    <BrowserRouter>
              <div className="App">
        <Navbar />
        <div className="content">
    <Routes>

    <Route path="/" element={<Home />} />
    {/* <Route path="/About" element={<About />} /> */}
    <Route path="/Provider" element={<Providers />} />
    <Route path="/Authenticator" element={<Authenticator />} />

    
    <Route path="/DocumentUpload" element={<DocumentUpload />} />
    <Route
          path="/About" 
          element={
            <RequireAuth>
              {<About />}
            </RequireAuth>
          }
        />
    <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
            {/* <Route path="/Map" element={<Map />} /> */}
            <Route path="/EducationalResources" element={<EducationalResources />} />
            <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
    </Routes>
    </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>

  )
}

export default App;
