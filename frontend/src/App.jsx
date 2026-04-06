import { useState, useEffect } from 'react';

const App = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    // Função que busca os dados no seu servidor Django
    const carregarDados = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/equipamentos/');
        if (!response.ok) throw new Error('Erro ao conectar com o servidor');
        
        const dados = await response.json();
        setEquipamentos(dados);
      } catch (err) {
        setErro(err.message);
        console.error("Erro na integração:", err);
      }
    };

    carregarDados();
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
           <h1 style={{ margin: 0, color: '#333' }}>📦 Inventário de Equipamentos - Leste</h1>
        </div>

        {erro && <p style={{ color: 'red', textAlign: 'center' }}>Erro: {erro}</p>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#0056b3', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '15px' }}>Nome</th>
              <th style={{ padding: '15px' }}>S/N</th>
              <th style={{ padding: '15px' }}>Local</th>
              <th style={{ padding: '15px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.length > 0 ? (
              equipamentos.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>{item.nome}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{item.serial_number}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{item.local}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '12px', 
                      fontSize: '12px', 
                      fontWeight: 'bold',
                      background: item.status === 'ESTOQUE' ? '#e1f7e7' : '#fff3cd',
                      color: item.status === 'ESTOQUE' ? '#1db954' : '#856404'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  Nenhum equipamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;