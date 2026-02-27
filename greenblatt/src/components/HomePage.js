"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { TrendingUp, PieChart, ShieldCheck, BarChart3 } from "lucide-react"

const HomePage = () => {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Systematic <span className="text-emerald-400">Value Investing</span>
          </h1>

          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto">
            Institutional-grade screening, ranking, and portfolio analytics
            powered by quantitative metrics inspired by Joel Greenblatt
            and Warren Buffett.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/app"
              className="px-8 py-4 rounded-xl bg-emerald-400 text-slate-900 font-bold text-lg hover:bg-emerald-300 transition shadow-lg"
            >
              Launch Screener
            </Link>

            <Link
              to="/buffett"
              className="px-8 py-4 rounded-xl border border-slate-700 text-slate-200 font-semibold hover:bg-slate-800 transition"
            >
              Buffett Analyzer
            </Link>
          </div>
        </motion.div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24">
          <MetricCard title="2 Core Factors" value="Earnings Yield + ROC" />
          <MetricCard title="Automatic Ranking" value="Greenblatt Formula" />
          <MetricCard title="Portfolio Engine" value="Weighted Exposure" />
          <MetricCard title="Qualitative Layer" value="Buffett Scoring" />
        </div>

        {/* FEATURE SECTION */}
        <div className="grid md:grid-cols-2 gap-12 mt-28 items-center">

          <div>
            <h2 className="text-4xl font-bold">
              Quantitative Discipline.
              <span className="text-emerald-400"> Zero Emotion.</span>
            </h2>

            <p className="mt-6 text-slate-400 text-lg">
              The Magic Formula ranks companies based on high earnings yield
              and high return on capital — combining value and quality into
              a systematic framework.
            </p>

            <p className="mt-4 text-slate-400 text-lg">
              QuantEdge automates this entire pipeline so you can focus
              on capital allocation instead of spreadsheets.
            </p>
          </div>

          <div className="space-y-6">
            <FeatureCard
              icon={<TrendingUp />}
              title="Factor-Based Screening"
              desc="Rank companies automatically using value and efficiency metrics."
            />
            <FeatureCard
              icon={<PieChart />}
              title="Portfolio Analytics"
              desc="Track weighted exposure, earnings yield, and capital returns."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Ranking Visualization"
              desc="Interactive charts for top-ranked companies."
            />
            <FeatureCard
              icon={<ShieldCheck />}
              title="Buffett Quality Overlay"
              desc="Qualitative scoring layer inspired by Warren Buffett."
            />
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-32 text-center">
          <h3 className="text-3xl font-bold">
            Build Smarter Portfolios.
          </h3>

          <p className="mt-4 text-slate-400">
            Stop guessing. Start ranking.
          </p>

          <Link
            to="/app"
            className="inline-block mt-8 px-10 py-5 bg-emerald-400 text-slate-900 font-extrabold rounded-xl hover:bg-emerald-300 transition text-lg"
          >
            Get Started
          </Link>
        </div>

      </div>
    </div>
  )
}

/* ===== Reusable Cards ===== */

const MetricCard = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center hover:border-emerald-400/40 transition">
    <div className="text-sm text-slate-500 uppercase tracking-wide">
      {title}
    </div>
    <div className="mt-3 text-xl font-semibold text-emerald-400">
      {value}
    </div>
  </div>
)

const FeatureCard = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-400/40 transition">
    <div className="text-emerald-400 mt-1">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-lg">{title}</h4>
      <p className="text-slate-400 mt-2">{desc}</p>
    </div>
  </div>
)

export default HomePage