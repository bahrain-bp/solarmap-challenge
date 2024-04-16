import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import Footer from './pages/Footer'
import Map from './pages/Map'
import MapV2 from './components/MapV2'; // Import InitializeMap component
import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  const identityPoolId = "us-east-1:3a802d07-d77b-4b1d-9b5f-efea30622397"; // Cognito Identity Pool ID
  const mapName = "devs-map"; // Amazon Location Service Map Name

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Provider" element={<Providers />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            <Route path="/Map" element={<Map />} />
            <Route path="/MapV2" element={<MapV2 identityPoolId={identityPoolId} mapName={mapName} />} />
          </Routes>
        </div>
        < Footer />
      </div>
    </BrowserRouter>
  )
}

export default App;
