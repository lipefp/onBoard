import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Equipamentos from './pages/Equipamentos';
import NovoEquipamento from './pages/NovoEquipamento';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipamentos" element={
          <PrivateRoute>
            <Equipamentos />
          </PrivateRoute>
        } />
        <Route path="/equipamentos/novo" element={
          <PrivateRoute>
            <NovoEquipamento />
          </PrivateRoute>
        } />
        <Route path="/equipamentos/editar/:id" element={
          <PrivateRoute>
            <NovoEquipamento />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;