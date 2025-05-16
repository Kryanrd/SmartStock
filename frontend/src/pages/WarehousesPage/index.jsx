import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    // Запрос к API бэкенда
    axios.get('http://localhost:3001/api/warehouses')
      .then((response) => setWarehouses(response.data))
      .catch((error) => console.error("Ошибка:", error));
  }, []);

  return (
    <div className="page-container">
      <h1 className="header">Управление складами</h1>

      <table className="warehouse-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Адрес</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map(warehouse => (
            <tr key={warehouse.id}>
              <td>{warehouse.id}</td>
              <td>{warehouse.name}</td>
              <td>{warehouse.address}</td>
              <td>{warehouse.description}</td>
              <td>
                <Link
                  to={`/warehouse/${warehouse.id}/view`}
                  className="action-button search-button"
                >
                  Поиск
                </Link>
                <Link className="action-button analyze-button">
                  Анализ
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehousesPage;
