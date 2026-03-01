import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

function Auth() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    try {
      setError(null)
      const endpoint = isLogin ? "login" : "register"

      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, {
        email,
        password
      })

      login(res.data.token)
      navigate("/portfolio")

    } catch (err) {
      setError(err.response?.data?.error || "Auth failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-10 rounded-2xl w-96 border border-slate-800">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <input
          className="w-full mb-4 p-3 bg-slate-800 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 bg-slate-800 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-emerald-400 text-slate-900 py-3 rounded font-bold hover:bg-emerald-300 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button
          className="mt-4 w-full text-slate-400 text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default Auth