import "./about.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  const transitionEase = [0.22, 1, 0.36, 1];

  const sectionReveal = {
    hidden: { opacity: 0, y: 26 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: transitionEase },
    },
  };

  const gridReveal = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: transitionEase, staggerChildren: 0.12 },
    },
  };

  const itemReveal = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: transitionEase } },
  };

  const featureGridVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: transitionEase,
        staggerChildren: 0.12,
      },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: transitionEase } },
  };

  return (
    <motion.div
      className="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: transitionEase }}
    >
      {/* HERO */}
      <motion.section
        className="about-hero"
        initial="hidden"
        animate="visible"
        variants={sectionReveal}
      >
        <div className="about-hero-overlay" />
        <motion.div className="about-container about-hero-inner" variants={gridReveal}>
          <motion.p className="about-kicker" variants={itemReveal}>Real Estate Companion</motion.p>
          <motion.h1 className="about-title" variants={itemReveal}>Luxury-level clarity for every property decision.</motion.h1>
          <motion.p className="about-subtitle" variants={itemReveal}>
            We help people find, compare, and evaluate homes using clean design and smart tools —
            so you can move with confidence.
          </motion.p>

          <motion.div className="about-hero-cards" variants={gridReveal}>
            <motion.div className="about-card" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <p className="about-card-label">Trust</p>
              <p className="about-card-value">Verified listings</p>
            </motion.div>
            <motion.div className="about-card" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <p className="about-card-label">Insight</p>
              <p className="about-card-value">Price & market signals</p>
            </motion.div>
            <motion.div className="about-card" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <p className="about-card-label">Speed</p>
              <p className="about-card-value">Search + smart filters</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* INTRO */}
      <motion.section
        className="about-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="about-container about-grid">
          <motion.div variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.h2 className="about-h2" variants={itemReveal}>A modern companion for a timeless purchase.</motion.h2>
            <motion.p className="about-p" variants={itemReveal}>
              Buying or renting property is emotional — and expensive. We built Real Estate Companion
              to bring calm, premium UX and data-backed tools into one place.
            </motion.p>
            <motion.p className="about-p" variants={itemReveal}>
              Our goal is simple: make searching feel effortless, make decisions feel smarter, and
              make the entire journey feel premium.
            </motion.p>

            <motion.div className="about-stats" variants={gridReveal}>
              <motion.div className="about-stat" variants={itemReveal} whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.22 }}>
                <div className="about-stat-number">24/7</div>
                <div className="about-stat-label">Discovery & alerts</div>
              </motion.div>
              <motion.div className="about-stat" variants={itemReveal} whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.22 }}>
                <div className="about-stat-number">1 place</div>
                <div className="about-stat-label">Search + insights</div>
              </motion.div>
              <motion.div className="about-stat" variants={itemReveal} whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.22 }}>
                <div className="about-stat-number">Luxury</div>
                <div className="about-stat-label">Design experience</div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="about-media" variants={itemReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {/* Luxury photo (replace with your own later) */}
            <motion.img
              className="about-image"
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury interior"
              loading="lazy"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35, ease: transitionEase }}
            />
            <motion.div className="about-media-caption" variants={itemReveal}>
              Premium interiors, premium experience.
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* VALUES */}
      <motion.section
        className="about-section about-section-alt"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="about-container">
          <motion.div className="about-section-head" variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.h2 className="about-h2" variants={itemReveal}>What we stand for</motion.h2>
            <motion.p className="about-p" variants={itemReveal}>
              A luxury product isn’t only aesthetics — it’s clarity, trust, and comfort.
            </motion.p>
          </motion.div>

          <motion.div className="about-values" variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
            <motion.div className="about-value" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <h3 className="about-h3">Clarity</h3>
              <p className="about-p">
                Clean layouts, clear info, and smart comparisons — no noisy screens.
              </p>
            </motion.div>

            <motion.div className="about-value" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <h3 className="about-h3">Trust</h3>
              <p className="about-p">
                Better listing quality signals so you can avoid low-effort or misleading posts.
              </p>
            </motion.div>

            <motion.div className="about-value" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <h3 className="about-h3">Insight</h3>
              <p className="about-p">
                Estimations, trends, and market context to support your decisions.
              </p>
            </motion.div>

            <motion.div className="about-value" variants={itemReveal} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.22 }}>
              <h3 className="about-h3">Elegance</h3>
              <p className="about-p">
                A calm, premium UI that feels like a luxury concierge.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FEATURE STRIP */}
      <motion.section
        className="about-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="about-container about-split">
          <motion.div className="about-split-media" variants={itemReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.img
              className="about-image"
              src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury building"
              loading="lazy"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35, ease: transitionEase }}
            />
          </motion.div>

          <motion.div className="about-split-content" variants={gridReveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <motion.h2 className="about-h2" variants={itemReveal}>Built for the features you’re adding next</motion.h2>
            <motion.p className="about-p" variants={itemReveal}>
              Your roadmap fits perfectly in a premium product flow:
            </motion.p>

            <motion.div
              className="about-featureGrid"
              variants={featureGridVariants}
            >
              <motion.div
                className="about-featureCard"
                variants={featureCardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: transitionEase }}
              >
                <div className="about-featureIcon">✓</div>
                <div className="about-featureText">
                  <div className="about-featureTitle">Smart Filters & Search</div>
                  <div className="about-featureSubtitle">Filter by price, size, rooms, and location instantly.</div>
                </div>
              </motion.div>

              <motion.div
                className="about-featureCard"
                variants={featureCardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: transitionEase }}
              >
                <div className="about-featureIcon">◆</div>
                <div className="about-featureText">
                  <div className="about-featureTitle">Price Estimator</div>
                  <div className="about-featureSubtitle">Get a quick estimate using key property details.</div>
                </div>
              </motion.div>

              <motion.div
                className="about-featureCard"
                variants={featureCardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: transitionEase }}
              >
                <div className="about-featureIcon">✓</div>
                <div className="about-featureText">
                  <div className="about-featureTitle">Market Dashboard</div>
                  <div className="about-featureSubtitle">Track trends and average prices by zone.</div>
                </div>
              </motion.div>

              <motion.div
                className="about-featureCard"
                variants={featureCardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: transitionEase }}
              >
                <div className="about-featureIcon">◆</div>
                <div className="about-featureText">
                  <div className="about-featureTitle">Deal Finder</div>
                  <div className="about-featureSubtitle">Spot listings priced below local market value.</div>
                </div>
              </motion.div>

              <motion.div
                className="about-featureCard"
                variants={featureCardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2, ease: transitionEase }}
              >
                <div className="about-featureIcon">✓</div>
                <div className="about-featureText">
                  <div className="about-featureTitle">Listing Quality Scorer</div>
                  <div className="about-featureSubtitle">Score listings by completeness and credibility.</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="about-ctaRow" variants={itemReveal}>
              <motion.a className="about-ctaPrimary" href="/apartments" whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
                Explore Apartments
              </motion.a>
              <motion.a className="about-ctaGhost" href="/contacts" whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
                Contact Us
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOT NOTE */}
      <motion.section
        className="about-section about-note"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="about-container">
          <motion.div
            className="about-note-card"
            variants={itemReveal}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.24, ease: transitionEase }}
          >
            <h3 className="about-h3">A premium experience from the first click.</h3>
            <p className="about-p">
              Real Estate Companion is designed to feel calm, modern, and high-end — while giving you
              the tools to choose smarter.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
