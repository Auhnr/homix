import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import banner_home from "../../assets/banner-home.png";
import astanaImage from "../../assets/astana.png";
import almatyImage from "../../assets/almaty.png";
import aktauImage from "../../assets/aktau.png";
import shymkentImage from "../../assets/shymkent.png";
import bg_hero from "../../assets/bg_home.jpg";
import mapBackground from "../../assets/map-bg.png"; // Import the map background image
import image2 from "../../assets/image2.png"; // Import image2
import image3 from "../../assets/image3.png"; // Import image3
import image4 from "../../assets/image4.png"; // Import image4
import aboutImage1 from "../../assets/about-img1.avif"; // Import About Us Image 1
import aboutImage2 from "../../assets/about-img2.avif"; // Import About Us Image 2
import aboutImage3 from "../../assets/about-img3.avif"; // Import About Us Image 3

const Home = ({ theme }) => {
  const navigate = useNavigate();

  const handleNavigateToAds = () => {
    navigate("/ads");
  };

  const handleNavigateToContacts = () => {
    navigate("/contacts");
  };

  return (
    <div className={`home-container moving-background`}>
      <div className="map-background"></div>

      <div className={`home_banner ${theme}`}></div>

      <div className={`hero ${theme}`}>
        {theme === "dark" && <div className="hero-overlay"></div>}

        <div className="theme-container">
          <div className={`hero-text text-${theme}`}>
            <h1 style={{ color: theme === "light" ? "black" : "white" }}>
              ВСЯ ВАША НЕДВИЖИМОСТЬ — В ОДНОЙ СИСТЕМЕ
            </h1>
            <p style={{ color: theme === "light" ? "black" : "white" }}>
              Удобный способ следить за объектами, планировать сделки и держать всё под контролем — легко и понятно.
            </p>
            <div className="buttons">
              <button className="primary-btn" onClick={handleNavigateToAds}>
                Найти жилье
              </button> 
              <button
                className="secondary-btn"
                onClick={handleNavigateToContacts}
              >
                Свяжитесь с нами
              </button>
            </div>
            <img src={image2} alt="Image 2" className="image2" />
            <img src={image3} alt="Image 3" className="image3" />
            <img src={image4} alt="Image 4" className="image4" />
          </div>
        </div>
      </div>

      <div className={`about-us about-us-${theme}`}>
        <h2>О компании</h2>
        <p>
          Наша миссия — предоставить клиентам удобный и надежный сервис для работы с недвижимостью. 
          Мы ценим прозрачность, индивидуальный подход и стремимся сделать процесс покупки, продажи 
          или аренды максимально комфортным.
        </p>
        <p>
          С более чем 10-летним опытом работы на рынке недвижимости, мы заслужили доверие тысяч клиентов. 
          Наша команда профессионалов готова помочь вам на каждом этапе сделки.
        </p>
        <p>
          Почему выбирают нас:
          <ul>
            <li>Надежность и прозрачность сделок</li>
            <li>Индивидуальный подход к каждому клиенту</li>
            <li>Широкий выбор объектов недвижимости</li>
          </ul>
        </p>
        <div className="about-us-images">
          <img src={aboutImage1} alt="About Us Image 1" />
          <img src={aboutImage2} alt="About Us Image 2" />
          <img src={aboutImage3} alt="About Us Image 3" />
        </div>
      </div>

      <div className={`slider-header text-${theme}`}>
        <h2 className="slider-title">
          Найдите недвижимость в ведущих городах Казахстана
        </h2>
      </div>
      <ul className={`slider slider-${theme}`}>
        {/* Алматы */}
        <li
          className="item"
          style={{ backgroundImage: `url(${almatyImage})` }}
        >
          <div className="bg-parallax" style={{ backgroundImage: `url(${almatyImage})` }}></div>
          <h3 className="city-name">Almaty</h3>
          <div className="info-container">
            <div className="info-text">
              <p><span>🏘</span>1,200 объектов</p>
              <p><span>🏢</span>Жилые и коммерческие</p>
              <p><span>📍</span>8 районов</p>
            </div>
          </div>
          <button onClick={handleNavigateToAds} className="go-arrow">Перейти</button>
        </li>

        {/* Астана */}
        <li
          className="item"
          style={{ backgroundImage: `url(${astanaImage})` }}
        >
          <div className="bg-parallax" style={{ backgroundImage: `url(${astanaImage})` }}></div>
          <h3 className="city-name">Astana</h3>
          <div className="info-container">
            <div className="info-text">
              <p><span>🏘</span>950 объектов</p>
              <p><span>🏢</span>Аренда, покупка, продажа</p>
              <p><span>📍</span>Центр, Левый берег, Байконур</p>
            </div>
          </div>
          <button onClick={handleNavigateToAds} className="go-arrow">Перейти</button>
        </li>

        {/* Шымкент */}
        <li
          className="item"
          style={{ backgroundImage: `url(${shymkentImage})` }}
        >
          <div className="bg-parallax" style={{ backgroundImage: `url(${shymkentImage})` }}></div>
          <h3 className="city-name">Shymkent</h3>
          <div className="info-container">
            <div className="info-text">
              <p><span>🏘</span>670 объектов</p>
              <p><span>🏢</span>Жилые комплексы и частные дома</p>
              <p><span>📍</span>Аль-Фараби, Каратау</p>
            </div>
          </div>
          <button onClick={handleNavigateToAds} className="go-arrow">Перейти</button>
        </li>

        {/* Актау */}
        <li
          className="item"
          style={{ backgroundImage: `url(${aktauImage})` }}
        >
          <div className="bg-parallax" style={{ backgroundImage: `url(${aktauImage})` }}></div>
          <h3 className="city-name">Aktau</h3>
          <div className="info-container">
            <div className="info-text">
              <p><span>🏘</span>420 объектов</p>
              <p><span>🏢</span>Квартиры у моря, элитная и бюджетная недвижимость</p>
              <p><span>📍</span>3-й, 9-й, 14-й микрорайоны</p>
            </div>
          </div>
          <button onClick={handleNavigateToAds} className="go-arrow">Перейти</button>
        </li>
      </ul>
    </div>
  );
};

export default Home;
