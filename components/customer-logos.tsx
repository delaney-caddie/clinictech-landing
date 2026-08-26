// Rolling strip of customer logos, shown under the homepage hero. Pure CSS
// marquee: the track holds two copies of the logo set and slides by half its
// width, so the loop is seamless. No JS, honors prefers-reduced-motion.
const logos = [
  { src: "/customers/renue.png", alt: "Renue Healthcare" },
  { src: "/customers/biox.svg", alt: "BioXcellerator" },
  { src: "/customers/optimal-hormones.png", alt: "Optimal Hormones" },
  { src: "/customers/cmf-surgeons.png", alt: "CMF Surgeons" },
  { src: "/customers/chapalamed.png", alt: "ChapalaMed" },
  { src: "/customers/rescore.svg", alt: "Rescore" },
];

export function CustomerLogos() {
  return (
    <section className="cust-strip" aria-label="Clinics running on Caddie">
      <style>{`
.cust-strip { max-width: 1180px; margin: 0 auto; padding: 34px 24px 10px; text-align: center; }
.cust-strip > p {
  color: var(--faint); font-size: .84rem; font-weight: 550;
  letter-spacing: .02em; margin: 0 0 18px;
}
.cust-marquee {
  overflow: hidden; position: relative;
  -webkit-mask-image: linear-gradient(90deg, #0000, #000 12%, #000 88%, #0000);
  mask-image: linear-gradient(90deg, #0000, #000 12%, #000 88%, #0000);
}
.cust-track {
  display: flex; align-items: center; gap: clamp(40px, 5vw, 72px);
  width: max-content; animation: cust-scroll 32s linear infinite;
}
.cust-track img {
  height: 34px; width: auto; max-width: 150px; object-fit: contain;
  opacity: .8; filter: grayscale(35%);
  transition: opacity .2s ease, filter .2s ease;
}
.cust-track img:hover { opacity: 1; filter: none; }
@keyframes cust-scroll { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .cust-track { animation: none; flex-wrap: wrap; width: auto; justify-content: center; }
  .cust-track img:nth-child(n+7) { display: none; }
  .cust-marquee { -webkit-mask-image: none; mask-image: none; }
}
      `}</style>
      <p>Clinics across North America run their front office on Caddie</p>
      <div className="cust-marquee">
        <div className="cust-track">
          {[...logos, ...logos].map((l, i) => (
            <img
              key={i}
              src={l.src}
              alt={i < logos.length ? l.alt : ""}
              aria-hidden={i >= logos.length}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
