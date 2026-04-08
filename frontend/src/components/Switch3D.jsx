import { useState, useRef, useEffect, useCallback } from 'react';

const W = 300; // largura do corpo
const H = 44;  // altura 1U
const D = 55;  // profundidade
const EAR = 24; // largura da orelha do rack (cada lado)

const Screw = ({ x, y }) => (
  <div style={{
    position: 'absolute', left: x - 5, top: y - 5,
    width: 10, height: 10, borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, #3a4a5a, #111820)',
    border: '1px solid #243040',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  }}>
    <div style={{ width: 5, height: 1, background: '#060a0e', transform: 'rotate(45deg)' }} />
  </div>
);

// Furo de rack (orelha) simulando profundidade
const RackHole = ({ x, y }) => (
  <div style={{
    position: 'absolute', left: x - 6, top: y - 6,
    width: 12, height: 12, borderRadius: '50%',
    background: 'radial-gradient(circle at 40% 40%, #1a2530, #050810)',
    border: '1px solid #1a2530',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.9), inset 0 0 6px rgba(0,0,0,0.7)',
  }} />
);

const Switch3D = () => {
  const rotRef = useRef({ x: 18, y: 30 });
  const [rot, setRot] = useState({ x: 18, y: 30 });
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragStart = useRef(null);
  const animRef = useRef(null);

  const leds = Array.from({ length: 24 }, (_, i) => {
    if (i === 5 || i === 11) return '#f59e0b';
    if (i === 3 || i === 17) return '#1e293b';
    return '#22c55e';
  });

  // Auto-rotação
  useEffect(() => {
    if (hovered || dragging) return;
    let last = null;
    const tick = (t) => {
      if (last !== null) {
        rotRef.current.y += (t - last) * 0.022;
        setRot({ x: rotRef.current.x, y: rotRef.current.y });
      }
      last = t;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [hovered, dragging]);

  const onMouseMove = useCallback((e) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    const newX = Math.max(-30, Math.min(60, dragStart.current.rx - dy * 0.45));
    const newY = dragStart.current.ry + dx * 0.45;
    rotRef.current = { x: newX, y: newY };
    setRot({ x: newX, y: newY });
  }, []);

  const onMouseUp = useCallback(() => {
    setDragging(false);
    dragStart.current = null;
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [dragging, onMouseMove, onMouseUp]);

  const onMouseDown = (e) => {
    dragStart.current = { mx: e.clientX, my: e.clientY, rx: rotRef.current.x, ry: rotRef.current.y };
    setDragging(true);
    e.preventDefault();
  };

  const totalW = W + EAR * 2;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', cursor: dragging ? 'grabbing' : 'grab' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); }}
      onMouseDown={onMouseDown}
    >
      <style>{`
        @keyframes pisca {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        .cena { perspective: 1100px; }
        .caixa {
          width: ${W}px; height: ${H}px;
          position: relative;
          transform-style: preserve-3d;
          transition: ${dragging ? 'none' : 'transform 0.05s linear'};
        }
        .f { position: absolute; left: 0; top: 0; box-sizing: border-box; }
      `}</style>

      <div className="cena">
        <div
          className="caixa"
          style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
        >
          {/* ── Frente (inclui orelhas do rack) ── */}
          <div className="f" style={{
            width: totalW, height: H,
            left: -EAR,
            background: 'linear-gradient(180deg, #1e2d3d 0%, #152030 55%, #1a2a3a 100%)',
            border: '1px solid #2d4060',
            transform: `translateZ(${D / 2}px)`,
            overflow: 'visible',
          }}>
            {/* Orelha esquerda */}
            <div style={{
              position: 'absolute', left: 0, top: 0,
              width: EAR, height: H,
              background: 'linear-gradient(180deg, #1a2a3a, #111e2b)',
              borderRight: '1px solid #243040',
            }}>
              <RackHole x={EAR / 2} y={H * 0.3} />
              <RackHole x={EAR / 2} y={H * 0.72} />
            </div>

            {/* Orelha direita */}
            <div style={{
              position: 'absolute', right: 0, top: 0,
              width: EAR, height: H,
              background: 'linear-gradient(180deg, #1a2a3a, #111e2b)',
              borderLeft: '1px solid #243040',
            }}>
              <RackHole x={EAR / 2} y={H * 0.3} />
              <RackHole x={EAR / 2} y={H * 0.72} />
            </div>

            {/* Corpo principal da frente */}
            <div style={{
              position: 'absolute', left: EAR, top: 0,
              width: W, height: H,
              display: 'flex', alignItems: 'center',
              borderLeft: '1px solid #162030',
              borderRight: '1px solid #162030',
            }}>
              <Screw x={10} y={H / 2} />
              <Screw x={W - 10} y={H / 2} />

              {/* 24 portas */}
              <div style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', gap: '5px', alignItems: 'center',
              }}>
                {leds.map((cor, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                    <div style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: cor,
                      boxShadow: cor !== '#1e293b' ? `0 0 4px ${cor}` : 'none',
                      animation: cor !== '#1e293b' ? `pisca ${1.4 + i * 0.13}s ease-in-out infinite` : 'none',
                    }} />
                    <div style={{
                      width: 9, height: 7,
                      background: '#060b12',
                      border: '1px solid #253545',
                      borderRadius: 1,
                    }} />
                  </div>
                ))}
              </div>

              {/* LED power */}
              <div style={{ position: 'absolute', right: 22, top: '50%', transform: 'translateY(-50%)' }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22c55e', boxShadow: '0 0 5px #22c55e',
                  animation: 'pisca 3.5s ease-in-out infinite',
                }} />
              </div>
            </div>
          </div>

          {/* ── Traseira ── */}
          <div className="f" style={{
            width: W, height: H,
            background: 'linear-gradient(180deg, #0d1820, #080f16)',
            border: '1px solid #152030',
            transform: `rotateY(180deg) translateZ(${D / 2}px)`,
          }} />

          {/* ── Lateral esquerda ── */}
          <div className="f" style={{
            width: D, height: H,
            background: 'linear-gradient(90deg, #0f1a26, #152030)',
            border: '1px solid #1e2e40',
            transform: `rotateY(-90deg) translateZ(${D / 2}px)`,
          }} />

          {/* ── Lateral direita ── */}
          <div className="f" style={{
            width: D, height: H,
            background: 'linear-gradient(90deg, #152030, #0f1a26)',
            border: '1px solid #1e2e40',
            transform: `rotateY(90deg) translateZ(${W - D / 2}px)`,
          }} />

          {/* ── Topo ── */}
          <div className="f" style={{
            width: W, height: D,
            background: 'linear-gradient(180deg, #1a3050 0%, #0f1e2e 100%)',
            border: '1px solid #253a50',
            transform: `rotateX(90deg) translateZ(${D / 2}px)`,
            overflow: 'hidden',
          }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute', left: '6%', width: '88%', height: 1,
                background: 'rgba(0,0,0,0.45)', top: 5 + i * 5,
              }} />
            ))}
          </div>

          {/* ── Base ── */}
          <div className="f" style={{
            width: W, height: D,
            background: '#080e16',
            border: '1px solid #12202e',
            transform: `rotateX(-90deg) translateZ(${H - D / 2}px)`,
          }} />
        </div>
      </div>
    </div>
  );
};

export default Switch3D;
