import { useState } from "react";
import LandingPage from './pages/LandingPage';
import Registration from './pages/Registration';
import Login from "./pages/Login";

function App() {
  const [currentPage, setCurrentPage] =
    useState('landing');

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onNavigate={navigateTo} />
      )}

      {currentPage === 'register' && (
        <Registration onNavigate={navigateTo} />
      )}

      {currentPage === 'login' && (
        <Login onNavigate={navigateTo} />
      )}
    </>
  );
}

export default App;