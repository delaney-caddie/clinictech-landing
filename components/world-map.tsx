// World map with clinic pins. The base is a static SVG served from /public;
// pins are positioned as percentages of the image so they stay put at any
// width. Pin placement is illustrative of where Caddie clinics operate, not
// a list of customer addresses.
//
// size: 1 = single practitioner, 2 = multi-provider clinic, 3 = multi-location network
const pins: { x: number; y: number; size: 1 | 2 | 3; label?: string; side?: "left" }[] = [
  // North America
  { x: 14, y: 37, size: 3, label: "Los Angeles" },
  { x: 13, y: 28, size: 1 },
  { x: 20, y: 39, size: 2 },
  { x: 25.5, y: 41, size: 2, label: "Miami" },
  { x: 27, y: 33, size: 2 },
  { x: 26, y: 31, size: 1 },
  // Mexico & Central America
  { x: 18, y: 45, size: 2 },
  { x: 19, y: 46.5, size: 3, label: "Mexico City" },
  { x: 22, y: 45, size: 1 },
  { x: 22.5, y: 50, size: 1 },
  { x: 23.5, y: 51.5, size: 1 },
  // South America
  { x: 25, y: 52.5, size: 1 },
  { x: 25.5, y: 54, size: 3, label: "Bogotá" },
  { x: 33, y: 68, size: 2 },
  { x: 30.5, y: 75, size: 1 },
  // Europe
  { x: 46.5, y: 26, size: 2, label: "London", side: "left" },
  { x: 45.5, y: 33, size: 1 },
  { x: 47, y: 32, size: 1 },
  { x: 50.5, y: 26, size: 1 },
  { x: 49, y: 30, size: 1 },
  { x: 55.5, y: 34, size: 2 },
  // Middle East & Africa
  { x: 62, y: 42, size: 3, label: "Dubai" },
  { x: 59, y: 42, size: 1 },
  { x: 55, y: 71, size: 1 },
  // Asia
  { x: 66, y: 46, size: 2 },
  { x: 74, y: 48, size: 2, label: "Bangkok", side: "left" },
  { x: 74.5, y: 53, size: 1 },
  { x: 79, y: 48, size: 1 },
  { x: 81, y: 34, size: 1 },
  { x: 84.5, y: 36, size: 2 },
  // Oceania
  { x: 87.5, y: 76, size: 3, label: "Sydney" },
];

export function WorldMap() {
  return (
    <div className="wmap" aria-label="Regenerative clinics running on Caddie around the world" role="img">
      <style>{`
.wmap {
  position: relative; width: 100%; aspect-ratio: 1.78 / 1; overflow: hidden;
  border-radius: var(--r-xl); border: 1px solid var(--line);
  background:
    radial-gradient(900px 500px at 50% 0, #355cff12, #0000 62%),
    linear-gradient(180deg, #f7f9ff 0%, #eef2ff 100%);
  box-shadow: var(--shadow-sm);
}
/* The inner box has the SVG's own aspect ratio, so pin percentages map onto
   the image; the outer box crops Antarctica off the bottom. */
.wmap-inner { position: absolute; left: 0; top: 0; width: 100%; aspect-ratio: 950 / 620; }
.wmap-img { position: absolute; inset: 0; width: 100%; height: 100%; display: block; pointer-events: none; user-select: none; }
.wmap-pin { position: absolute; transform: translate(-50%, -50%); }
.wmap-dot {
  display: block; border-radius: 999px; background: var(--blue);
  border: 2px solid #fff; box-shadow: 0 2px 8px #2447e04d;
}
.wmap-pin.s1 .wmap-dot { width: 10px; height: 10px; }
.wmap-pin.s2 .wmap-dot { width: 14px; height: 14px; }
.wmap-pin.s3 .wmap-dot { width: 18px; height: 18px; background: #2447e0; }
.wmap-ring {
  position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
  width: 18px; height: 18px; border-radius: 999px; border: 2px solid var(--blue);
  opacity: 0; animation: wmap-pulse 2.8s ease-out infinite;
}
.wmap-pin.s3 .wmap-ring { animation-duration: 2.2s; }
.wmap-pin.s1 .wmap-ring { display: none; }
@keyframes wmap-pulse {
  0% { transform: translate(-50%, -50%) scale(.6); opacity: .8; }
  100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
}
.wmap-label {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
}
.wmap-label.left { left: auto; right: 14px; }
.wmap-label {
  white-space: nowrap; font-size: .74rem; font-weight: 650; color: var(--blue-ink);
  background: #ffffffe6; border: 1px solid #dde6f8; border-radius: 999px; padding: 3px 9px;
  box-shadow: var(--shadow-xs);
}
.wmap-legend {
  position: absolute; left: 18px; bottom: 16px; display: flex; flex-wrap: wrap; gap: 8px 18px;
  background: #ffffffd9; border: 1px solid var(--line); border-radius: 999px;
  padding: 9px 16px; font-size: .78rem; font-weight: 560; color: var(--ink-soft);
  backdrop-filter: blur(6px);
}
.wmap-legend span { display: inline-flex; align-items: center; gap: 7px; }
.wmap-legend i { display: inline-block; border-radius: 999px; background: var(--blue); border: 1.5px solid #fff; box-shadow: 0 0 0 1px #2447e033; }
.wmap-legend i.a { width: 8px; height: 8px; }
.wmap-legend i.b { width: 11px; height: 11px; }
.wmap-legend i.c { width: 14px; height: 14px; background: #2447e0; }
@media (prefers-reduced-motion: reduce) { .wmap-ring { animation: none; } }
@media (max-width: 720px) {
  .wmap { aspect-ratio: 1.6 / 1; border-radius: var(--r-lg); }
  .wmap-label { display: none; }
  .wmap-legend { left: 10px; bottom: 10px; padding: 7px 12px; font-size: .7rem; gap: 6px 12px; }
  .wmap-pin.s1 .wmap-dot { width: 7px; height: 7px; }
  .wmap-pin.s2 .wmap-dot { width: 10px; height: 10px; }
  .wmap-pin.s3 .wmap-dot { width: 13px; height: 13px; }
}
      `}</style>
      {/* The source map includes Antarctica along the bottom edge; the
          container's aspect ratio crops it out. */}
      <div className="wmap-inner">
        <img className="wmap-img" src="/world-map.svg" alt="" aria-hidden="true" />
        {pins.map((p, i) => (
          <span
            key={i}
            className={`wmap-pin s${p.size}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <i className="wmap-ring" aria-hidden="true" />
            <i className="wmap-dot" aria-hidden="true" />
            {p.label && <em className={`wmap-label${p.side === "left" ? " left" : ""}`}>{p.label}</em>}
          </span>
        ))}
      </div>
      <div className="wmap-legend" aria-hidden="true">
        <span><i className="a" /> Single practitioner</span>
        <span><i className="b" /> Multi-provider clinic</span>
        <span><i className="c" /> Multi-location network</span>
      </div>
    </div>
  );
}
