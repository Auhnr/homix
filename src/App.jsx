import React, { useEffect, useState, useCallback } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/navbar/navbar";
import Home from "./Components/home/Home";
import Register from "./Components/register/Register";
import Login from "./Components/login/login";
import Contacts from "./Components/contacts/contacts";
import Loader from "./Components/loader/loader";
import Recommend from "./Components/recommend/Recommend";
import Footer from "./Components/footer/Footer";
import AdDetails from "./Components/adDetails/AdDetails";
import Profile from "./Components/profile/Profile";
import AddAd from "./Components/addAd/AddAd";
import "../src/index.css";

const App = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("current_theme") || "light"
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(true);

  const saveThemeToLocalStorage = useCallback(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  useEffect(() => {
    saveThemeToLocalStorage();
  }, [theme, saveThemeToLocalStorage]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  if (loading) return <LoaderContainer />;

  return (
    <Router>
      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route
            path="/"
            element={
              <div className="page">
                <Home theme={theme} />
              </div>
            }
            exact
          />
          <Route
            path="/ads"
            element={
              <div className="page">
                <Recommend theme={theme} />
              </div>
            }
          />
          <Route
            path="/ads/:id"
            element={
              <div className="page">
                <AdDetails theme={theme} />
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div className="page">
                {isAuthenticated ? (
                  <Profile theme={theme} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )}
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="page">
                <Register theme={theme} />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="page">
                <Login theme={theme} setIsAuthenticated={setIsAuthenticated} />
              </div>
            }
          />
          <Route
            path="/contacts"
            element={
              <div className="page">
                <Contacts theme={theme} />
              </div>
            }
          />
          <Route
            path="/add-ad"
            element={
              <div className="page">
                {isAuthenticated ? (
                  <AddAd theme={theme} />
                ) : (
                  <Navigate to="/login" />
                )}
              </div>
            }
          />
        </Routes>
        {Footer && <Footer theme={theme} />}
      </div>
    </Router>
  );
};

const LoaderContainer = () => (
  <div className="container">
    <Loader />
  </div>
);

export default App;
