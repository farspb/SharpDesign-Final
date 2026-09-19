import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import CryptoSignals from './pages/CryptoSignals';
import StockSignals from './pages/StockSignals';
import Astrology from './pages/Astrology';
import News from './pages/News';
import Auth from './pages/Auth';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/crypto" element={<CryptoSignals />} />
                    <Route path="/stock" element={<StockSignals />} />
                    <Route path="/astrology" element={<Astrology />} />
                    <Route path="/news" element={<News />} />
                </Routes>
            </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;