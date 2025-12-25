import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function OrchardMap() {
  const featureGroupRef = useRef(null);
  const [orchards, setOrchards] = useState([]);

  const getColor = (ndvi) => {
    if (ndvi > 0.6) return "green";
    if (ndvi > 0.4) return "yellow";
    return "red";
  };

  /* LOAD ORCHARDS */
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orchards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrchards(await res.json());
    };
    load();
  }, []);

  /* CREATE ORCHARD */
  const handleCreate = async (e) => {
    const geoJSON = e.layer.toGeoJSON();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/orchards", {
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

  /* DELETE */
  const deleteOrchard = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/orchards/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrchards((prev) => prev.filter((o) => o._id !== id));
  };

  return (
    <>
      <MapContainer
        center={[34.11, 74.8]}
        zoom={14}
        style={{ height: "360px", borderRadius: "16px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreate}
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              marker: false,
              polyline: false,
            }}
          />

          {orchards.map((o) => (
            <GeoJSON
              key={o._id}
              data={o.aoi}
              style={{
                color: getColor(o.ndvi),
                fillOpacity: 0.45,
              }}
            />
          ))}
        </FeatureGroup>
      </MapContainer>

      {/* DASHBOARD */}
      <div className="panel">
        <h3>🌱 Orchard Health</h3>
        {orchards.map((o) => (
          <p key={o._id}>
            {o.name} → NDVI: <strong>{o.ndvi}</strong>
            <button
              onClick={() => deleteOrchard(o._id)}
              style={{ marginLeft: "12px", color: "red" }}
            >
              Delete
            </button>
          </p>
        ))}
      </div>
    </>
  );
}
