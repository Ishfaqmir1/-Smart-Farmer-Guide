import { Link } from "react-router-dom";
import "../App.css";
import "../Services.css";

function Services() {
  return (
    <section className="services-page">
      {/* HEADER */}
      <div className="services-header">
        <h1>🍎 Our Services</h1>
        <p>
          SmartFarmer provides intelligent tools that help farmers make
          confident, data-driven decisions.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="services-grid">
        <Link to="/services/weather" className="service-card">
          <span className="service-icon">🌦️</span>
          <h3>Weather Forecasting</h3>
          <p>
            Accurate short-term and 7-day weather forecasts tailored to your
            location.
          </p>
        </Link>

        <Link to="/services/soil" className="service-card">
          <span className="service-icon">💧</span>
          <h3>Soil Moisture Estimation</h3>
          <p>
            Intelligent soil moisture estimation based on weather and humidity
            patterns.
          </p>
        </Link>

        <Link to="/services/orchard" className="service-card">
          <span className="service-icon">🍎</span>
          <h3>Orchard Advisory</h3>
          <p>
            Crop-specific guidance for apple orchards including pruning,
            flowering, and fruit stages.
          </p>
        </Link>

        <Link to="/services/disease" className="service-card">
          <span className="service-icon">🦠</span>
          <h3>Disease Risk Alerts</h3>
          <p>
            Early warnings for fungal and weather-driven crop diseases to
            prevent losses.
          </p>
        </Link>

        <Link to="/services/spray" className="service-card">
          <span className="service-icon">🌬️</span>
          <h3>Spray Advisory</h3>
          <p>
            Smart spray recommendations based on wind speed, rain, and crop
            stage.
          </p>
        </Link>

        <Link to="/services/analytics" className="service-card">
          <span className="service-icon">📊</span>
          <h3>Visual Analytics</h3>
          <p>
            Easy-to-understand charts to analyze temperature and moisture
            trends.
          </p>
        </Link>
      </div>
    </section>
  );
}

export default Services;
