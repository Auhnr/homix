import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adsRoutes from "./routes/ads.js";
import pkg from "pg";
import path from "path";
const { Pool } = pkg;

dotenv.config();
const app = express();

// Middleware для JSON
app.use(express.json());

//Middleware для CORS
app.use(cors());

// Роуты
app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);

// Статическая папка для изображений
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Статическая папка для изображений
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Подключение к PostgreSQL
export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool
  .connect()
  .then(() => console.log("✅ Подключено к PostgreSQL"))
  .catch((err) => console.error("❌ Ошибка подключения к PostgreSQL:", err));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
