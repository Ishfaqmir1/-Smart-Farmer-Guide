import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

/* ================= HELPERS ================= */
const getDayName = (date) =>
  new Date(date).toLocaleDateString("en-US", { weekday: "short" });

const getWeatherIcon = (rain, temp) => {
  if (rain > 10) return "🌧️";
  if (rain > 0) return "🌦️";
  if (temp < 2) return "❄️";
  return "☀️";
};

const formatTimeAMPM = (time) => {
  const hour = Number(time.split(":")[0]);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12} ${suffix}`;
};

function App() {
  const [location, setLocation] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [daily, setDaily] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [selectedHourly, setSelectedHourly] = useState([]);
  const [soil, setSoil] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => loadAll(pos.coords.latitude, pos.coords.longitude),
      () => alert("Location permission denied")
    );
  }, []);

  const estimateSoil = (t, h, r) =>
    Math.max(0.08, Math.min(0.3 - t * 0.004 + h * 0.001 + r * 0.02, 0.45)).toFixed(
      3
    );

  const loadAll = async (lat, lon) => {
    const current = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then((r) => r.json());
    setLocation(current);

    const forecast = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then((r) => r.json());

    setForecastList(forecast.list);

    const h12 = forecast.list.slice(0, 12).map((h) => ({
      time: h.dt_txt.split(" ")[1],
      temp: h.main.temp,
      humidity: h.main.humidity,
      rain: h.rain?.["3h"] || 0,
      pop: Math.round((h.pop || 0) * 100),
    }));

    setHourly(h12);
    setSelectedHourly(h12);
    setSoil({
      value: estimateSoil(h12[0].temp, h12[0].humidity, h12[0].rain),
    });

    const byDate = {};
    forecast.list.forEach((f) => {
      const d = f.dt_txt.split(" ")[0];
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(f);
    });

    setDaily(
      Object.keys(byDate)
        .slice(0, 7)
        .map((d) => ({
          date: d,
          max: Math.max(...byDate[d].map((i) => i.main.temp_max)),
          min: Math.min(...byDate[d].map((i) => i.main.temp_min)),
          rain: byDate[d].reduce(
            (s, i) => s + (i.rain?.["3h"] || 0),
            0
          ),
        }))
    );
  };

  if (!location || !soil) return <h2 className="loading">Loading…</h2>;

  /*ADVISORY ENGINE  */
  const todayRain = daily[0]?.rain || 0;
  const humidity = hourly[0]?.humidity || 0;
  const wetDays = daily.slice(0, 5).filter((d) => d.rain > 2).length;
  const month = new Date().getMonth(); // 0–11

  /*  ORCHARD OPERATIONS*/
  let orchard = "pruning is advised to maintain tree health and breakage due to snow";
  if (month <= 1)
    orchard = "🍎 Dormancy period → No irrigation / no fertilizer";
  else if (month === 1 || month === 2)
    orchard = "✂️ Pruning recommended for apple trees";
  else if (month === 2 || month === 3)
    orchard = "🌱 Grafting / budding suitable period";
  else if (month >= 3 && month <= 5)
    orchard = "🌸 Flowering → Avoid pesticide spray";
  else if (month >= 6 && month <= 8)
    orchard = "🍎 Fruit development → Monitor pests & moisture";

  /*DISEASE & PESTICIDE  */
  let disease = "Low disease risk";
  let pesticide = "No spray required";

  if (wetDays >= 3 && humidity > 80) {
    disease = "Apple Scab / Powdery Mildew";
    pesticide =
      "Fungicide: Mancozeb or Carbendazim (spray only in dry window)";
  }

  /*  MAIN ADVISORY  */
  let advisoryText = "✂️ Pruning recommended for traditional/high density apple trees";
  let advisoryClass = "good";
  let advisoryIcon = "✅";

  if (todayRain > 5) {
    advisoryText =
      "Rain expected → Do NOT spray pesticides or irrigate";
    advisoryClass = "danger";
    advisoryIcon = "🌧️";
  } else if (wetDays >= 3 && humidity > 80) {
    advisoryText =
      "Continuous wet spell → High fungal disease risk in apple orchards";
    advisoryClass = "warning";
    advisoryIcon = "🍎";
  } else if (soil.value < 0.18) {
    advisoryText = "Low soil moisture → Irrigation required";
    advisoryClass = "info";
    advisoryIcon = "💧";
  }

  /*  CHART */
  const chartData = {
    labels: selectedHourly.map((h) => formatTimeAMPM(h.time)),
    datasets: [
      {
        label: "Temperature (°C)",
        data: selectedHourly.map((h) => h.temp),
        backgroundColor: "#38bdf8",
      },
      {
        label: "Soil Moisture",
        data: selectedHourly.map(() => soil.value),
        backgroundColor: "#4ade80",
      },
    ],
  };

  const onDayClick = (date) => {
    setAnimate(false);
    setTimeout(() => {
      setSelectedHourly(
        forecastList
          .filter((f) => f.dt_txt.startsWith(date))
          .slice(0, 12)
          .map((h) => ({
            time: h.dt_txt.split(" ")[1],
            temp: h.main.temp,
            humidity: h.main.humidity,
            pop: Math.round((h.pop || 0) * 100),
          }))
      );
      setAnimate(true);
    }, 80);
  };

  return (
    <div className="app">
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

      <div className="container">
        {/* LEFT */}
        <div className="left">
          <div className="panel current motion">
            <h2>🌤 Current Weather</h2>
            <h1>{Math.round(location.main.temp)}°C</h1>
            <p>{location.weather[0].description}</p>
            <p>📍 {location.name}</p>
          </div>

          <div className={`advisory-card motion ${advisoryClass}`}>
            <div className="advisory-icon">{advisoryIcon}</div>
            <div>
              <h3>Farm Advisory</h3>
              <p>{advisoryText}</p>
            </div>
          </div>

          <div className="panel motion">
            <h3>🌳 Orchard Operations (Apple)</h3>
            <p>{orchard}</p>
            <p>🦠 Disease: {disease}</p>
            <p>🧪 Pesticide: {pesticide}</p>
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
                <span className="icon">
                  {getWeatherIcon(d.rain, d.max)}
                </span>
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
                <p>🌧 {h.pop}% chance</p>
              </div>
            ))}
          </div>

          <h2>📊 Temperature & Soil Moisture</h2>
          <Bar data={chartData} />
        <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
