// ── Major International Airports Database ──────────────────────────────────
// Curated dataset of ~120 major international airports worldwide.
// Used to find nearest departure/arrival airports for international shipments.

export interface Airport {
  name: string;
  iata: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
}

export const AIRPORTS: Airport[] = [
  // ── North America ──
  { name: "John F. Kennedy International Airport", iata: "JFK", city: "New York", country: "United States", countryCode: "US", lat: 40.6413, lng: -73.7781 },
  { name: "Los Angeles International Airport", iata: "LAX", city: "Los Angeles", country: "United States", countryCode: "US", lat: 33.9416, lng: -118.4085 },
  { name: "O'Hare International Airport", iata: "ORD", city: "Chicago", country: "United States", countryCode: "US", lat: 41.9742, lng: -87.9073 },
  { name: "Hartsfield-Jackson Atlanta International Airport", iata: "ATL", city: "Atlanta", country: "United States", countryCode: "US", lat: 33.6407, lng: -84.4277 },
  { name: "Dallas/Fort Worth International Airport", iata: "DFW", city: "Dallas", country: "United States", countryCode: "US", lat: 32.8998, lng: -97.0403 },
  { name: "Denver International Airport", iata: "DEN", city: "Denver", country: "United States", countryCode: "US", lat: 39.8561, lng: -104.6737 },
  { name: "San Francisco International Airport", iata: "SFO", city: "San Francisco", country: "United States", countryCode: "US", lat: 37.6213, lng: -122.3790 },
  { name: "Seattle-Tacoma International Airport", iata: "SEA", city: "Seattle", country: "United States", countryCode: "US", lat: 47.4502, lng: -122.3088 },
  { name: "Miami International Airport", iata: "MIA", city: "Miami", country: "United States", countryCode: "US", lat: 25.7959, lng: -80.2870 },
  { name: "George Bush Intercontinental Airport", iata: "IAH", city: "Houston", country: "United States", countryCode: "US", lat: 29.9902, lng: -95.3368 },
  { name: "Newark Liberty International Airport", iata: "EWR", city: "Newark", country: "United States", countryCode: "US", lat: 40.6895, lng: -74.1745 },
  { name: "Boston Logan International Airport", iata: "BOS", city: "Boston", country: "United States", countryCode: "US", lat: 42.3656, lng: -71.0096 },
  { name: "Minneapolis-Saint Paul International Airport", iata: "MSP", city: "Minneapolis", country: "United States", countryCode: "US", lat: 44.8848, lng: -93.2223 },
  { name: "Detroit Metropolitan Wayne County Airport", iata: "DTW", city: "Detroit", country: "United States", countryCode: "US", lat: 42.2124, lng: -83.3534 },
  { name: "Philadelphia International Airport", iata: "PHL", city: "Philadelphia", country: "United States", countryCode: "US", lat: 39.8721, lng: -75.2411 },
  { name: "Toronto Pearson International Airport", iata: "YYZ", city: "Toronto", country: "Canada", countryCode: "CA", lat: 43.6777, lng: -79.6248 },
  { name: "Vancouver International Airport", iata: "YVR", city: "Vancouver", country: "Canada", countryCode: "CA", lat: 49.1967, lng: -123.1815 },
  { name: "Montréal-Pierre Elliott Trudeau International Airport", iata: "YUL", city: "Montréal", country: "Canada", countryCode: "CA", lat: 45.4706, lng: -73.7408 },
  { name: "Mexico City International Airport", iata: "MEX", city: "Mexico City", country: "Mexico", countryCode: "MX", lat: 19.4363, lng: -99.0721 },
  { name: "Cancún International Airport", iata: "CUN", city: "Cancún", country: "Mexico", countryCode: "MX", lat: 21.0365, lng: -86.8771 },

  // ── Europe ──
  { name: "London Heathrow Airport", iata: "LHR", city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.4700, lng: -0.4543 },
  { name: "London Gatwick Airport", iata: "LGW", city: "London", country: "United Kingdom", countryCode: "GB", lat: 51.1537, lng: -0.1821 },
  { name: "Paris Charles de Gaulle Airport", iata: "CDG", city: "Paris", country: "France", countryCode: "FR", lat: 49.0097, lng: 2.5479 },
  { name: "Frankfurt Airport", iata: "FRA", city: "Frankfurt", country: "Germany", countryCode: "DE", lat: 50.0379, lng: 8.5622 },
  { name: "Amsterdam Schiphol Airport", iata: "AMS", city: "Amsterdam", country: "Netherlands", countryCode: "NL", lat: 52.3105, lng: 4.7683 },
  { name: "Madrid-Barajas Adolfo Suárez Airport", iata: "MAD", city: "Madrid", country: "Spain", countryCode: "ES", lat: 40.4983, lng: -3.5676 },
  { name: "Barcelona–El Prat Airport", iata: "BCN", city: "Barcelona", country: "Spain", countryCode: "ES", lat: 41.2974, lng: 2.0833 },
  { name: "Munich Airport", iata: "MUC", city: "Munich", country: "Germany", countryCode: "DE", lat: 48.3537, lng: 11.7750 },
  { name: "Rome Fiumicino Leonardo da Vinci Airport", iata: "FCO", city: "Rome", country: "Italy", countryCode: "IT", lat: 41.8003, lng: 12.2389 },
  { name: "Milan Malpensa Airport", iata: "MXP", city: "Milan", country: "Italy", countryCode: "IT", lat: 45.6306, lng: 8.7281 },
  { name: "Zurich Airport", iata: "ZRH", city: "Zurich", country: "Switzerland", countryCode: "CH", lat: 47.4647, lng: 8.5492 },
  { name: "Vienna International Airport", iata: "VIE", city: "Vienna", country: "Austria", countryCode: "AT", lat: 48.1103, lng: 16.5697 },
  { name: "Lisbon Humberto Delgado Airport", iata: "LIS", city: "Lisbon", country: "Portugal", countryCode: "PT", lat: 38.7756, lng: -9.1354 },
  { name: "Dublin Airport", iata: "DUB", city: "Dublin", country: "Ireland", countryCode: "IE", lat: 53.4264, lng: -6.2499 },
  { name: "Copenhagen Airport", iata: "CPH", city: "Copenhagen", country: "Denmark", countryCode: "DK", lat: 55.6181, lng: 12.6560 },
  { name: "Stockholm Arlanda Airport", iata: "ARN", city: "Stockholm", country: "Sweden", countryCode: "SE", lat: 59.6519, lng: 17.9186 },
  { name: "Oslo Gardermoen Airport", iata: "OSL", city: "Oslo", country: "Norway", countryCode: "NO", lat: 60.1939, lng: 11.1004 },
  { name: "Helsinki-Vantaa Airport", iata: "HEL", city: "Helsinki", country: "Finland", countryCode: "FI", lat: 60.3172, lng: 24.9633 },
  { name: "Warsaw Chopin Airport", iata: "WAW", city: "Warsaw", country: "Poland", countryCode: "PL", lat: 52.1657, lng: 20.9671 },
  { name: "Istanbul Airport", iata: "IST", city: "Istanbul", country: "Turkey", countryCode: "TR", lat: 41.2753, lng: 28.7519 },
  { name: "Athens International Airport", iata: "ATH", city: "Athens", country: "Greece", countryCode: "GR", lat: 37.9364, lng: 23.9445 },
  { name: "Brussels Airport", iata: "BRU", city: "Brussels", country: "Belgium", countryCode: "BE", lat: 50.9014, lng: 4.4844 },
  { name: "Moscow Sheremetyevo International Airport", iata: "SVO", city: "Moscow", country: "Russia", countryCode: "RU", lat: 55.9726, lng: 37.4146 },

  // ── Middle East ──
  { name: "Dubai International Airport", iata: "DXB", city: "Dubai", country: "United Arab Emirates", countryCode: "AE", lat: 25.2532, lng: 55.3657 },
  { name: "Abu Dhabi International Airport", iata: "AUH", city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", lat: 24.4330, lng: 54.6511 },
  { name: "Hamad International Airport", iata: "DOH", city: "Doha", country: "Qatar", countryCode: "QA", lat: 25.2731, lng: 51.6081 },
  { name: "King Abdulaziz International Airport", iata: "JED", city: "Jeddah", country: "Saudi Arabia", countryCode: "SA", lat: 21.6796, lng: 39.1565 },
  { name: "King Khalid International Airport", iata: "RUH", city: "Riyadh", country: "Saudi Arabia", countryCode: "SA", lat: 24.9578, lng: 46.6989 },
  { name: "Ben Gurion Airport", iata: "TLV", city: "Tel Aviv", country: "Israel", countryCode: "IL", lat: 32.0114, lng: 34.8867 },
  { name: "Bahrain International Airport", iata: "BAH", city: "Manama", country: "Bahrain", countryCode: "BH", lat: 26.2708, lng: 50.6336 },
  { name: "Muscat International Airport", iata: "MCT", city: "Muscat", country: "Oman", countryCode: "OM", lat: 23.5933, lng: 58.2844 },
  { name: "Kuwait International Airport", iata: "KWI", city: "Kuwait City", country: "Kuwait", countryCode: "KW", lat: 29.2267, lng: 47.9689 },

  // ── Asia ──
  { name: "Narita International Airport", iata: "NRT", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.7647, lng: 140.3864 },
  { name: "Tokyo Haneda Airport", iata: "HND", city: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.5494, lng: 139.7798 },
  { name: "Beijing Capital International Airport", iata: "PEK", city: "Beijing", country: "China", countryCode: "CN", lat: 40.0799, lng: 116.6031 },
  { name: "Shanghai Pudong International Airport", iata: "PVG", city: "Shanghai", country: "China", countryCode: "CN", lat: 31.1443, lng: 121.8083 },
  { name: "Hong Kong International Airport", iata: "HKG", city: "Hong Kong", country: "Hong Kong", countryCode: "HK", lat: 22.3080, lng: 113.9185 },
  { name: "Singapore Changi Airport", iata: "SIN", city: "Singapore", country: "Singapore", countryCode: "SG", lat: 1.3644, lng: 103.9915 },
  { name: "Incheon International Airport", iata: "ICN", city: "Seoul", country: "South Korea", countryCode: "KR", lat: 37.4602, lng: 126.4407 },
  { name: "Suvarnabhumi Airport", iata: "BKK", city: "Bangkok", country: "Thailand", countryCode: "TH", lat: 13.6900, lng: 100.7501 },
  { name: "Kuala Lumpur International Airport", iata: "KUL", city: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", lat: 2.7456, lng: 101.7099 },
  { name: "Ngurah Rai International Airport", iata: "DPS", city: "Bali", country: "Indonesia", countryCode: "ID", lat: -8.7482, lng: 115.1672 },
  { name: "Soekarno-Hatta International Airport", iata: "CGK", city: "Jakarta", country: "Indonesia", countryCode: "ID", lat: -6.1256, lng: 106.6559 },
  { name: "Indira Gandhi International Airport", iata: "DEL", city: "New Delhi", country: "India", countryCode: "IN", lat: 28.5562, lng: 77.1000 },
  { name: "Chhatrapati Shivaji Maharaj International Airport", iata: "BOM", city: "Mumbai", country: "India", countryCode: "IN", lat: 19.0896, lng: 72.8656 },
  { name: "Ninoy Aquino International Airport", iata: "MNL", city: "Manila", country: "Philippines", countryCode: "PH", lat: 14.5086, lng: 121.0198 },
  { name: "Noi Bai International Airport", iata: "HAN", city: "Hanoi", country: "Vietnam", countryCode: "VN", lat: 21.2187, lng: 105.8050 },
  { name: "Tan Son Nhat International Airport", iata: "SGN", city: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN", lat: 10.8188, lng: 106.6520 },
  { name: "Taiwan Taoyuan International Airport", iata: "TPE", city: "Taipei", country: "Taiwan", countryCode: "TW", lat: 25.0797, lng: 121.2342 },

  // ── Africa ──
  { name: "O.R. Tambo International Airport", iata: "JNB", city: "Johannesburg", country: "South Africa", countryCode: "ZA", lat: -26.1392, lng: 28.2460 },
  { name: "Cape Town International Airport", iata: "CPT", city: "Cape Town", country: "South Africa", countryCode: "ZA", lat: -33.9649, lng: 18.6017 },
  { name: "Cairo International Airport", iata: "CAI", city: "Cairo", country: "Egypt", countryCode: "EG", lat: 30.1219, lng: 31.4056 },
  { name: "Jomo Kenyatta International Airport", iata: "NBO", city: "Nairobi", country: "Kenya", countryCode: "KE", lat: -1.3192, lng: 36.9278 },
  { name: "Murtala Muhammed International Airport", iata: "LOS", city: "Lagos", country: "Nigeria", countryCode: "NG", lat: 6.5774, lng: 3.3211 },
  { name: "Nnamdi Azikiwe International Airport", iata: "ABV", city: "Abuja", country: "Nigeria", countryCode: "NG", lat: 9.0065, lng: 7.2632 },
  { name: "Addis Ababa Bole International Airport", iata: "ADD", city: "Addis Ababa", country: "Ethiopia", countryCode: "ET", lat: 8.9779, lng: 38.7993 },
  { name: "Mohammed V International Airport", iata: "CMN", city: "Casablanca", country: "Morocco", countryCode: "MA", lat: 33.3675, lng: -7.5898 },
  { name: "Kotoka International Airport", iata: "ACC", city: "Accra", country: "Ghana", countryCode: "GH", lat: 5.6052, lng: -0.1668 },

  // ── South America ──
  { name: "São Paulo–Guarulhos International Airport", iata: "GRU", city: "São Paulo", country: "Brazil", countryCode: "BR", lat: -23.4356, lng: -46.4731 },
  { name: "Rio de Janeiro–Galeão International Airport", iata: "GIG", city: "Rio de Janeiro", country: "Brazil", countryCode: "BR", lat: -22.8100, lng: -43.2506 },
  { name: "Buenos Aires Ministro Pistarini International Airport", iata: "EZE", city: "Buenos Aires", country: "Argentina", countryCode: "AR", lat: -34.8222, lng: -58.5358 },
  { name: "Santiago Arturo Merino Benítez International Airport", iata: "SCL", city: "Santiago", country: "Chile", countryCode: "CL", lat: -33.3930, lng: -70.7858 },
  { name: "El Dorado International Airport", iata: "BOG", city: "Bogotá", country: "Colombia", countryCode: "CO", lat: 4.7016, lng: -74.1469 },
  { name: "Jorge Chávez International Airport", iata: "LIM", city: "Lima", country: "Peru", countryCode: "PE", lat: -12.0219, lng: -77.1143 },

  // ── Oceania ──
  { name: "Sydney Kingsford Smith Airport", iata: "SYD", city: "Sydney", country: "Australia", countryCode: "AU", lat: -33.9461, lng: 151.1772 },
  { name: "Melbourne Airport", iata: "MEL", city: "Melbourne", country: "Australia", countryCode: "AU", lat: -37.6690, lng: 144.8410 },
  { name: "Brisbane Airport", iata: "BNE", city: "Brisbane", country: "Australia", countryCode: "AU", lat: -27.3842, lng: 153.1175 },
  { name: "Auckland Airport", iata: "AKL", city: "Auckland", country: "New Zealand", countryCode: "NZ", lat: -37.0082, lng: 174.7850 },
];

/**
 * Calculate Haversine distance between two coordinates in kilometers.
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest international airport to given coordinates.
 */
export function findNearestAirport(lat: number, lng: number): Airport {
  let nearest = AIRPORTS[0];
  let minDist = Infinity;
  for (const airport of AIRPORTS) {
    const dist = haversineDistance(lat, lng, airport.lat, airport.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = airport;
    }
  }
  return nearest;
}
