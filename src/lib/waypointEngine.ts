// ── Dynamic Waypoint & Transit Route Generator ─────────────────────────────
// Generates precise transit waypoints by:
// 1. Geocoding sender/receiver addresses (Nominatim — free)
// 2. Getting the actual driving route (OSRM — free)
// 3. Sampling intermediate points along the route
// 4. Reverse-geocoding each point to get real city/town names (Nominatim — free)
// Result: Realistic logistics routes from sender to receiver.

// ── Types ──────────────────────────────────────────────────────────────────

export interface TransitWaypoint {
  name: string;
  type: "origin" | "center" | "flight" | "destination";
  lat: number;
  lng: number;
  order: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Small delay to respect Nominatim's 1 request/second rate limit */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Geocode an address using Nominatim (OpenStreetMap) — free, no API key.
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; display: string; country: string } | null> {
  // 1. Try Nominatim (handles full street addresses well)
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1&email=admin@firstrank logix.com`;
    const nomRes = await fetch(nomUrl);
    if (nomRes.ok) {
      const nomData = await nomRes.json();
      if (nomData && nomData.length > 0) {
        const r = nomData[0];
        const addr = r.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || "";
        const state = addr.state || "";
        const country = addr.country || "";
        const display = [city, state, country].filter(Boolean).join(", ");
        return {
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          display: display || r.display_name?.split(",").slice(0, 3).join(",").trim() || address,
          country,
        };
      }
    }
  } catch {
    // Ignore Nominatim errors and proceed to fallback
  }

  // 2. Fallback to Open-Meteo (city/region only).
  try {
    const parts = address.split(',').map(s => s.trim()).filter(Boolean);
    const queriesToTry = [address];
    if (parts.length > 1) {
      queriesToTry.push(parts[parts.length - 2]); // Usually City
      queriesToTry.push(parts[parts.length - 1]); // Usually State/Country
    }
    if (parts.length > 0 && !queriesToTry.includes(parts[0])) {
      queriesToTry.push(parts[0]);
    }

    for (const query of queriesToTry) {
      if (!query || query.length < 2) continue;
      const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&format=json`;
      const omRes = await fetch(omUrl);
      if (omRes.ok) {
        const omData = await omRes.json();
        if (omData && omData.results && omData.results.length > 0) {
          const r = omData.results[0];
          const display = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
          return {
            lat: r.latitude,
            lng: r.longitude,
            display: display || address,
            country: r.country || "",
          };
        }
      }
    }
  } catch {
    // Ignore Open-Meteo errors
  }

  return null;
}

