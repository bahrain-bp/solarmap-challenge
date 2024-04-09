import Navbar from './pages/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
import Map from './pages/Map';
import Calculator from './pages/Calculator';

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
            <Route path="/Calculator" element={<Calculator />} />
            <Route path="/Provider" element={<Providers />} />
            <Route path="/DocumentUpload" element={<DocumentUpload />} />
            <Route path="/Map" element={<Map />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
