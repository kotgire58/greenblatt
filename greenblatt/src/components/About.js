"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp, ChevronRight, Book, Video, LinkIcon, FileText } from "lucide-react"

const About = () => {
  const [expandedSections, setExpandedSections] = useState({})
  const [faqExpanded, setFaqExpanded] = useState({})
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeSection, setActiveSection] = useState("")
  const [tocExpanded, setTocExpanded] = useState(true)

  const sections = {
    whatIs: {
      id: "whatIs",
      title: "What Is Magic Formula Investing?",
      subsections: ["howItWorks", "requirements"],
    },
    advantages: {
      id: "advantages",
      title: "Advantages and Disadvantages",
      subsections: [],
    },
    implementation: {
      id: "implementation",
      title: "Implementation",
      subsections: [],
    },
    faq: {
      id: "faq",
      title: "Magic Formula Investing FAQs",
      subsections: [],
    },
    resources: {
      id: "resources",
      title: "Resource Library",
      subsections: [],
    },
  }

  const sectionRefs = {
    whatIs: useRef(null),
    howItWorks: useRef(null),
    requirements: useRef(null),
    advantages: useRef(null),
    implementation: useRef(null),
    faq: useRef(null),
    resources: useRef(null),
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

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
  }, [sectionRefs]) // Added sectionRefs to dependencies

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  useEffect(() => {
    const fetchResources = async () => {
      // In a real application, this would be an API call
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
          url: "https://towardsdatascience.com/the-magic-formula-investment-strategy-in-python-5d6a7b0f1a0a",
        },
        {
          id: 4,
          title: "Value Investing: From Graham to Buffett and Beyond",
          type: "book",
          url: "https://www.amazon.com/Value-Investing-Graham-Buffett-Beyond/dp/0471463396",
        },
        {
          id: 5,
          title: "Magic Formula Investing: Performance Analysis",
          type: "research",
          url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2616719",
        },
        {
          id: 6,
          title: "Official Magic Formula Investing Website",
          type: "website",
          url: "https://www.magicformulainvesting.com/",
        },
        {
          id: 7,
          title: "Investopedia: Magic Formula Investing",
          type: "article",
          url: "https://www.investopedia.com/terms/m/magic-formula-investing.asp",
        },
      ]
      setResources(realResources)
      setFilteredResources(realResources)
    }
    fetchResources()
  }, [])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleFaq = (index) => {
    setFaqExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const filterResources = (filter) => {
    setActiveFilter(filter)
    if (filter === "all") {
      setFilteredResources(resources)
    } else {
      setFilteredResources(resources.filter((resource) => resource.type === filter))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
              <div className="space-y-2">
                {Object.values(sections).map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center w-full text-left hover:text-blue-600 ${
                        activeSection === section.id ? "text-blue-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 mr-2" />
                      {section.title}
                    </button>
                    {section.subsections.length > 0 && (
                      <div className="ml-6 mt-2 space-y-2">
                        {section.subsections.map((subId) => (
                          <button
                            key={subId}
                            onClick={() => scrollToSection(subId)}
                            className={`block w-full text-left hover:text-blue-600 ${
                              activeSection === subId ? "text-blue-600 font-semibold" : "text-gray-600"
                            }`}
                          >
                            {subId === "howItWorks" ? "How It Works" : "Requirements"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Magic Formula Investing</h1>
            <div className="mt-4 text-gray-600">
              <span className="mr-4">By Will Kenton</span>
              <span>Updated July 01, 2024</span>
            </div>
            <div className="mt-2 text-gray-600">Reviewed by Julius Mansa</div>
          </div>

          {/* What Is Section */}
          <section ref={sectionRefs.whatIs} className="mb-12">
            <h2 className="text-3xl font-bold mb-4">What Is Magic Formula Investing?</h2>
            <p className="mb-4">
              Magic Formula Investing is a strategy developed by Joel Greenblatt, a successful value investor and
              professor at Columbia University. The strategy aims to identify high-quality companies trading at
              attractive valuations.
            </p>

            {/* How It Works Subsection */}
            <div ref={sectionRefs.howItWorks} className="mt-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <p className="mb-4">
                The Magic Formula strategy involves ranking companies based on their combined performance in Earnings
                Yield and Return on Capital. This systematic approach helps investors identify potentially undervalued
                stocks with strong business fundamentals.
              </p>
            </div>

            {/* Requirements Subsection */}
            <div ref={sectionRefs.requirements} className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Requirements</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Market capitalization greater than $100 million</li>
                <li>Adequate liquidity and trading volume</li>
                <li>No financial sector stocks</li>
                <li>No utilities sector stocks</li>
              </ul>
            </div>
          </section>

          {/* Advantages and Disadvantages Section */}
          <section ref={sectionRefs.advantages} className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Advantages and Disadvantages</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Advantages</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Systematic approach to value investing</li>
                  <li>Removes emotional biases from investment decisions</li>
                  <li>Focuses on both quality and value metrics</li>
                  <li>Easy to implement and follow</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Disadvantages</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>May underperform in certain market conditions</li>
                  <li>Limited to specific market segments</li>
                  <li>Requires patience and discipline</li>
                  <li>May not account for qualitative factors</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Implementation Section */}
          <section ref={sectionRefs.implementation} className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Implementation</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Calculate Earnings Yield and Return on Capital for a large group of stocks</li>
              <li>Rank the stocks separately by each metric</li>
              <li>Combine the rankings to get an overall score</li>
              <li>Invest in the top-ranked stocks</li>
              <li>Rebalance the portfolio periodically (usually annually)</li>
            </ol>
          </section>

          {/* FAQ Section */}
          <section ref={sectionRefs.faq} className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Magic Formula Investing FAQs</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is Magic Formula Investing suitable for beginners?",
                  a: "Yes, the strategy is designed to be simple enough for individual investors to implement.",
                },
                {
                  q: "How often should I rebalance my Magic Formula portfolio?",
                  a: "Greenblatt recommends rebalancing annually, but some investors prefer more frequent rebalancing.",
                },
                {
                  q: "Does Magic Formula Investing work in all market conditions?",
                  a: "While the strategy has shown long-term success, it may underperform in certain market conditions, particularly during strong bull markets.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left font-semibold"
                  >
                    {faq.q}
                    {faqExpanded[index] ? <ChevronUp /> : <ChevronDown />}
                  </button>
                  {faqExpanded[index] && <p className="mt-2">{faq.a}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Resource Library Section */}
          <section ref={sectionRefs.resources} className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Resource Library</h2>
            <div className="mb-4">
              <button
                onClick={() => filterResources("all")}
                className={`mr-2 px-3 py-1 rounded ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                All
              </button>
              <button
                onClick={() => filterResources("book")}
                className={`mr-2 px-3 py-1 rounded ${activeFilter === "book" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Books
              </button>
              <button
                onClick={() => filterResources("video")}
                className={`mr-2 px-3 py-1 rounded ${activeFilter === "video" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Videos
              </button>
              <button
                onClick={() => filterResources("article")}
                className={`mr-2 px-3 py-1 rounded ${activeFilter === "article" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                Articles
              </button>
            </div>
            <ul className="space-y-2">
              {filteredResources.map((resource) => (
                <li key={resource.id} className="flex items-center">
                  {resource.type === "book" && <Book className="mr-2" />}
                  {resource.type === "video" && <Video className="mr-2" />}
                  {resource.type === "article" && <FileText className="mr-2" />}
                  {resource.type === "research" && <LinkIcon className="mr-2" />}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About

