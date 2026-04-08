import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { saveAuthData } from '../utils/auth';
import Switch3D from '../components/Switch3D';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const res = await api.post('auth/login/', form);
      saveAuthData(res.data.access, res.data.refresh, res.data.username, res.data.is_staff);
      navigate('/equipamentos');
    } catch (err) {
      if (err.response?.status === 429) {
        setErro('Muitas tentativas. Aguarde 5 minutos e tente novamente.');
      } else {
        setErro('Usuário ou senha inválidos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Painel esquerdo */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12 min-h-screen">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package size={22} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Inventário de Rede</span>
        </div>

        <div>
          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            <Switch3D />
            <div className="text-center">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Controle total do seu inventário
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Gerencie switches, roteadores, access points e transceivers em um único lugar.
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2026 Inventário de Rede</p>
      </div>

      {/* Painel direito */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package size={18} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800">Inventário de Rede</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Bem-vindo</h1>
          <p className="text-sm text-slate-500 mb-8">Entre com suas credenciais para continuar</p>

          {erro && (
            <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Usuário</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Não tem conta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
