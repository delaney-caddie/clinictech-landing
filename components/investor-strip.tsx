// The investor / operator proof strip. Used under the homepage hero as a
// divider, and at the foot of the About page as a standalone trust block.

const investorLogos = [
  { src: "/logos/shopify.png", alt: "Shopify" },
  { src: "/logos/deepmind.png", alt: "Google DeepMind" },
  { src: "/logos/y-combinator.png", alt: "Y Combinator" },
  { src: "/logos/mistral.avif", alt: "Mistral" },
  { src: "/logos/fellow.png", alt: "Fellow" },
  { src: "/logos/rewind.png", alt: "Rewind" },
  { src: "/logos/noibu.webp", alt: "Noibu" },
];

export function InvestorStrip({
  /** Hairline under the strip. On for the homepage divider, off at page end. */
  divider = true,
  /** Roomier padding when the strip stands alone as its own section. */
  standalone = false,
}: {
  divider?: boolean;
  standalone?: boolean;
}) {
  return (
    <div
      className={`proof-bar${divider ? "" : " no-divider"}${standalone ? " is-standalone" : ""}`}
    >
      <style>{`
.proof-bar {
  border-bottom: 1px solid var(--line);
  display: grid; gap: 16px; justify-items: center; text-align: center;
  padding-top: 34px; padding-bottom: 34px;
}
.proof-bar.no-divider { border-bottom: 0; }
.proof-bar.is-standalone { padding-top: 12px; padding-bottom: var(--section-y); }
.proof-bar .ui-label { color: var(--faint); margin-bottom: 0; max-width: 620px; }
.proof-bar-logos {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  gap: 18px 36px;
}
.proof-bar-logos img {
  height: 26px; width: auto; max-width: 110px; object-fit: contain;
  opacity: .82; filter: grayscale(1);
}
      `}</style>
      <span className="ui-label">
        Operators and investors behind some of the world&apos;s best software and AI
        companies back Caddie
      </span>
      <div className="proof-bar-logos">
        {investorLogos.map((logo) => (
          <img key={logo.alt} src={logo.src} alt={logo.alt} loading="lazy" />
        ))}
      </div>
    </div>
  );
}
