// Mantiene la misma interfaz (categories, active, onSelect, isAdmin, onAddCategory).
// Solo cambia la capa visual: tira minimal + sección editorial con iconos finos.

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
    </svg>
  );
}

function Ring() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="15" r="5.2" />
      <path d="M9.4 10.6 12 7l2.6 3.6L12 12.2z" />
    </svg>
  );
}

function Hoop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <ellipse cx="12" cy="12.5" rx="5.5" ry="7" />
      <circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Necklace() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M4 3.5c0 6.5 3.6 11.5 8 11.5s8-5 8-11.5" />
      <circle cx="12" cy="15" r="1.6" />
    </svg>
  );
}

function Bracelet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="12" cy="11" r="6.5" />
      <circle cx="12" cy="18.6" r="1.5" />
    </svg>
  );
}

function Pendant() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1.7" />
      <path d="M12 6.7c2.8 3.6 4.5 6.4 4.5 9a4.5 4.5 0 0 1-9 0c0-2.6 1.7-5.4 4.5-9z" />
    </svg>
  );
}

function Stack() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </svg>
  );
}

// Elige icono por palabra clave; las categorías son dinámicas, así que
// cualquier nombre no reconocido usa el destello neutro de la marca.
function CategoryIcon({ name }) {
  const n = String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (n.includes('anillo')) return <Ring />;
  if (n.includes('aro') || n.includes('argolla')) return <Hoop />;
  if (n.includes('caden') || n.includes('cadena') || n.includes('collar') || n.includes('gargantilla')) return <Necklace />;
  if (n.includes('pulsera') || n.includes('brazalete') || n.includes('tobillera') || n.includes('esclava')) return <Bracelet />;
  if (n.includes('dije')) return <Pendant />;
  if (n.includes('set') || n.includes('combo') || n.includes('pack')) return <Stack />;
  return <Sparkle />;
}

export default function CategoryTabs({ categories, active, onSelect, isAdmin, onAddCategory }) {
  return (
    <>
      <div className="cats" role="tablist" aria-label="Categorías">
        <button
          className={`cat-pill ${active === 'Todas' ? 'active' : ''}`}
          onClick={() => onSelect('Todas')}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`cat-pill ${active === c.name ? 'active' : ''}`}
            onClick={() => onSelect(c.name)}
          >
            {c.name}
          </button>
        ))}
        {isAdmin && (
          <button className="cat-pill cat-add" onClick={onAddCategory}>
            + Nueva categoría
          </button>
        )}
      </div>

      <section className="shop-cats" id="coleccion">
        <div className="shop-cats-inner">
          <span className="section-eyebrow">Nuestra colección</span>
          <h2 className="section-title">Joyas que hablan por vos.</h2>
          <p className="section-sub">
            Explorá por categoría y encontrá esa pieza que se siente tuya.
          </p>
          <div className="cat-grid">
            <button
              className={`explore-cat${active === 'Todas' ? ' active' : ''}`}
              onClick={() => onSelect('Todas')}
            >
              <span className="explore-cat-emoji"><Sparkle /></span>
              <span className="explore-cat-name">Todas</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`explore-cat${active === c.name ? ' active' : ''}`}
                onClick={() => onSelect(c.name)}
              >
                <span className="explore-cat-emoji"><CategoryIcon name={c.name} /></span>
                <span className="explore-cat-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
