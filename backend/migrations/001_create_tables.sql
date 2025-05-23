-- -- Создание таблицы складов
-- CREATE TABLE warehouses (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   address TEXT NOT NULL,
--   description TEXT
-- );

-- -- Создание таблицы конфигураций
-- CREATE TABLE warehouse_configs (
--   id SERIAL PRIMARY KEY,
--   warehouse_id INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
--   width FLOAT NOT NULL,
--   height FLOAT NOT NULL,
--   depth FLOAT NOT NULL,
--   shelf_count INTEGER NOT NULL,
--   rows INTEGER NOT NULL,
--   columns INTEGER NOT NULL,
--   spacing FLOAT NOT NULL
-- );

-- BEGIN;

-- -- Создаём стеллажи
-- CREATE TABLE racks (
--   id           SERIAL PRIMARY KEY,
--   warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
--   row_index    INTEGER NOT NULL,
--   col_index    INTEGER NOT NULL,
--   width        REAL NOT NULL,
--   height       REAL NOT NULL,
--   depth        REAL NOT NULL,
--   pos_x        REAL NOT NULL,
--   pos_y        REAL NOT NULL,
--   pos_z        REAL NOT NULL
-- );

-- -- Создаём полки
-- CREATE TABLE shelves (
--   id        SERIAL PRIMARY KEY,
--   rack_id   INTEGER NOT NULL REFERENCES racks(id) ON DELETE CASCADE,
--   level     INTEGER NOT NULL,
--   pos_y     REAL NOT NULL
-- );

-- -- Меняем продукты
-- ALTER TABLE products
--   DROP COLUMN position_x,
--   DROP COLUMN position_y,
--   DROP COLUMN position_z,
--   ADD COLUMN shelf_id   INTEGER REFERENCES shelves(id) ON DELETE SET NULL,
--   ADD COLUMN offset_x   REAL DEFAULT 0,
--   ADD COLUMN offset_z   REAL DEFAULT 0;

-- COMMIT;