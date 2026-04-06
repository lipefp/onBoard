import { useNavigate } from 'react-router-dom';
import api from '../api';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      await api.post('auth/logout/', { refresh });
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  return (
    <nav style={{
      backgroundColor: '#0056b3',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#fff'
    }}>
      <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
        📦 Inventário Leste
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px' }}>Olá, {username}</span>
        <button onClick={handleLogout} style={{
          background: 'transparent',
          border: '1px solid #fff',
          color: '#fff',
          padding: '6px 14px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;