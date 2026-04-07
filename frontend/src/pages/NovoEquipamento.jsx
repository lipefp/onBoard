import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/NavBar';

const initialForm = {
  nome: '', categoria: 'SWITCH', quantidade: 1, gerenciamento: 'L2',
  velocidade_uplink: '1G', suporta_poe: false, potencia_poe: 0,
  quantidade_portas: 24, serial_number: '', estado: 'ESTOQUE',
  local: 'Sede Piratininga', observacoes: '',
};

const inputClass = "w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

const Secao = ({ titulo, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{titulo}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Campo = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
    {children}
  </div>
);

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

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Informações Básicas */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Secao titulo="Informações Básicas">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Campo label="Nome">
                    <input name="nome" type="text" value={form.nome} onChange={handleChange} required className={inputClass} />
                  </Campo>
                </div>
                <Campo label="Número de Série">
                  <input name="serial_number" type="text" value={form.serial_number} onChange={handleChange} required className={inputClass} />
                </Campo>
                <Campo label="Local">
                  <input name="local" type="text" value={form.local} onChange={handleChange} className={inputClass} />
                </Campo>
                <Campo label="Quantidade">
                  <input name="quantidade" type="number" value={form.quantidade} onChange={handleChange} className={inputClass} />
                </Campo>
                <Campo label="Estado">
                  <select name="estado" value={form.estado} onChange={handleChange} className={inputClass}>
                    {['ESTOQUE', 'USO'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Campo>
              </div>
            </Secao>
          </div>

          {/* Especificações Técnicas */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Secao titulo="Especificações Técnicas">
              <div className="grid grid-cols-2 gap-4">
                <Campo label="Categoria">
                  <select name="categoria" value={form.categoria} onChange={handleChange} className={inputClass}>
                    {['SWITCH', 'ROUTER', 'AP', 'CONECTIVIDADE'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Campo>
                <Campo label="Gerenciamento">
                  <select name="gerenciamento" value={form.gerenciamento} onChange={handleChange} className={inputClass}>
                    {['L2', 'L3', 'UNMANAGED', 'SMART'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Campo>
                <Campo label="Velocidade Uplink">
                  <select name="velocidade_uplink" value={form.velocidade_uplink} onChange={handleChange} className={inputClass}>
                    {['1G', '10G', '40G', '100G'].map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Campo>
                <Campo label="Qtd. Portas">
                  <input name="quantidade_portas" type="number" value={form.quantidade_portas} onChange={handleChange} className={inputClass} />
                </Campo>
              </div>
            </Secao>
          </div>

          {/* PoE */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Secao titulo="PoE">
              <div className="flex items-center gap-2.5 mb-4">
                <input
                  type="checkbox" name="suporta_poe" id="suporta_poe"
                  checked={form.suporta_poe} onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="suporta_poe" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Suporta PoE?
                </label>
              </div>
              {form.suporta_poe && (
                <Campo label="Potência PoE (W)">
                  <input name="potencia_poe" type="number" value={form.potencia_poe} onChange={handleChange} className={inputClass} />
                </Campo>
              )}
            </Secao>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <Secao titulo="Observações">
              <textarea
                name="observacoes" value={form.observacoes} onChange={handleChange}
                rows={3} placeholder="Notas sobre VLANs, firmware, localização física..."
                className={`${inputClass} resize-none`}
              />
            </Secao>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {loading ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button
              type="button" onClick={() => navigate('/equipamentos')}
              className="flex-1 py-2.5 border border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NovoEquipamento;
