import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const { login, signup }       = useAuth();
  const navigate                = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ← NEW
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setError("");
      setLoading(true);
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"       ? "No account found with this email" :
        err.code === "auth/wrong-password"       ? "Incorrect password" :
        err.code === "auth/email-already-in-use" ? "Email already registered" :
        err.code === "auth/invalid-email"        ? "Invalid email address" :
        "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__icon">⚡</span>
          <span className="login-logo__text">Voltix</span>
        </div>

        <h2 className="login-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="login-subtitle">
          {isSignup
            ? "Sign up to start monitoring your devices"
            : "Sign in to your dashboard"}
        </p>

        {/* Email */}
        <div className="modal__field">
          <label className="modal__label">Email</label>
          <input
            className="modal__input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Password with eye toggle */}
        <div className="modal__field">
          <label className="modal__label">Password</label>
          <div className="password-wrapper">
            <input
              className="modal__input password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              className="password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              type="button"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="modal__error">{error}</p>}

        {/* Submit */}
        <button
          className="login-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
        </button>

        {/* Toggle signup/login */}
        <p className="login-toggle">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            className="login-toggle__btn"
            onClick={() => {
              setIsSignup((prev) => !prev);
              setError("");
            }}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;