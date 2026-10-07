import { useCart } from '../context/CartContext';

export default function CartPanel({ products, whatsappNumber, onClose, onCheckoutSuccess }) {
  const { items, changeQty, remove, clear } = useCart();
  const ids = Object.keys(items);

  const lines = ids
    .map((id) => products.find((p) => String(p.id) === String(id)))
    .filter(Boolean);

  const total = lines.reduce((sum, p) => sum + Number(p.price) * items[p.id], 0);

  function checkout() {
    if (ids.length === 0) return;
    if (!whatsappNumber) {
      alert('Falta configurar el número de WhatsApp de la tienda.');
      return;
    }

    // Nota: el stock NO se descuenta acá. El administrador lo descuenta manualmente
    // desde el panel una vez que confirma el pago, tal como lo pediste.
    const msgLines = ['Hola! Quiero comprar:'];
    lines.forEach((p) => {
      const subtotal = Number(p.price) * items[p.id];
      msgLines.push(`- ${p.name} x${items[p.id]} ($${subtotal.toLocaleString('es-AR')})`);
    });
    msgLines.push(`Total: $${total.toLocaleString('es-AR')}`);

    const msg = encodeURIComponent(msgLines.join('\n'));
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');

    clear();
    onCheckoutSuccess?.();
  }

  return (
    <div className="panel-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        <h2>Tu carrito</h2>
        <div className="panel-sub">
          {lines.length === 0
            ? 'Piezas elegidas con calma.'
            : `${lines.length} ${lines.length === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'}`}
        </div>
        {lines.length === 0 && (
          <div className="empty" style={{ marginTop: 8 }}>
            <div className="empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h15l-1.5 9h-12z" />
                <path d="M6 7l-1-4H2" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
              </svg>
            </div>
            <h3 className="empty-title">Tu carrito está vacío</h3>
            <div className="empty-divider" />
            <p className="empty-text">Elegí con calma esas piezas que se sientan tuyas.</p>
          </div>
        )}
        {lines.map((p) => (
          <div className="cart-item" key={p.id}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {p.image_url && (
                <img className="cart-item-thumb" src={p.image_url} alt={p.name} />
              )}
              <div>
                <div className="cart-item-name">{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  ${Number(p.price).toLocaleString('es-AR')} c/u
                </div>
              </div>
            </div>
            <div className="qty-ctrl">
              <button onClick={() => changeQty(p.id, -1, p.stock)} aria-label="Quitar uno">−</button>
              <span>{items[p.id]}</span>
              <button
                onClick={() => changeQty(p.id, 1, p.stock)}
                disabled={items[p.id] >= Number(p.stock)}
                aria-label="Agregar uno"
              >
                +
              </button>
              <button
                className="cart-remove"
                onClick={() => remove(p.id)}
                aria-label={`Eliminar ${p.name} del carrito`}
                title="Eliminar del carrito"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <div className="total-row">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
        <button className="btn solid block" onClick={checkout}>
          Finalizar compra por WhatsApp
        </button>
        <button className="btn block" style={{ marginTop: 10 }} onClick={onClose}>
          Seguir explorando
        </button>
      </div>
    </div>
  );
}
