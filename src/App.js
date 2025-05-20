import { useEffect, useState } from "react";
import './App.css';
import FooterConponent from './components/FooterConponent';
import HeaderComponent from './components/HeaderComponent';
import HomePage from './pages/HomePage';
import { Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import PostPage from "./pages/PostPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectPage from "./pages/ProjectPage";

function App() {


  const [showButton, setShowButton] = useState(false);
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (pathname === '/' && hash) return;
  
    window.scrollTo(0, 0);
  }, [pathname, hash]);


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<> <HeaderComponent /> <HomePage /> <FooterConponent /></>} />
        <Route path="/system/authorization/admin/management" element={<AdminPage />} />
        <Route path="/system/authorization/admin/login" element={<LoginPage />} />
        <Route path="/system/login" element={<LoginPage />} />
        <Route path="/bai-viet/:slugify" element={<><HeaderComponent /><PostPage /><FooterConponent /></>} />
        <Route path="/du-an/:slugify" element={<><HeaderComponent /><ProjectPage /><FooterConponent /></>} />
        <Route path="/*" element={<><HeaderComponent /><NotFoundPage /><FooterConponent /></>} />
      </Routes>

      {showButton && <button
        className="btnToTop"
        onClick={scrollToTop}
      ><i className="fa-solid fa-angle-up"></i></button>}

      <a className="callNow" href="tel: +0971833093"><i className="fa-solid fa-phone"/></a>
      {/* <a className={`${styleModule.footer_contact_item}`} id="item_phone" href="tel: +0971833093" style={{ backgroundImage: `url(${phoneIcon})` }}></a> */}
      
    </div>
  );
}

export default App;
