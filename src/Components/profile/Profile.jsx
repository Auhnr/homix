import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateUser, deleteUser } from "../../api/auth";
import { getMyAds, deleteAd } from "../../api/ads";
import "./profile.css";
import user_avatar from "../../assets/user_avatar.png";

const Profile = ({ theme, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [myAds, setMyAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then((res) => {
          setUser(res.data);
          setFormData({
            full_name: res.data.full_name,
            email: res.data.email,
            phone_number: res.data.phone_number || "",
          });
        })
        .catch(() => alert("Ошибка получения данных"));

      getMyAds(token)
        .then((res) => setMyAds(res.data))
        .catch(() => alert("Ошибка загрузки объявлений"));
    }
  }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedUser = await updateUser(token, formData);
      setUser(updatedUser.data);
      setIsEditing(false);
      alert("Профиль успешно обновлен");
    } catch {
      alert("Ошибка обновления профиля");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Вы уверены, что хотите удалить свой профиль?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteUser(token);
        localStorage.clear();
        onLogout();
        alert("Профиль успешно удален");
      } catch {
        alert("Ошибка при удалении профиля");
      }
    }
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm("Вы уверены, что хотите удалить это объявление?")) {
      try {
        await deleteAd(adId);
        setMyAds(myAds.filter((ad) => ad.id !== adId));
        alert("Объявление успешно удалено");
      } catch {
        alert("Ошибка при удалении объявления");
      }
    }
  };

  const handleAddAd = () => navigate("/add-ad");
  const handleMyListings = () => navigate("/my-listings");

  if (!user) return <div>Загрузка...</div>;

  return (
    <div className={`profile-container ${theme}`}>
      <div className={`profile-header ${theme}`}>
        <img src={user_avatar} alt="User Avatar" className="profile-avatar" />
        {isEditing ? (
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className={`profile-input ${theme}`}
          />
        ) : (
          <h1 className={`profile-name ${theme}`}>{user.full_name}</h1>
        )}
        <p className={`profile-email ${theme}`}>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`profile-input ${theme}`}
            />
          ) : (
            user.email
          )}
        </p>
      </div>
      <div className={`profile-body ${theme}`}>
        <div className={`profile-section ${theme}`}>
          <h2>Информация</h2>
          <p>
            <strong>Телефон:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`profile-input ${theme}`}
              />
            ) : (
              user.phone_number || "Не указан"
            )}
          </p>
        </div>
        <div className={`profile-section ${theme}`}>
          <h2>Мои объявления</h2>
          {myAds.length > 0 ? (
            <ul className={`ads-list ${theme}`}>
              {myAds.map((ad) => (
                <li key={ad.id} className={`ad-item ${theme}`}>
                  <p>
                    <strong>{ad.title}</strong> - {ad.price} ₸
                  </p>
                  <button
                    className={`delete-ad-btn ${theme}`}
                    onClick={() => handleDeleteAd(ad.id)}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`no-ads-message ${theme}`}>У вас нет объявлений</p>
          )}
        </div>
        <div className={`profile-section ${theme}`}>
          <h2>Действия</h2>
          <div className={`profile-actions-grid ${theme}`}>
            {isEditing ? (
              <>
                <button
                  className={`profile-action-btn save-btn ${theme}`}
                  onClick={handleSave}
                >
                  Сохранить
                </button>
                <button
                  className={`profile-action-btn cancel-btn ${theme}`}
                  onClick={handleCancel}
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <button
                  className={`profile-action-btn edit-btn ${theme}`}
                  onClick={handleEdit}
                >
                  Редактировать профиль
                </button>
                <button
                  className={`profile-action-btn logout-btn ${theme}`}
                  onClick={onLogout}
                >
                  Выйти
                </button>
                <button
                  className={`profile-action-btn add-ad-btn ${theme}`}
                  onClick={handleAddAd}
                >
                  Добавить объявление
                </button>
                <button
                  className={`profile-action-btn delete-profile-btn ${theme}`}
                  onClick={handleDelete}
                >
                  Удалить профиль
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
