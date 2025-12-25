import { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider from "./context/AuthContext";

// HOME PAGE UI component
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";


// Chart
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

// helpers
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
  const [showSpray, setShowSpray] = useState(false);

  // LOCATION + WEATHER
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
      wind: h.wind?.speed || 0,
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
          rain: byDate[d].reduce((s, i) => s + (i.rain?.["3h"] || 0), 0),
        }))
    );
  };

  if (!location || !soil) return <h2 className="loading">Loading…</h2>;

  // advisory engine
  const todayRain = daily[0]?.rain || 0;
  const humidity = hourly[0]?.humidity || 0;
  const wetDays = daily.slice(0, 5).filter((d) => d.rain > 2).length;

  const wind = hourly[0]?.wind || 0;
  const month = new Date().getMonth();

  let windAdvice = "";
  if (wind > 25) windAdvice = "🌬️ Strong wind — avoid spraying";
  else if (wind > 14) windAdvice = "💨 Moderate wind — caution";

  let orchard = "pruning is advised to maintain tree health";
  if (month <= 1) orchard = "🍎 Dormancy — no irrigation";
  else if (month === 1 || month === 2) orchard = "✂️ Pruning season";
  else if (month === 2 || month === 3) orchard = "🌱 Grafting period";
  else if (month >= 3 && month <= 5) orchard = "🌸 Flowering — avoid spray";
  else if (month >= 6 && month <= 8) orchard = "🍎 Fruit development";

  let disease = "Low Risk";
  let diseaseColor = "green";

  if (wetDays >= 3 && humidity > 80) {
    disease = "Fungal Risk: Scab/Mildew";
    diseaseColor = "orange";
  }
  if (todayRain > 6) {
    disease = "Spray not advised";
    diseaseColor = "red";
  }

  let advisoryText = "✂️ Pruning recommended";
  let advisoryClass = "good";
  let advisoryIcon = "✂️";

  if (todayRain > 5) {
    advisoryText = "Rain expected — avoid spraying";
    advisoryClass = "danger";
    advisoryIcon = "🌧️";
  } else if (wetDays >= 3 && humidity > 80) {
    advisoryText = "Wet spell — fungal disease risk";
    advisoryClass = "warning";
    advisoryIcon = "🍎";
  } else if (soil.value < 0.18) {
    advisoryText = "Low soil moisture — irrigation needed";
    advisoryClass = "info";
    advisoryIcon = "💧";
  }

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
            wind: h.wind?.speed || 0,
          }))
      );
      setAnimate(true);
    }, 80);
  };

  return (
        <Router>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                location={location}
                wind={wind}
                advisoryClass={advisoryClass}
                advisoryIcon={advisoryIcon}
                advisoryText={advisoryText}
                windAdvice={windAdvice}
                orchard={orchard}
                disease={disease}
                diseaseColor={diseaseColor}
                showSpray={showSpray}
                setShowSpray={setShowSpray}
                daily={daily}
                getDayName={getDayName}
                getWeatherIcon={getWeatherIcon}
                onDayClick={onDayClick}
                animate={animate}
                selectedHourly={selectedHourly}
                formatTimeAMPM={formatTimeAMPM}
                Bar={Bar}
                chartData={chartData}
              />
                
            }
          />
            
<Route path="/services" element={<Services />} />
<Route path="/services/:slug" element={<ServiceDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
 
  );
}

export default App;
