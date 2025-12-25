import axios from "axios";

export async function searchPlanetImages(aoi, from, to) {
  const body = {
    item_types: ["PSScene"],
    filter: {
      type: "AndFilter",
      config: [
        {
          type: "GeometryFilter",
          field_name: "geometry",
          config: {
            type: "Polygon",
            coordinates: [aoi]
          }
        },
        {
          type: "DateRangeFilter",
          field_name: "acquired",
          config: { gte: from, lte: to }
        }
      ]
    }
  };

  const res = await axios.post(
    "https://api.planet.com/data/v1/quick-search",
    body,
    {
      auth: {
        username: process.env.PLANET_API_KEY,
        password: ""
      }
    }
  );

  return res.data.features;
}
