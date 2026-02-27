"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Book,
  Video,
  Link as LinkIcon,
  FileText,
} from "lucide-react"

const About = () => {
  const [faqExpanded, setFaqExpanded] = useState({})
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeSection, setActiveSection] = useState("")

  /* ===========================
     Stable Section Refs
  ============================ */

  const whatIsRef = useRef(null)
  const advantagesRef = useRef(null)
  const implementationRef = useRef(null)
  const faqRef = useRef(null)
  const resourcesRef = useRef(null)

  const sectionRefs = useMemo(
    () => ({
      whatIs: whatIsRef,
      advantages: advantagesRef,
      implementation: implementationRef,
      faq: faqRef,
      resources: resourcesRef,
    }),
    []
  )

  /* ===========================
     Scroll Tracking
  ============================ */

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120

      for (const sectionId in sectionRefs) {
        const element = sectionRefs[sectionId].current
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(sectionId)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionRefs])

  /* ===========================
     Resources
  ============================ */

  useEffect(() => {
    const realResources = [
      {
        id: 1,
        title: "The Little Book That Beats the Market",
        type: "book",
        url: "https://www.amazon.com/Little-Book-Still-Beats-Market/dp/0470624159",
      },
      {
        id: 2,
        title: "Magic Formula Investing Explained",
        type: "video",
        url: "https://www.youtube.com/watch?v=7cjIWMUgPtY",
      },
      {
        id: 3,
        title: "Implementing Magic Formula in Python",
        type: "article",
        url: "https://towardsdatascience.com/",
      },
    ]

    setResources(realResources)
    setFilteredResources(realResources)
  }, [])

  const filterResources = (filter) => {
    setActiveFilter(filter)

    if (filter === "all") {
      setFilteredResources(resources)
    } else {
      setFilteredResources(
        resources.filter((r) => r.type === filter)
      )
    }
  }

  const toggleFaq = (index) => {
    setFaqExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const scrollToSection = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  /* ===========================
     UI
  ============================ */

  return (
    <div className="container mx-auto px-6 py-20">

      {/* HERO */}
      <div className="text-center mb-20">
        <h1 className="text-5xl font-extrabold">
          Magic Formula
          <span className="text-emerald-400"> Investing</span>
        </h1>
        <p className="text-slate-400 mt-6 max-w-3xl mx-auto text-lg">
          A systematic value investing strategy combining
          Earnings Yield and Return on Capital to identify
          high-quality undervalued companies.
        </p>
      </div>

      <div className="flex gap-12">

        {/* SIDEBAR */}
        <aside className="hidden md:block w-64">
          <div className="sticky top-24 space-y-4">
            {Object.keys(sectionRefs).map((key) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className={`flex items-center gap-2 text-sm transition ${
                  activeSection === key
                    ? "text-emerald-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ChevronRight size={14} />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-20">

          {/* WHAT IS */}
          <section ref={whatIsRef}>
            <h2 className="text-3xl font-bold mb-6">
              What Is It?
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Magic Formula Investing ranks companies using two
              metrics: Earnings Yield (value) and Return on Capital
              (quality). The combined ranking identifies companies
              that are both profitable and undervalued.
            </p>
          </section>

          {/* ADVANTAGES */}
          <section ref={advantagesRef}>
            <h2 className="text-3xl font-bold mb-6">
              Advantages & Disadvantages
            </h2>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                  Advantages
                </h3>
                <ul className="space-y-3 text-slate-400">
                  <li>Systematic & emotion-free</li>
                  <li>Combines value + quality</li>
                  <li>Backtested long-term performance</li>
                  <li>Simple implementation</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-red-400 mb-4">
                  Disadvantages
                </h3>
                <ul className="space-y-3 text-slate-400">
                  <li>Short-term underperformance risk</li>
                  <li>Sector exclusions required</li>
                  <li>No qualitative overlay</li>
                </ul>
              </div>
            </div>
          </section>

          {/* IMPLEMENTATION */}
          <section ref={implementationRef}>
            <h2 className="text-3xl font-bold mb-6">
              Implementation
            </h2>
            <ol className="space-y-3 text-slate-400 list-decimal list-inside">
              <li>Calculate Earnings Yield and ROC</li>
              <li>Rank stocks independently</li>
              <li>Combine rankings</li>
              <li>Invest in top selections</li>
              <li>Rebalance annually</li>
            </ol>
          </section>

          {/* FAQ */}
          <section ref={faqRef}>
            <h2 className="text-3xl font-bold mb-6">
              FAQs
            </h2>

            {[
              {
                q: "Is this suitable for beginners?",
                a: "Yes. The framework is simple, but discipline is required.",
              },
              {
                q: "How often should I rebalance?",
                a: "Typically once per year.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between w-full font-semibold"
                >
                  {faq.q}
                  {faqExpanded[index] ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </button>

                {faqExpanded[index] && (
                  <p className="mt-4 text-slate-400">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* RESOURCES */}
          <section ref={resourcesRef}>
            <h2 className="text-3xl font-bold mb-6">
              Resource Library
            </h2>

            <div className="mb-6 space-x-3">
              {["all", "book", "video", "article"].map((type) => (
                <button
                  key={type}
                  onClick={() => filterResources(type)}
                  className={`px-4 py-2 rounded-xl text-sm transition ${
                    activeFilter === type
                      ? "bg-emerald-400 text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredResources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-400/40 transition flex items-center gap-4"
                >
                  {resource.type === "book" && <Book />}
                  {resource.type === "video" && <Video />}
                  {resource.type === "article" && <FileText />}
                  {resource.type === "research" && <LinkIcon />}
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

export default About