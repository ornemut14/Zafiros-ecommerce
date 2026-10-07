import heroImg from '../assets/hero.jpg';

export default function Hero({ onVerProductos, featured }) {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-eyebrow">Joyería boutique — Zafiros</span>
        <h2 className="hero-title">
          Detalles que <em>perduran.</em>
        </h2>
        <p className="hero-sub">
          Joyas pensadas para acompañarte todos los días.
          Piezas delicadas, atemporales y elegidas para cada historia.
        </p>
        <div className="hero-actions">
          <button className="btn solid hero-btn" onClick={onVerProductos}>
            Ver colección
          </button>
          <button className="hero-link" onClick={onVerProductos}>
            Novedades →
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <img
            className="hero-img"
            src={featured?.image_url || heroImg}
            alt={featured?.name || 'Joyería Zafiros'}
          />
          <span className="hero-tag">Nueva colección</span>
          {featured && (
            <div className="hero-badge">
              <span className="hero-badge-name">{featured.name}</span>
              <span className="hero-badge-price">
                ${Number(featured.price).toLocaleString('es-AR')}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
