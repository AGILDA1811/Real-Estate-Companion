import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [policyModal, setPolicyModal] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.agree) {
      setError("Please accept the terms to continue.");
      return;
    }

    // Temporary fake signup flow
    navigate("/login");
  }

  return (
    <main className="signup-page">
      <section className="signup-shell" aria-labelledby="signup-title">
        <div className="signup-panel signup-panel-brand">
          <p className="signup-kicker">Real Estate Companion</p>
          <h1 id="signup-title" className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Save listings, organize your apartment search, and get personalized recommendations as new tools launch.
          </p>

          <div className="signup-points">
            <div className="signup-point"><span className="signup-point-dot" /><p>Save favorites and compare them later.</p></div>
            <div className="signup-point"><span className="signup-point-dot" /><p>Track your search flow in one place.</p></div>
            <div className="signup-point"><span className="signup-point-dot" /><p>Get better insights as features expand.</p></div>
          </div>
        </div>

        <div className="signup-panel signup-panel-formWrap">
          <div className="signup-panel-formCard">
            <h2 className="signup-formTitle">Sign Up</h2>
            <p className="signup-formSubtitle">Create your profile in a few steps.</p>

            <form className="signup-form" onSubmit={handleSubmit} noValidate>
              <label className="signup-label" htmlFor="signup-fullName">Full name</label>
              <input
                id="signup-fullName"
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />

              <label className="signup-label" htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <label className="signup-label" htmlFor="signup-password">Password</label>
              <div className="signup-passwordWrap">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="signup-passwordToggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label className="signup-label" htmlFor="signup-confirmPassword">Confirm password</label>
              <div className="signup-passwordWrap">
                <input
                  id="signup-confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="signup-passwordToggle"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              <label className="signup-check">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                />
                <span>
                  I agree to the{" "}
                  <button type="button" className="signup-inlineLink" onClick={() => setPolicyModal("terms")}>
                    Terms
                  </button>{" "}
                  and{" "}
                  <button type="button" className="signup-inlineLink" onClick={() => setPolicyModal("privacy")}>
                    Privacy Policy
                  </button>.
                </span>
              </label>

              {error ? <p className="signup-error">{error}</p> : null}

              <button type="submit" className="signup-submit">Create Account</button>
            </form>

            <p className="signup-bottomText">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
            <p className="signup-legalLinks">
              Full legal pages: <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>

      {policyModal ? (
        <div className="signup-modalBackdrop" onClick={() => setPolicyModal(null)}>
          <div className="signup-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="signup-modalHead">
              <h3>{policyModal === "terms" ? "Terms Summary" : "Privacy Summary"}</h3>
              <button type="button" className="signup-modalClose" onClick={() => setPolicyModal(null)}>
                Close
              </button>
            </div>

            {policyModal === "terms" ? (
              <p>
                By creating an account, you agree to use the platform lawfully and keep your account details secure.
                Listing and market information is provided as guidance and may change over time.
              </p>
            ) : (
              <p>
                We use account and usage data to provide features and improve the platform. Session-related cookies may
                be used for authentication and security.
              </p>
            )}

            <p>
              Read full details:{" "}
              {policyModal === "terms" ? <Link to="/terms">Terms of Service</Link> : <Link to="/privacy">Privacy Policy</Link>}
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
