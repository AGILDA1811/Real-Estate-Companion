import "./legal.css";

export default function Terms() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <p className="legal-kicker">Legal</p>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: February 25, 2026</p>

        <div className="legal-content">
          <h2>1. Using the Platform</h2>
          <p>
            You may use Real Estate Companion for lawful purposes only. You agree not to misuse
            the service or attempt to disrupt normal operation.
          </p>

          <h2>2. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for activity under your account.
          </p>

          <h2>3. Listing and Market Information</h2>
          <p>
            Property information is provided for general guidance. We do not guarantee absolute
            completeness or accuracy of every listing at all times.
          </p>

          <h2>4. Service Changes</h2>
          <p>
            We may update, improve, or discontinue parts of the platform. Continued use after
            updates means you accept the revised terms.
          </p>

          <h2>5. Contact</h2>
          <p>
            Questions about these terms can be directed to support@realestatecompanion.com.
          </p>
        </div>
      </section>
    </main>
  );
}
