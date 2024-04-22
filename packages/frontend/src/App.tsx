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
import { Authenticator } from '@aws-amplify/ui-react';
function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name
  console.log(process.env.USER_POOL_ID);
  console.log(process.env.USER_POOL_WEB_CLIENT_ID);
  return (
    <Authenticator>
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Provider" element={<Providers />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            {/* <Route path="/Map" element={<Map />} /> */}
            <Route path="/EducationalResources" element={<EducationalResources />} />
            <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
          </Routes>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
    </Authenticator>
  )
}

export default App;
