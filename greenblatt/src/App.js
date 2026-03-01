"use client"

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import axios from "axios"

import Header from "./components/Header"
import HomePage from "./components/HomePage"
import About from "./components/About"
import Resources from "./components/Resources"
import Contact from "./components/Contact"
import BuffettAnalyzer from "./components/BuffettAnalyzer"
import Auth from "./components/Auth"
import Screener from "./components/Screener"
import Portfolio from "./components/Portfolio"
import GreenblattPortfolio from "./components/GreenblattPortfolio"

/* ================= AXIOS INTERCEPTOR ================= */

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ================= PROTECTED ROUTE WRAPPER ================= */

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/auth" replace />
  }

  return children
}

/* ================= MAIN APP ================= */

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 flex flex-col">

        <Header />

        <main className="flex-grow relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_1px_1px,_#ffffff_1px,_transparent_0)] bg-[size:20px_20px]" />

          <div className="relative z-10">
            <Routes>

              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected */}
              <Route
                path="/greenblatt"
                element={
                  <ProtectedRoute>
                    <GreenblattPortfolio />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/screener"
                element={
                  <ProtectedRoute>
                    <Screener />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/buffett"
                element={
                  <ProtectedRoute>
                    <BuffettAnalyzer />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="text-lg font-bold tracking-tight">
              Quant<span className="text-emerald-400">Edge</span>
            </div>

            <p className="text-slate-400 text-sm mt-2">
              Systematic Value Investing Platform
            </p>

            <p className="text-slate-500 text-xs mt-4">
              © 2025 Kamal Kotgire · Built with React, Node.js, Quant Metrics
            </p>
          </div>
        </footer>

      </div>
    </Router>
  )
}

export default App