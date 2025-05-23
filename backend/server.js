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
  const sql = `
    SELECT p.id, p.name, p.width, p.height, p.depth, p.color,
           p.offset_x, p.offset_y, p.offset_z,
           s.pos_y AS shelf_y,
           r.pos_x AS rack_x, r.pos_y AS rack_y, r.pos_z AS rack_z
    FROM products p
    LEFT JOIN shelves s ON p.shelf_id = s.id
    LEFT JOIN racks    r ON s.rack_id = r.id
    WHERE p.warehouse_id = $1`;
  try {
    const { rows } = await pool.query(sql, [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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


// GET /api/warehouses/:id/racks
app.get("/api/warehouses/:id/racks", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT r.*, s.id AS shelf_id, s.level, s.pos_y
       FROM racks r
       LEFT JOIN shelves s ON s.rack_id = r.id
       WHERE r.warehouse_id = $1
       ORDER BY r.row_index, r.col_index, s.level`,
      [id]
    );
    // Собрать дерево { rack: { ... , shelves: [ ... ] } }
    const racksMap = {};
    rows.forEach(r => {
      if (!racksMap[r.id]) {
        racksMap[r.id] = {
          id: r.id, pos: [r.pos_x, 0, r.pos_z],
          width: r.width, height: r.height, depth: r.depth,
          shelves: [], row_index: r.row_index, col_index: r.col_index,
        };
      }
      racksMap[r.id].shelves.push({
        id: r.shelf_id,
        level: r.level,
        pos_y: r.pos_y
      });
    });
    res.json(Object.values(racksMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// API: Добавить новый товар
app.post("/api/products", async (req, res) => {
  const { name, description, shelf_id, warehouse_id } = req.body;
  // Стандартные размеры и цвет
  const width  = 1.0;
  const height = 0.5;
  const depth  = 0.5;
  const color  = '#4CAF50';

  try {
    const { rows } = await pool.query(
      `INSERT INTO products
         (warehouse_id, name, description,
          width, height, depth, color,
          shelf_id, offset_x, offset_y, offset_z)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0, 0)
       RETURNING *`,
      [warehouse_id, name, description, width, height, depth, color, shelf_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Ошибка в /api/products:", err);
    res.status(500).json({ error: "Ошибка сервера при добавлении товара" });
  }
});

// Запуск сервера
app.listen(3001, () => console.log("Сервер запущен на порту 3001"));
