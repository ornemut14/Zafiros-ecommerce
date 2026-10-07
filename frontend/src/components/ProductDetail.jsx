import { useEffect, useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductDetail({ product, onBack }) {
  const { add, changeQty, items } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [added, setAdded] = useState(false);

  // Estructura lista para múltiples imágenes: hoy el backend tiene una sola
  // (image_url), pero esta galería permite agregar más sin tocar la base.
  const images = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.image_url) list.push(product.image_url);
    return list;
  }, [product]);

  useEffect(() => {
    setQuantity(1);
    setActiveImg(0);
    setAdded(false);
  }, [product]);

  if (!product) {
    return (
      <main className="detail-main">
        <div className="empty">
          <div>Producto no encontrado.</div>
          <button className="btn solid" style={{ marginTop: 12 }} onClick={onBack}>
            ← Volver a productos
          </button>
        </div>
      </main>
    );
  }

  const stock = Number(product.stock);
  const outOfStock = stock <= 0;
  const inCart = items[product.id] || 0;
  const remaining = Math.max(stock - inCart, 0);

  let stockNote;
  let stockClass = '';
  if (outOfStock) {
    stockNote = 'Sin stock';
    stockClass = 'low';
  } else {
    stockNote = 'Disponible';
  }

  function setQuantitySafe(value) {
    const n = Number(value);
    if (Number.isNaN(n) || n < 1) { setQuantity(1); return; }
    const max = outOfStock ? 0 : Math.max(remaining, 1);
    setQuantity(Math.min(Math.floor(n), max));
  }

  function handleAddToCart() {
    if (outOfStock) return;
    // Si ya hay varios en el carrito, agregamos la cantidad restante
    for (let i = 0; i < quantity; i++) {
      add(product.id, stock);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const currentImg = images[activeImg];

  return (
    <main className="detail-main">
      <button className="btn back-link" onClick={onBack}>
        ← Volver a productos
      </button>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-image" onClick={() => images.length > 0 && setShowLightbox(true)}>
            {currentImg ? (
              <img src={currentImg} alt={product.name} />
            ) : (
              <span className="icon detail-fallback">{product.icon || '💎'}</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="detail-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`detail-thumb${i === activeImg ? ' active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={src} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="section-eyebrow">{product.category_name || 'Zafiros'}</span>
          <h2 className="detail-title">{product.name}</h2>
          <div className="detail-price">${Number(product.price).toLocaleString('es-AR')}</div>
          <p className="detail-desc">
            Pieza de la colección Zafiros — delicada, atemporal y pensada para acompañarte todos los días.
          </p>

          <div className={`stock-note ${stockClass}`} style={{ marginTop: 6 }}>
            {outOfStock ? 'Sin stock' : `${stockNote} — ${stock} disponible${stock === 1 ? '' : 's'}`}
          </div>

          <div className="detail-qty">
            <span className="detail-qty-label">Cantidad</span>
            <div className="qty-ctrl">
              <button onClick={() => setQuantitySafe(quantity - 1)} disabled={quantity <= 1 || outOfStock}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantitySafe(quantity + 1)} disabled={outOfStock || quantity >= remaining}>+</button>
            </div>
            {inCart > 0 && (
              <div className="detail-in-cart">
                {inCart} en el carrito
              </div>
            )}
          </div>

          <button
            className={`btn solid detail-add${added ? ' added' : ''}`}
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sin stock' : added ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
          {remaining === 0 && !outOfStock && (
            <div className="error-text" style={{ marginTop: 8 }}>
              Ya alcanzaste el máximo disponible de este producto en el carrito.
            </div>
          )}
          <div className="split-list" style={{ marginTop: 22, paddingTop: 22 }}>
            <li>Envíos a todo el país</li>
            <li>Compra segura por WhatsApp</li>
          </div>
        </div>
      </div>

      {showLightbox && currentImg && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <img src={currentImg} alt={product.name} />
        </div>
      )}
    </main>
  );
}
