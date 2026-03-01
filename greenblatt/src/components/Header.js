"use client"

import { useMemo, useState, useContext } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, Sparkles } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  const navItems = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Portfolio", path: "/portfolio" },
        { name: "Greenblatt", path: "/greenblatt" },
        { name: "Screener", path: "/screener" },

      { name: "Buffett", path: "/buffett" },
      { name: "About", path: "/about" },
      { name: "Resources", path: "/resources" },
      { name: "Contact", path: "/contact" },
    ],
    []
  )

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <div className="text-white font-bold">
              Quant<span className="text-emerald-400">Edge</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(item.path)
                    ? "bg-emerald-400 text-slate-900"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <Link
                to="/auth"
                className="px-4 py-2 bg-emerald-400 text-slate-900 rounded font-semibold"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    logout()
                    navigate("/")
                  }
                }}
                className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header