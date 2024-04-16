import Navbar from './pages/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import Map from './pages/Map';
import Footer from './pages/Footer'
import EducationalResources from './pages/EduResources';

import { BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
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
            <Route path="/EducationalResources" element={<EducationalResources />} />
          </Routes>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
