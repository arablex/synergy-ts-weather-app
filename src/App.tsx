import { Navigate, Route, Routes } from 'react-router-dom';
import { ForecastPage } from './pages/ForecastPage';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weather/:city" element={<ForecastPage />} />
      {/* Любой неизвестный адрес — на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
