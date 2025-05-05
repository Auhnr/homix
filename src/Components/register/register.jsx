import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import "./register.css";

const Register = ({ theme }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    try {
      const res = await register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
      });
      alert(res.data.message);

      // Сохраняем токен и данные пользователя
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Перенаправляем на страницу профиля
      navigate("/profile");
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      alert(err.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className={`register-container ${theme}`}>
      <h1 className={`register-title ${theme}`}>Регистрация</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="full_name" className={`label-${theme}`}>
            ФИО
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            placeholder="Введите ваше ФИО"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className={`label-${theme}`}>
            Электронная почта
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите ваш email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className={`label-${theme}`}>
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите ваш пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className={`label-${theme}`}>
            Подтвердите пароль
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Подтвердите ваш пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number" className={`label-${theme}`}>
            Номер телефона
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            placeholder="Введите ваш номер телефона"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={`register-btn ${theme}`}>
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
