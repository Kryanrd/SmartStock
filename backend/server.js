const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "warehouse_db",
  password: "1234",
  port: 5432,
});

app.use(cors());
app.use(express.json());

// API: Получить список складов
app.get("/api/warehouses", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM warehouses");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// API: Получить конфигурацию склада по ID
app.get("/api/warehouses/:id/config", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM warehouse_configs WHERE warehouse_id = $1",
      [id]
    );
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// API: Получить товары по ID склада
app.get("/api/warehouses/:id/products", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE warehouse_id = $1",
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Ошибка SQL:", error); // Добавьте логирование
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// API: Поиск товаров по названию
app.get("/api/products/search", async (req, res) => {
  const { query, warehouseId } = req.query;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE warehouse_id = $1 AND name ILIKE $2",
      [warehouseId, `%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Запуск сервера
app.listen(3001, () => console.log("Сервер запущен на порту 3001"));