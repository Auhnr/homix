import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSearchStore from "../../store/searchStore";
import "./recommend.css";
import city from "../../assets/city.png";

const Recommend = ({ theme }) => {
  const { filteredListings, fetchListings, setFilters, filters } =
    useSearchStore();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (e) => {
    const { name, value, type } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]:
        type === "number" || name.includes("Price") || name.includes("Area")
          ? Number(value)
          : value,
    });

    // Логируем изменения фильтров
    console.log("Изменение фильтра:", name, value);
  };

  const applyFilters = () => {
    // Применяем фильтры
    setFilters(localFilters);
    setShowFilters(false);

    // Логируем примененные фильтры
    console.log("Примененные фильтры:", localFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      type: "",
      dealType: "",
      city: "",
      district: "",
      address: "",
      minArea: "",
      maxArea: "",
      rooms: "",
      floor: "",
      totalFloors: "",
    };
    setLocalFilters(defaultFilters);
    setFilters(defaultFilters);
    setShowFilters(false);

    // Логируем сброс фильтров
    console.log("Фильтры сброшены");
  };

  return (
    <div className={`recommendation-container text-${theme}`}>
      <div className="recommendation-header">
        <span>Рекомендованные объявления</span>
        <button className="filter-btn" onClick={() => setShowFilters(true)}>
          Фильтры
        </button>
      </div>
      <div className="recommendation-list">
        {filteredListings.map((ad) => (
          <Link
            to={`/ads/${ad.id}`}
            key={ad.id}
            className={`ad_container text-${theme}`}
          >
            <img
              src={`http://localhost:5000${ad.images?.[0]}` || city}
              alt={ad.type}
              className="ad_image"
            />
            <h1 className="ad_type">{ad.type}</h1>
            <p className="ad_title">{ad.title}</p>
            <div className="ad_info">
              <p className="ad_city">
                <img src={city} alt="city" />
                {ad.city}, {ad.district}
              </p>
              <p className="ad_price">
                {ad.price} <span className="ad_price_type">₸</span>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {showFilters && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h2>Фильтры</h2>
            <div className="filter-group">
              <label htmlFor="city">Город</label>
              <input
                type="text"
                id="city"
                name="city"
                value={localFilters.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="district">Район</label>
              <input
                type="text"
                id="district"
                name="district"
                value={localFilters.district}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="address">Адрес</label>
              <input
                type="text"
                id="address"
                name="address"
                value={localFilters.address}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="minArea">Минимальная площадь (м²)</label>
              <input
                type="number"
                id="minArea"
                name="minArea"
                value={localFilters.minArea}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="maxArea">Максимальная площадь (м²)</label>
              <input
                type="number"
                id="maxArea"
                name="maxArea"
                value={localFilters.maxArea}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="rooms">Количество комнат</label>
              <input
                type="number"
                id="rooms"
                name="rooms"
                value={localFilters.rooms}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="floor">Этаж</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={localFilters.floor}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="totalFloors">Всего этажей</label>
              <input
                type="number"
                id="totalFloors"
                name="totalFloors"
                value={localFilters.totalFloors}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="type">Тип</label>
              <select
                id="type"
                name="type"
                value={localFilters.type}
                onChange={handleFilterChange}
              >
                <option value="">Все</option>
                <option value="Квартира">Квартира</option>
                <option value="Дом">Дом</option>
                <option value="Комната">Комната</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="apply-btn" onClick={applyFilters}>
                Применить
              </button>
              <button className="reset-btn" onClick={resetFilters}>
                Сбросить
              </button>
              <button
                className="close-btn"
                onClick={() => setShowFilters(false)}
              >
                Отмена
              </button>
              <button
                className="close-filter-btn"
                onClick={() => setShowFilters(false)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;
