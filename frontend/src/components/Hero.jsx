import "../Hero.css";
import orchardImg from "../assets/orchard.jpg";

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay" />

      <div className="hero-container">
        {/* TEXT */}
        <div className="hero-content">
          <span className="hero-badge">🌱 Smart Agriculture Platform</span>

          <h1 className="hero-title">
            🌾 Smart Farmer <span>Guide</span> 🍎
          </h1>

          <h3 className="hero-tagline">
            “Grow smarter. Farm better. Harvest more.”
          </h3>

          <p className="hero-bio">
            A smart agriculture decision-support system combining real-time
            weather insights, soil moisture estimation, orchard operations,
            and disease advisories — built to help farmers reduce risk and
            improve crop yield.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-outline">Learn More</button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="hero-image-container">
          <img src={orchardImg} alt="Apple Orchard" className="hero-image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
