import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Wifi, MapPin, Tag, Hash, Layers, Zap, Package, BoxIcon, Activity } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';

const Modal = ({ item, onClose }) => {
  if (!item) return null;

  const Campo = ({ icone: Icone, label, valor }) => (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400"><Icone size={15} /></div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 font-medium">{valor || '—'}</p>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-800">{item.nome}</h3>
            <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.estado === 'ESTOQUE'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {item.estado}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-5">
          <Campo icone={Tag} label="Categoria" valor={item.categoria} />
          <Campo icone={Hash} label="Nº de Série" valor={item.serial_number} />
          <Campo icone={MapPin} label="Local" valor={item.local} />
          <Campo icone={Layers} label="Gerenciamento" valor={item.gerenciamento} />
          <Campo icone={Wifi} label="Velocidade Uplink" valor={item.velocidade_uplink} />
          <Campo icone={Zap} label="PoE" valor={item.suporta_poe ? `Sim — ${item.potencia_poe}W` : 'Não'} />
          <Campo icone={Hash} label="Portas" valor={item.quantidade_portas} />
          <Campo icone={Hash} label="Quantidade" valor={item.quantidade} />
        </div>

        {item.observacoes && (
          <div className="px-6 pb-4">
            <p className="text-xs text-slate-400 mb-1">Observações</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{item.observacoes}</p>
          </div>
        )}

        <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Cadastrado por <span className="font-medium text-slate-500">{item.cadastrado_por || '—'}</span></span>
          <span>{new Date(item.data_cadastro).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
};

const Equipamentos = () => {
  const navigate = useNavigate();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selecionado, setSelecionado] = useState(null);

  const carregarEquipamentos = async () => {
    try {
      const res = await api.get('equipamentos/');
      setEquipamentos(res.data);
    } catch (err) {
      setErro('Erro ao carregar equipamentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este equipamento?')) return;
    try {
      await api.delete(`equipamentos/${id}/`);
      setEquipamentos(equipamentos.filter((e) => e.id !== id));
    } catch {
      alert('Erro ao deletar equipamento.');
    }
  };

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  const total = equipamentos.length;
  const emEstoque = equipamentos.filter((e) => e.estado === 'ESTOQUE').length;
  const emUso = equipamentos.filter((e) => e.estado === 'USO').length;

  const cards = [
    { label: 'Total', value: total, icone: Package, cor: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Em Estoque', value: emEstoque, icone: BoxIcon, cor: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Em Uso', value: emUso, icone: Activity, cor: 'text-amber-700', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <Modal item={selecionado} onClose={() => setSelecionado(null)} />

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Equipamentos</h2>
            <p className="text-sm text-slate-500 mt-0.5">Gerencie o inventário de rede</p>
          </div>
          <button
            onClick={() => navigate('/equipamentos/novo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Novo Equipamento
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {cards.map(({ label, value, icone: Icone, cor, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4">
              <div className={`${bg} p-2.5 rounded-lg`}>
                <Icone size={18} className={cor} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {erro && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {erro}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">Carregando...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-200 text-left">
                  {['Nome', 'Categoria', 'Nº de Série', 'Local', 'Estado', 'Ações'].map((h) => (
                    <th key={h} className="px-5 py-3.5 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipamentos.length > 0 ? (
                  equipamentos.map((item, i) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelecionado(item)}
                      className={`border-t border-slate-100 hover:bg-blue-50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-800">{item.nome}</td>
                      <td className="px-5 py-3.5 text-slate-500">{item.categoria}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{item.serial_number}</td>
                      <td className="px-5 py-3.5 text-slate-500">{item.local}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.estado === 'ESTOQUE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/equipamentos/editar/${item.id}`)}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Pencil size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletar(item.id)}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                            Remover
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center text-slate-400">
                      Nenhum equipamento cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipamentos;
