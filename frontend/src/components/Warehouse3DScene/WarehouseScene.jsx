import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, SoftShadows } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from 'react';
import axios from 'axios';

const WarehouseScene = ({ config, highlightedProducts = [] }) => {
  console.log("highlightedProducts в WarehouseScene:", highlightedProducts);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!config?.id) return;
    // Загрузка товаров для текущего склада
    axios.get(`http://localhost:3001/api/warehouses/${config.id}/products`)
      .then((response) => setProducts(response.data))
      .catch(console.error);
  }, [config.id]);

  // if (!config) return null;
  // Параметры из конфига
  const {
    width = 8,
    height = 4,
    depth = 1,
    shelfCount = 5,
    rows = 3,
    columns = 2,
    spacing = 3
  } = config;

  const ProductBox = ({ product, highlighted }) => (
    console.log(
      "ID:", product.id,
      "Тип ID:", typeof product.id,
      "Подсветка:", highlighted,
      "Тип подсветки:", typeof highlighted
    ),
    <Box
      args={[product.width, product.height, product.depth]}
      position={[product.position_x, product.position_y, product.position_z]}
    >
      <meshStandardMaterial
        color={highlighted ? "#ff0000" : product.color}
        metalness={0.3}
        roughness={0.5}
      />
    </Box>
  );

  // Создание одной полки
  const Shelf = ({ position }) => (
    <Box args={[width, 0.2, depth]} position={position} castShadow receiveShadow>
      <meshStandardMaterial color="#dcdcdc" metalness={0.3} roughness={0.5} />
    </Box>
  );

  // Создание одного стеллажа
  const Rack = ({ position }) => {
    const shelves = [];
    const shelfHeight = height / shelfCount;

    for (let i = 0; i < shelfCount; i++) {
      shelves.push(
        <Shelf
          key={`shelf-${i}`}
          position={[0, i * shelfHeight + shelfHeight / 2, 0]}
        />
      );
    }

    return (
      <group position={position}>
        {shelves}
        {/* Боковые стенки */}
        <Box args={[0.2, height, depth]}
          position={[width / 2, height / 2, 0]}>
          <meshStandardMaterial color="#a0a0a0" />
        </Box>
        <Box args={[0.2, height, depth]}
          position={[-width / 2, height / 2, 0]}>
          <meshStandardMaterial color="#a0a0a0" />
        </Box>
      </group>
    );
  };

  // Генерация всех стеллажей
  const generateRacks = () => {
    const racks = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const xPos = (col - (columns - 1) / 2) * (width + 2);
        const zPos = row * (depth + spacing);

        racks.push(
          <Rack
            key={`rack-${row}-${col}`}
            position={[xPos, 0, zPos]}
          />
        );
      }
    }

    return racks;
  };


  return (
    <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 15, -10]} intensity={0.8} color="#94e2ff" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
      />
      {/* <CameraController /> */}
      <SoftShadows />
      {/* Пол */}
      <Box args={[50, 0.1, 50]} position={[0, -0.05, 10]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>


      {generateRacks()}
      {products.map((product) => (
        <ProductBox
          key={product.id}
          product={product}
          highlighted={highlightedProducts.includes(product.id)} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
};

export default WarehouseScene;