export function ndviHealth(ndvi) {
  if (ndvi < 0.3) return "Poor vegetation";
  if (ndvi < 0.5) return "Moderate vegetation";
  return "Healthy vegetation";
}

export function soilMoistureFromNDVI(ndvi) {
  // empirical agriculture model
  return Number((ndvi * 0.6 + 0.2).toFixed(2));
}
