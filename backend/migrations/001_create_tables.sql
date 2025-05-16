-- Создание таблицы складов
CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  description TEXT
);

-- Создание таблицы конфигураций
CREATE TABLE warehouse_configs (
  id SERIAL PRIMARY KEY,
  warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
  width FLOAT NOT NULL,
  height FLOAT NOT NULL,
  depth FLOAT NOT NULL,
  shelf_count INTEGER NOT NULL,
  rows INTEGER NOT NULL,
  columns INTEGER NOT NULL,
  spacing FLOAT NOT NULL
);