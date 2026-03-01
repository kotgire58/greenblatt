const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

// ================= REGISTER =================

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hashed
    })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registration failed" })
  }
}

// ================= LOGIN =================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Login failed" })
  }
}