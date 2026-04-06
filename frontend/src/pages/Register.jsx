import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#f0f4f8'
    }}>
      <div style={{
        background: '#fff', padding: '40px', borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#0056b3' }}>
          Criar Conta
        </h2>

        {erro && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '12px' }}>{erro}</p>
        )}

        <form onSubmit={handleSubmit}>
          {['username', 'email', 'password'].map((field) => (
            <div key={field} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#333', textTransform: 'capitalize' }}>
                {field === 'username' ? 'Usuário' : field === 'email' ? 'E-mail' : 'Senha'}
              </label>
              <input
                name={field}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '10px', borderRadius: '6px',
                  border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
                }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', backgroundColor: '#0056b3',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '15px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px'
          }}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#666' }}>
          Já tem conta? <Link to="/login" style={{ color: '#0056b3' }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;