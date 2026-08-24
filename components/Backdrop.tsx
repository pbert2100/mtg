/**
 * Fundo 100% declarativo: gradientes CSS + um SVG estático, sem animação.
 * As órbitas já foram animadas (uma volta a cada 4 minutos), mas isso mantinha o
 * compositor do navegador acordado em todo quadro para um movimento imperceptível.
 */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nebulosa */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #3E3E85 0%, #3a2555 38%, #1E1436 68%, #120C22 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 40% at 78% 12%, rgba(48,52,106,0.85) 0%, transparent 70%), radial-gradient(50% 40% at 12% 28%, rgba(98,89,116,0.45) 0%, transparent 70%)",
        }}
      />

      {/* Estrelas */}
      <div className="starfield absolute inset-0 opacity-60" />

      {/* Linhas orbitais douradas */}
      <svg
        className="absolute top-[-18vw] left-1/2 h-[86vw] w-[86vw] -translate-x-1/2 text-gold"
        viewBox="0 0 800 800"
        fill="none"
      >
        <g opacity="0.34">
          <circle cx="400" cy="400" r="238" stroke="currentColor" strokeWidth="0.8" />
          <circle
            cx="400"
            cy="400"
            r="286"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeDasharray="2 9"
          />
          <circle cx="400" cy="400" r="335" stroke="currentColor" strokeWidth="0.6" opacity="0.7" />
          <circle cx="400" cy="162" r="4.5" fill="currentColor" opacity="0.8" />
          <circle cx="638" cy="400" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="252" cy="608" r="3.5" fill="currentColor" opacity="0.5" />
        </g>
        <g opacity="0.28">
          <ellipse
            cx="400"
            cy="400"
            rx="380"
            ry="180"
            stroke="currentColor"
            strokeWidth="0.7"
            transform="rotate(18 400 400)"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="380"
            ry="180"
            stroke="currentColor"
            strokeWidth="0.7"
            transform="rotate(-42 400 400)"
          />
          <ellipse
            cx="400"
            cy="400"
            rx="340"
            ry="120"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="3 10"
            transform="rotate(76 400 400)"
          />
        </g>
        <g opacity="0.22">
          <circle cx="400" cy="400" r="120" stroke="currentColor" strokeWidth="0.9" />
          <path d="M400 250 L420 380 L400 400 L380 380 Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M400 550 L420 420 L400 400 L380 420 Z" stroke="currentColor" strokeWidth="0.9" />
        </g>
      </svg>

      {/* Vinheta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 65% at 50% 40%, transparent 40%, rgba(10,6,20,0.55) 100%)",
        }}
      />
    </div>
  );
}
