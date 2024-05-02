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
            <Route path="/addConsultants" element={<AddConsultants />} />
            <Route path="/addContractor" element={<AddContractor />} />
            <Route path="/deleteConsultant" element={<DeleteConsulantant />} />
            <Route path="/deleteContractor" element={<DeleteContractor />} />
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
            <Route path="/DocumentsDashboard" element={<DocumentsDashboard />} />

          </Routes>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;
