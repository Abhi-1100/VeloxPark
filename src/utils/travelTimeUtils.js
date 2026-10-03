/**
 * travelTimeUtils.js
 * Accurate distance and realistic travel time calculations for Indian urban & highway traffic conditions.
 */

/**
 * Calculates realistic driving travel time for Indian city, suburban, and highway conditions.
 * Free-flow routing algorithms (like standard OSRM) typically underestimate Indian travel times
 * by 1.8x to 2.0x due to traffic signals, pedestrian crossings, speed bumps, and congestion.
 *
 * @param {number} distanceKm - Distance in kilometers
 * @param {number|null} rawDurationSeconds - Optional raw duration in seconds from OSRM
 * @returns {string} Formatted duration string e.g. "30 min" or "1 hr 15 min"
 */
export function calculateRealisticDrivingTime(distanceKm, rawDurationSeconds = null) {
  const km = parseFloat(distanceKm);
  if (!Number.isFinite(km) || km <= 0) return '2 min';

  // Base urban/suburban traffic speeds in India:
  // - 0 to 3 km (Local core/dense market): ~20 km/h -> 3.0 min/km
  // - 3 to 10 km (Urban arterials): ~24 km/h -> 2.5 min/km
  // - 10 to 25 km (Town-to-town / state highway with traffic): ~30 km/h -> 2.0 min/km
  //   (e.g., 15.0 km between Changa/Padgol and VV Nagar takes ~30 mins, matching Google Maps)
  // - 25 to 60 km (National highway segments): ~42 km/h -> 1.4 min/km
  // - > 60 km (Expressway/Highways): ~55 km/h -> 1.1 min/km
  let estimatedMinutes;

  if (km < 0.5) {
    estimatedMinutes = 2;
  } else if (km <= 3) {
    estimatedMinutes = Math.round(km * 2.8) + 1;
  } else if (km <= 10) {
    estimatedMinutes = Math.round(km * 2.3);
  } else if (km <= 25) {
    // 15 km -> 30 mins
    estimatedMinutes = Math.round(km * 2.0);
  } else if (km <= 60) {
    estimatedMinutes = Math.round(km * 1.42);
  } else {
    estimatedMinutes = Math.round(km * 1.15);
  }

  // If raw router duration is supplied, blend with realistic traffic multiplier
  if (rawDurationSeconds && rawDurationSeconds > 0) {
    const rawMinutes = rawDurationSeconds / 60;
    // OSRM base time typically needs 1.80x - 1.95x adjustment for Indian town/city traffic
    const trafficAdjustedMinutes = Math.round(rawMinutes * 1.88);
    // Blend the two models for maximum precision
    estimatedMinutes = Math.round((estimatedMinutes * 0.6) + (trafficAdjustedMinutes * 0.4));
  }

  estimatedMinutes = Math.max(1, estimatedMinutes);

  if (estimatedMinutes >= 60) {
    const hours = Math.floor(estimatedMinutes / 60);
    const mins = estimatedMinutes % 60;
    return mins > 0 ? `${hours} hr ${mins} min` : `${hours} hr`;
  }

  return `${estimatedMinutes} min`;
}

/**
 * Formats distance in meters or km to a human-readable label.
 * @param {number} metres 
 * @returns {string} e.g. "15.0 km" or "450 m"
 */
export function formatRouteDistance(metres) {
  const m = Number(metres);
  if (!Number.isFinite(m) || m <= 0) return '0.0 km';
  if (m >= 1000) {
    return `${(m / 1000).toFixed(1)} km`;
  }
  return `${Math.round(m)} m`;
}
