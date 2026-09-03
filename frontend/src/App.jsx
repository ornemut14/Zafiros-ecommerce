import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import StorePage from './pages/StorePage';
import AdminPage from './pages/AdminPage';
import LoginModal from './components/LoginModal';
import ContactModal from './components/ContactModal';

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function AppInner() {
  const { isAdmin, logout } = useAuth();
  const [view, setView] = useState('store'); // 'store' | 'admin'
  const [showLogin, setShowLogin] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function goToId(id) {
    setView('store');
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  return (
    <>
      <header id="inicio">
        <h1>Joyería <span>Zafiros</span></h1>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAdmin ? (
            <button className="btn" onClick={logout}>Cerrar sesión</button>
          ) : (
            <button className="btn" onClick={() => setShowLogin(true)}>Iniciar sesión</button>
          )}
        </div>
      </header>

      <nav className="site-nav">
        <button className="nav-link" onClick={() => goToId('inicio')}>Inicio</button>
        <button className="nav-link" onClick={() => goToId('productos')}>Productos</button>
        <button className="nav-link" onClick={() => setShowContact(true)}>Contacto</button>
      </nav>

      {isAdmin && (
        <div className="admin-bar">
          <span>Modo administrador activo</span>
          <button className="btn small" onClick={() => setView(view === 'store' ? 'admin' : 'store')}>
            {view === 'store' ? 'Ver panel de productos' : 'Ver tienda'}
          </button>
        </div>
      )}

      {view === 'admin' && isAdmin ? <AdminPage /> : <StorePage />}

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
