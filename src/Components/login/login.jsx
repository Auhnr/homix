import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import "./login.css";

function LoginPage({ setIsAuthenticated, theme, toggleTheme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      const res = await login(form);
      alert(`Добро пожаловать, ${res.data.user.full_name}!`);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsAuthenticated(true);

      navigate("/profile");
    } catch (err) {
      console.error("Ошибка входа:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <h1 className={`login-title ${theme}`}>Вход</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className={`label-${theme}`}>
            Электронная почта
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите ваш email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className={`label-${theme}`}>
            Пароль
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Введите ваш пароль"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Скрыть" : "Показать"}
            </button>
          </div>
        </div>
        <button type="submit" className={`login-btn ${theme}`}>
          Войти
        </button>
        <p className="register-prompt">
          Нет аккаунта?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Зарегистрироваться
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
