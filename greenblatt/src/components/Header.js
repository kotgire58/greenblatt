"use client"

import { useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Sparkles } from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Screener", path: "/app" },
      { name: "Portfolio", path: "/portfolio" },   // ✅ ADDED
      { name: "Buffett", path: "/buffett" },
      { name: "About", path: "/about" },
      { name: "Resources", path: "/resources" },
      { name: "Contact", path: "/contact" },
    ],
    []
  )

  const isActive = (path) => location.pathname === path

  const linkBase =
    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
  const linkActive = "bg-emerald-400 text-slate-900 shadow-sm"
  const linkIdle =
    "text-slate-300 hover:text-white hover:bg-slate-800/70"

  return (
    <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-slate-900" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold tracking-tight text-white">
                Quant<span className="text-emerald-400">Edge</span>
              </div>
              <div className="text-[11px] text-slate-400 -mt-0.5">
                Systematic Value Investing
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  linkBase,
                  isActive(item.path) ? linkActive : linkIdle,
                ].join(" ")}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/app"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-slate-700 transition"
            >
              Open Screener
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 bg-white/5 hover:bg-white/10 transition"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-950/70 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={[
                    "px-3 py-3 rounded-xl border text-sm font-semibold transition",
                    isActive(item.path)
                      ? "bg-emerald-400 text-slate-900 border-emerald-300"
                      : "bg-white/5 text-slate-200 border-slate-800 hover:bg-white/10",
                  ].join(" ")}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <Link
              to="/app"
              onClick={() => setIsMenuOpen(false)}
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-extrabold border border-emerald-300/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header