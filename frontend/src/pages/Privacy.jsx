import "./legal.css";

export default function Privacy() {
  return (
    <main className="legal-page">
      <section className="legal-shell">
        <p className="legal-kicker">Legal</p>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: February 25, 2026</p>

        <div className="legal-content">
          <h2>1. Information We Collect</h2>
          <p>
            We may collect account details, usage activity, and technical information needed to run
            and improve the platform.
          </p>

          <h2>2. How We Use Information</h2>
          <p>
            Information is used to provide features, support accounts, improve performance, and
            communicate important updates.
          </p>

          <h2>3. Cookies and Session Data</h2>
          <p>
            Strictly necessary cookies or session mechanisms may be used for login and security.
            Optional analytics or marketing cookies should be disclosed separately.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We apply reasonable measures to protect user data, but no system can guarantee absolute
            security at all times.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You may request account-related support or policy clarification via
            support@realestatecompanion.com.
          </p>
        </div>
      </section>
    </main>
  );
}
