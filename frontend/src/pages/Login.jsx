import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const INITIAL_FORM = {
  email: "",
  password: "",
  remember: true,
};
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Temporary fake login logic
    if (email === "admin@admin.com" && password === "admin") {
      localStorage.setItem("auth_token", "mock-admin-token");
      navigate("/admin");
      return;
    }

    setError("Invalid credentials. Try admin@admin.com / admin.");
  }

  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-title">
        <div className="login-panel login-panel-brand">
          <p className="login-kicker">Real Estate Companion</p>
          <h1 id="login-title" className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Sign in to continue your property search, track your favorite listings, and use your tools in one place.
          </p>

          <div className="login-points">
            <div className="login-point">
              <span className="login-point-dot" />
              <p>Saved apartment lists and comparison views.</p>
            </div>
            <div className="login-point">
              <span className="login-point-dot" />
              <p>Faster workflows with your recent filters.</p>
            </div>
            <div className="login-point">
              <span className="login-point-dot" />
              <p>Upcoming recommendations and market insights.</p>
            </div>
          </div>
        </div>

        <div className="login-panel login-panel-formWrap">
          <div className="login-panel-formCard">
            <h2 className="login-formTitle">Sign In</h2>
            <p className="login-formSubtitle">Use your account credentials to access your dashboard.</p>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <label className="login-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-passwordWrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-passwordToggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="login-row">
                <label className="login-check">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>

                <a className="login-forgot" href="#">Forgot password?</a>
              </div>

              {error ? <p className="login-error">{error}</p> : null}

              <button type="submit" className="login-submit">Sign In</button>
            </form>

            <p className="login-bottomText">
              Need an account? <Link to="/signup">Sign up</Link>
            </p>
            <p className="login-legalText">
              By signing in, you agree to our <Link to="/terms">Terms</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
