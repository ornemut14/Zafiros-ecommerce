import { useEffect, useState } from 'react';
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
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  const visible = products.filter(
    (p) => active === 'Todas' || p.category_name === active
  );

  function handleAdd(product) {
    add(product.id, Number(product.stock));
  }

  function goToCatalog() {
    setActive('Todas');
    requestAnimationFrame(() => {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function goToCategory(name) {
    setActive(name);
    requestAnimationFrame(() => {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
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
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <>
          <Hero
            categories={categories}
            products={products}
            onVerProductos={goToCatalog}
            onSelectCategory={goToCategory}
            onAdd={handleAdd}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
          <CategoryTabs
            categories={categories}
            active={active}
            onSelect={setActive}
            isAdmin={isAdmin}
            onAddCategory={() => setShowCategoryModal(true)}
          />
          <main id="productos">
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
                    onSelect={(prod) => setSelectedProduct(prod)}
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
