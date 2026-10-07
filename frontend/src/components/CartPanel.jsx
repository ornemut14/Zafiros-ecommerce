import { useCart } from '../context/CartContext';

export default function CartPanel({ products, whatsappNumber, onClose, onCheckoutSuccess }) {
  const { items, changeQty, clear } = useCart();
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
        {lines.length === 0 && <div className="empty">Tu carrito está vacío.</div>}
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
