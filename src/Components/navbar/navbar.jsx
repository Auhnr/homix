import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSearchStore from "../../store/searchStore";
import "./navbar.css";
import logo_light from "../../assets/HomIX_light.png";
import logo_dark from "../../assets/HomIX_dark.png";
import search_icon_light from "../../assets/search-w.png";
import search_icon_dark from "../../assets/search-b.png";
import toogle_light from "../../assets/night.png";
import toogle_dark from "../../assets/day.png";

const Navbar = ({ theme, setTheme }) => {
  const { query, setQuery } = useSearchStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogoClick = () => {
    navigate("/");
    closeAllMenus();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector('.navbar');
      const mobileMenu = document.querySelector('.mobile-menu');
      if (!navbar.contains(event.target) && !mobileMenu.contains(event.target)) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    return () => closeAllMenus();
  }, [navigate]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <div className={`navbar ${theme}`}>
      <img
        src={theme === "light" ? logo_light : logo_dark}
        alt="Логотип"
        className="logo"
        onClick={handleLogoClick}
      />

      {/* Desktop Navigation */}
      <ul className="nav-links">
        <li>
          <Link to="/" onClick={closeAllMenus}>
            Главная
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={closeAllMenus}>
            Профиль
          </Link>
        </li>
        <li>
          <Link to="/ads" onClick={closeAllMenus}>
            Объявления
          </Link>
        </li>
        <li>
          <Link to="/contacts" onClick={closeAllMenus}>
            Контакты
          </Link>
        </li>
      </ul>

      {/* Desktop Search */}
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск..."
        />
        <img 
          src={theme === "light" ? search_icon_light : search_icon_dark} 
          alt="Поиск" 
          className="search-icon" 
        />
      </div>

      {/* Mobile Search */}
      <div className="mobile-search">
        <img
          src={theme === "light" ? search_icon_light : search_icon_dark}
          alt="Поиск"
          className="mobile-search-icon"
          onClick={toggleSearch}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск..."
          className={`mobile-search-input ${isSearchOpen ? 'active' : ''}`}
        />
      </div>

      {/* Theme Toggle */}
      <img
        src={theme === "light" ? toogle_light : toogle_dark}
        alt="Переключатель темы"
        className="toogle-icon"
        onClick={toggleTheme}
      />

      {/* Hamburger Menu */}
      <div 
        className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={toggleMobileMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeAllMenus}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <Link to="/" onClick={closeAllMenus}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={closeAllMenus}>
              Профиль
            </Link>
          </li>
          <li>
            <Link to="/ads" onClick={closeAllMenus}>
              Объявления
            </Link>
          </li>
          <li>
            <Link to="/contacts" onClick={closeAllMenus}>
              Контакты
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;