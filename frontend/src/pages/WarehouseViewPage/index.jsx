  import { useParams } from 'react-router-dom';
  import axios from 'axios';
  import Warehouse3DScene from '../../components/Warehouse3DScene';
  import './style.css';
  import { FiSearch, FiMic } from 'react-icons/fi';
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

  const WarehouseViewPage = () => {
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedProducts, setHighlightedProducts] = useState([]);
    const handleSearch = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/search`, {
          params: { query: searchQuery, warehouseId: id }
        });
        console.log("Ответ API:", response.data); // Логируем ответ
        const productIds = response.data.map(p => Number(p.id));
        console.log("Извлеченные ID:", productIds); // Логируем ID
        setHighlightedProducts(productIds);
      } catch (error) {
        console.error("Ошибка поиска:", error);
      }
    };

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
        </SearchContainer>


        <ModelContainer>
          <Warehouse3DScene
            config={{ ...mockWarehouses[id], id }}
            highlightedProducts={highlightedProducts}
          />
        </ModelContainer>
      </ViewContainer>
    );
  };

  export default WarehouseViewPage;