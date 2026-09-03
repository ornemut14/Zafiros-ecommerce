import { useState } from 'react';

export default function CategoryModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return setError('Escribí un nombre.');
    setSaving(true);
    setError('');
    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Nueva categoría</h2>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Aros" />
        {error && <div className="error-text">{error}</div>}
        <div className="modal-actions">
          <button className="btn" disabled={saving} onClick={onClose}>Cancelar</button>
          <button className="btn solid" disabled={saving} onClick={handleSave}>
            {saving ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
