import { useParams, Link } from "react-router-dom";
import "../App.css";
import "./ServiceDetail.css";

const servicesData = {
  weather: {
    title: "Weather Forecasting",
    icon: "🌦️",
    description:
      "Accurate and localized weather forecasting helps farmers plan irrigation, spraying, and harvesting.",
    points: [
      "7-day and hourly forecasts",
      "Rainfall probability",
      "Temperature & humidity trends",
      "Wind speed monitoring",
    ],
  },
  soil: {
    title: "Soil Moisture Estimation",
    icon: "💧",
    description:
      "Estimate soil moisture using intelligent calculations based on temperature, humidity, and rainfall.",
    points: [
      "Water stress detection",
      "Irrigation recommendations",
      "Improves water efficiency",
    ],
  },
  orchard: {
    title: "Orchard Advisory",
    icon: "🍎",
    description:
      "Stage-wise orchard management guidance specially designed for apple growers.",
    points: [
      "Pruning & flowering guidance",
      "Fruit development monitoring",
      "Seasonal best practices",
    ],
  },
  disease: {
    title: "Disease Risk Alerts",
    icon: "🦠",
    description:
      "Early disease risk alerts help farmers prevent crop loss caused by fungi and moisture.",
    points: [
      "Humidity & rainfall based alerts",
      "Fungal disease prediction",
      "Preventive advisory",
    ],
  },
  spray: {
    title: "Spray Advisory",
    icon: "🌬️",
    description:
      "Smart spraying advice based on wind speed, rainfall, and crop safety.",
    points: [
      "Wind-safe spray windows",
      "Rain-aware spray timing",
      "Chemical loss reduction",
    ],
  },
  analytics: {
    title: "Visual Analytics",
    icon: "📊",
    description:
      "Interactive charts to visualize temperature and soil moisture trends.",
    points: [
      "Hourly & daily charts",
      "Easy trend analysis",
      "Better decision making",
    ],
  },
};

function ServiceDetail() {
  const { slug } = useParams();
  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="service-detail-page">
        <h2>Service not found ❌</h2>
        <Link to="/services" className="back-link">
          ← Back to Services
        </Link>
      </div>
    );
  }

  return (
    <section className="service-detail-page">
      <div className="service-detail-card">
        <span className="detail-icon">{service.icon}</span>
        <h1>{service.title}</h1>
        <p className="detail-desc">{service.description}</p>

        <ul className="detail-list">
          {service.points.map((p, i) => (
            <li key={i}>✔ {p}</li>
          ))}
        </ul>

        <Link to="/services" className="btn-primary detail-btn">
          ← Back to Services
        </Link>
      </div>
    </section>
  );
}

export default ServiceDetail;
