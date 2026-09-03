import ProductCard from './ProductCard';

export default function Hero({
  categories,
  products,
  onVerProductos,
  onSelectCategory,
  onAdd,
  onSelectProduct,
}) {
  // Producto destacado: primero que tenga imagen, si no, el primero disponible
  const featured =
    products.find((p) => p.image_url) || products[0] || null;
  const hasImage = !!featured?.image_url;

  // Algunos productos para la sección "Explorá nuestros productos"
  const explore = products.slice(0, 4);

  const catEmojis = {
    Anillos: '💍',
    Collares: '📿',
    Aros: '💎',
    Pulseras: '✨',
  };

  return (
    <>
      <section className="hero">
        <div className="hero-deco" aria-hidden="true"></div>
        <div className="hero-text">
          <span className="hero-eyebrow">Joyería Zafiros</span>
          <h2 className="hero-title">
            Descubrí tu próxima joya
          </h2>
          <p className="hero-sub">
            Anillos, collares, aros y pulseras seleccionados para
            acompañarte y hacerte brillar en cada ocasión.
          </p>
          <div className="hero-actions">
            <button className="btn solid hero-btn" onClick={onVerProductos}>
              Ver productos
            </button>
            <a className="btn hero-btn" href="#explorar">
              Conocer más
            </a>
          </div>
        </div>

        <div className="hero-visual">
          {hasImage && featured ? (
            <div className="hero-card">
              <img
                className="hero-img"
                src={featured.image_url}
                alt={featured.name}
              />
              <div className="hero-badge">
                <span className="hero-badge-name">{featured.name}</span>
                <span className="hero-badge-price">
                  ${Number(featured.price).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          ) : (
            <div className="hero-card hero-card-placeholder">
              <span className="hero-gem">💎</span>
              <span className="hero-placeholder-text">Joyería Zafiros</span>
            </div>
          )}
        </div>
      </section>

      <section className="explore" id="explorar">
        <h3 className="explore-title">Explorá nuestros productos</h3>
        <div className="explore-cats">
          {categories.map((c) => (
            <button
              key={c.id}
              className="explore-cat"
              onClick={() => onSelectCategory(c.name)}
            >
              <span className="explore-cat-emoji">{catEmojis[c.name] || '💎'}</span>
              <span className="explore-cat-name">{c.name}</span>
            </button>
          ))}
        </div>
        {explore.length > 0 && (
          <div className="grid explore-grid">
            {explore.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={onAdd}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
        <div className="explore-more">
          <button className="btn solid" onClick={onVerProductos}>
            Ver todos los productos
          </button>
        </div>
      </section>
    </>
  );
}
