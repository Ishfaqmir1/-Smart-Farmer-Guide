import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

function DrawAOI({ onComplete }) {
  const [points, setPoints] = useState([]);

  useMapEvents({
    click(e) {
      setPoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
    dblclick() {
      onComplete(points);
      setPoints([]);
    },
  });

  return points.length > 0 ? <Polygon positions={points} /> : null;
}

export default function FarmMap({ setAOI }) {
  return (
    <MapContainer
      center={[34.0721, 74.8054]} // Kashmir default
      zoom={12}
      style={{ height: "400px", width: "100%" }}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DrawAOI onComplete={setAOI} />
    </MapContainer>
  );
}
