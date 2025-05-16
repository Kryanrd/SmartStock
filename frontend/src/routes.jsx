import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const WarehousesPage = lazy(() => import('./pages/WarehousesPage'));
const WarehouseViewPage = lazy(() => import('./pages/WarehouseViewPage'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/warehouses" element={<WarehousesPage />} />
      <Route path="/warehouse/:id/view" element={<WarehouseViewPage />} />
      <Route path="/" element={<WarehousesPage />} /> 
    </Routes>
  );
}