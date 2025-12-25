import BenefitsSection from "../components/BenefitsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import OrchardMap from "../components/OrchardMap";


export default function Home({
  location,
  wind,
  advisoryClass,
  advisoryIcon,
  advisoryText,
  windAdvice,
  orchard,
  disease,
  diseaseColor,
  showSpray,
  setShowSpray,
  daily,
  getDayName,
  getWeatherIcon,
  onDayClick,
  animate,
  selectedHourly,
  formatTimeAMPM,
  Bar,
  chartData
}) {
  return (
    <>
      <Hero />
      <BenefitsSection />

      {/* HEADER */}
      <header className="header motion">
        <h1>🌾 Smart Farmer Guide 🍎</h1>
        <h3>“Grow smarter. Farm better. Harvest more.”</h3>
        <p>
          A smart agriculture decision-support system combining weather,
          soil moisture estimation, orchard operations, and disease
          advisories for farmers.
        </p>
      </header>

      {/* MAIN WEATHER LAYOUT */}
      <div className="container">
        {/* LEFT */}
        <div className="left">
          <div className="panel current motion">
            <h2>🌤 Current Weather</h2>
            <h1>{Math.round(location.main.temp)}°C</h1>
            <p>{location.weather[0].description}</p>
            <p>💨 Wind: {wind} km/h</p>
            <p>📍 {location.name}</p>
          </div>

          <div className={`advisory-card motion ${advisoryClass}`}>
            <div className="advisory-icon">{advisoryIcon}</div>
            <div>
              <h3>Farm Advisory</h3>
              <p>{advisoryText}</p>
              {windAdvice && <p>{windAdvice}</p>}
            </div>
          </div>

          <div className="panel motion">
            <h3>🌳 Orchard Operations (Apple)</h3>
            <p>{orchard}</p>
            <p>
              🦠 Disease:{" "}
              <span style={{ color: diseaseColor, fontWeight: "bold" }}>
                {disease}
              </span>
            </p>
          </div>

          <div className="panel motion">
            <h3 onClick={() => setShowSpray(!showSpray)}>
              📅 Apple Spray Schedule {showSpray ? "▲" : "▼"}
            </h3>

            {showSpray && (
              <ul>
                <li>Green tip → Captan / Dodine</li>
                <li>Pink bud → Mancozeb / Propineb</li>
                <li>Fruit set → Carbendazim</li>
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <h2>📅 7-Day Forecast</h2>

          <div className="forecast">
            {daily.map((d, i) => (
              <div
                key={i}
                className="forecast-card motion"
                onClick={() => onDayClick(d.date)}
              >
                <h4>{getDayName(d.date)}</h4>
                <span className="icon">{getWeatherIcon(d.rain, d.max)}</span>
                <p>⬆ {d.max.toFixed(1)}°C</p>
                <p>⬇ {d.min.toFixed(1)}°C</p>
              </div>
            ))}
          </div>

          <div className={`hourly ${animate ? "show" : ""}`}>
            {selectedHourly.map((h, i) => (
              <div key={i} className="hour-card motion">
                <p>{formatTimeAMPM(h.time)}</p>
                <p>🌡 {h.temp}°C</p>
                <p>💧 {h.humidity}%</p>
                <p>🌧 {h.pop}%</p>
                <p>💨 {h.wind} km/h</p>
              </div>
            ))}
          </div>

          <Bar data={chartData} />
        </div>
      </div>

      {/* ✅ FULL WIDTH SECTIONS */}
      {/* ================= SATELLITE / NDVI ================= */}
<section id="map" className="panel motion" style={{ maxWidth: "1200px", margin: "40px auto" }}>
  <h2>🛰 Orchard Health (Satellite NDVI)</h2>

  <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "12px" }}>
    Vegetation health derived from satellite imagery (NDVI)
  </p>

  <OrchardMap />

  {/* NDVI SUMMARY */}
  <div style={{ marginTop: "14px" }}>
    <p>
      🌱 Vegetation Health:{" "}
      <strong style={{ color: "#22c55e" }}>Good</strong>
    </p>
    <p style={{ fontSize: "14px", color: "#94a3b8" }}>
      NDVI indicates healthy canopy density across the orchard.
    </p>
  </div>
</section>

      <ContactSection />
      <Footer />
    </>
  );
}
