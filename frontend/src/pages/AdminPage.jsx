import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProductModal from '../components/ProductModal';
import CategoryModal from '../components/CategoryModal';
import HomeIcon from '../icons/home.svg?react';
import SettingsIcon from '../icons/settings.svg?react';
import BoxIcon from '../icons/box.svg?react';
import ProductsIcon from '../icons/products.svg?react';
import PlusIcon from '../icons/plus.svg?react';
import { CategoryIcon, GemIcon, MaterialIcon, StackIcon } from '../components/CategoryIcon';

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [products, setProducts] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [discountProductId, setDiscountProductId] = useState('');
  const [discountQty, setDiscountQty] = useState('');
  const [discounting, setDiscounting] = useState(false);
  const [discountMsg, setDiscountMsg] = useState('');
  const [discountErr, setDiscountErr] = useState('');
  const [discountSearch, setDiscountSearch] = useState('');
  const [showDiscountDropdown, setShowDiscountDropdown] = useState(false);

  const [savingConfig, setSavingConfig] = useState(false);
  const [configMsg, setConfigMsg] = useState('');
  const [configErr, setConfigErr] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  const [activeSection, setActiveSection] = useState('home');
  const [productSearch, setProductSearch] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCatId, setDeletingCatId] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deletingMatId, setDeletingMatId] = useState(null);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [cats, prods, cfg] = await Promise.all([
        api.getCategories(),
        api.getAllProducts(),
        api.getConfig(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setWhatsappNumber(cfg.whatsapp_number || '');
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

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    setDeletingId(id);
    try {
      await api.deleteProduct(id);
      await loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveCategory(name) {
    if (editingCategory) {
      await api.updateCategory(editingCategory.id, name);
    } else {
      await api.createCategory(name);
    }
    await loadAll();
  }

  async function handleDeleteCategory(id) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    setDeletingCatId(id);
    try {
      await api.deleteCategory(id);
      await loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingCatId(null);
    }
  }

  async function handleSaveMaterial(name) {
    if (editingMaterial) {
      await api.updateMaterial(editingMaterial.id, name);
    } else {
      await api.createMaterial(name);
    }
    await loadAll();
  }

  async function handleDeleteMaterial(id) {
    if (!confirm('¿Eliminar este material? Los productos que lo usen quedarán sin material asignado.')) return;
    setDeletingMatId(id);
    try {
      await api.deleteMaterial(id);
      await loadAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingMatId(null);
    }
  }

  // Alta rápida de material desde el modal de producto: crea y devuelve
  // el material para seleccionarlo al instante.
  async function handleQuickAddMaterial(name) {
    const created = await api.createMaterial(name);
    setMaterials((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }

  async function handleSaveConfig() {
    setSavingConfig(true);
    setConfigErr('');
    setConfigMsg('');
    try {
      await api.updateConfig(whatsappNumber);
      setConfigMsg('Número de WhatsApp guardado.');
    } catch (err) {
      setConfigErr(err.message);
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleDiscount() {
    setDiscountErr('');
    setDiscountMsg('');
    if (!discountProductId) {
      setDiscountErr('Seleccioná un producto.');
      return;
    }
    const product = products.find((p) => String(p.id) === String(discountProductId));
    const qty = Number(discountQty);
    if (discountQty === '' || Number.isNaN(qty)) {
      setDiscountErr('Ingresá una cantidad válida.');
      return;
    }
    if (!Number.isInteger(qty)) {
      setDiscountErr('La cantidad debe ser un número entero.');
      return;
    }
    if (qty <= 0) {
      setDiscountErr('La cantidad debe ser mayor a 0.');
      return;
    }
    if (product && qty > Number(product.stock)) {
      setDiscountErr(`No podés descontar más de ${product.stock} unidades (stock actual).`);
      return;
    }

    setDiscounting(true);
    try {
      await api.discountStock(product.id, qty);
      setDiscountMsg(`Stock descontado correctamente (${qty} unidad/es de "${product.name}").`);
      setDiscountQty('');
      setDiscountSearch('');
      setDiscountProductId('');
      await loadAll();
    } catch (err) {
      setDiscountErr(err.message);
    } finally {
      setDiscounting(false);
    }
  }

  const selectedProduct = products.find((p) => String(p.id) === String(discountProductId));

  const filteredDiscountProducts = products.filter((p) =>
    p.name.toLowerCase().includes(discountSearch.toLowerCase())
  );

  function handleDiscountProductSelect(product) {
    setDiscountProductId(String(product.id));
    setDiscountSearch(product.name);
    setShowDiscountDropdown(false);
  }

  const q = productSearch.trim().toLowerCase();
  const filteredProducts = products.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.category_name || '').toLowerCase().includes(q) ||
      (p.material_name || '').toLowerCase().includes(q)
  );

  const dashboardItems = [
    {
      id: 'config',
      icon: <SettingsIcon className="dash-icon" />,
      title: 'Configuración de tienda',
      desc: 'Número de WhatsApp',
    },
    {
      id: 'stock',
      icon: <BoxIcon className="dash-icon" />,
      title: 'Descontar stock',
      desc: 'Restar unidades de un producto',
    },
    {
      id: 'productos',
      icon: <ProductsIcon className="dash-icon" />,
      title: 'Cargar productos',
      desc: 'Agregar y editar productos',
    },
    {
      id: 'categorias',
      icon: <StackIcon className="dash-icon" />,
      title: 'Categorías',
      desc: 'Editar y eliminar categorías',
    },
    {
      id: 'materiales',
      icon: <GemIcon className="dash-icon" />,
      title: 'Materiales',
      desc: 'Editar y eliminar materiales',
    },
  ];

  return (
    <main>
      <div className="admin-nav">
        <button
          className={`admin-nav-link${activeSection === 'home' ? ' active' : ''}`}
          onClick={() => setActiveSection('home')}
        >
          <HomeIcon className="nav-icon" /> Panel
        </button>
        <button
          className={`admin-nav-link${activeSection === 'config' ? ' active' : ''}`}
          onClick={() => setActiveSection('config')}
        >
          <SettingsIcon className="nav-icon" /> Configuración
        </button>
        <button
          className={`admin-nav-link${activeSection === 'stock' ? ' active' : ''}`}
          onClick={() => setActiveSection('stock')}
        >
          <BoxIcon className="nav-icon" /> Descontar stock
        </button>
        <button
          className={`admin-nav-link${activeSection === 'productos' ? ' active' : ''}`}
          onClick={() => setActiveSection('productos')}
        >
          <ProductsIcon className="nav-icon" /> Productos
        </button>
        <button
          className={`admin-nav-link${activeSection === 'categorias' ? ' active' : ''}`}
          onClick={() => setActiveSection('categorias')}
        >
          <ProductsIcon className="nav-icon" /> Categorías
        </button>
        <button
          className={`admin-nav-link${activeSection === 'materiales' ? ' active' : ''}`}
          onClick={() => setActiveSection('materiales')}
        >
          <GemIcon className="nav-icon" /> Materiales
        </button>
      </div>

      {activeSection === 'home' && (
        <div className="dashboard">
          <div className="dashboard-grid">
            {dashboardItems.map((item) => (
              <button
                key={item.id}
                className="dashboard-card"
                onClick={() => setActiveSection(item.id)}
              >
                <span className="dashboard-card-icon">{item.icon}</span>
                <span className="dashboard-card-title">{item.title}</span>
                <span className="dashboard-card-desc">{item.desc}</span>
              </button>
            ))}
            <button
              className="dashboard-card"
              onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
            >
              <span className="dashboard-card-icon"><PlusIcon className="dash-icon" /></span>
              <span className="dashboard-card-title">Nuevo producto</span>
              <span className="dashboard-card-desc">Cargar un producto desde cero</span>
            </button>
          </div>
        </div>
      )}

      {activeSection === 'config' && (
      <div className="admin-section">
        <h3>Configuración de la tienda</h3>
        <label>Número de WhatsApp (con código de país, sin +)</label>
        <input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="5491122334455"
        />
        <button className="btn solid" style={{ marginTop: 10 }} onClick={handleSaveConfig} disabled={savingConfig}>
          {savingConfig ? 'Guardando...' : 'Guardar'}
        </button>
        {configMsg && <div className="ok-text">{configMsg}</div>}
        {configErr && <div className="error-text">{configErr}</div>}
      </div>
      )}

      {activeSection === 'stock' && (
      <div className="admin-section">
        <h3>Descontar stock</h3>
        <label>Producto</label>
        <div className="autocomplete-wrapper">
          <input
            type="text"
            value={discountSearch}
            onChange={(e) => {
              setDiscountSearch(e.target.value);
              setDiscountProductId('');
              setShowDiscountDropdown(true);
            }}
            onFocus={() => setShowDiscountDropdown(true)}
            onBlur={() => setTimeout(() => setShowDiscountDropdown(false), 200)}
            placeholder="Buscar producto..."
          />
          {showDiscountDropdown && discountSearch && !discountProductId && (
            <div className="autocomplete-dropdown">
              {filteredDiscountProducts.length === 0 ? (
                <div className="autocomplete-empty">No se encontraron productos</div>
              ) : (
                filteredDiscountProducts.map((p) => (
                  <div
                    key={p.id}
                    className="autocomplete-item"
                    onMouseDown={() => handleDiscountProductSelect(p)}
                  >
                    <span className="autocomplete-item-name">{p.name}</span>
                    <span className="autocomplete-item-stock">{p.stock} en stock</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <label>Unidades a descontar</label>
        <input
          type="number"
          value={discountQty}
          onChange={(e) => setDiscountQty(e.target.value)}
          placeholder={selectedProduct ? `Máximo ${selectedProduct.stock}` : 'Ej: 2'}
          min={1}
        />
        <button
          className="btn solid"
          style={{ marginTop: 10 }}
          onClick={handleDiscount}
          disabled={discounting}
        >
          {discounting ? 'Descontando...' : 'Descontar stock'}
        </button>
        {discountMsg && <div className="ok-text">{discountMsg}</div>}
        {discountErr && <div className="error-text">{discountErr}</div>}
      </div>
      )}

      {activeSection === 'productos' && (
        <>
      <div className="admin-section">
        <h3>Cargar producto</h3>
        <button
          className="btn solid"
          onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
        >
          + Nuevo producto
        </button>
      </div>

      <div className="admin-section">
        <h3>Productos ({filteredProducts.length} de {products.length})</h3>
        <div className="admin-search">
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Buscar producto por nombre o categoría..."
          />
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
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th><th>Categoría</th><th>Material</th><th>Precio</th><th>Stock</th><th>Estado</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr><td colSpan="6" className="empty" style={{ border: 'none' }}>No se encontraron productos.</td></tr>
                )}
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="admin-thumb" />
                      ) : (
                        <span>{p.icon}</span>
                      )}{' '}
                      {p.name}
                    </td>
                    <td>
                      <CategoryIcon name={p.category_name} className="table-glyph" />
                      {p.category_name}
                    </td>
                    <td>
                      {p.material_name ? (
                        <>
                          <MaterialIcon className="table-glyph" />
                          {p.material_name}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>${Number(p.price).toLocaleString('es-AR')}</td>
                    <td>{p.stock}</td>
                    <td>{p.stock <= 0 ? <span className="tag-nostock">Sin stock</span> : 'Visible'}</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => { setEditingProduct(p); setShowProductModal(true); }}
                      >
                        Editar
                      </button>{' '}
                      <button
                        className="btn small danger"
                        disabled={deletingId === p.id}
                        onClick={() => handleDelete(p.id)}
                      >
                        {deletingId === p.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}

      {activeSection === 'categorias' && (
      <div className="admin-section">
        <h3>Categorías ({categories.length})</h3>
        <button
          className="btn solid"
          onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
        >
          + Nueva categoría
        </button>

        {loading ? (
          <div className="empty">Cargando categorías...</div>
        ) : error ? (
          <div className="empty">
            <div>{error}</div>
            <button className="btn solid" style={{ marginTop: 12 }} onClick={loadAll}>
              Reintentar
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty">Todavía no hay categorías.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th><th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <CategoryIcon name={c.name} className="table-glyph" />
                      {c.name}
                    </td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => { setEditingCategory(c); setShowCategoryModal(true); }}
                      >
                        Editar
                      </button>{' '}
                      <button
                        className="btn small danger"
                        disabled={deletingCatId === c.id}
                        onClick={() => handleDeleteCategory(c.id)}
                      >
                        {deletingCatId === c.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleSaveCategory}
        />
      )}

      {activeSection === 'materiales' && (
      <div className="admin-section">
        <h3>Materiales ({materials.length})</h3>
        <button
          className="btn solid"
          onClick={() => { setEditingMaterial(null); setShowMaterialModal(true); }}
        >
          + Nuevo material
        </button>

        {loading ? (
          <div className="empty">Cargando materiales...</div>
        ) : error ? (
          <div className="empty">
            <div>{error}</div>
            <button className="btn solid" style={{ marginTop: 12 }} onClick={loadAll}>
              Reintentar
            </button>
          </div>
        ) : materials.length === 0 ? (
          <div className="empty">Todavía no hay materiales. Si ves este mensaje, ejecutá la migración de materiales en la base de datos.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Material</th><th></th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <MaterialIcon className="table-glyph" />
                      {m.name}
                    </td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => { setEditingMaterial(m); setShowMaterialModal(true); }}
                      >
                        Editar
                      </button>{' '}
                      <button
                        className="btn small danger"
                        disabled={deletingMatId === m.id}
                        onClick={() => handleDeleteMaterial(m.id)}
                      >
                        {deletingMatId === m.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {showMaterialModal && (
        <CategoryModal
          category={editingMaterial}
          onClose={() => setShowMaterialModal(false)}
          onSave={handleSaveMaterial}
          createTitle="Nuevo material"
          editTitle="Editar material"
          placeholder="Ej: Plata 925"
        />
      )}

      {showProductModal && (
        <ProductModal
          categories={categories}
          materials={materials}
          product={editingProduct}
          onClose={() => setShowProductModal(false)}
          onAddMaterial={handleQuickAddMaterial}
          onSave={async (payload) => {
            if (editingProduct) {
              await api.updateProduct(editingProduct.id, payload);
            } else {
              await api.createProduct(payload);
            }
            await loadAll();
          }}
        />
      )}
    </main>
  );
}
