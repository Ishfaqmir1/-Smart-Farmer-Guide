import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leafmap";
import "leaflet/dist/leaflet.css";

export default function NDVIHeatmap({ points }) {
  return (
    <MapContainer center={[34.1, 74.8]} zoom={13} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <HeatmapLayer
        points={points}
        longitudeExtractor={p => p.lng}
        latitudeExtractor={p => p.lat}
        intensityExtractor={p => p.ndvi}
      />
    </MapContainer>
  );
}
