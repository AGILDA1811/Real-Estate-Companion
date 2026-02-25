import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./help.css";

const faqs = [
  {
    id: "search-apartments",
    category: "Listings",
    question: "How do I search for apartments?",
    answer: "Go to the Apartments page and use the search bar and filters to refine results by price, size, rooms, and location."
  },
  {
    id: "price-estimator",
    category: "Tools",
    question: "What is the Price Estimator?",
    answer: "The Price Estimator analyzes property details to give you a fair value estimate based on available data."
  },
  {
    id: "deal-finder",
    category: "Tools",
    question: "How does Deal Finder work?",
    answer: "Deal Finder compares listing prices with estimated market values to highlight potentially underpriced properties."
  },
  {
    id: "list-property",
    category: "Getting Started",
    question: "How do I list my property?",
    answer: "Click 'List your property' in the navigation bar or contact us directly to get started."
  }
];

export default function Help() {
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [search, setSearch] = useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredFaqs = faqs.filter((faq) => {
    const haystack = `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  return (
    <motion.div
      className="help"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >

      {/* HERO */}
      <section className="help-hero">
        <div className="help-hero-bg" />
        <div className="help-container">
          <p className="help-kicker">Help Center</p>
          <h1>How can we assist you?</h1>

          <div className="help-searchWrap">
            <input
              type="text"
              placeholder="Search by topic, tool, or question..."
              className="help-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search help center"
            />
            {search ? (
              <button
                type="button"
                className="help-searchClear"
                onClick={() => setSearch("")}
              >
                Clear
              </button>
            ) : null}
          </div>
          <p className="help-searchMeta">
            {filteredFaqs.length} result{filteredFaqs.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="help-section">
        <div className="help-container help-categories">
          {["Getting Started", "Listings", "Tools", "Account"].map((cat) => (
            <motion.div
              key={cat}
              className="help-card card-hover"
            >
              <h3>{cat}</h3>
              <p>Browse articles related to {cat.toLowerCase()}.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="help-section help-section-alt">
        <div className="help-container">
          <h2>Frequently Asked Questions</h2>

          <div className="help-faq">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className={`help-faqItem card-hover ${
                  activeFaqId === faq.id ? "active" : ""
                }`}
                onClick={() =>
                  setActiveFaqId(activeFaqId === faq.id ? null : faq.id)
                }
              >
                <div className="help-faqQuestion">
                  {faq.question}
                  <span>{activeFaqId === faq.id ? "−" : "+"}</span>
                </div>
                {activeFaqId === faq.id && (
                  <div className="help-faqAnswer">{faq.answer}</div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 ? (
              <div className="help-noResults">
                No matching help topics found. Try keywords like <strong>filters</strong>, <strong>estimator</strong>, or <strong>listing</strong>.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="help-cta">
        <div className="help-container">
          <h2>Still need help?</h2>
          <p>Contact our support team and we’ll respond shortly.</p>
          <a href="/contacts" className="help-btn">
            Call Support
          </a>
        </div>
      </section>

    </motion.div>
  );
}
