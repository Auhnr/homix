import express from "express";
import multer from "multer";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";
import { pool } from "../server.js";

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Папка для сохранения изображений
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Добавление объявления
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10), // Принимает до 10 изображений
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        type,
        purpose,
        rent_period,
        city,
        district,
        address,
        area,
        land_area,
        land_unit,
        rooms,
        floor,
        total_floors,
      } = req.body;

      // Логирование входящих данных
      console.log("Полученные данные:", req.body);

      // Проверка обязательных полей
      if (!title || !price || !type || !purpose || !city) {
        return res.status(400).json({
          message: "Обязательные поля: title, price, type, purpose, city",
        });
      }

      // Проверка значения purpose
      if (purpose !== "продажа" && purpose !== "аренда") {
        return res
          .status(400)
          .json({ message: "Некорректное значение purpose" });
      }

      // Устанавливаем rent_period в NULL, если purpose !== 'аренда'
      const adjustedRentPeriod = purpose === "аренда" ? rent_period : null;

      // Проверка area для типа "Земельный участок"
      if (type === "Земельный участок" && area) {
        return res.status(400).json({
          message:
            "Поле area не должно передаваться для типа 'Земельный участок'",
        });
      }

      // Проверка land_area и land_unit для типа "Квартира" или "Коммерческая недвижимость"
      if (
        (type === "Квартира" || type === "Коммерческая недвижимость") &&
        (land_area || land_unit)
      ) {
        return res.status(400).json({
          message:
            "Поля land_area и land_unit не должны передаваться для типа 'Квартира' или 'Коммерческая недвижимость'",
        });
      }

      // Проверка area и land_area для типа "Дом"
      if (type === "Дом" && (!area || !land_area)) {
        return res.status(400).json({
          message: "Для типа 'Дом' должны быть указаны и area, и land_area",
        });
      }

      // Проверка значения price
      if (Number(price) > 9999999999.99) {
        return res
          .status(400)
          .json({ message: "Цена превышает допустимый лимит." });
      }

      // Логирование перед SQL-запросом
      console.log("Подготовка к выполнению SQL-запроса...");

      const newListing = await pool.query(
        `INSERT INTO listings 
        (user_id, title, description, price, type, purpose, rent_period, city, district, address, area, land_area, land_unit, rooms, floor, total_floors) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
        RETURNING *`,
        [
          req.user.userId,
          title,
          description || null,
          price,
          type,
          purpose,
          adjustedRentPeriod, // Используем скорректированное значение rent_period
          city,
          district || null,
          address || null,
          area || null,
          land_area || null,
          land_unit || null,
          rooms || null,
          floor || null,
          total_floors || null,
        ]
      );

      console.log("SQL-запрос выполнен успешно:", newListing.rows[0]);

      const listingId = newListing.rows[0].id;

      // Сохраняем изображения в таблице images
      if (req.files && req.files.length > 0) {
        const imageQueries = req.files.map((file) =>
          pool.query("INSERT INTO images (listing_id, url) VALUES ($1, $2)", [
            listingId,
            `/uploads/${file.filename}`, // Сохраняем путь к изображению
          ])
        );
        await Promise.all(imageQueries);
      }

      res.status(201).json({ message: "Объявление успешно добавлено" });
    } catch (error) {
      console.error("Ошибка при добавлении объявления:", error.message);
      res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
  }
);

// Получение всех объявлений
router.get("/", async (req, res) => {
  try {
    const listings = await pool.query(
      `SELECT l.*, u.full_name, u.phone_number, 
              COALESCE(json_agg(i.url) FILTER (WHERE i.id IS NOT NULL), '[]') AS images
       FROM listings l
       JOIN users u ON l.user_id = u.id
       LEFT JOIN images i ON l.id = i.listing_id
       GROUP BY l.id, u.id`
    );

    res.json(listings.rows);
  } catch (error) {
    console.error("Ошибка при получении объявлений:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение всех объявлений для рекомендаций
router.get("/recommendations", async (req, res) => {
  try {
    const recommendations = await pool.query(
      `SELECT l.*, u.full_name, u.phone_number, 
              COALESCE(json_agg(i.url) FILTER (WHERE i.id IS NOT NULL), '[]') AS images
       FROM listings l
       JOIN users u ON l.user_id = u.id
       LEFT JOIN images i ON l.id = i.listing_id
       GROUP BY l.id, u.id`
    );

    res.json(recommendations.rows);
  } catch (error) {
    console.error("Ошибка при получении рекомендаций:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение объявлений текущего пользователя
router.get("/my-ads", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listings = await pool.query(
      `SELECT l.*, 
              COALESCE(json_agg(i.url) FILTER (WHERE i.id IS NOT NULL), '[]') AS images
       FROM listings l
       LEFT JOIN images i ON l.id = i.listing_id
       WHERE l.user_id = $1
       GROUP BY l.id`,
      [userId]
    );

    res.json(listings.rows);
  } catch (error) {
    console.error("Ошибка при получении объявлений пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение деталей объявления
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Логирование ID
    console.log("Получение объявления с ID:", id);

    // Получаем объявление по ID вместе с данными пользователя и фотографиями
    const ad = await pool.query(
      `SELECT l.*, 
              u.full_name AS user_name, 
              u.phone_number AS user_phone, 
              COALESCE(json_agg(i.url) FILTER (WHERE i.id IS NOT NULL), '[]') AS images
       FROM listings l
       JOIN users u ON l.user_id = u.id
       LEFT JOIN images i ON l.id = i.listing_id
       WHERE l.id = $1
       GROUP BY l.id, u.id`,
      [id]
    );

    // Логирование результата запроса
    console.log("Результат запроса:", ad.rows);

    if (ad.rows.length === 0) {
      console.log("Объявление с ID не найдено:", id);
      return res.status(404).json({ message: "Объявление не найдено" });
    }

    res.json(ad.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении деталей объявления:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление объявления
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const adId = req.params.id;
    const userId = req.user.userId;

    // Проверяет принадлежит ли объявление текущему пользователю
    const ad = await pool.query(
      "SELECT * FROM listings WHERE id = $1 AND user_id = $2",
      [adId, userId]
    );

    if (ad.rows.length === 0) {
      return res.status(404).json({
        message: "Объявление не найдено или вы не являетесь его владельцем",
      });
    }

    // Удаляем объявление
    await pool.query("DELETE FROM listings WHERE id = $1", [adId]);

    // Удаляем связанные изображения
    await pool.query("DELETE FROM images WHERE listing_id = $1", [adId]);

    res.json({ message: "Объявление успешно удалено" });
  } catch (error) {
    console.error("Ошибка при удалении объявления:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


// Надо поидеи тут еще реализовать добавить в избранное и удалить из избранного (объявления) но чет лень  и не успеем

export default router;
