import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Warehouse3DScene from '../../components/Warehouse3DScene';
import './style.css';
import { FiSearch, FiMic, FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const ViewContainer = styled.div`
    padding: 2rem;
    padding-top: 6rem;
    height: calc(100vh - 120px); 
  `;

const ModelContainer = styled.div`
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 70vh;
    min-height: 500px;
  `;

const SearchContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  `;

const SearchInput = styled.input`
    flex: 1;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 15px;
    font-size: 1rem;
    outline: none;
    &:focus {
      border-color: #94E2FF;
    }
  `;

const IconButton = styled.button`
    background: #94E2FF;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #7fd1f0;
    }
  `;

const WareHouseName = styled.h1`
  text-align: center;
  margin-top: 0;
`

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 400px;
`;
const FormField = styled.div`
  margin-bottom: 1rem;
  label { display:block; margin-bottom: 0.5rem; font-weight:600; }
  input, textarea, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:first-child { background: #eee; }
    &:last-child  { background: #94E2FF; color: white;}
  }
`;

const WarehouseViewPage = () => {
  const { state } = useLocation();
  const warehouseName = state?.warehouseName || '— без имени —';
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const [highlightedProducts, setHighlightedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [racks, setRacks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [productsList, setProductsList] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/products/search`, {
        params: { query: searchQuery, warehouseId: id }
      });
      const productIds = response.data.map(p => Number(p.id));
      setHighlightedProducts(productIds);
    } catch (error) {
      console.error("Ошибка поиска:", error);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/warehouses/${id}/racks`)
      .then(({ data }) => setRacks(data))
      .catch(console.error);
    axios.get(`http://localhost:3001/api/warehouses/${id}/products`)
      .then(({ data }) => setProductsList(data))
      .catch(console.error);
  }, [id, refreshKey]);


  // Добавление товара
  const handleAddProduct = async () => {
    if (!newName || !selectedShelf) {
      return alert("Заполните название и выберите полку");
    }
    try {
      await axios.post('http://localhost:3001/api/products', {
        name: newName,
        description: newDesc,
        shelf_id: selectedShelf,
        warehouse_id: id,
      });
      // сброс формы
      setNewName('');
      setNewDesc('');
      setSelectedShelf('');
      setShowAddModal(false);
      // обновляем сцену и данные
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении");
    }
  };

  // Собираем список занятых полок
  const occupied = new Set(productsList.map(p => p.shelf_id));
  // Генерируем список свободных <option>
  const shelfOptions = racks.flatMap(rack =>
    rack.shelves
      .filter(shelf => !occupied.has(shelf.id))
      .map(shelf => (
        <option key={shelf.id} value={shelf.id}>
          Р{rack.row_index}–К{rack.col_index}, полка {shelf.level}
        </option>
      ))
  );
  // Временные данные
  const mockWarehouses = {
    1: {
      id: 1,
      width: 10,
      height: 5,
      depth: 8,
      shelf_count: 5,
      rows: 3,
      columns: 2,
      spacing: 1.5
    },
    2: {
      id: 2,
      width: 15,
      height: 6,
      depth: 10,
      shelf_count: 6,
      rows: 4,
      columns: 3,
      spacing: 2
    }
  };

  return (

    <ViewContainer>
      {/* Поисковая строка */}
      <WareHouseName>{warehouseName}</WareHouseName>
      <SearchContainer>
        <SearchInput
          placeholder="Поиск по товарам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <IconButton onClick={handleSearch}>
          <FiSearch size={20} />
        </IconButton>

        <IconButton>
          <FiMic size={20} />
        </IconButton>

        <IconButton onClick={() => setShowAddModal(true)}>
          <FiPlus size={20} />
        </IconButton>
      </SearchContainer>

      <ModelContainer>
        <Warehouse3DScene
          config={{ ...mockWarehouses[id], id }}
          highlightedProducts={highlightedProducts}
        />
      </ModelContainer>
      {showAddModal && (
        <Overlay>
          <Modal>
            <h2>Добавить товар</h2>
            <FormField>
              <label>Название</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Описание</label>
              <textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </FormField>
            <FormField>
              <label>Полка</label>
              <select
                value={selectedShelf}
                onChange={e => setSelectedShelf(e.target.value)}
              >
                <option value="">— выберите полку —</option>
                {shelfOptions}
              </select>
            </FormField>
            <Actions>
              <button onClick={() => setShowAddModal(false)}>Отмена</button>
              <button onClick={handleAddProduct}
                disabled={!newName.trim() || !selectedShelf}
              >
                Добавить
              </button>
            </Actions>
          </Modal>
        </Overlay>
      )}
    </ViewContainer>
  );
};

export default WarehouseViewPage;
