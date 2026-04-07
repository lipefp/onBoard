import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ShieldCheck } from 'lucide-react';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      await api.post('auth/register/', form);
      navigate('/login');
    } catch (err) {
      setErro('Erro ao cadastrar. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const campos = [
    { name: 'username', label: 'Usuário', type: 'text' },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'password', label: 'Senha', type: 'password' },
  ];

  return (
    <div className="min-h-screen flex">

      {/* Painel esquerdo */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Package size={22} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Inventário de Rede</span>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8">
          <ShieldCheck size={32} className="text-blue-400 mb-4" />
          <h2 className="text-white text-2xl font-semibold mb-2">
            Crie sua conta
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Após o cadastro você terá acesso completo ao sistema de inventário.
          </p>
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

          <h1 className="text-2xl font-bold text-slate-800 mb-1">Criar conta</h1>
          <p className="text-sm text-slate-500 mb-8">Preencha os dados para se cadastrar</p>

          {erro && (
            <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {campos.map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
