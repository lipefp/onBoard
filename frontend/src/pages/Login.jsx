import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
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
      const res = await api.post('auth/login/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('username', res.data.username);
      navigate('/equipamentos');
    } catch (err) {
      setErro('Usuário ou senha inválidos.');
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
          📦 Inventário Leste
        </h2>

        {erro && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '12px' }}>{erro}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333' }}>Usuário</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333' }}>Senha</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px', borderRadius: '6px',
                border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
              }}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', backgroundColor: '#0056b3',
            color: '#fff', border: 'none', borderRadius: '6px',
            fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#666' }}>
          Não tem conta? <Link to="/register" style={{ color: '#0056b3' }}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;