/**
 * Reverse geocode a coordinate to get a readable city/region name.
 */
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&email=admin@firstrank logix.com`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || data.error) return null;

    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.hamlet || "";
    const county = addr.county || "";
    const state = addr.state || "";
    const country = addr.country || "";

    // Build a nice name: "City, State" or "City, Country"
    if (city && state) return `${city}, ${state}`;
    if (city && country) return `${city}, ${country}`;
    if (county && state) return `${county}, ${state}`;
    if (city) return city;
    if (county) return county;

    // Fallback: use display_name first 2-3 parts
    const parts = (data.display_name || "").split(",").map((s: string) => s.trim());
    if (parts.length >= 2) return parts.slice(0, 2).join(", ");
    return null;
  } catch {
    return null;
  }
}

/**
 * Haversine distance in km between two coordinates.
 */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Great Circle Arc ───────────────────────────────────────────────────────

/**
 * Calculate a point along a great-circle arc between two coordinates.
 * @param t - fraction along the arc (0 = start, 1 = end)
 */
function greatCirclePoint(lat1: number, lng1: number, lat2: number, lng2: number, t: number): { lat: number; lng: number } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const φ1 = toRad(lat1), λ1 = toRad(lng1);
  const φ2 = toRad(lat2), λ2 = toRad(lng2);

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((φ2 - φ1) / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2
    )
  );

  if (d < 1e-10) return { lat: lat1, lng: lng1 };

  const a = Math.sin((1 - t) * d) / Math.sin(d);
  const b = Math.sin(t * d) / Math.sin(d);

  const x = a * Math.cos(φ1) * Math.cos(λ1) + b * Math.cos(φ2) * Math.cos(λ2);
  const y = a * Math.cos(φ1) * Math.sin(λ1) + b * Math.cos(φ2) * Math.sin(λ2);
  const z = a * Math.sin(φ1) + b * Math.sin(φ2);

  return {
    lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDeg(Math.atan2(y, x)),
  };
}

// ── Flight Region Labeling ─────────────────────────────────────────────────

/**
 * Determine a human-readable region label for a geographic coordinate.
 * Used for realistic "In Flight — Over [Region]" labels.
 */
function getRegionLabel(lat: number, lng: number): string {
  // Oceans
  if (lat > 10 && lat < 60 && lng > -70 && lng < -10) return "North Atlantic Ocean";
  if (lat > -40 && lat <= 10 && lng > -50 && lng < 10) return "South Atlantic Ocean";
  if (lat > 10 && lat < 60 && lng > 100 && lng < 180) return "North Pacific Ocean";
  if (lat > 10 && lat < 60 && lng > -180 && lng < -100) return "North Pacific Ocean";
  if (lat > -40 && lat <= 10 && lng > 100 && lng < 180) return "South Pacific Ocean";
  if (lat > -40 && lat <= 10 && lng > -180 && lng < -80) return "South Pacific Ocean";
  if (lat > -60 && lat < -10 && lng > 20 && lng < 120) return "Indian Ocean";

  // Continents / regions
  if (lat > 35 && lat < 72 && lng > -12 && lng < 40) return "European Airspace";
  if (lat > 25 && lat < 50 && lng > -130 && lng < -60) return "North American Airspace";
  if (lat > -5 && lat < 25 && lng > -130 && lng < -60) return "Central American Airspace";
  if (lat > -60 && lat < -5 && lng > -85 && lng < -30) return "South American Airspace";
  if (lat > -35 && lat < 37 && lng > -20 && lng < 55) return "African Airspace";
  if (lat > 10 && lat < 55 && lng > 40 && lng < 70) return "Central Asian Airspace";
  if (lat > 5 && lat < 55 && lng > 70 && lng < 145) return "East Asian Airspace";
  if (lat > -10 && lat <= 5 && lng > 95 && lng < 145) return "Southeast Asian Airspace";
  if (lat > 10 && lat < 35 && lng > 40 && lng < 70) return "Middle Eastern Airspace";
  if (lat > -50 && lat < -10 && lng > 110 && lng < 180) return "Australian Airspace";

  // Arctic / Antarctic
  if (lat > 60) return "Arctic Airspace";
  if (lat < -60) return "Antarctic Airspace";

  return "International Airspace";
}

// ── Airport Database ───────────────────────────────────────────────────────

interface AirportEntry { name: string; lat: number; lng: number; }

const MAJOR_AIRPORTS: AirportEntry[] = [
  // North America
  { name: "Atlanta Hartsfield–Jackson Airport (ATL)", lat: 33.6407, lng: -84.4277 },
  { name: "New York JFK International Airport (JFK)", lat: 40.6413, lng: -73.7781 },
  { name: "Chicago O'Hare International Airport (ORD)", lat: 41.9742, lng: -87.9073 },
  { name: "Los Angeles International Airport (LAX)", lat: 33.9425, lng: -118.4081 },
  { name: "Dallas/Fort Worth International Airport (DFW)", lat: 32.8998, lng: -97.0403 },
  { name: "Miami International Airport (MIA)", lat: 25.7959, lng: -80.2870 },
  { name: "Houston George Bush Airport (IAH)", lat: 29.9902, lng: -95.3368 },
  { name: "Seattle-Tacoma International Airport (SEA)", lat: 47.4502, lng: -122.3088 },
  { name: "Boston Logan International Airport (BOS)", lat: 42.3656, lng: -71.0096 },
  { name: "Denver International Airport (DEN)", lat: 39.8561, lng: -104.6737 },
  { name: "San Francisco International Airport (SFO)", lat: 37.6213, lng: -122.3790 },
  { name: "Washington Dulles International Airport (IAD)", lat: 38.9531, lng: -77.4565 },
  { name: "Toronto Pearson International Airport (YYZ)", lat: 43.6777, lng: -79.6248 },
  { name: "Mexico City Benito Juárez Airport (MEX)", lat: 19.4363, lng: -99.0721 },
  { name: "Cancún International Airport (CUN)", lat: 21.0365, lng: -86.8771 },

  // Europe
  { name: "London Heathrow Airport (LHR)", lat: 51.4700, lng: -0.4543 },
  { name: "Paris Charles de Gaulle Airport (CDG)", lat: 49.0097, lng: 2.5479 },
  { name: "Frankfurt Airport (FRA)", lat: 50.0379, lng: 8.5622 },
  { name: "Amsterdam Schiphol Airport (AMS)", lat: 52.3105, lng: 4.7683 },
  { name: "Madrid Barajas International Airport (MAD)", lat: 40.4983, lng: -3.5676 },
  { name: "Rome Fiumicino Leonardo da Vinci Airport (FCO)", lat: 41.8003, lng: 12.2389 },
  { name: "Munich Airport (MUC)", lat: 48.3538, lng: 11.7861 },
  { name: "Lisbon Humberto Delgado Airport (LIS)", lat: 38.7756, lng: -9.1354 },
  { name: "Istanbul Airport (IST)", lat: 41.2753, lng: 28.7519 },
  { name: "Moscow Sheremetyevo Airport (SVO)", lat: 55.9726, lng: 37.4146 },

  // Middle East
  { name: "Dubai International Airport (DXB)", lat: 25.2532, lng: 55.3657 },
  { name: "Doha Hamad International Airport (DOH)", lat: 25.2731, lng: 51.6081 },
  { name: "Abu Dhabi International Airport (AUH)", lat: 24.4430, lng: 54.6511 },
  { name: "Riyadh King Khalid Airport (RUH)", lat: 24.9576, lng: 46.6988 },
  { name: "Jeddah King Abdulaziz Airport (JED)", lat: 21.6796, lng: 39.1565 },

  // Asia
  { name: "Singapore Changi Airport (SIN)", lat: 1.3644, lng: 103.9915 },
  { name: "Hong Kong International Airport (HKG)", lat: 22.3080, lng: 113.9185 },
  { name: "Tokyo Narita International Airport (NRT)", lat: 35.7720, lng: 140.3929 },
  { name: "Seoul Incheon International Airport (ICN)", lat: 37.4602, lng: 126.4407 },
  { name: "Shanghai Pudong International Airport (PVG)", lat: 31.1434, lng: 121.8052 },
  { name: "Beijing Capital International Airport (PEK)", lat: 40.0799, lng: 116.6031 },
  { name: "Bangkok Suvarnabhumi Airport (BKK)", lat: 13.6900, lng: 100.7501 },
  { name: "Mumbai Chhatrapati Shivaji Airport (BOM)", lat: 19.0896, lng: 72.8656 },
  { name: "Delhi Indira Gandhi Airport (DEL)", lat: 28.5562, lng: 77.1000 },
  { name: "Kuala Lumpur International Airport (KUL)", lat: 2.7456, lng: 101.7099 },

  // Africa
  { name: "Lagos Murtala Muhammed Airport (LOS)", lat: 6.5774, lng: 3.3214 },
  { name: "Nairobi Jomo Kenyatta Airport (NBO)", lat: -1.3192, lng: 36.9275 },
  { name: "Johannesburg O.R. Tambo Airport (JNB)", lat: -26.1367, lng: 28.2411 },
  { name: "Cairo International Airport (CAI)", lat: 30.1219, lng: 31.4056 },
  { name: "Accra Kotoka International Airport (ACC)", lat: 5.6052, lng: -0.1668 },
  { name: "Addis Ababa Bole International Airport (ADD)", lat: 8.9779, lng: 38.7993 },
  { name: "Casablanca Mohammed V Airport (CMN)", lat: 33.3675, lng: -7.5898 },
  { name: "Abuja Nnamdi Azikiwe Airport (ABV)", lat: 9.0065, lng: 7.2632 },
  { name: "Cape Town International Airport (CPT)", lat: -33.9648, lng: 18.6017 },
  { name: "Dar es Salaam Julius Nyerere Airport (DAR)", lat: -6.8781, lng: 39.2026 },

  // South America
  { name: "São Paulo Guarulhos Airport (GRU)", lat: -23.4356, lng: -46.4731 },
  { name: "Buenos Aires Ezeiza Airport (EZE)", lat: -34.8222, lng: -58.5358 },
  { name: "Bogotá El Dorado Airport (BOG)", lat: 4.7016, lng: -74.1469 },
  { name: "Lima Jorge Chávez Airport (LIM)", lat: -12.0219, lng: -77.1143 },
  { name: "Santiago Arturo Merino Benítez Airport (SCL)", lat: -33.3930, lng: -70.7858 },

  // Oceania
  { name: "Sydney Kingsford Smith Airport (SYD)", lat: -33.9399, lng: 151.1753 },
  { name: "Melbourne Tullamarine Airport (MEL)", lat: -37.6690, lng: 144.8410 },
  { name: "Auckland Airport (AKL)", lat: -37.0082, lng: 174.7850 },
];

function findNearestAirport(lat: number, lng: number): AirportEntry {
  let best = MAJOR_AIRPORTS[0];
  let bestDist = Infinity;
  for (const ap of MAJOR_AIRPORTS) {
    const d = haversineKm(lat, lng, ap.lat, ap.lng);
    if (d < bestDist) { bestDist = d; best = ap; }
  }
  return best;
}

// ── Domestic Facility Names ────────────────────────────────────────────────

const FACILITY_SUFFIXES = [
  "Sorting Facility",
  "Distribution Center",
  "Logistics Hub",
  "Processing Center",
  "Transit Depot",
  "Freight Terminal",
  "Package Center",
  "Regional Hub",
];

function getFacilitySuffix(index: number): string {
  return FACILITY_SUFFIXES[index % FACILITY_SUFFIXES.length];
}

// ── Distribution Center Enrichment ─────────────────────────────────────────

/**
 * Post-process a generated waypoints array to automatically insert a
 * "[City] Distribution Center" entry after every center-type waypoint.
 *
 * This does NOT modify how waypoints are generated — it only enriches the
 * already-generated list by adding distribution center stops.
 */
export function enrichWithDistributionCenters(waypoints: TransitWaypoint[]): TransitWaypoint[] {
  const enriched: TransitWaypoint[] = [];

  for (const wp of waypoints) {
    enriched.push(wp);

    // Only add a Distribution Center entry for center-type stops
    // (skip origin, destination, and flight legs)
    if (wp.type === 'center') {
      // Skip if this waypoint is already a Distribution Center
      if (wp.name.toLowerCase().includes('distribution center')) {
        continue;
      }

      // Strip any known facility suffix to get the bare location name
      let baseName = wp.name;
      for (const suffix of FACILITY_SUFFIXES) {
        if (baseName.endsWith(suffix)) {
          baseName = baseName.slice(0, baseName.length - suffix.length).replace(/,?\s*$/, '').trim();
          break;
        }
      }

      enriched.push({
        name: `${baseName} Distribution Center`,
        type: 'center',
        lat: wp.lat,
        lng: wp.lng,
        order: 0, // Re-numbered below
      });
    }
  }

  // Re-assign sequential order numbers after enrichment
  return enriched.map((wp, i) => ({ ...wp, order: i }));
}

// ── Main Function ──────────────────────────────────────────────────────────

export interface WaypointResult {
  waypoints: TransitWaypoint[];
  error?: string;
}

export async function generateTransitWaypoints(
  senderAddress: string,
  receiverAddress: string
): Promise<WaypointResult> {
  // 1) Geocode sender
  const originGeo = await geocodeAddress(senderAddress);
  if (!originGeo) {
    return { waypoints: [], error: "Could not locate sender address. Check the address and try again." };
  }

  await delay(1100);

  // 2) Geocode receiver
  const destGeo = await geocodeAddress(receiverAddress);
  if (!destGeo) {
    return { waypoints: [], error: "Could not locate receiver address. Check the address and try again." };
  }

  const totalDistKm = haversineKm(originGeo.lat, originGeo.lng, destGeo.lat, destGeo.lng);
  const isInternational = (originGeo.country && destGeo.country && originGeo.country !== destGeo.country) || totalDistKm > 1200;

  // ── INTERNATIONAL ROUTE ──────────────────────────────────────────────────
  if (isInternational) {
    const originAirport = findNearestAirport(originGeo.lat, originGeo.lng);
    const destAirport = findNearestAirport(destGeo.lat, destGeo.lng);

    const waypoints: TransitWaypoint[] = [];
    let order = 0;
    const usedNames = new Set<string>();

    // 1. Origin
    waypoints.push({ name: originGeo.display, type: "origin", lat: originGeo.lat, lng: originGeo.lng, order: order++ });
    usedNames.add(originGeo.display.toLowerCase());

    // 2. Origin Land Leg — OSRM driving route to airport
    const originLandPoints = await getDrivingWaypoints(originGeo.lat, originGeo.lng, originAirport.lat, originAirport.lng, 3);
    for (let i = 0; i < originLandPoints.length; i++) {
      const pt = originLandPoints[i];
      await delay(1100);
      const name = await reverseGeocode(pt.lat, pt.lng);
      let finalName = name ? `${name} ${getFacilitySuffix(i)}` : `Regional ${getFacilitySuffix(i)}`;
      if (usedNames.has(finalName.toLowerCase())) finalName = `${finalName} ${i + 1}`;
      usedNames.add(finalName.toLowerCase());
      waypoints.push({ name: finalName, type: "center", lat: pt.lat, lng: pt.lng, order: order++ });
    }

    // 3. Origin Airport — Departure
    waypoints.push({ name: `${originAirport.name} — Departure Hub`, type: "flight", lat: originAirport.lat, lng: originAirport.lng, order: order++ });

    // 4. Flight leg — Great-circle arc with region-aware labels
    const flightDistKm = haversineKm(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng);
    const flightPoints = Math.min(12, Math.max(4, Math.round(flightDistKm / 800)));
    const prevRegion = { value: "" };

    for (let i = 1; i <= flightPoints; i++) {
      const t = i / (flightPoints + 1);
      const pt = greatCirclePoint(originAirport.lat, originAirport.lng, destAirport.lat, destAirport.lng, t);
      const region = getRegionLabel(pt.lat, pt.lng);

      // Only label the region if it changed, otherwise use altitude label
      let label: string;
      if (region !== prevRegion.value) {
        label = `In Flight — Over ${region}`;
        prevRegion.value = region;
      } else {
        const altFt = 35000 + Math.round(Math.sin(t * Math.PI) * 6000);
        label = `In Transit — Cruising at ${altFt.toLocaleString()} ft`;
      }

      waypoints.push({ name: label, type: "flight", lat: pt.lat, lng: pt.lng, order: order++ });
    }

    // 5. Destination Airport — Customs & Clearance
    waypoints.push({ name: `${destAirport.name} — Customs & Clearance`, type: "flight", lat: destAirport.lat, lng: destAirport.lng, order: order++ });

    // 6. Destination Land Leg — OSRM driving route from airport to destination
    const destLandPoints = await getDrivingWaypoints(destAirport.lat, destAirport.lng, destGeo.lat, destGeo.lng, 3);
    for (let i = 0; i < destLandPoints.length; i++) {
      const pt = destLandPoints[i];
      await delay(1100);
      const name = await reverseGeocode(pt.lat, pt.lng);
      let finalName = name ? `${name} ${getFacilitySuffix(i + 4)}` : `Local ${getFacilitySuffix(i + 4)}`;
      if (usedNames.has(finalName.toLowerCase())) finalName = `${finalName} ${i + 1}`;
      usedNames.add(finalName.toLowerCase());
      waypoints.push({ name: finalName, type: "center", lat: pt.lat, lng: pt.lng, order: order++ });
    }

    // 7. Destination
    waypoints.push({ name: destGeo.display, type: "destination", lat: destGeo.lat, lng: destGeo.lng, order: order++ });

    return { waypoints };
  }

  // ── DOMESTIC ROUTE ───────────────────────────────────────────────────────

  // Determine number of intermediate stops based on distance
  const numSamples = totalDistKm < 200 ? 4 : totalDistKm < 600 ? 6 : totalDistKm < 1000 ? 8 : 10;

  // 3) Try to get OSRM driving route
  let routeCoords: [number, number][] = [];
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originGeo.lng},${originGeo.lat};${destGeo.lng},${destGeo.lat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.length > 0) {
      routeCoords = data.routes[0].geometry?.coordinates || [];
    }
  } catch {
    // fall back to straight-line sampling
  }

  // 4) Sample points from route or interpolate
  let samplePoints: { lat: number; lng: number }[] = [];

  if (routeCoords.length > 10) {
    // Sample evenly from the route geometry (skip first and last — those are origin/dest)
    const step = Math.floor(routeCoords.length / (numSamples + 1));
    for (let i = 1; i <= numSamples; i++) {
      const idx = Math.min(step * i, routeCoords.length - 2);
      const coord = routeCoords[idx];
      if (coord) {
        samplePoints.push({ lat: coord[1], lng: coord[0] }); // GeoJSON is [lng, lat]
      }
    }
  } else {
    // Fallback: straight-line interpolation between origin and dest
    for (let i = 1; i <= numSamples; i++) {
      const t = i / (numSamples + 1);
      samplePoints.push({
        lat: originGeo.lat + (destGeo.lat - originGeo.lat) * t,
        lng: originGeo.lng + (destGeo.lng - originGeo.lng) * t,
      });
    }
  }

  // 5) Filter out points too close to each other (< 15 km apart)
  const filteredPoints: { lat: number; lng: number }[] = [];
  let lastPt = { lat: originGeo.lat, lng: originGeo.lng };
  for (const pt of samplePoints) {
    if (haversineKm(lastPt.lat, lastPt.lng, pt.lat, pt.lng) > 15) {
      filteredPoints.push(pt);
      lastPt = pt;
    }
  }

  // 6) Reverse-geocode each sample point to get real city/town names
  const waypoints: TransitWaypoint[] = [];
  let order = 0;

  // Origin
  waypoints.push({
    name: originGeo.display,
    type: "origin",
    lat: originGeo.lat,
    lng: originGeo.lng,
    order: order++,
  });

  const usedNames = new Set<string>([originGeo.display.toLowerCase()]);

  for (let i = 0; i < filteredPoints.length; i++) {
    const pt = filteredPoints[i];

    // Rate-limit: respect Nominatim's 1 req/sec policy
    await delay(1100);

    const name = await reverseGeocode(pt.lat, pt.lng);
    const suffix = getFacilitySuffix(i);
    let finalName = name ? `${name} ${suffix}` : `Transit ${suffix} ${i + 1}`;

    // Deduplicate
    if (usedNames.has(finalName.toLowerCase())) {
      finalName = name ? `${name} ${getFacilitySuffix(i + 3)}` : `Regional ${suffix} ${i + 1}`;
    }
    usedNames.add(finalName.toLowerCase());

    waypoints.push({
      name: finalName,
      type: "center",
      lat: pt.lat,
      lng: pt.lng,
      order: order++,
    });
  }

  // Destination
  waypoints.push({
    name: destGeo.display,
    type: "destination",
    lat: destGeo.lat,
    lng: destGeo.lng,
    order: order++,
  });

  return { waypoints };
}

// ── Helper: Get driving waypoints between two points via OSRM ──────────────

async function getDrivingWaypoints(
  startLat: number, startLng: number,
  endLat: number, endLng: number,
  numPoints: number
): Promise<{ lat: number; lng: number }[]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.length > 0) {
      const coords: [number, number][] = data.routes[0].geometry?.coordinates || [];
      if (coords.length > 4) {
        const step = Math.floor(coords.length / (numPoints + 1));
        const points: { lat: number; lng: number }[] = [];
        for (let i = 1; i <= numPoints; i++) {
          const idx = Math.min(step * i, coords.length - 2);
          const c = coords[idx];
          if (c) points.push({ lat: c[1], lng: c[0] });
        }
        return points;
      }
    }
  } catch {
    // Fallback below
  }

  // Fallback: straight-line interpolation
  const points: { lat: number; lng: number }[] = [];
  for (let i = 1; i <= numPoints; i++) {
    const t = i / (numPoints + 1);
    points.push({
      lat: startLat + (endLat - startLat) * t,
      lng: startLng + (endLng - startLng) * t,
    });
  }
  return points;
}
