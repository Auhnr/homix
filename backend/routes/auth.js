import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../server.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Регистрация пользователя
router.post("/register", async (req, res) => {
  try {
    const { full_name, email, password, phone_number } = req.body;

    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Все обязательные поля должны быть заполнены" });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
      [full_name, email, hashedPassword, phone_number || null]
    );

    res
      .status(201)
      .json({ message: "Регистрация успешна", user: newUser.rows[0] });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход пользователя
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Пожалуйста, заполните все поля" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      console.log("Пользователь с таким email не найден:", email);
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      console.log("Пароль не совпадает для пользователя:", email);
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET || "секретный_ключ",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Вход выполнен",
      token,
      user: {
        id: user.rows[0].id,
        full_name: user.rows[0].full_name,
        email: user.rows[0].email,
        phone_number: user.rows[0].phone_number,
      },
    });
  } catch (error) {
    console.error("Ошибка на сервере:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получить данные текущего пользователя
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, full_name, email, phone_number FROM users WHERE id = $1",
      [req.user.userId]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление данных текущего пользователя
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { full_name, email, phone_number } = req.body;

    if (!full_name || !email) {
      return res
        .status(400)
        .json({ message: "Полное имя и email обязательны" });
    }

    const updatedUser = await pool.query(
      "UPDATE users SET full_name = $1, email = $2, phone_number = $3 WHERE id = $4 RETURNING id, full_name, email, phone_number",
      [full_name, email, phone_number || null, req.user.userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);

    if (error.code === "23505") {
      return res.status(400).json({ message: "Email уже используется" });
    }

    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление профиля
router.delete("/me", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, full_name, email",
      [req.user.userId]
    );

    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ message: "Профиль успешно удален", user: deletedUser.rows[0] });
  } catch (error) {
    console.error("Ошибка при удалении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
