export default function CategoryTabs({ categories, active, onSelect, isAdmin, onAddCategory }) {
  return (
    <div className="cats">
      <button className={`cat-pill ${active === 'Todas' ? 'active' : ''}`} onClick={() => onSelect('Todas')}>
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
  );
}
