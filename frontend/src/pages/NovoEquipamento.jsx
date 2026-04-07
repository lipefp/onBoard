import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

const CAMPOS = [
  { name: 'nome', label: 'Nome', type: 'text' },
  { name: 'serial_number', label: 'Número de Série', type: 'text' },
  { name: 'quantidade', label: 'Quantidade', type: 'number' },
  { name: 'quantidade_portas', label: 'Qtd. Portas', type: 'number' },
  { name: 'local', label: 'Local', type: 'text' },
  { name: 'potencia_poe', label: 'Potência PoE (W)', type: 'number' },
  { name: 'observacoes', label: 'Observações', type: 'textarea' },
];

const SELECTS = [
  { name: 'categoria', label: 'Categoria', options: ['SWITCH', 'ROUTER', 'AP', 'CONECTIVIDADE'] },
  { name: 'gerenciamento', label: 'Gerenciamento', options: ['L2', 'L3', 'UNMANAGED', 'SMART'] },
  { name: 'velocidade_uplink', label: 'Velocidade Uplink', options: ['1G', '10G', '40G', '100G'] },
  { name: 'estado', label: 'Estado', options: ['ESTOQUE', 'USO'] },
];

const initialForm = {
  nome: '', categoria: 'SWITCH', quantidade: 1, gerenciamento: 'L2',
  velocidade_uplink: '1G', suporta_poe: false, potencia_poe: 0,
  quantidade_portas: 24, serial_number: '', estado: 'ESTOQUE',
  local: 'Sede Piratininga', observacoes: '',
};

const inputClass = "w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

const NovoEquipamento = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdicao) {
      api.get(`equipamentos/${id}/`).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      if (isEdicao) {
        await api.put(`equipamentos/${id}/`, form);
      } else {
        await api.post('equipamentos/', form);
      }
      navigate('/equipamentos');
    } catch (err) {
      setErro('Erro ao salvar equipamento. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEdicao ? 'Editar Equipamento' : 'Novo Equipamento'}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {isEdicao ? 'Atualize os dados do equipamento' : 'Preencha os dados para cadastrar'}
          </p>
        </div>

        {erro && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {erro}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {CAMPOS.map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              {SELECTS.map(({ name, label, options }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <select name={name} value={form[name]} onChange={handleChange} className={inputClass}>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                name="suporta_poe"
                id="suporta_poe"
                checked={form.suporta_poe}
                onChange={handleChange}
                className="w-4 h-4 accent-blue-600"
              />
              <label htmlFor="suporta_poe" className="text-sm font-medium text-slate-700 cursor-pointer">
                Suporta PoE?
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {loading ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/equipamentos')}
                className="flex-1 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NovoEquipamento;
