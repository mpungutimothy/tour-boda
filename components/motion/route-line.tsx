/**
 * Schematic route line: Entebbe → Kampala → Jinja.
 *
 * Deliberately a diagram, not a map — the three points show relative position
 * (Entebbe on the lake to the south-west, Jinja east) and nothing more. The
 * path draws itself on load and each stop carries a soft ping, reinforcing
 * "we know every road".
 *
 * Server component: the motion is pure CSS, and reduced-motion resolves it to
 * the fully-drawn state.
 */
const STOPS = [
  { id: "entebbe", name: "Entebbe", note: "Lake Victoria", x: 74, y: 212, anchor: "start" },
  { id: "kampala", name: "Kampala", note: "Capital", x: 208, y: 148, anchor: "middle" },
  { id: "jinja", name: "Jinja", note: "Source of the Nile", x: 376, y: 84, anchor: "end" },
] as const;

const ROUTE_PATH =
  "M 74 212 C 128 196, 162 168, 208 148 S 322 104, 376 84";

export function RouteLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 280"
      role="img"
      aria-labelledby="route-line-title route-line-desc"
      className={className}
      fill="none"
    >
      <title id="route-line-title">
        Route diagram: Entebbe, Kampala and Jinja
      </title>
      <desc id="route-line-desc">
        A schematic line linking the three regions Tour-Boda operates in:
        Entebbe on Lake Victoria in the south-west, Kampala in the centre, and
        Jinja to the east.
      </desc>

      {/* Lake Victoria — a hint of shoreline, not a geography lesson. */}
      <path
        d="M -10 232 C 60 208, 118 236, 150 262 C 96 282, 30 286, -10 274 Z"
        fill="hsl(var(--primary) / 0.055)"
      />

      {/* Faint terrain contours behind the route. */}
      <g stroke="hsl(var(--grid))" strokeWidth="1" opacity="0.9">
        <path d="M 16 60 C 120 34, 300 30, 424 62" />
        <path d="M 8 96 C 116 68, 306 62, 432 96" />
        <path d="M 22 132 C 128 106, 312 100, 420 130" />
      </g>

      {/* The route itself, drawing in on load. */}
      <path
        d={ROUTE_PATH}
        pathLength={1}
        strokeDasharray={1}
        className="animate-route-draw"
        stroke="hsl(var(--primary) / 0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {STOPS.map((stop, i) => (
        <g key={stop.id}>
          {/* Ping ring. */}
          <circle
            cx={stop.x}
            cy={stop.y}
            r={5}
            className="animate-ping-soft"
            style={{ animationDelay: `${i * 420}ms`, transformOrigin: `${stop.x}px ${stop.y}px` }}
            fill="hsl(var(--primary) / 0.35)"
          />
          {/* Node. */}
          <circle cx={stop.x} cy={stop.y} r={4} fill="hsl(var(--primary))" />
          <circle
            cx={stop.x}
            cy={stop.y}
            r={8}
            stroke="hsl(var(--primary) / 0.35)"
            strokeWidth="1"
          />

          <text
            x={stop.x}
            y={stop.y - 18}
            textAnchor={stop.anchor}
            fill="hsl(var(--foreground))"
            fontFamily="var(--font-space), system-ui, sans-serif"
            fontSize="13"
            fontWeight="600"
            letterSpacing="-0.01em"
          >
            {stop.name}
          </text>
          <text
            x={stop.x}
            y={stop.y - 6}
            textAnchor={stop.anchor}
            fill="hsl(var(--muted-foreground))"
            fontFamily="var(--font-jetbrains), ui-monospace, monospace"
            fontSize="8.5"
            letterSpacing="0.14em"
          >
            {stop.note.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
