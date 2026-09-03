import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        <h2>Acceso administrador</h2>
        <label>Usuario</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
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
