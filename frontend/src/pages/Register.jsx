import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-800 p-3 rounded-xl mb-3">
            <Package size={28} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-800">Criar conta</h1>
          <p className="text-sm text-slate-500 mt-1">Preencha os dados para se cadastrar</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {erro && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
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
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
