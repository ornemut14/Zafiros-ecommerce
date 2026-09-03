import { useState } from 'react';
import { uploadImageToCloudinary } from '../api/cloudinary';

export default function ProductModal({ categories, product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || '');
  const [stock, setStock] = useState(product?.stock ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id || categories[0]?.id || '');
  const [icon, setIcon] = useState(product?.icon || '💍');
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    const trimmedName = name.trim();
    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (!trimmedName) return setError('El nombre del producto es obligatorio.');
    if (price === '' || price === null || priceNum === '' || Number.isNaN(priceNum)) {
      return setError('El precio es obligatorio y debe ser un número válido.');
    }
    if (priceNum < 0) return setError('El precio no puede ser negativo.');
    if (stock === '' || stock === null || Number.isNaN(stockNum)) {
      return setError('El stock es obligatorio y debe ser un número válido.');
    }
    if (stockNum < 0) return setError('El stock no puede ser negativo.');
    if (!Number.isInteger(stockNum)) return setError('El stock debe ser un número entero.');
    if (!categoryId) return setError('Seleccioná una categoría.');
    if (!Number.isInteger(Number(categoryId))) return setError('La categoría seleccionada no es válida.');

    setSaving(true);
    setError('');
    try {
      await onSave({
        name: trimmedName,
        price: priceNum,
        stock: stockNum,
        categoryId: Number(categoryId),
        icon,
        imageUrl: imageUrl || null,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 420 }}>
        <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
        <label>Nombre del producto</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Anillo de plata 925" />
        <div className="form-grid">
          <div>
            <label>Precio</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label>Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>
        <label>Categoría</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Foto del producto</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Subiendo imagen...</div>}
        {imageUrl && !uploading && (
          <img
            src={imageUrl}
            alt="Vista previa"
            style={{ marginTop: 10, width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 4 }}
          />
        )}

        <label>Ícono de respaldo (emoji, se usa si no hay foto)</label>
        <input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} />

        {error && <div className="error-text">{error}</div>}
        <div className="modal-actions">
          <button className="btn" disabled={saving} onClick={onClose}>Cancelar</button>
          <button className="btn solid" disabled={uploading || saving} onClick={handleSave}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
