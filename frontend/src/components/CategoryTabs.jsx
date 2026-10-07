// Mantiene la misma interfaz (categories, active, onSelect, isAdmin, onAddCategory).
// Solo cambia la capa visual: tira minimal + sección editorial con iniciales finas.

function initials(name) {
  const clean = String(name || '').trim();
  if (!clean) return '·';
  const words = clean.split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
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
              <span className="explore-cat-emoji">✦</span>
              <span className="explore-cat-name">Todas</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`explore-cat${active === c.name ? ' active' : ''}`}
                onClick={() => onSelect(c.name)}
              >
                <span className="explore-cat-emoji">{initials(c.name)}</span>
                <span className="explore-cat-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
