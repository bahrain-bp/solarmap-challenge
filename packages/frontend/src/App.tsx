import Navbar from './pages/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import Map from './pages/Map'
import MapV2 from './components/MapV2'; // Import InitializeMap component
import logo from "./assets/logo.png";
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
        {/* Footer */}
      <footer style={{backgroundColor:"grey"}}>
        <div className="container-fluid padding">
          <div className="row text-center">
            <div className="col-md-4">
              <img src= {logo} style={{height: "100px"}}/>
              <hr className="light" />
              <p>555-555-555</p>
              <p>email@email.com</p>
              <p>Manama, Bahrain</p>
          </div>
          <div className="col-md-4">
            <hr className="light" />
            <h5>Our Hours</h5>
            <hr className="light" />
            <p>Monday-Friday: 9am-5pm</p>
            <p>Saturday: 10am-2pm</p>
            <p>Sunday: Closed</p>
          </div>
          <div className="col-md-4">
          <hr className="light" />
            <h5>Service Governates</h5>
            <hr className="light" />
            <p>Central Municpal</p>
            <p>Muharraq Municpal</p>
            <p>Northern Municpal</p>
            <p>Southern Municpal</p>
          </div>
          <div className="col-12">
            <hr className="light" />
            <h5>&copy; 2024 Solar Map</h5>
            <h5>solarmap.org.bh</h5>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </BrowserRouter>
  )
}

export default App;
