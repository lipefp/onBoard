// Dimensões do switch (proporções de 1U rack real)
const W = 280; // largura
const H = 44;  // altura (1U = 44mm)
const D = 60;  // profundidade

const Switch3D = () => {
  const leds = ['#22c55e', '#22c55e', '#f59e0b', '#1e293b', '#22c55e', '#f59e0b', '#22c55e', '#22c55e'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      <style>{`
        @keyframes giro {
          from { transform: rotateX(22deg) rotateY(0deg);   }
          to   { transform: rotateX(22deg) rotateY(360deg); }
        }
        @keyframes pisca {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.1; }
        }
        .cena  { perspective: 900px; }
        .caixa {
          width: ${W}px; height: ${H}px;
          position: relative;
          transform-style: preserve-3d;
          animation: giro 10s linear infinite;
        }
        .f { position: absolute; left: 0; top: 0; box-sizing: border-box; }
      `}</style>

      <div className="cena">
        <div className="caixa">

          {/* Frente */}
          <div className="f" style={{
            width: W, height: H,
            background: '#1e293b',
            border: '1px solid #3b5268',
            transform: `translateZ(${D / 2}px)`,
            display: 'flex', alignItems: 'center', padding: '0 12px', gap: '10px'
          }}>
            <span style={{ color: '#60a5fa', fontSize: '7px', fontFamily: 'monospace', fontWeight: 'bold', flexShrink: 0 }}>SW-8P</span>

            {/* 8 portas com LEDs */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {leds.map((cor, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: cor,
                    boxShadow: cor !== '#1e293b' ? `0 0 5px ${cor}` : 'none',
                    animation: cor !== '#1e293b' ? `pisca ${1.2 + i * 0.2}s ease-in-out infinite` : 'none',
                  }} />
                  <div style={{
                    width: 14, height: 10,
                    background: '#0a0f1a',
                    border: '1px solid #334155',
                    borderRadius: 1,
                  }} />
                </div>
              ))}
            </div>

            {/* LED power */}
            <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e', boxShadow: '0 0 6px #22c55e',
                animation: 'pisca 3s ease-in-out infinite'
              }} />
            </div>
          </div>

          {/* Traseira */}
          <div className="f" style={{
            width: W, height: H,
            background: '#0f172a',
            border: '1px solid #1e293b',
            transform: `rotateY(180deg) translateZ(${D / 2}px)`,
          }} />

          {/* Lateral esquerda */}
          <div className="f" style={{
            width: D, height: H,
            background: '#162032',
            border: '1px solid #2d4a6b',
            transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
          }} />

          {/* Lateral direita */}
          <div className="f" style={{
            width: D, height: H,
            background: '#162032',
            border: '1px solid #2d4a6b',
            transform: `rotateY(90deg) translateZ(${W - D / 2}px)`,
          }} />

          {/* Topo com ranhuras */}
          <div className="f" style={{
            width: W, height: D,
            background: 'linear-gradient(180deg, #1e3a5f, #162032)',
            border: '1px solid #2d4a6b',
            transform: `rotateX(-90deg) translateZ(${D / 2}px)`,
            overflow: 'hidden',
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: '8%', width: '84%', height: 2,
                background: 'rgba(0,0,0,0.35)', borderRadius: 1,
                top: 4 + i * 4,
              }} />
            ))}
          </div>

          {/* Base */}
          <div className="f" style={{
            width: W, height: D,
            background: '#0f172a',
            border: '1px solid #1e293b',
            transform: `rotateX(90deg) translateZ(${H - D / 2}px)`,
          }} />

        </div>
      </div>
    </div>
  );
};

export default Switch3D;
