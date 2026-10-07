// Mantiene la misma interfaz (categories, active, onSelect, isAdmin, onAddCategory).
// Solo cambia la capa visual: tira minimal + sección editorial con iconos finos.
import { CategoryIcon, SparkleIcon } from './CategoryIcon';

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
              <span className="explore-cat-emoji"><SparkleIcon /></span>
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
