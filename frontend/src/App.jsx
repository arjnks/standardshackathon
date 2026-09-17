import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="bg-grid"></div>
      <div className="glow"></div>
      
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Autodesk Fusion <span className="text-gold">×</span> Standards</Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/register" className="nav-link">REGISTER</Link>
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hackathon-admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
