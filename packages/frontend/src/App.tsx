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
import DeleteEducationalResources from './pages/deleteEduResource';
import AddEducationalResource from './pages/addEduResource';

function App() {
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID; // Cognito Identity Pool ID
  const mapName = import.meta.env.VITE_MAP_NAME; // Amazon Location Service Map Name

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Provider" element={<Providers />} />
            <Route path="/CarbonEmissionsCalculator" element={<CarbonFootprintCalculator />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            <Route path="/QuickSightDashboard" element={<QuickSightDashboard />} />
            {/* <Route path="/Map" element={<Map />} /> */}
            <Route path="/EducationalResources" element={<EducationalResources />} />
            <Route path="/deleteEduResource" element={<DeleteEducationalResources />} />
            <Route path="/addEduResource" element={<AddEducationalResource />} />
            <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/Privacy" element={<Privacy />} />

          </Routes>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;
