import { useState } from "react";
import LandingPage from './pages/public/LandingPage';
import Registration from './pages/public/Registration';
import Login from "./pages/public/Login";
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.startsWith('/reset-password') || search.includes('token=') || search.includes('email=')) {
      return 'login';
    }
    if (path === '/student') {
      return 'student';
    }
    if (path === '/admin') {
      return 'admin';
    }
    return 'landing';
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);

    // Sync browser URL bar dynamically
    if (page === 'admin') window.history.pushState(null, '', '/admin');
    else if (page === 'student') window.history.pushState(null, '', '/student');
    else if (page === 'login') window.history.pushState(null, '', '/login');
    else if (page === 'register') window.history.pushState(null, '', '/register');
    else window.history.pushState(null, '', '/');
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
        <Login 
          onNavigate={navigateTo} 
          initialView={
            window.location.pathname.startsWith('/reset-password') || 
            window.location.search.includes('token=') || 
            window.location.search.includes('email=') 
              ? 'reset' 
              : 'login'
          } 
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard onNavigate={navigateTo} />
      )}

      {currentPage === 'student' && (
        <StudentDashboard onNavigate={navigateTo} />
      )

      }


    </>
  );
}

export default App;