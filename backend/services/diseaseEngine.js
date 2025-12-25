export function diseaseRisk({ ndvi, humidity, rain, temp }) {
  if (humidity > 85 && rain > 5 && temp >= 10 && temp <= 20) {
    return {
      level: "High",
      disease: "Apple Scab",
      action: "Apply fungicide after rain-free window"
    };
  }

  if (humidity > 70 && temp >= 15 && temp <= 25) {
    return {
      level: "Moderate",
      disease: "Powdery Mildew",
      action: "Monitor orchard & prune infected shoots"
    };
  }

  return {
    level: "Low",
    disease: "None",
    action: "No action required"
  };
}
