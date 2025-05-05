import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Убедитесь, что baseURL корректен
});

// Добавление объявления
export const addAd = (token, data) =>
  API.post("/ads", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Получение всех объявлений
export const getAds = () => API.get("/ads");

// Получение объявлений текущего пользователя
export const getMyAds = (token) =>
  API.get("/ads/my-ads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Удаление объявления
export const deleteAd = (adId) => {
  const token = localStorage.getItem("token");
  return API.delete(`/ads/${adId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Фильтрация объявлений
export const filterAds = (filters) => {
  return API.get("/ads", {
    params: filters,
  });
};

// Получение деталей объявления
export const getAdDetails = (id) => {
  console.log("Выполняем запрос к API для ID:", id); // Логируем ID
  return API.get(`/ads/${id}`)
    .then((response) => {
      console.log("Ответ API:", response.data); // Логируем ответ API
      return response;
    })
    .catch((error) => {
      console.error("Ошибка API:", error.response?.data || error.message); // Логируем ошибку
      throw error;
    });
};
