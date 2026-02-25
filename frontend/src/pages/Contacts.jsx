// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import "./contacts.css";

export default function Contacts() {
  return (
    <div className="contact">

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-container">
          <p className="contact-kicker">Contact</p>
          <h1>Let’s talk.</h1>
          <p>
            Questions about listings, partnerships, or the platform?
            Reach out and we’ll respond shortly.
          </p>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-main">
        <div className="contact-container contact-grid">

          {/* LEFT SIDE */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Contact Information</h2>

            <div className="contact-block">
              <span>Email</span>
              <p>support@realestatecompanion.com</p>
            </div>

            <div className="contact-block">
              <span>Phone</span>
              <p>+355 00 000 000</p>
            </div>

            <div className="contact-block">
              <span>Location</span>
              <p>Tirane, Albania</p>
            </div>

            <div className="contact-block">
              <span>Working Hours</span>
              <p>Monday – Friday • 09:00 – 18:00</p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            className="contact-formCard"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2>Send a Message</h2>

            <form className="contact-form">
              <input type="text" placeholder="Full name" required />
              <input type="email" placeholder="Email address" required />
              <input type="text" placeholder="Subject" required />
              <textarea placeholder="Your message..." rows="5" required />
              <button type="submit">Send Message</button>
            </form>
          </motion.div>

        </div>
      </section>

      {/* MAP SECTION */}
      <section className="contact-map">
        <iframe
          title="Tirane Map"
          src="https://www.google.com/maps?q=Tirana%2C%20Albania&z=13&output=embed"
          loading="lazy"
        />
      </section>

    </div>
  );
}
