import { clinicFeatures } from "@/lib/vs";

// The "built for healthcare" section shared by /vs and every /vs/[slug]
// page: the clinic-specific capabilities a one-size-fits-all CRM doesn't
// ship, because they only make sense with a patient on the other end.
export function VsClinicFeatures() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-copy wide">
        <span className="eyebrow">Built for healthcare</span>
        <h2>One size fits all means built for no one in particular.</h2>
        <p>
          Generic CRMs sell the same product to every industry and leave the
          fitting to you. Everything in Caddie exists because a clinic needs
          it, from the protocol builder to the concierge coach to
          post-procedure follow-up questionnaires. You cannot configure your
          way to this in a general-purpose CRM.
        </p>
      </div>
      <div className="vs-feat-grid">
        {clinicFeatures.map((f) => (
          <article key={f.title} className="vs-feat">
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
