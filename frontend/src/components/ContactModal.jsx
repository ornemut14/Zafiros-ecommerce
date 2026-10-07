const INSTAGRAM_USER = 'zafiros_joyass';
const PHONES = ['2644362739', '2644810270'];

// Mismo criterio de armado de número que usa el checkout: código de país 54 + 9 + número
function toWhatsappLink(phone) {
  return `https://wa.me/549${phone}`;
}

export default function ContactModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <span className="section-eyebrow">Zafiros</span>
        <h2>Contacto</h2>
        <div className="modal-sub">Estamos para ayudarte a elegir tu próxima pieza.</div>

        <label>Instagram</label>
        <a
          className="contact-link"
          href={`https://instagram.com/${INSTAGRAM_USER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
          </svg>
          @{INSTAGRAM_USER}
        </a>

        <label>WhatsApp</label>
        {PHONES.map((phone) => (
          <a
            key={phone}
            className="contact-link"
            href={toWhatsappLink(phone)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.2-.7.3-.9.9-1.1 2.2-.2 3.9a12 12 0 0 0 4.5 4.2c1.7.8 2.4.9 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.1z" />
            </svg>
            {phone}
          </a>
        ))}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
