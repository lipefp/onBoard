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

  const inputStyle = {
    width: '100%', padding: '10px', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
      <Navbar />
      <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ color: '#333', marginBottom: '24px' }}>
          {isEdicao ? 'Editar Equipamento' : 'Novo Equipamento'}
        </h2>

        {erro && <p style={{ color: 'red', marginBottom: '16px' }}>{erro}</p>}

        <div style={{
          background: '#fff', padding: '32px', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <form onSubmit={handleSubmit}>
            {CAMPOS.map(({ name, label, type }) => (
              <div key={name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    name={name} value={form[name]} onChange={handleChange}
                    rows={3} style={{ ...inputStyle, resize: 'vertical' }}
                  />
                ) : (
                  <input
                    name={name} type={type} value={form[name]}
                    onChange={handleChange} style={inputStyle}
                  />
                )}
              </div>
            ))}

            {SELECTS.map(({ name, label, options }) => (
              <div key={name} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontWeight: '500' }}>
                  {label}
                </label>
                <select name={name} value={form[name]} onChange={handleChange} style={inputStyle}>
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox" name="suporta_poe" id="suporta_poe"
                checked={form.suporta_poe} onChange={handleChange}
              />
              <label htmlFor="suporta_poe" style={{ color: '#333', fontWeight: '500' }}>
                Suporta PoE?
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: '12px', backgroundColor: '#0056b3',
                color: '#fff', border: 'none', borderRadius: '6px',
                fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'
              }}>
                {loading ? 'Salvando...' : isEdicao ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" onClick={() => navigate('/equipamentos')} style={{
                flex: 1, padding: '12px', backgroundColor: 'transparent',
                color: '#666', border: '1px solid #ccc', borderRadius: '6px',
                fontSize: '15px', cursor: 'pointer'
              }}>
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