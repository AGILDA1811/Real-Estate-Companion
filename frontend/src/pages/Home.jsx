// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./home.css";

const ease = [0.22, 1, 0.36, 1];

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const staggerContainer = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, staggerChildren: 0.1 },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const tools = [
  {
    icon: "[]",
    title: "Smart Filters & Search",
    description: "Refine by price, size, room count, and area in seconds.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "+",
    title: "Price Estimator",
    description: "Instantly estimate listing value from essential property inputs.",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "//",
    title: "Market Dashboard",
    description: "Read trend movement and local averages before making offers.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
];

const steps = [
  {
    index: "01",
    title: "Discover",
    text: "Browse premium listings with structured details and cleaner results.",
  },
  {
    index: "02",
    title: "Evaluate",
    text: "Compare pricing quality and market context to eliminate weak options.",
  },
  {
    index: "03",
    title: "Decide",
    text: "Move forward with a confident shortlist supported by better signals.",
  },
];

export default function Home() {
  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <motion.section className="home-hero" initial="hidden" animate="visible" variants={staggerContainer}>
        <div className="home-container home-hero-grid">
          <motion.div className="home-hero-copy" variants={staggerContainer}>
            <motion.p className="home-kicker" variants={fadeItem}>
              Real Estate Companion
            </motion.p>
            <motion.h1 className="home-title" variants={fadeItem}>
              A more elegant way to find your next apartment.
            </motion.h1>
          <motion.p className="home-subtitle" variants={fadeItem}>
              Clear structure, useful data, and practical tools for faster property decisions.
          </motion.p>

          <motion.div className="home-hero-actions" variants={fadeItem}>
              <Link to="/apartments" className="home-btn home-btn-primary">
                Explore Apartments
              </Link>
              <Link to="/about" className="home-btn home-btn-ghost">
                How It Works
              </Link>
            </motion.div>

            <motion.div className="home-hero-metrics" variants={staggerContainer}>
              <motion.div className="home-hero-metric" variants={fadeItem}>
                <span className="home-hero-metric-num">3</span>
                <span className="home-hero-metric-label">Core tools</span>
              </motion.div>
              <motion.div className="home-hero-metric" variants={fadeItem}>
                <span className="home-hero-metric-num">Fast</span>
                <span className="home-hero-metric-label">Search flow</span>
              </motion.div>
              <motion.div className="home-hero-metric" variants={fadeItem}>
                <span className="home-hero-metric-num">Clear</span>
                <span className="home-hero-metric-label">Price context</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="home-hero-visual" variants={fadeItem} whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
            <img
              className="home-hero-image"
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury modern apartment interior"
              loading="lazy"
            />
            <div className="home-hero-chip">Curated Listings</div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="home-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="home-container">
          <div className="home-section-head">
            <h2 className="home-h2">Tools that feel premium and practical</h2>
            <p className="home-p">
              Every feature is tuned to keep your search focused, structured, and calm.
            </p>
          </div>

          <motion.div
            className="home-tools-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {tools.map((tool) => (
              <motion.article
                key={tool.title}
                className="home-tool-card"
                variants={fadeItem}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img className="home-tool-image" src={tool.image} alt={tool.title} loading="lazy" />
                <div className="home-tool-body">
                  <span className="home-tool-tag">Feature</span>
                  <div className="home-tool-icon" aria-hidden="true">
                    {tool.icon}
                  </div>
                  <h3 className="home-h3">{tool.title}</h3>
                  <p className="home-p">{tool.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="home-section home-section-soft"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="home-container home-steps-layout">
          <div>
            <div className="home-section-head">
              <h2 className="home-h2">How your journey stays structured</h2>
            </div>

            <div className="home-steps">
              {steps.map((step) => (
                <motion.div
                  key={step.index}
                  className="home-step"
                  whileHover={{ backgroundColor: "rgba(11,18,32,0.03)" }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="home-step-index">{step.index}</p>
                  <div>
                    <h3 className="home-h3">{step.title}</h3>
                    <p className="home-p">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div className="home-steps-visual" variants={fadeItem} whileHover={{ y: -3 }} transition={{ duration: 0.22 }}>
            <img
              className="home-steps-image"
              src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1100&q=80"
              alt="Luxury home exterior"
              loading="lazy"
            />
            <p className="home-steps-caption">Premium spaces. Smarter decisions.</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="home-end"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="home-container home-end-grid">
          <div className="home-end-left">
            <h2 className="home-h2">Built with luxury clarity from first click to shortlist.</h2>
            <p className="home-p">
              Real Estate Companion blends better structure with real utility, so decisions feel sharper and less stressful.
            </p>
            <Link to="/apartments" className="home-btn home-btn-primary">
              Start Exploring
            </Link>
          </div>

          <div className="home-end-right">
            <img
              className="home-end-image"
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
              alt="Refined modern living room"
              loading="lazy"
            />

            <div className="home-end-stat">
              <span>01</span>
              <div>
                <h4>Search Smarter</h4>
                <p>High-signal filtering built for fast discovery.</p>
              </div>
            </div>

            <div className="home-end-stat">
              <span>02</span>
              <div>
                <h4>Evaluate Pricing</h4>
                <p>Value estimates and local context in one flow.</p>
              </div>
            </div>

            <div className="home-end-stat">
              <span>03</span>
              <div>
                <h4>Decide with Confidence</h4>
                <p>Shortlist with stronger evidence, not guesswork.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
