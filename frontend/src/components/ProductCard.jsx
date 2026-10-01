export default function ProductCard({ product, onAdd, onSelect }) {
  const stock = Number(product.stock);
  const outOfStock = stock <= 0;

  let stockNote;
  let stockClass = '';
  if (outOfStock) {
    stockNote = 'Sin stock';
    stockClass = 'low';
  } else {
    stockNote = 'Disponible';
  }

  return (
    <div
      className="card clickable"
      onClick={() => onSelect && onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(product);
        }
      }}
    >
      {product.image_url ? (
        <img className="product-photo" src={product.image_url} alt={product.name} />
      ) : (
        <div className="icon">{product.icon || '💎'}</div>
      )}
      <div className="cat-tag">{product.category_name}</div>
      <h3>{product.name}</h3>
      <div className="price">${Number(product.price).toLocaleString('es-AR')}</div>
      <div className={`stock-note ${stockClass}`}>
        {stockNote}
      </div>
      <button
        className="btn solid"
        style={{ marginTop: 8 }}
        disabled={outOfStock}
        onClick={(e) => {
          e.stopPropagation();
          onAdd && onAdd(product);
        }}
      >
        {outOfStock ? 'Sin stock' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
