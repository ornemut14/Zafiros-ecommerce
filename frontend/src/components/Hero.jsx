import heroImg from '../assets/hero.jpg';

export default function Hero({ onVerProductos }) {
  return (
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
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card">
          <img
            className="hero-img"
            src={heroImg}
            alt="Joyería Zafiros"
          />
        </div>
      </div>
    </section>
  );
}
