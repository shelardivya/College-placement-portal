import { useState } from "react";
import LandingPage from './pages/public/LandingPage';
import Registration from './pages/public/Registration';
import Login from "./pages/public/Login";
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (token && storedUser.email) {
      const isAdmin = storedUser.email === 'saurabh@gmail.com' ||
        storedUser.email.includes('admin');
      return isAdmin ? 'admin' : 'student';
    }
    return 'student'; // Fallback default for testing
  });

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