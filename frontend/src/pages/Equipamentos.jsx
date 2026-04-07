import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api';
import Navbar from '../components/Navbar';

const Equipamentos = () => {
  const navigate = useNavigate();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
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
                      className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}
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
                      <td className="px-5 py-3.5">
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
