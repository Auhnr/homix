import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверка на наличие токена
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "секретный_ключ"
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Ошибка проверки токена:", error);
    return res.status(401).json({ message: "Неверный токен" });
  }
};

export default authMiddleware;
