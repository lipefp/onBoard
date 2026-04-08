import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, X, Wifi, MapPin, Tag, Hash,
  Layers, Zap, Package, BoxIcon, Activity, Search,
  CheckCircle, AlertTriangle, Filter
} from 'lucide-react';
import api from '../api';
import Navbar from '../components/NavBar';
import { isStaff } from '../utils/auth';

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const isErro = toast.tipo === 'erro';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all
      ${isErro ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
      {isErro ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
      {toast.msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
};

// ── Modal de confirmação de exclusão ──────────────────────────────────────
const ModalConfirmar = ({ item, onConfirmar, onCancelar }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onCancelar}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-50 p-2 rounded-lg">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">Remover equipamento</h3>
        </div>
        <p className="text-sm text-slate-500 mb-5">
          Tem certeza que deseja remover <span className="font-medium text-slate-700">{item.nome}</span>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirmar}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Remover
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 py-2 border border-slate-300 hover:border-slate-400 text-slate-600 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal de detalhe ──────────────────────────────────────────────────────
const ModalDetalhe = ({ item, onClose }) => {
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
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

// ── Página principal ──────────────────────────────────────────────────────
const Equipamentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [paraRemover, setParaRemover] = useState(null);
  const [toast, setToast] = useState(null);

  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const showToast = (msg, tipo = 'sucesso') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  const carregarEquipamentos = useCallback(async () => {
    try {
      const params = {};
      if (busca) params.search = busca;
      if (filtroCategoria) params.categoria = filtroCategoria;
      if (filtroEstado) params.estado = filtroEstado;
      const res = await api.get('equipamentos/', { params });
      setEquipamentos(res.data);
    } catch {
      setErro('Erro ao carregar equipamentos.');
    } finally {
      setLoading(false);
    }
  }, [busca, filtroCategoria, filtroEstado]);

  useEffect(() => {
    if (location.state?.toast) {
      showToast(location.state.toast);
      window.history.replaceState({}, '');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => carregarEquipamentos(), 300);
    return () => clearTimeout(timer);
  }, [carregarEquipamentos]);

  const handleDeletar = async () => {
    if (!paraRemover) return;
    try {
      await api.delete(`equipamentos/${paraRemover.id}/`);
      setEquipamentos(equipamentos.filter((e) => e.id !== paraRemover.id));
      showToast(`"${paraRemover.nome}" removido com sucesso.`);
    } catch {
      showToast('Erro ao remover equipamento.', 'erro');
    } finally {
      setParaRemover(null);
    }
  };

  const total = equipamentos.length;
  const emEstoque = equipamentos.filter((e) => e.estado === 'ESTOQUE').length;
  const emUso = equipamentos.filter((e) => e.estado === 'USO').length;

  const cards = [
    { label: 'Total', value: total, icone: Package, cor: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Em Estoque', value: emEstoque, icone: BoxIcon, cor: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Em Uso', value: emUso, icone: Activity, cor: 'text-amber-700', bg: 'bg-amber-50' },
  ];

  const selectClass = "text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700";

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <Toast toast={toast} onClose={() => setToast(null)} />
      <ModalDetalhe item={selecionado} onClose={() => setSelecionado(null)} />
      <ModalConfirmar
        item={paraRemover}
        onConfirmar={handleDeletar}
        onCancelar={() => setParaRemover(null)}
      />

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

        {/* Busca e filtros */}
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 mb-4 flex flex-wrap items-center gap-3">
          <Filter size={15} className="text-slate-400" />
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, serial ou local..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className={selectClass}>
            <option value="">Todas categorias</option>
            {['SWITCH', 'ROUTER', 'AP', 'CONECTIVIDADE'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className={selectClass}>
            <option value="">Todos estados</option>
            <option value="ESTOQUE">ESTOQUE</option>
            <option value="USO">USO</option>
          </select>
          {(busca || filtroCategoria || filtroEstado) && (
            <button
              onClick={() => { setBusca(''); setFiltroCategoria(''); setFiltroEstado(''); }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
            >
              <X size={12} /> Limpar
            </button>
          )}
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
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{item.serial_number || '—'}</td>
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
                          {isStaff() && (
                            <button
                              onClick={() => setParaRemover(item)}
                              className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-300 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                              Remover
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Package size={36} className="opacity-30" />
                        <p className="text-sm font-medium">
                          {busca || filtroCategoria || filtroEstado
                            ? 'Nenhum equipamento encontrado para os filtros aplicados.'
                            : 'Nenhum equipamento cadastrado ainda.'}
                        </p>
                        {!busca && !filtroCategoria && !filtroEstado && (
                          <button
                            onClick={() => navigate('/equipamentos/novo')}
                            className="mt-1 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                          >
                            <Plus size={13} />
                            Cadastrar primeiro equipamento
                          </button>
                        )}
                      </div>
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
