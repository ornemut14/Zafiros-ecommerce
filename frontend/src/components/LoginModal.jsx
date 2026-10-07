import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;
    if (!username.trim() || !password) {
      setError('Completá usuario y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <span className="section-eyebrow">Zafiros</span>
        <h2>Acceso administrador</h2>
        <div className="modal-sub">Ingresá para gestionar la boutique.</div>
        <label>Usuario</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Contraseña</label>
        <div className="password-wrap">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l18 18" />
                <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c7 0 11 7 11 7a17.6 17.6 0 0 1-2.2 3.1M6.6 6.6C3.8 8.2 1 12 1 12s4 7 11 7c1.5 0 2.9-.3 4.1-.8" />
                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {error && <div className="error-text">{error}</div>}
        <div className="modal-actions">
          <button className="btn" disabled={loading} onClick={onClose}>Cancelar</button>
          <button className="btn solid" disabled={loading} onClick={handleLogin}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
}
