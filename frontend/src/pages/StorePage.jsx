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

export default function StorePage() {
  const { isAdmin } = useAuth();
  const { add, count } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState('Todas');
  const [productSearch, setProductSearch] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const savedScrollY = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const visible = products.filter((p) => {
    const byCat = active === 'Todas' || p.category_name === active;
    const q = productSearch.trim().toLowerCase();
    const byText = !q || p.name.toLowerCase().includes(q);
    return byCat && byText;
  });

  function clearFilters() {
    setActive('Todas');
    setProductSearch('');
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
      ) : (
        <>
          <Hero
            onVerProductos={goToCatalog}
          />
          <CategoryTabs
            categories={categories}
            active={active}
            onSelect={setActive}
            isAdmin={isAdmin}
            onAddCategory={() => setShowCategoryModal(true)}
          />
          <main id="productos">
            <div className="store-filter">
              <input
                className="store-search"
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar producto..."
              />
              {(active !== 'Todas' || productSearch) && (
                <button className="btn store-clear" onClick={clearFilters}>
                  ✕ Limpiar filtros
                </button>
              )}
            </div>
            {loading ? (
              <div className="empty">Cargando productos...</div>
            ) : error ? (
              <div className="empty">
                <div>{error}</div>
                <button className="btn solid" style={{ marginTop: 12 }} onClick={loadAll}>
                  Reintentar
                </button>
              </div>
            ) : visible.length === 0 ? (
              <div className="empty">Todavía no hay productos disponibles en esta categoría.</div>
            ) : (
              <div className="grid">
                {visible.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAdd={handleAdd}
                    onSelect={openDetail}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      <button className="fab" onClick={() => setShowCart(true)}>
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
