import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './fonts.css';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);


  return (
    <>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <AppRoutes />
    </>
  );
}

export default App;