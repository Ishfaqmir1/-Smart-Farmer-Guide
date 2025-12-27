import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  GeoJSON,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

/* =========================
   NDVI → COLOR MAPPING
========================= */
const getNDVIColor = (ndvi) => {
  if (ndvi === null || ndvi === undefined) return "#999"; // unknown
  if (ndvi >= 0.6) return "#2ecc71"; // green
  if (ndvi >= 0.4) return "#f1c40f"; // yellow
  return "#e74c3c"; // red
};

export default function OrchardMap() {
  const featureGroupRef = useRef(null);
  const [orchards, setOrchards] = useState([]);
  const [showNDVI, setShowNDVI] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  /* =========================
     LOAD ORCHARDS
  ========================= */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/orchards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrchards(data);
        }
      })
      .catch(console.error);
  }, [API_URL, token]);

  /* =========================
     CREATE ORCHARD
  ========================= */
  const handleCreate = async (e) => {
    const geoJSON = e.layer.toGeoJSON();

    const res = await fetch(`${API_URL}/api/orchards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "My Orchard",
        aoi: geoJSON.geometry,
      }),
    });

    const saved = await res.json();
    setOrchards((prev) => [...prev, saved]);
  };

  return (
    <>
      {/* ================= MAP ================= */}
      <MapContainer
        center={[34.11, 74.8]}
        zoom={14}
        style={{ height: "380px", borderRadius: "16px" }}
      >
        {/* BASE MAP */}
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* DRAW + ORCHARDS */}
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreate}
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              polyline: false,
              marker: false,
              circlemarker: false,
            }}
          />

          {/* NDVI COLORED ORCHARDS */}
          {showNDVI &&
            orchards.map((o) => (
              <GeoJSON
                key={o._id}
                data={o.aoi}
                style={{
                  color: getNDVIColor(o.ndvi),
                  weight: 2,
                  fillOpacity: 0.55,
                }}
              />
            ))}
        </FeatureGroup>
      </MapContainer>

      {/* ================= CONTROLS ================= */}
      <div style={{ marginTop: "12px" }}>
        <button
          onClick={() => setShowNDVI(!showNDVI)}
          className="btn-primary"
        >
          {showNDVI ? "Hide NDVI" : "Show NDVI"}
        </button>
      </div>

      {/* ================= LEGEND ================= */}
      <div className="panel" style={{ marginTop: "16px" }}>
        <h3>🌱 Orchard Health (NDVI)</h3>
        <p>
          <span style={{ color: "#2ecc71" }}>●</span> Healthy (≥ 0.6)<br />
          <span style={{ color: "#f1c40f" }}>●</span> Moderate (0.4 – 0.6)<br />
          <span style={{ color: "#e74c3c" }}>●</span> Poor (&lt; 0.4)
        </p>
      </div>
    </>
  );
}
