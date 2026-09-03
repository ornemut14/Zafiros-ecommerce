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
        <h2>Contacto</h2>

        <label>Instagram</label>
        <a
          className="contact-link"
          href={`https://instagram.com/${INSTAGRAM_USER}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📷 @{INSTAGRAM_USER}
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
            💬 {phone}
          </a>
        ))}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
