import { Link } from "react-router-dom"
import { useSpring, animated, config } from "react-spring"

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
      className="min-h-screen bg-gradient-to-br from-beige-200 to-beige-400 text-beige-900 p-8"
    >
      <div className="max-w-4xl mx-auto">
        <animated.h1 style={slideUp} className="text-5xl font-bold mb-8 text-center text-beige-900">
          Magic Formula Investing
        </animated.h1>

        <animated.div style={fadeIn} className="bg-beige-100 bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-beige-900">What is the Magic Formula?</h2>
          <p className="mb-4 text-beige-800">
            The Magic Formula is an investing strategy developed by Joel Greenblatt, a successful value investor and
            professor at Columbia University. It aims to identify high-quality companies trading at attractive
            valuations.
          </p>
          <p className="mb-4 text-beige-800">The formula ranks companies based on two key metrics:</p>
          <ul className="list-disc list-inside mb-4 text-beige-800">
            <li>Return on Capital (ROC): Measures how efficiently a company generates profits from its assets</li>
            <li>Earnings Yield: Indicates how inexpensive a stock is relative to its earnings</li>
          </ul>
          <p className="text-beige-800">
            By combining these metrics, the Magic Formula seeks to find companies that are both profitable and
            undervalued.
          </p>
        </animated.div>

        <animated.div style={slideUp} className="bg-beige-100 bg-opacity-80 rounded-lg p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4 text-beige-900">How to Use This App</h2>
          <ol className="list-decimal list-inside mb-4 text-beige-800">
            <li>Click the "Start Analyzing" button below to access the main app</li>
            <li>Add companies manually or fetch data automatically using stock symbols</li>
            <li>View the ranked list of companies based on the Magic Formula</li>
            <li>Use the rankings to inform your investment decisions</li>
          </ol>
          <p className="text-beige-800">
            Remember, the Magic Formula is a tool to help identify potential investment opportunities. Always conduct
            thorough research and consider your personal financial situation before making investment decisions.
          </p>
        </animated.div>

        <animated.div style={pulse} className="text-center">
          <Link
            to="/app"
            className="inline-block bg-beige-700 text-beige-100 font-bold py-3 px-6 rounded-full hover:bg-beige-800 transition duration-300 shadow-md"
          >
            Start Analyzing
          </Link>
        </animated.div>
      </div>
    </animated.div>
  )
}

export default HomePage

