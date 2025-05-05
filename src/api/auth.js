import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Убедитесь, что baseURL корректен
});

// 📌 Регистрация
export const register = (data) => API.post("/auth/register", data);

// 📌 Вход
export const login = (data) => API.post("/auth/login", data);

// 📌 Получить текущего пользователя
export const getCurrentUser = (token) =>
  API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// 📌 Обновление данных пользователя
export const updateUser = (token, data) =>
  API.put("/auth/me", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// 📌 Удаление профиля
export const deleteUser = (token) =>
  API.delete("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
