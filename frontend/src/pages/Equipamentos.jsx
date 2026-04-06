import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Equipamentos em Estoque</h2>
          <button onClick={() => navigate('/equipamentos/novo')} style={{
            backgroundColor: '#0056b3', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            + Novo Equipamento
          </button>
        </div>

        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        {loading && <p style={{ color: '#666' }}>Carregando...</p>}

        {!loading && (
          <div style={{
            background: '#fff', borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0056b3', color: '#fff', textAlign: 'left' }}>
                  {['Nome', 'Categoria', 'S/N', 'Local', 'Estado', 'Ações'].map((h) => (
                    <th key={h} style={{ padding: '14px 16px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {equipamentos.length > 0 ? equipamentos.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '14px 16px' }}>{item.nome}</td>
                    <td style={{ padding: '14px 16px', color: '#555' }}>{item.categoria}</td>
                    <td style={{ padding: '14px 16px', color: '#555' }}>{item.serial_number}</td>
                    <td style={{ padding: '14px 16px', color: '#555' }}>{item.local}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                        background: item.estado === 'ESTOQUE' ? '#e1f7e7' : '#fff3cd',
                        color: item.estado === 'ESTOQUE' ? '#1db954' : '#856404'
                      }}>
                        {item.estado}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => navigate(`/equipamentos/editar/${item.id}`)} style={{
                        marginRight: '8px', padding: '6px 12px', borderRadius: '6px',
                        border: '1px solid #0056b3', color: '#0056b3',
                        background: 'transparent', cursor: 'pointer'
                      }}>
                        Editar
                      </button>
                      <button onClick={() => handleDeletar(item.id)} style={{
                        padding: '6px 12px', borderRadius: '6px',
                        border: '1px solid #dc3545', color: '#dc3545',
                        background: 'transparent', cursor: 'pointer'
                      }}>
                        Remover
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#999' }}>
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