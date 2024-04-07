import Navbar from './pages/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Providers from './pages/Provider';
import DocumentUpload from './pages/DocumentUpload';
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
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
