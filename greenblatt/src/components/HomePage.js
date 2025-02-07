"use client"

import { Link } from "react-router-dom"
import { useSpring, animated, config } from "react-spring"
import { BookOpen, TrendingUp, PieChart, DollarSign } from "lucide-react"

const HomePage = () => {
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: config.molasses,
  })

  const slideUp = useSpring({
    transform: "translateY(0px)",
    from: { transform: "translateY(50px)" },
    config: config.wobbly,
  })

  const pulse = useSpring({
    to: async (next) => {
      while (1) {
        await next({ transform: "scale(1.05)" })
        await next({ transform: "scale(1)" })
      }
    },
    from: { transform: "scale(1)" },
    config: config.gentle,
  })

  return (
    <animated.div
      style={fadeIn}
      className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-900 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <animated.h1 style={slideUp} className="text-5xl font-bold mb-8 text-center text-indigo-900">
          Magic Formula Investing
        </animated.h1>

        <animated.div style={fadeIn} className="bg-white bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-900">Discover Undervalued Stocks</h2>
          <p className="mb-4 text-indigo-800">
            Magic Formula Investing, developed by Joel Greenblatt, is a powerful strategy that helps you identify
            high-quality companies trading at attractive valuations. Our tool simplifies the process, allowing you to
            make informed investment decisions.
          </p>
          <p className="mb-4 text-indigo-800">Start your journey to smarter investing today!</p>
        </animated.div>

        <animated.div style={slideUp} className="bg-white bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-900">Key Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <TrendingUp className="mr-2 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-indigo-800">Earnings Yield</h3>
                <p className="text-indigo-700">Identifies companies with high earnings relative to their price</p>
              </div>
            </div>
            <div className="flex items-start">
              <PieChart className="mr-2 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-indigo-800">Return on Capital</h3>
                <p className="text-indigo-700">
                  Focuses on companies that efficiently generate profits from their assets
                </p>
              </div>
            </div>
          </div>
        </animated.div>

        <animated.div style={slideUp} className="bg-white bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-900">How It Works</h2>
          <ol className="list-decimal list-inside mb-4 text-indigo-800">
            <li>Add companies to your watchlist</li>
            <li>View financial metrics and rankings</li>
            <li>Analyze top-performing stocks</li>
            <li>Make informed investment decisions</li>
          </ol>
          <p className="text-indigo-800">
            Our tool does the heavy lifting, so you can focus on building your portfolio.
          </p>
        </animated.div>

        <animated.div style={fadeIn} className="bg-white bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-indigo-900">Why Use Our Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <DollarSign className="mr-2 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-indigo-800">Data-Driven Decisions</h3>
                <p className="text-indigo-700">Make investment choices based on solid financial metrics</p>
              </div>
            </div>
            <div className="flex items-start">
              <BookOpen className="mr-2 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-indigo-800">Educational Resources</h3>
                <p className="text-indigo-700">Learn more about value investing and the Magic Formula strategy</p>
              </div>
            </div>
          </div>
        </animated.div>

        <animated.div style={pulse} className="text-center">
          <Link
            to="/app"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Get Started
          </Link>
        </animated.div>
      </div>
    </animated.div>
  )
}

export default HomePage

