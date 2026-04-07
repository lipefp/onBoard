import { useNavigate } from 'react-router-dom';
import { LogOut, Package } from 'lucide-react';
import api from '../api';
import { getUsername, getRefreshToken, clearAuthData } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const username = getUsername();

  const handleLogout = async () => {
    try {
      const refresh = getRefreshToken();
      await api.post('auth/logout/', { refresh });
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    } finally {
      // Sempre limpa os dados locais, mesmo se o backend falhar
      clearAuthData();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <Package size={20} className="text-blue-400" />
        <span className="font-semibold text-base tracking-wide">Inventário de Rede</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">Olá, <span className="text-white font-medium">{username}</span></span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm border border-slate-500 hover:border-slate-300 hover:text-slate-100 text-slate-300 px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
