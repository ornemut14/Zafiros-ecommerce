import { useState } from 'react';

// Misma interfaz: product, onAdd, onSelect. Solo cambia la capa visual.
export default function ProductCard({ product, onAdd, onSelect }) {
  const stock = Number(product.stock);
  const outOfStock = stock <= 0;
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e) {
    e.stopPropagation();
    if (outOfStock) return;
    onAdd && onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect && onSelect(product);
    }
  }

  return (
    <article
      className="card clickable reveal"
      onClick={() => onSelect && onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKey}
      aria-label={product.name}
    >
      <div className="card-media">
        {product.image_url ? (
          <img
            className="product-photo"
            src={product.image_url}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="icon">{product.icon || '✦'}</div>
        )}
        <span className={`card-badge${outOfStock ? ' soldout' : ''}`}>
          {outOfStock ? 'Agotado' : (product.category_name || 'Zafiros')}
        </span>
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className="card-mini-btn"
            onClick={handleAdd}
            disabled={outOfStock}
            title={outOfStock ? 'Sin stock' : 'Agregar al carrito'}
            aria-label={outOfStock ? 'Sin stock' : 'Agregar al carrito'}
          >
            {justAdded ? '✓' : '+'}
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="cat-tag">{product.category_name || 'Zafiros'}</div>
        <h3>{product.name}</h3>
        <div className="price">${Number(product.price).toLocaleString('es-AR')}</div>
        <div className={`stock-note ${outOfStock ? 'low' : ''}`}>
          {outOfStock ? 'Sin stock' : 'Disponible'}
        </div>
        <button
          className="btn"
          disabled={outOfStock}
          onClick={handleAdd}
        >
          {outOfStock ? 'Sin stock' : justAdded ? '✓ Agregado' : 'Agregar'}
        </button>
      </div>
    </article>
  );
}
