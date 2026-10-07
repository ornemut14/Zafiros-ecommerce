import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { useCart } from '../context/CartContext';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import CartPanel from '../components/CartPanel';
import CategoryModal from '../components/CategoryModal';
import ProductDetail from '../components/ProductDetail';
import Hero from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import CartIcon from '../icons/cart.svg?react';
import editorialLifestyle from '../assets/editorial.png';

export default function StorePage({ onContact }) {
  const { isAdmin } = useAuth();
  const { add, count } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [active, setActive] = useState('Todas');
  const [activeMaterial, setActiveMaterial] = useState('Todos');
  const [productSearch, setProductSearch] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const savedScrollY = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const PAGE_SIZE = 8;
  const [shownCount, setShownCount] = useState(PAGE_SIZE);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [cats, prods, cfg] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getConfig(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setWhatsappNumber(cfg.whatsapp_number);
      // Materiales en llamada separada y tolerante: si el backend aún no
      // tiene el endpoint, la tienda sigue funcionando sin filtro.
      try {
        setMaterials(await api.getMaterials());
      } catch {
        setMaterials([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  // Al cambiar filtros o búsqueda, volver a mostrar solo la primera tanda
  useEffect(() => { setShownCount(PAGE_SIZE); }, [active, activeMaterial, productSearch]);

  const visible = products.filter((p) => {
    const byCat = active === 'Todas' || p.category_name === active;
    const byMat = activeMaterial === 'Todos' || p.material_name === activeMaterial;
    const q = productSearch.trim().toLowerCase();
    const byText = !q || p.name.toLowerCase().includes(q);
    return byCat && byMat && byText;
  });

  const shown = visible.slice(0, shownCount);
  const remaining = visible.length - shown.length;

  function clearFilters() {
    setActive('Todas');
    setActiveMaterial('Todos');
    setProductSearch('');
  }

  function renderFilters() {
    return (
      <>
        <div className="store-filter">
          <input
            className="store-search"
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Buscar pieza..."
            aria-label="Buscar producto"
          />
          {(active !== 'Todas' || activeMaterial !== 'Todos' || productSearch) && (
            <button className="btn store-clear" onClick={clearFilters}>
              ✕ Limpiar filtros
            </button>
          )}
        </div>
        {materials.length > 0 && (
          <div className="mat-row">
            <span className="mat-label">Material</span>
            <div className="mat-pills">
              <button
                className={`cat-pill${activeMaterial === 'Todos' ? ' active' : ''}`}
                onClick={() => setActiveMaterial('Todos')}
              >
                Todos
              </button>
              {materials.map((m) => (
                <button
                  key={m.id}
                  className={`cat-pill${activeMaterial === m.name ? ' active' : ''}`}
                  onClick={() => setActiveMaterial(m.name)}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  function renderResults() {
    if (loading) return <div className="empty">Cargando productos...</div>;
    if (error) {
      return (
        <div className="empty">
          <div>{error}</div>
          <button className="btn solid" style={{ marginTop: 12 }} onClick={loadAll}>
            Reintentar
          </button>
        </div>
      );
    }
    if (visible.length === 0) {
      return <div className="empty">No hay piezas que coincidan con esos filtros.</div>;
    }
    return (
      <>
        <div className="grid">
          {shown.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={handleAdd}
              onSelect={openDetail}
            />
          ))}
        </div>
        {remaining > 0 && (
          <div className="explore-more">
            <button
              className="btn"
              onClick={() => setShownCount((n) => n + PAGE_SIZE)}
            >
              Ver más ({remaining} {remaining === 1 ? 'pieza' : 'piezas'})
            </button>
          </div>
        )}
      </>
    );
  }

  function handleAdd(product) {
    add(product.id, Number(product.stock));
  }

  function goToCatalog() {
    setActive('Todas');
    requestAnimationFrame(() => {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function openDetail(product) {
    savedScrollY.current = window.scrollY;
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  }

  function closeDetail() {
    setSelectedProduct(null);
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY.current);
    });
  }

  // Catálogo completo: vista propia con todo, reutilizando los filtros.
  function openCatalog() {
    savedScrollY.current = window.scrollY;
    clearFilters();
    setShowCatalog(true);
    window.scrollTo(0, 0);
  }

  function closeCatalog() {
    setShowCatalog(false);
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY.current);
    });
  }

  const detailProduct = selectedProduct
    ? products.find((p) => String(p.id) === String(selectedProduct.id))
    : null;

  return (
    <>
      {selectedProduct ? (
        <ProductDetail
          product={detailProduct}
          onBack={closeDetail}
        />
      ) : showCatalog ? (
        <main>
          <button className="btn back-link" onClick={closeCatalog}>
            ← Volver a la tienda
          </button>
          <div className="shop-head">
            <div>
              <span className="section-eyebrow">Zafiros</span>
              <h2>Catálogo completo</h2>
              <p>
                {products.length === 1
                  ? '1 pieza en total'
                  : `${products.length} piezas en total`}
              </p>
            </div>
          </div>
          <div className="cats" style={{ padding: '0 0 24px', border: 'none', maxWidth: 'none', margin: 0 }}>
            <button
              className={`cat-pill ${active === 'Todas' ? 'active' : ''}`}
              onClick={() => setActive('Todas')}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`cat-pill ${active === c.name ? 'active' : ''}`}
                onClick={() => setActive(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
          {renderFilters()}
          {renderResults()}
        </main>
      ) : (
        <>
          <Hero onVerProductos={goToCatalog} />
          <CategoryTabs
            categories={categories}
            active={active}
            onSelect={setActive}
            isAdmin={isAdmin}
            onAddCategory={() => setShowCategoryModal(true)}
          />

          <main id="productos">
            <div className="shop-head">
              <div>
                <span className="section-eyebrow">Catálogo</span>
                <h2>
                  {active === 'Todas' ? 'Todas las piezas' : active}
                  {activeMaterial !== 'Todos' ? ` · ${activeMaterial}` : ''}
                </h2>
                <p>
                  {visible.length === 1
                    ? '1 pieza disponible'
                    : `${visible.length} piezas disponibles`}
                  {' '}— elegidas para acompañar cada momento.
                </p>
              </div>
              <button className="link-arrow" onClick={openCatalog}>Ver todos →</button>
            </div>

            {renderFilters()}
            {renderResults()}
          </main>

          <section className="split">
            <div className="split-media">
              <img src={editorialLifestyle} alt="Modelo con aro dorado Zafiros" loading="lazy" />
            </div>
            <div className="split-text">
              <span className="section-eyebrow">Editorial</span>
              <h2>Joyas para cada historia.</h2>
              <p>
                Descubrí piezas pensadas para acompañarte en cada ocasión —
                del día a día a esos momentos que querés recordar siempre.
              </p>
              <ul className="split-list">
                <li>Materiales nobles de uso diario</li>
                <li>Diseño atemporal, delicado y versátil</li>
                <li>Atención personalizada por WhatsApp</li>
              </ul>
              <button className="btn solid" onClick={() => (onContact ? onContact() : goToCatalog())}>
                Conocer más
              </button>
            </div>
          </section>

          <section className="brand-band" id="nosotros">
            <span className="section-eyebrow">Nuestra casa</span>
            <h2>ZAFIROS</h2>
            <p>Detalles que hacen especial lo cotidiano. Una joyería boutique que celebra la elegancia silenciosa.</p>
            <div className="hairline" />
          </section>

          <section className="perks">
            <div className="perk"><strong>Envíos a todo el país</strong><span>Despacho rápido y seguro</span></div>
            <div className="perk"><strong>Compra segura</strong><span>Atención directa por WhatsApp</span></div>
            <div className="perk"><strong>Calidad garantizada</strong><span>Piezas elegidas una por una</span></div>
          </section>

          <section className="newsletter">
            <span className="section-eyebrow">Quedate cerca</span>
            <h2>Novedades y piezas especiales</h2>
            <p>Seguinos para ver nuevos ingresos, reposiciones y piezas especiales antes que nadie.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                className="btn solid"
                href="https://instagram.com/zafiros_joyass"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <button className="btn" onClick={() => (onContact ? onContact() : goToCatalog())}>
                WhatsApp
              </button>
            </div>
          </section>
        </>
      )}

      <button className="fab" onClick={() => setShowCart(true)} aria-label="Abrir carrito">
        <CartIcon className="cart-icon" />
        {count > 0 && <div className="count">{count}</div>}
      </button>

      {showCart && (
        <CartPanel
          products={products}
          whatsappNumber={whatsappNumber}
          onClose={() => setShowCart(false)}
          onCheckoutSuccess={() => setShowCart(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onSave={async (name) => {
            await api.createCategory(name);
            await loadAll();
          }}
        />
      )}
    </>
  );
}
