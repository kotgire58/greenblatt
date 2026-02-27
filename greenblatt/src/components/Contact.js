"use client"

import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react"

const Contact = () => {
  return (
    <div className="container mx-auto px-6 py-20 max-w-5xl">

      {/* HERO */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Let’s Build Something
          <span className="text-emerald-400"> Intelligent</span>
        </h1>

        <p className="text-slate-400 mt-6 text-lg max-w-3xl mx-auto">
          I design and build full-stack financial systems focused on
          quantitative ranking, portfolio analytics, and AI-driven evaluation.
          Open to high-impact engineering roles and ambitious fintech teams.
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-3xl font-bold">
              Kamal Kotgire
            </h2>

            <p className="text-emerald-400 mt-2 font-semibold">
              Quant-Focused Full Stack Engineer
            </p>

            <p className="text-slate-400 mt-6 max-w-xl leading-relaxed">
              MS Software Engineering Systems · Northeastern University  
              Specialized in financial systems, scalable APIs, quantitative
              analytics platforms, and production-grade SaaS architecture.
            </p>

            <div className="mt-6 flex items-center gap-2 text-slate-400">
              <MapPin size={16} />
              Boston, MA
            </div>
          </div>

          {/* RIGHT SIDE – CONTACT ACTIONS */}
          <div className="space-y-4">

            <ContactButton
              icon={<Mail size={18} />}
              label="Email Me"
              value="kotgire.k@northeastern.edu"
              link="mailto:kotgire.k@northeastern.edu"
            />

            <ContactButton
              icon={<Phone size={18} />}
              label="Call"
              value="(857) 395-2210"
              link="tel:8573952210"
            />

            <ContactButton
              icon={<Linkedin size={18} />}
              label="LinkedIn"
              value="linkedin.com/in/kamal-kotgire"
              link="https://www.linkedin.com/in/kamal-kotgire"
            />

            <ContactButton
              icon={<Github size={18} />}
              label="GitHub"
              value="github.com/kamalkotgire"
              link="https://github.com/kamalkotgire"
            />

          </div>

        </div>
      </div>

      {/* EXPERTISE SECTION */}
      <div className="mt-20 grid md:grid-cols-2 gap-10">

        <SkillCard
          title="Financial Systems"
          items={[
            "Factor-Based Equity Ranking",
            "Portfolio Analytics & Weighted Exposure",
            "Quantitative Scoring Models",
            "Systematic Value Investing Frameworks",
          ]}
        />

        <SkillCard
          title="Engineering Stack"
          items={[
            "React / Next.js / TypeScript",
            "Node.js / REST / GraphQL",
            "PostgreSQL / MongoDB / Redis",
            "AWS / Docker / Terraform",
          ]}
        />

      </div>

      {/* FINAL CTA */}
      <div className="mt-24 text-center">
        <p className="text-slate-400 text-lg">
          Interested in collaborating or discussing an opportunity?
        </p>

        <a
          href="mailto:kotgire.k@northeastern.edu"
          className="inline-block mt-8 px-10 py-5 bg-emerald-400 text-slate-900 font-extrabold rounded-2xl hover:bg-emerald-300 transition text-lg shadow-lg"
        >
          Start a Conversation
        </a>
      </div>

    </div>
  )
}

/* ===== Reusable Components ===== */

const ContactButton = ({ icon, label, value, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 bg-slate-950 border border-slate-800 px-6 py-4 rounded-2xl hover:border-emerald-400/40 transition"
  >
    <div className="text-emerald-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-semibold text-white text-sm">{value}</p>
    </div>
  </a>
)

const SkillCard = ({ title, items }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
    <h3 className="text-xl font-bold mb-6">
      {title}
    </h3>

    <ul className="space-y-3 text-slate-400">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2" />
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export default Contact