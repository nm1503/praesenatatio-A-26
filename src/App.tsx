import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Domains from './pages/Domains';
import Flagships from './pages/Flagships';
import DomainActivity from './pages/DomainActivity';
import GalleryPage from './pages/GalleryPage';

// Spiral is now embedded inside the Home page drum — not a global fixed element.

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/flagships" element={<Flagships />} />
          <Route path="/domain-activity" element={<DomainActivity />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
