import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function MapAOI({ onAOISelect }) {
  const onCreated = (e) => {
    const layer = e.layer;
    const coords = layer.getLatLngs()[0].map(p => [p.lng, p.lat]);
    onAOISelect(coords);
  };

  return (
    <MapContainer center={[34.1, 74.8]} zoom={13} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl position="topright" onCreated={onCreated} draw={{ rectangle: false }} />
      </FeatureGroup>
    </MapContainer>
  );
}
