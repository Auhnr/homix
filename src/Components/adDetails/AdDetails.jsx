import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAdDetails } from "../../api/ads";
import "./adDetails.css";

const AdDetails = ({ theme }) => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        console.log("Запрашиваем данные для объявления с ID:", id); // Логируем ID
        const response = await getAdDetails(id);
        console.log("Полученные данные объявления:", response.data); // Логируем данные
        setAd(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных объявления:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === ad.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? ad.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return <div className="ad-details__not-found">Загрузка...</div>;
  }

  if (!ad) {
    return <div className="ad-details__not-found">Объявление не найдено</div>;
  }

  return (
    <div className={`ad-details__container ${theme}`}>
      <div className="ad-details__header">
        <div className="ad-details__images">
          {ad.images?.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:5000${image}`}
              alt={`Фото ${index + 1}`}
              className="ad-details__image"
              onClick={() => openModal(index)}
            />
          ))}
        </div>
        <div className="ad-details__info">
          <h1 className="ad-details__title">{ad.title}</h1>
          <p className="ad-details__price">{ad.price} ₸</p>
          <p className="ad-details__city">
            {ad.city}, {ad.district}
          </p>
        </div>
      </div>
      <div className="ad-details__body">
        <p>
          <strong>Тип недвижимости:</strong> {ad.type}
        </p>
        <p>
          <strong>Цель:</strong> {ad.purpose}
        </p>
        {ad.purpose === "аренда" && (
          <p>
            <strong>Период аренды:</strong> {ad.rent_period}
          </p>
        )}
        <p>
          <strong>Адрес:</strong> {ad.address}
        </p>
        {ad.area && (
          <p>
            <strong>Площадь:</strong> {ad.area} м²
          </p>
        )}
        {ad.land_area && (
          <p>
            <strong>Площадь участка:</strong> {ad.land_area} {ad.land_unit}
          </p>
        )}
        {ad.rooms && (
          <p>
            <strong>Количество комнат:</strong> {ad.rooms}
          </p>
        )}
        {ad.floor && (
          <p>
            <strong>Этаж:</strong> {ad.floor}
          </p>
        )}
        {ad.total_floors && (
          <p>
            <strong>Всего этажей:</strong> {ad.total_floors}
          </p>
        )}
        <p>
          <strong>Описание:</strong> {ad.description}
        </p>
        <p>
          <strong>Опубликовал:</strong> {ad.user_name}
        </p>
        <p>
          <strong>Телефон для связи:</strong> {ad.user_phone || "Не указан"}
        </p>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>
            <button className="modal-prev" onClick={showPrevImage}>
              ◀
            </button>
            <img
              src={`http://localhost:5000${ad.images[currentImageIndex]}`}
              alt={`Фото ${currentImageIndex + 1}`}
              className="modal-image"
            />
            <button className="modal-next" onClick={showNextImage}>
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetails;
