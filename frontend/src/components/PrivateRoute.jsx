import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

// Protege rotas privadas: redireciona para /login se não houver token ativo
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;