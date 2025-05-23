import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import WarehouseScene from './WarehouseScene';

const Warehouse3DView = ({highlightedProducts = []}) => {
  const { id } = useParams();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/warehouses/${id}/config`)
      .then((response) => setConfig(response.data))
      .catch((error) => console.error("Ошибка:", error));
  }, [id]);

  return (
    <div className="warehouse-view">
      {config ? <WarehouseScene config={config} highlightedProducts={highlightedProducts}/> : <div>Склад не найден</div>}
    </div>
  );
};

export default Warehouse3DView;
