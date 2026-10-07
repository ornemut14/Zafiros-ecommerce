import { useState } from 'react';

export default function CategoryModal({
  category,
  onClose,
  onSave,
  createTitle = 'Nueva categoría',
  editTitle = 'Editar categoría',
  placeholder = 'Ej: Aros',
}) {
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isEdit = !!category;

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
        <h2>{isEdit ? editTitle : createTitle}</h2>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={placeholder} />
        {error && <div className="error-text">{error}</div>}
        <div className="modal-actions">
          <button className="btn" disabled={saving} onClick={onClose}>Cancelar</button>
          <button className="btn gold" disabled={saving} onClick={handleSave}>
            {saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
