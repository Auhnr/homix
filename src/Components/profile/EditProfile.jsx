import React, { useState } from "react";
import "./profile.css";

const EditProfile = ({ user, onSave, onCancel, theme }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={`edit-profile-container ${theme}`}>
      <h2 className={theme}>Редактировать профиль</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className={theme}>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className={theme}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className={theme}>Город:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="profile-btn primary-btn">
            Сохранить
          </button>
          <button
            type="button"
            className="profile-btn secondary-btn"
            onClick={onCancel}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
