import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Box,
  SoftShadows,
  MeshReflectorMaterial,
  useTexture
} from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, RepeatWrapping } from 'three';
import axios from 'axios';

const WarehouseScene = ({ config, highlightedProducts = [] }) => {
  const [racks, setRacks] = useState([]);
  const [products, setProducts] = useState([]);
  const floorTexture = useLoader(
    TextureLoader,
    '/textures/Concrete013_2K-JPG_Color.jpg'
  );

  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  // // Загрузка стеллажей + полок
  // useEffect(() => {
  //   if (!config?.id) return;
  //   axios.get(`http://localhost:3001/api/warehouses/${config.id}/racks`)
  //     .then(({ data }) => setRacks(data))
  //     .catch(console.error);
  // }, [config.id]);

  // // Загрузка товаров
  // useEffect(() => {
  //   if (!config?.id) return;
  //   axios.get(`http://localhost:3001/api/warehouses/${config.id}/products`)
  //     .then(({ data }) => setProducts(data))
  //     .catch(console.error);
  // }, [config.id]);

  useEffect(() => {
    if (!config?.id) return;
    axios.get(`http://localhost:3001/api/warehouses/${config.id}/racks`)
      .then(({ data }) => setRacks(data))
      .catch(console.error);
    axios.get(`http://localhost:3001/api/warehouses/${config.id}/products`)
      .then(({ data }) => setProducts(data))
      .catch(console.error);
  }, [config.id]);

  // Рендерим один стеллаж с его полками
  const Rack = ({ rack }) => (
    <group position={rack.pos}>
      {rack.shelves.map(shelf => (
        <Box
          key={shelf.id}
          args={[rack.width, 0.2, rack.depth]}
          position={[0, shelf.pos_y, 0]}
          castShadow receiveShadow
        >
          <meshPhysicalMaterial
            roughness={0.6}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            color="#ddd"
          />
        </Box>
      ))}
      {/* Боковые стенки */}
      <Box args={[0.2, rack.height, rack.depth]} position={[rack.width / 2, rack.height / 2, 0]} castShadow>
        <meshPhysicalMaterial
          roughness={0.4}
          metalness={0.8}
          color="#888"
        />
      </Box>
      <Box args={[0.2, rack.height, rack.depth]} position={[-rack.width / 2, rack.height / 2, 0]} castShadow>
        <meshPhysicalMaterial
          roughness={0.4}
          metalness={0.8}
          color="#888"
        />
      </Box>
    </group>
  );

  // Рендерим одну коробку-товар
  const ProductBox = ({ p }) => {
    // рассчитываем глобальные координаты
    const x = p.rack_x + p.offset_x;
    const y = p.shelf_y + (p.offset_y || 0) + p.height / 2;
    const z = p.rack_z + p.offset_z;
    const isHighlighted = highlightedProducts.includes(p.id);

    return (
      <Box key={p.id} args={[p.width, p.height, p.depth]} position={[x, y, z]} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={isHighlighted ? '#ff4d4d' : p.color}
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </Box>
    );
  };

  return (
    <Canvas shadows camera={{ position: [15, 15, 15], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[-10, 15, -10]} intensity={0.8} color="#94e2ff" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
      />
      <SoftShadows />


      {/* Пол */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 10]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Стеллажи */}
      {racks.map(rack => <Rack key={rack.id} rack={rack} />)}

      {/* Товары */}
      {products.map(p => <ProductBox key={p.id} p={p} />)}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
};

export default WarehouseScene;
