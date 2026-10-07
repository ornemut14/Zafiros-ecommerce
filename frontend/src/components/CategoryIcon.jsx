// Iconos finos estilo Zafiros, compartidos entre tienda y panel admin.
// Las categorías son dinámicas: se elige icono por palabra clave.

function Base({ children, className, filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SparkleIcon({ className }) {
  return (
    <Base className={className}>
      <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z" />
    </Base>
  );
}

export function RingIcon({ className }) {
  return (
    <Base className={className}>
      <circle cx="12" cy="15" r="5.2" />
      <path d="M9.4 10.6 12 7l2.6 3.6L12 12.2z" />
    </Base>
  );
}

export function HoopIcon({ className }) {
  return (
    <Base className={className}>
      <ellipse cx="12" cy="12.5" rx="5.5" ry="7" />
      <circle cx="12" cy="5" r="1.1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function NecklaceIcon({ className }) {
  return (
    <Base className={className}>
      <path d="M4 3.5c0 6.5 3.6 11.5 8 11.5s8-5 8-11.5" />
      <circle cx="12" cy="15" r="1.6" />
    </Base>
  );
}

export function BraceletIcon({ className }) {
  return (
    <Base className={className}>
      <circle cx="12" cy="11" r="6.5" />
      <circle cx="12" cy="18.6" r="1.5" />
    </Base>
  );
}

export function PendantIcon({ className }) {
  return (
    <Base className={className}>
      <circle cx="12" cy="5" r="1.7" />
      <path d="M12 6.7c2.8 3.6 4.5 6.4 4.5 9a4.5 4.5 0 0 1-9 0c0-2.6 1.7-5.4 4.5-9z" />
    </Base>
  );
}

export function StackIcon({ className }) {
  return (
    <Base className={className}>
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </Base>
  );
}

export function GemIcon({ className }) {
  return (
    <Base className={className}>
      <path d="M7 4h10l3.5 5L12 20 3.5 9z" />
      <path d="M3.5 9h17M12 20L8.5 9 12 4l3.5 5z" />
    </Base>
  );
}

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// Icono según tipo de joya (para categorías).
export function CategoryIcon({ name, className }) {
  const n = normalize(name);
  if (n.includes('anillo')) return <RingIcon className={className} />;
  if (n.includes('aro') || n.includes('argolla')) return <HoopIcon className={className} />;
  if (n.includes('caden') || n.includes('cadena') || n.includes('collar') || n.includes('gargantilla')) return <NecklaceIcon className={className} />;
  if (n.includes('pulsera') || n.includes('brazalete') || n.includes('tobillera') || n.includes('esclava')) return <BraceletIcon className={className} />;
  if (n.includes('dije')) return <PendantIcon className={className} />;
  if (n.includes('set') || n.includes('combo') || n.includes('pack')) return <StackIcon className={className} />;
  return <SparkleIcon className={className} />;
}

// Icono para materiales (gema neutra de la marca).
export function MaterialIcon({ className }) {
  return <GemIcon className={className} />;
}
