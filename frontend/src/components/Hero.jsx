import heroImg from '../assets/hero.jpg';

export default function Hero({ onVerProductos }) {
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
          <button className="link-arrow" onClick={onVerProductos}>
            Novedades →
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <img
            className="hero-img"
            src={heroImg}
            alt="Joyería Zafiros"
          />
          <span className="hero-tag">Nueva colección</span>
        </div>
      </div>
    </section>
  );
}
