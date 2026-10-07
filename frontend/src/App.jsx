import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import LoginModal from './components/LoginModal';
import ContactModal from './components/ContactModal';

function AppInner() {
  const { isAdmin, logout } = useAuth();
  const [view, setView] = useState('store'); // 'store' | 'admin'
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [storeHomeSignal, setStoreHomeSignal] = useState(0);

  // El admin entra directo al panel (la landing es solo para clientes).
  // El cambio manual con el botón se respeta hasta el próximo login/logout.
  useEffect(() => {
    setView(isAdmin ? 'admin' : 'store');
  }, [isAdmin]);

  function goToId(id) {
    setView('store');
    setMenuOpen(false);
    // Si estamos en catálogo completo o detalle, StorePage debe cerrarlos
    // para que los anchors vuelvan a existir. Se avisa por señal.
    setStoreHomeSignal((n) => n + 1);
    // Esperar al re-render antes de scrollear, con fallback arriba del todo.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (id === 'inicio') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Si la sección aún no existe (catálogo cerrándose), reintentar una vez.
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }, 80);
  }

  function openContact() {
    setMenuOpen(false);
    setShowContact(true);
  }

  return (
    <>
      <div className="topbar">
        <span>Envíos a todo el país<em>·</em>Compra segura<em>·</em>Zafiros</span>
      </div>

      <header className="site-header" id="inicio">
        <div className="site-header-inner">
          <div className="site-header-left">
            <button
              className="icon-btn mobile-nav-row"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
              style={{ fontSize: 20 }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
            <button
              className="icon-btn"
              onClick={() => goToId('productos')}
              title="Buscar"
              aria-label="Buscar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </div>

          <h1 className="brand-logo" onClick={() => goToId('inicio')}>
            ZAFIROS
            <small>JOYAS</small>
          </h1>

          <div className="site-header-right">
            {isAdmin ? (
              <button className="icon-btn" onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
                </svg>
              </button>
            ) : (
              <button className="icon-btn" onClick={() => setShowLogin(true)} title="Iniciar sesión" aria-label="Iniciar sesión">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <nav className={`site-nav${menuOpen ? ' mobile-open' : ''}`}>
          <button className="nav-link" onClick={() => goToId('inicio')}>Inicio</button>
          <button className="nav-link" onClick={() => goToId('coleccion')}>Colección</button>
          <button className="nav-link" onClick={() => goToId('productos')}>Productos</button>
          <button className="nav-link" onClick={() => goToId('nosotros')}>Nosotros</button>
          <button className="nav-link" onClick={openContact}>Contacto</button>
        </nav>
      </header>

      {isAdmin && (
        <div className="admin-bar">
          <span>Modo administrador activo</span>
          <button className="btn small" onClick={() => setView(view === 'store' ? 'admin' : 'store')}>
            {view === 'store' ? 'Ver panel de productos' : 'Ver tienda'}
          </button>
        </div>
      )}

      {view === 'admin' && isAdmin ? <AdminPage /> : <StorePage onContact={openContact} homeSignal={storeHomeSignal} />}

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>ZAFIROS</h3>
            <p>Joyas pensadas para acompañarte. Detalles que hacen especial lo cotidiano.</p>
            <button className="btn small" onClick={openContact}>Contactanos</button>
          </div>
          <div>
            <h4>Navegación</h4>
            <ul>
              <li><button onClick={() => goToId('inicio')}>Inicio</button></li>
              <li><button onClick={() => goToId('coleccion')}>Colección</button></li>
              <li><button onClick={() => goToId('productos')}>Productos</button></li>
              <li><button onClick={() => goToId('nosotros')}>Nosotros</button></li>
            </ul>
          </div>
          <div>
            <h4>Seguinos</h4>
            <ul>
              <li>
                <a href="https://instagram.com/zafiros_joyass" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li><button onClick={openContact}>WhatsApp</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Zafiros Joyas — Todos los derechos reservados.</span>
          <span>
            Desarrollado por{' '}
            <a
              href="https://www.linkedin.com/in/ornella-mut-04757a274"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Ornella Mut
            </a>
          </span>
        </div>
      </footer>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
