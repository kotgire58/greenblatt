import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

// Animated background particles
function Particles() {
  return (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div key={i} className={`particle particle-${i % 5}`} style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${6 + Math.random() * 6}s`
        }} />
      ))}
    </div>
  )
}

function Auth() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  const handleSubmit = async () => {
    try {
      setError(null)
      setLoading(true)
      const endpoint = isLogin ? "login" : "register"
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, { email, password })
      login(res.data.token)
      navigate("/portfolio")
    } catch (err) {
      setError(err.response?.data?.error || "Auth failed")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background: #030712;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Radial glow background */
        .auth-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse-glow 8s ease-in-out infinite;
        }

        .auth-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%);
          pointer-events: none;
          animation: pulse-glow 10s ease-in-out infinite reverse;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        /* Grid overlay */
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Floating particles */
        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          bottom: -10px;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          animation: float-up linear infinite;
        }

        .particle-0 { background: rgba(16, 185, 129, 0.6); }
        .particle-1 { background: rgba(6, 182, 212, 0.4); }
        .particle-2 { background: rgba(52, 211, 153, 0.5); }
        .particle-3 { background: rgba(255, 255, 255, 0.2); }
        .particle-4 { background: rgba(16, 185, 129, 0.3); }

        @keyframes float-up {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }

        /* Card */
        .card-wrapper {
          position: relative;
          z-index: 10;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: translateY(30px);
        }

        .card-wrapper.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Glowing border effect */
        .card-glow {
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(16,185,129,0.4), rgba(6,182,212,0.2), transparent, rgba(16,185,129,0.1));
          padding: 1px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: border-rotate 6s linear infinite;
        }

        @keyframes border-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .card {
          background: rgba(10, 15, 28, 0.95);
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 24px;
          padding: 52px 48px;
          width: 420px;
          position: relative;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 25px 50px rgba(0,0,0,0.5),
            0 0 80px rgba(16, 185, 129, 0.05);
        }

        /* Logo / Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(16,185,129,0.3);
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .brand-name span {
          color: #10b981;
        }

        /* Heading */
        .heading {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .subheading {
          font-size: 13.5px;
          color: #4b5563;
          margin-bottom: 32px;
          letter-spacing: 0.01em;
        }

        /* Divider */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent);
          margin-bottom: 32px;
        }

        /* Input */
        .input-group {
          margin-bottom: 16px;
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .input-group.focused .input-label {
          color: #10b981;
        }

        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          color: #f9fafb;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          outline: none;
          transition: all 0.25s ease;
        }

        .input-field::placeholder {
          color: #374151;
        }

        .input-field:focus {
          background: rgba(16, 185, 129, 0.04);
          border-color: rgba(16, 185, 129, 0.35);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08), 0 0 20px rgba(16, 185, 129, 0.05);
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 15px;
          margin-top: 8px;
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #34d399, #10b981);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .submit-btn:hover::before { opacity: 1; }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn span { position: relative; z-index: 1; }

        .submit-btn.loading {
          pointer-events: none;
          opacity: 0.8;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Toggle */
        .toggle-btn {
          width: 100%;
          margin-top: 20px;
          background: none;
          border: none;
          color: #4b5563;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }

        .toggle-btn:hover { color: #10b981; }
        .toggle-btn strong { color: #10b981; font-weight: 500; }

        /* Error */
        .error-msg {
          margin-top: 16px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #f87171;
          font-size: 13px;
          text-align: center;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        /* Mode badge */
        .mode-tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 28px;
        }

        .mode-tab {
          flex: 1;
          padding: 8px;
          border: none;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: none;
          color: #4b5563;
        }

        .mode-tab.active {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          box-shadow: 0 0 12px rgba(16,185,129,0.1);
        }

        .mode-tab:not(.active):hover { color: #6b7280; }
      `}</style>

      <div className="auth-root">
        <div className="grid-bg" />
        <Particles />

        <div className={`card-wrapper ${mounted ? "mounted" : ""}`}>
          <div className="card">

            {/* Brand */}
            <div className="brand">
              <div className="brand-icon">📈</div>
              <div className="brand-name">Quant<span>Edge</span></div>
            </div>

            {/* Mode tabs */}
            <div className="mode-tabs">
              <button
                className={`mode-tab ${isLogin ? "active" : ""}`}
                onClick={() => { setIsLogin(true); setError(null) }}
              >
                Sign In
              </button>
              <button
                className={`mode-tab ${!isLogin ? "active" : ""}`}
                onClick={() => { setIsLogin(false); setError(null) }}
              >
                Create Account
              </button>
            </div>

            {/* Heading */}
            <div className="heading">
              {isLogin ? "Welcome back" : "Start investing smarter"}
            </div>
            <div className="subheading">
              {isLogin
                ? "Sign in to your portfolio dashboard"
                : "Create your account to get started"}
            </div>

            <div className="divider" />

            {/* Inputs */}
            <div className={`input-group ${focused === "email" ? "focused" : ""}`}>
              <label className="input-label">Email address</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={`input-group ${focused === "password" ? "focused" : ""}`}>
              <label className="input-label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Submit */}
            <button
              className={`submit-btn ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
            >
              <span>
                {loading && <span className="spinner" />}
                {loading ? "Authenticating..." : isLogin ? "Sign In" : "Create Account"}
              </span>
            </button>

            <button
              className="toggle-btn"
              onClick={() => { setIsLogin(!isLogin); setError(null) }}
            >
              {isLogin
                ? <>Don't have an account? <strong>Sign up free</strong></>
                : <>Already have an account? <strong>Sign in</strong></>
              }
            </button>

            {error && <div className="error-msg">{error}</div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth