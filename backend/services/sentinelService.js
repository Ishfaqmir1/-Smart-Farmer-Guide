import axios from "axios";

/* ============================
   GET ACCESS TOKEN
============================ */
async function getAccessToken() {
  const res = await axios.post(
    "https://services.sentinel-hub.com/oauth/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SENTINEL_CLIENT_ID,
      client_secret: process.env.SENTINEL_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return res.data.access_token;
}

/* ============================
   GET NDVI (AOI BASED)
============================ */
export async function getNDVI(aoi) {
  const token = await getAccessToken();

  const payload = {
    input: {
      bounds: {
        geometry: aoi,
      },
      data: [
        {
          type: "sentinel-2-l2a",
          dataFilter: {
            maxCloudCoverage: 20,
          },
        },
      ],
    },
    aggregation: {
      timeRange: {
        from: "2025-01-01T00:00:00Z",
        to: new Date().toISOString(),
      },
      aggregationInterval: { of: "P1D" },
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08"],
            output: { bands: 1 }
          };
        }
        function evaluatePixel(s) {
          let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04);
          return [ndvi];
        }
      `,
    },
    calculations: {
      default: {
        statistics: {
          default: {
            percentile: {
              k: [50],
            },
          },
        },
      },
    },
  };

  const res = await axios.post(
    "https://services.sentinel-hub.com/api/v1/statistics",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = res.data.data;
  if (!data.length) return null;

  return data[0].outputs.default.stats.percentile["50"];
}
