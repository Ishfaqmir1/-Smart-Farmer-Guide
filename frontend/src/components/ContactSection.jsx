import "../ContactSection.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function ContactSection() {
  return (
    <section className="contact-sec" id="contact">
      {/* HEADER */}
      <div className="contact-header fade-up">
        <h2>
          Get in <span>Touch</span>
        </h2>
        <p>
          Have questions about SmartFarmer? Reach out to us — we’re here to help
          you grow smarter.
        </p>
      </div>

      {/* CONTENT */}
      <div className="contact-content">
        {/* LEFT INFO */}
        <div className="contact-info fade-left">
          <div className="contact-card">
            <FaEnvelope className="contact-icon email" />
            <div>
              <h4>Email</h4>
              <p>support@smartfarmer.ai</p>
            </div>
          </div>

          <div className="contact-card delay-1">
            <FaPhoneAlt className="contact-icon phone" />
            <div>
              <h4>Phone</h4>
              <p>+91 7006 123 456</p>
            </div>
          </div>

          <div className="contact-card delay-2">
            <FaMapMarkerAlt className="contact-icon location" />
            <div>
              <h4>Location</h4>
              <p>Kashmir, India</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <form className="contact-form fade-right" noValidate>
          <div className="field">
            <input type="text" required placeholder=" " />
            <label>Your Name</label>
          </div>

          <div className="field">
            <input type="email" required placeholder=" " />
            <label>Your Email</label>
          </div>

          <div className="field">
            <textarea rows="5" required placeholder=" " />
            <label>Your Message</label>
          </div>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
