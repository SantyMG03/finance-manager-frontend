import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto que carga el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta del panel de control */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Si el usuario escribe una ruta que no existe, lo mandamos al Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
