
// Constants
const AUTH_KEY = 'firstrank_admin_auth';
const ADMIN_PASSWORD = 'Firstrank@768';

// EMAILJS CONFIGURATION
// ============================================
// IMPORTANT: Replace these with your actual EmailJS credentials
const EMAILJS_PUBLIC_KEY = 'YHu_W23A0rG6z2iGq';      // Get from EmailJS Dashboard > Account > General
const EMAILJS_SERVICE_ID = 'service_yx0bmlt';      // Get from EmailJS Dashboard > Email Services
const EMAILJS_TEMPLATE_ID = 'template_uz9h9c9';    // Get from EmailJS Dashboard > Email Templates

// Initialize EmailJS
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

// Send shipment notification email to receiver
async function sendShipmentNotificationEmail(shipment) {
  try {

    const templateParams = {
      receiver_email: shipment.receiver.email,
      receiver_name: shipment.receiver.name,
      tracking_code: shipment.trackingCode,
      sender_name: shipment.sender.name,
      origin: shipment.origin,
      destination: shipment.destination,
      carrier: shipment.carrier,
      shipment_type: shipment.shipmentType,
      contents: shipment.packageInfo.contents,
      weight: shipment.packageInfo.weight,
      expected_delivery: shipment.estimatedDelivery || 'To be determined'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    console.log('Shipment notification email sent successfully to:', shipment.receiver.email);
    return true;
  } catch (error) {
    console.error('Failed to send shipment notification email:', error);
    return false;
  }
}

// Distribution Warehouses - Global Hubs with state-level coordinates
// Distribution Warehouses - US State Capitals & Global Hubs
const DISTRIBUTION_WAREHOUSES = [
  // US State Capitals
  { id: 'us-al-mtg', name: 'Montgomery Logistics Hub', location: 'Montgomery, AL, USA', lat: 32.3792, lng: -86.3077 },
  { id: 'us-ak-jun', name: 'Juneau Logistics Hub', location: 'Juneau, AK, USA', lat: 58.3019, lng: -134.4197 },
  { id: 'us-az-phx', name: 'Phoenix Logistics Hub', location: 'Phoenix, AZ, USA', lat: 33.4484, lng: -112.0740 },
  { id: 'us-ar-lr', name: 'Little Rock Logistics Hub', location: 'Little Rock, AR, USA', lat: 34.7465, lng: -92.2896 },
  { id: 'us-ca-sac', name: 'Sacramento Logistics Hub', location: 'Sacramento, CA, USA', lat: 38.5816, lng: -121.4944 },
  { id: 'us-co-den', name: 'Denver Logistics Hub', location: 'Denver, CO, USA', lat: 39.7392, lng: -104.9903 },
  { id: 'us-ct-hfd', name: 'Hartford Logistics Hub', location: 'Hartford, CT, USA', lat: 41.7658, lng: -72.6734 },
  { id: 'us-de-dov', name: 'Dover Logistics Hub', location: 'Dover, DE, USA', lat: 39.1582, lng: -75.5244 },
  { id: 'us-fl-tlh', name: 'Tallahassee Logistics Hub', location: 'Tallahassee, FL, USA', lat: 30.4383, lng: -84.2807 },
  { id: 'us-ga-atl', name: 'Atlanta Logistics Hub', location: 'Atlanta, GA, USA', lat: 33.7490, lng: -84.3880 },
  { id: 'us-hi-hnl', name: 'Honolulu Logistics Hub', location: 'Honolulu, HI, USA', lat: 21.3069, lng: -157.8583 },
  { id: 'us-id-boi', name: 'Boise Logistics Hub', location: 'Boise, ID, USA', lat: 43.6150, lng: -116.2023 },
  { id: 'us-il-spf', name: 'Springfield Logistics Hub', location: 'Springfield, IL, USA', lat: 39.7817, lng: -89.6501 },
  { id: 'us-in-ind', name: 'Indianapolis Logistics Hub', location: 'Indianapolis, IN, USA', lat: 39.7684, lng: -86.1581 },
  { id: 'us-ia-dsm', name: 'Des Moines Logistics Hub', location: 'Des Moines, IA, USA', lat: 41.5868, lng: -93.6250 },
  { id: 'us-ks-top', name: 'Topeka Logistics Hub', location: 'Topeka, KS, USA', lat: 39.0473, lng: -95.6752 },
  { id: 'us-ky-fft', name: 'Frankfort Logistics Hub', location: 'Frankfort, KY, USA', lat: 38.2009, lng: -84.8733 },
  { id: 'us-la-br', name: 'Baton Rouge Logistics Hub', location: 'Baton Rouge, LA, USA', lat: 30.4515, lng: -91.1871 },
  { id: 'us-me-aug', name: 'Augusta Logistics Hub', location: 'Augusta, ME, USA', lat: 44.3106, lng: -69.7795 },
  { id: 'us-md-ann', name: 'Annapolis Logistics Hub', location: 'Annapolis, MD, USA', lat: 38.9784, lng: -76.4922 },
  { id: 'us-ma-bos', name: 'Boston Logistics Hub', location: 'Boston, MA, USA', lat: 42.3601, lng: -71.0589 },
  { id: 'us-mi-lan', name: 'Lansing Logistics Hub', location: 'Lansing, MI, USA', lat: 42.7325, lng: -84.5555 },
  { id: 'us-mn-stp', name: 'Saint Paul Logistics Hub', location: 'Saint Paul, MN, USA', lat: 44.9537, lng: -93.0900 },
  { id: 'us-ms-jac', name: 'Jackson Logistics Hub', location: 'Jackson, MS, USA', lat: 32.2988, lng: -90.1848 },
  { id: 'us-mo-jef', name: 'Jefferson City Logistics Hub', location: 'Jefferson City, MO, USA', lat: 38.5767, lng: -92.1735 },
  { id: 'us-mt-hel', name: 'Helena Logistics Hub', location: 'Helena, MT, USA', lat: 46.5891, lng: -112.0391 },
  { id: 'us-ne-lin', name: 'Lincoln Logistics Hub', location: 'Lincoln, NE, USA', lat: 40.8136, lng: -96.7026 },
  { id: 'us-nv-cc', name: 'Carson City Logistics Hub', location: 'Carson City, NV, USA', lat: 39.1638, lng: -119.7674 },
  { id: 'us-nh-con', name: 'Concord Logistics Hub', location: 'Concord, NH, USA', lat: 43.2081, lng: -71.5375 },
  { id: 'us-nj-tre', name: 'Trenton Logistics Hub', location: 'Trenton, NJ, USA', lat: 40.2171, lng: -74.7429 },
  { id: 'us-nm-sfe', name: 'Santa Fe Logistics Hub', location: 'Santa Fe, NM, USA', lat: 35.6869, lng: -105.9378 },
  { id: 'us-ny-alb', name: 'Albany Logistics Hub', location: 'Albany, NY, USA', lat: 42.6526, lng: -73.7562 },
  { id: 'us-nc-ral', name: 'Raleigh Logistics Hub', location: 'Raleigh, NC, USA', lat: 35.7796, lng: -78.6382 },
  { id: 'us-nd-bis', name: 'Bismarck Logistics Hub', location: 'Bismarck, ND, USA', lat: 46.8083, lng: -100.7837 },
  { id: 'us-oh-col', name: 'Columbus Logistics Hub', location: 'Columbus, OH, USA', lat: 39.9612, lng: -82.9988 },
  { id: 'us-ok-okc', name: 'Oklahoma City Logistics Hub', location: 'Oklahoma City, OK, USA', lat: 35.4676, lng: -97.5164 },
  { id: 'us-or-sal', name: 'Salem Logistics Hub', location: 'Salem, OR, USA', lat: 44.9429, lng: -123.0351 },
  { id: 'us-pa-har', name: 'Harrisburg Logistics Hub', location: 'Harrisburg, PA, USA', lat: 40.2732, lng: -76.8867 },
  { id: 'us-ri-pro', name: 'Providence Logistics Hub', location: 'Providence, RI, USA', lat: 41.8240, lng: -71.4128 },
  { id: 'us-sc-col', name: 'Columbia Logistics Hub', location: 'Columbia, SC, USA', lat: 34.0007, lng: -81.0348 },
  { id: 'us-sd-pie', name: 'Pierre Logistics Hub', location: 'Pierre, SD, USA', lat: 44.3683, lng: -100.3510 },
  { id: 'us-tn-nas', name: 'Nashville Logistics Hub', location: 'Nashville, TN, USA', lat: 36.1627, lng: -86.7816 },
  { id: 'us-tx-aus', name: 'Austin Logistics Hub', location: 'Austin, TX, USA', lat: 30.2672, lng: -97.7431 },
  { id: 'us-ut-slc', name: 'Salt Lake City Logistics Hub', location: 'Salt Lake City, UT, USA', lat: 40.7608, lng: -111.8910 },
  { id: 'us-vt-mon', name: 'Montpelier Logistics Hub', location: 'Montpelier, VT, USA', lat: 44.2601, lng: -72.5754 },
  { id: 'us-va-ric', name: 'Richmond Logistics Hub', location: 'Richmond, VA, USA', lat: 37.5407, lng: -77.4360 },
  { id: 'us-wa-oly', name: 'Olympia Logistics Hub', location: 'Olympia, WA, USA', lat: 47.0379, lng: -122.9007 },
  { id: 'us-wv-cha', name: 'Charleston Logistics Hub', location: 'Charleston, WV, USA', lat: 38.3498, lng: -81.6326 },
  { id: 'us-wi-mad', name: 'Madison Logistics Hub', location: 'Madison, WI, USA', lat: 43.0731, lng: -89.4012 },
  { id: 'us-wy-che', name: 'Cheyenne Logistics Hub', location: 'Cheyenne, WY, USA', lat: 41.1400, lng: -104.8202 },

  // International Hubs
  { id: 'lon', name: 'London Logistics Hub', location: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { id: 'dub', name: 'Dubai Logistics Hub', location: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { id: 'sin', name: 'Singapore Logistics Hub', location: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'hkg', name: 'Hong Kong Logistics Hub', location: 'Hong Kong, China', lat: 22.3193, lng: 114.1694 },
  { id: 'syd', name: 'Sydney Logistics Hub', location: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { id: 'tok', name: 'Tokyo Logistics Hub', location: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { id: 'fra', name: 'Frankfurt Logistics Hub', location: 'Frankfurt, Germany', lat: 50.1109, lng: 8.6821 },
  { id: 'par', name: 'Paris Logistics Hub', location: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { id: 'tor', name: 'Toronto Logistics Hub', location: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
  { id: 'mum', name: 'Mumbai Logistics Hub', location: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },

  // USA Export Hubs
  { id: 'us-ny-jfk', name: 'JFK International Export Hub', location: 'New York, NY, USA', lat: 40.6413, lng: -73.7781 },

  // Poland Logistics Hubs (States/Provinces)
  { id: 'waw-port', name: 'Warsaw International Airport Hub', location: 'Warsaw, Masovian, Poland', lat: 52.1659, lng: 20.9671 },
  { id: 'pl-mas', name: 'Warsaw Logistics Hub', location: 'Warsaw, Masovian, Poland', lat: 52.2297, lng: 21.0122 },
  { id: 'pl-les', name: 'Krakow Logistics Hub', location: 'Krakow, Lesser Poland, Poland', lat: 50.0647, lng: 19.9450 },
  { id: 'pl-low', name: 'Wroclaw Logistics Hub', location: 'Wroclaw, Lower Silesian, Poland', lat: 51.1079, lng: 17.0385 },
  { id: 'pl-pom', name: 'Gdansk Logistics Hub', location: 'Gdansk, Pomeranian, Poland', lat: 54.3520, lng: 18.6466 },
  { id: 'pl-gre', name: 'Poznan Logistics Hub', location: 'Poznan, Greater Poland, Poland', lat: 52.4064, lng: 16.9252 },
  { id: 'pl-lod', name: 'Lodz Logistics Hub', location: 'Lodz, Lodzkie, Poland', lat: 51.7592, lng: 19.4560 },
  { id: 'pl-sil', name: 'Katowice Logistics Hub', location: 'Katowice, Silesian, Poland', lat: 50.2649, lng: 19.0238 }
];

// State
let currentShipment = null;
let routingMap = null;
let allShipmentsCache = null;

// ============================================
// DISTRIBUTION CENTER HELPERS
// ============================================

// US State codes mapped to warehouse IDs
const STATE_TO_WAREHOUSE = {
  'AL': 'us-al-mtg', 'AK': 'us-ak-jun', 'AZ': 'us-az-phx', 'AR': 'us-ar-lr',
  'CA': 'us-ca-sac', 'CO': 'us-co-den', 'CT': 'us-ct-hfd', 'DE': 'us-de-dov',
  'FL': 'us-fl-tlh', 'GA': 'us-ga-atl', 'HI': 'us-hi-hnl', 'ID': 'us-id-boi',
  'IL': 'us-il-spf', 'IN': 'us-in-ind', 'IA': 'us-ia-dsm', 'KS': 'us-ks-top',
  'KY': 'us-ky-fft', 'LA': 'us-la-br', 'ME': 'us-me-aug', 'MD': 'us-md-ann',
  'MA': 'us-ma-bos', 'MI': 'us-mi-lan', 'MN': 'us-mn-stp', 'MS': 'us-ms-jac',
  'MO': 'us-mo-jef', 'MT': 'us-mt-hel', 'NE': 'us-ne-lin', 'NV': 'us-nv-cc',
  'NH': 'us-nh-con', 'NJ': 'us-nj-tre', 'NM': 'us-nm-sfe', 'NY': 'us-ny-alb',
  'NC': 'us-nc-ral', 'ND': 'us-nd-bis', 'OH': 'us-oh-col', 'OK': 'us-ok-okc',
  'OR': 'us-or-sal', 'PA': 'us-pa-har', 'RI': 'us-ri-pro', 'SC': 'us-sc-col',
  'SD': 'us-sd-pie', 'TN': 'us-tn-nas', 'TX': 'us-tx-aus', 'UT': 'us-ut-slc',
  'VT': 'us-vt-mon', 'VA': 'us-va-ric', 'WA': 'us-wa-oly', 'WV': 'us-wv-cha',
  'WI': 'us-wi-mad', 'WY': 'us-wy-che'
};

// Extract US state code from address string (e.g., "123 Main St, Sacramento, CA 95814" -> "CA")
function extractStateCode(addressString) {
  if (!addressString) return null;

  // Common patterns: "City, ST", "City, ST ZIP", "City, State"
  const statePattern = /\b([A-Z]{2})\b(?:\s*\d{5})?/g;
  const matches = addressString.toUpperCase().match(statePattern);

  if (matches) {
    for (const match of matches) {
      const code = match.trim().substring(0, 2);
      if (STATE_TO_WAREHOUSE[code]) {
        return code;
      }
    }
  }

  // Try to match full state names
  const stateNames = {
    'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
    'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE',
    'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI', 'IDAHO': 'ID',
    'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS',
    'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD',
    'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS',
    'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
    'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
    'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'OHIO': 'OH', 'OKLAHOMA': 'OK',
    'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
    'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT',
    'VERMONT': 'VT', 'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
    'WISCONSIN': 'WI', 'WYOMING': 'WY'
  };

  const upperAddress = addressString.toUpperCase();
  for (const [name, code] of Object.entries(stateNames)) {
    if (upperAddress.includes(name)) {
      return code;
    }
  }

  return null;
}

// Find warehouse by state code or address
function findClosestWarehouse(locationString) {
  if (!locationString) return null;

  // Try to extract US state code first
  const stateCode = extractStateCode(locationString);
  if (stateCode && STATE_TO_WAREHOUSE[stateCode]) {
    const warehouseId = STATE_TO_WAREHOUSE[stateCode];
    return DISTRIBUTION_WAREHOUSES.find(w => w.id === warehouseId) || null;
  }

  // Fallback: match by city/location name using scoring
  const locationLower = locationString.toLowerCase();
  const words = locationLower.split(/[,\s]+/).filter(w => w.length > 2);

  let bestWarehouse = null;
  let bestScore = 0;

  for (const warehouse of DISTRIBUTION_WAREHOUSES) {
    const warehouseLoc = warehouse.location.toLowerCase();
    const warehouseName = warehouse.name.toLowerCase();

    let score = 0;
    for (const word of words) {
      if (warehouseLoc.includes(word)) score += 2;
      else if (warehouseName.includes(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestWarehouse = warehouse;
    }
  }

  return bestWarehouse;
}

// Get distribution centers ordered along the route from origin to destination
function getRouteDistributionCenters(originAddress, destinationAddress) {
  if (!originAddress || !destinationAddress) {
    return [];
  }

  const originWarehouse = findClosestWarehouse(originAddress);
  const destinationWarehouse = findClosestWarehouse(destinationAddress);

  if (!originWarehouse || !destinationWarehouse) {
    return [];
  }

  // If same location, no intermediate centers
  if (originWarehouse.id === destinationWarehouse.id) {
    return [];
  }

  // Calculate route line parameters
  const oLat = originWarehouse.lat;
  const oLng = originWarehouse.lng;
  const dLat = destinationWarehouse.lat;
  const dLng = destinationWarehouse.lng;

  const isUSOrigin = originWarehouse.location.includes('USA');
  const isUSDest = destinationWarehouse.location.includes('USA');
  const isPolandOrigin = originWarehouse.location.toLowerCase().includes('poland');
  const isPolandDest = destinationWarehouse.location.toLowerCase().includes('poland');

  const isUSA_to_Poland = isUSOrigin && isPolandDest;
  const isPoland_to_USA = isPolandOrigin && isUSDest;

  // Filter centers that are between origin and destination (along the route)
  const routeCenters = DISTRIBUTION_WAREHOUSES.filter(warehouse => {
    // Exclude origin and destination themselves
    if (warehouse.id === originWarehouse.id || warehouse.id === destinationWarehouse.id) {
      return false;
    }

    // Calculate perpendicular distance from route line
    const dist = pointToLineDistance(warehouse.lat, warehouse.lng, oLat, oLng, dLat, dLng);

    // Increase corridor width for international flights to catch European hubs
    const threshold = (isUSA_to_Poland || isPoland_to_USA) ? 6.0 : 3.0;

    // Only include if within threshold distance of the direct route
    if (dist > threshold) {
      return false;
    }

    // Check if warehouse is between origin and destination (not past endpoints)
    const minLat = Math.min(oLat, dLat) - 4;
    const maxLat = Math.max(oLat, dLat) + 4;
    const minLng = Math.min(oLng, dLng) - 4;
    const maxLng = Math.max(oLng, dLng) + 4;

    return warehouse.lat >= minLat && warehouse.lat <= maxLat &&
      warehouse.lng >= minLng && warehouse.lng <= maxLng;
  });

  // For specific USA to Poland route, inject guaranteed international checkpoints if missing
  if (isUSA_to_Poland) {
    const jfk = DISTRIBUTION_WAREHOUSES.find(w => w.id === 'us-ny-jfk');
    if (jfk && jfk.id !== originWarehouse.id && jfk.id !== destinationWarehouse.id && !routeCenters.some(w => w.id === jfk.id)) {
      routeCenters.push(jfk);
    }
    const wawPort = DISTRIBUTION_WAREHOUSES.find(w => w.id === 'waw-port');
    if (wawPort && wawPort.id !== originWarehouse.id && wawPort.id !== destinationWarehouse.id && !routeCenters.some(w => w.id === wawPort.id)) {
      routeCenters.push(wawPort);
    }
  } else if (isPoland_to_USA) {
    const wawPort = DISTRIBUTION_WAREHOUSES.find(w => w.id === 'waw-port');
    if (wawPort && wawPort.id !== originWarehouse.id && wawPort.id !== destinationWarehouse.id && !routeCenters.some(w => w.id === wawPort.id)) {
      routeCenters.push(wawPort);
    }
    const jfk = DISTRIBUTION_WAREHOUSES.find(w => w.id === 'us-ny-jfk');
    if (jfk && jfk.id !== originWarehouse.id && jfk.id !== destinationWarehouse.id && !routeCenters.some(w => w.id === jfk.id)) {
      routeCenters.push(jfk);
    }
  }

  // Sort by distance from origin (creates ordered path)
  routeCenters.sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.lat - oLat, 2) + Math.pow(a.lng - oLng, 2));
    const distB = Math.sqrt(Math.pow(b.lat - oLat, 2) + Math.pow(b.lng - oLng, 2));
    return distA - distB;
  });

  return routeCenters;
}

// Helper: Calculate perpendicular distance from point (p) to line segment (v-w)
function pointToLineDistance(pLat, pLng, vLat, vLng, wLat, wLng) {
  const l2 = Math.pow(wLat - vLat, 2) + Math.pow(wLng - vLng, 2);
  if (l2 === 0) return Math.sqrt(Math.pow(pLat - vLat, 2) + Math.pow(pLng - vLng, 2));

  let t = ((pLat - vLat) * (wLat - vLat) + (pLng - vLng) * (wLng - vLng)) / l2;
  t = Math.max(0, Math.min(1, t));

  const projLat = vLat + t * (wLat - vLat);
  const projLng = vLng + t * (wLng - vLng);

  return Math.sqrt(Math.pow(pLat - projLat, 2) + Math.pow(pLng - projLng, 2));
}


// ============================================
// UTILITY FUNCTIONS
// ============================================

// ============================================
// DATA FUNCTIONS (Pure Supabase)
// ============================================

async function getStoredShipments(forceRefresh = false) {
  try {
    if (allShipmentsCache && !forceRefresh) {
      return allShipmentsCache;
    }

    if (typeof fetchAllShipments !== 'function') {
      console.error('Supabase client not initialized correctly');
      // Attempt to recover if window.supabase exists? 
      // For now, return empty or mock if needed, but error is better.
      return [];
    }

    const data = await fetchAllShipments();
    allShipmentsCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching shipments from Supabase:', error);
    // Don't alert on every keystroke/render
    // alert('Error connecting to database. Please check your internet connection.');
    return [];
  }
}

async function saveShipment(shipment) {
  try {
    const success = await upsertShipment(shipment);
    if (!success) {
      throw new Error('Failed to save shipment');
    }
    return true;
  } catch (error) {
    console.error('Error saving shipment to Supabase:', error);
    alert('Error saving shipment. Please check your internet connection and try again.');
    return false;
  }
}

async function deleteShipment(trackingCode) {
  try {
    const success = await deleteShipmentFromDB(trackingCode);
    if (!success) {
      throw new Error('Failed to delete shipment');
    }
    return true;
  } catch (error) {
    console.error('Error deleting shipment from Supabase:', error);
    alert('Error deleting shipment. Please check your internet connection and try again.');
    return false;
  }
}

function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = ['FPS']; // Firstrank Parcel Service prefix
  for (let i = 0; i < 3; i++) {
    let segment = '';
    for (let j = 0; j < 3; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  return segments.join('-');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString();
}

function getStatusLabel(status) {
  const labels = {
    'pending': 'Pending',
    'picked-up': 'Picked Up',
    'in-transit': 'In Transit',
    'out-for-delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'on-hold': 'On Hold'
  };
  return labels[status] || status;
}

function getStatusClass(status) {
  return `badge badge-${status}`;
}

// ============================================
// AUTHENTICATION
// ============================================

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function login(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');
}

async function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  await renderShipmentList();
}

// Initialize auth state
document.addEventListener('DOMContentLoaded', function () {
  if (isAuthenticated()) {
    showDashboard();
  } else {
    showLoginScreen();
  }
});

// Login form
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const loginErrorMessage = document.getElementById('loginErrorMessage');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handleLogin();
  });
}

// Auto-login on correct password
if (passwordInput) {
  passwordInput.addEventListener('input', function () {
    loginError.classList.add('hidden');
    if (this.value === ADMIN_PASSWORD) {
      loginBtnText.textContent = 'Authenticating...';
      loginBtn.disabled = true;
      setTimeout(() => {
        login(this.value);
        showDashboard();
        loginBtnText.textContent = 'Authenticate';
        loginBtn.disabled = false;
        this.value = '';
      }, 500);
    }
  });
}

function handleLogin() {
  const password = passwordInput.value;

  loginBtnText.textContent = 'Authenticating...';
  loginBtn.disabled = true;

  // Simulate network delay for UX then authenticate
  setTimeout(() => {
    if (login(password)) {
      showDashboard();
      // Clear password field for security
      passwordInput.value = '';
    } else {
      loginErrorMessage.textContent = 'Invalid access key. Please try again.';
      loginError.classList.remove('hidden');
      loginBtn.disabled = false;
      loginBtnText.textContent = 'Authenticate';
    }
  }, 500);
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// ============================================
// VIEW TOGGLE
// ============================================

const listViewBtn = document.getElementById('listViewBtn');
const createViewBtn = document.getElementById('createViewBtn');
const listView = document.getElementById('listView');
const createView = document.getElementById('createView');

if (listViewBtn) {
  listViewBtn.addEventListener('click', function () {
    listViewBtn.classList.add('active');
    createViewBtn.classList.remove('active');
    listView.classList.remove('hidden');
    createView.classList.add('hidden');
  });
}

if (createViewBtn) {
  createViewBtn.addEventListener('click', function () {
    createViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    createView.classList.remove('hidden');
    listView.classList.add('hidden');
  });
}

// ============================================
// SHIPMENT LIST
// ============================================

const searchInput = document.getElementById('searchInput');
const shipmentTableBody = document.getElementById('shipmentTableBody');
const shipmentCards = document.getElementById('shipmentCards');

if (searchInput) {
  searchInput.addEventListener('input', async function () {
    await renderShipmentList(this.value);
  });
}

async function renderShipmentList(searchTerm = '') {
  const shipments = await getStoredShipments();
  const filtered = shipments.filter(s =>
    s.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.receiver?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  renderTableView(filtered);
  renderCardView(filtered);
}

function renderTableView(shipments) {
  if (!shipmentTableBody) return;

  if (shipments.length === 0) {
    shipmentTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">No shipments found. Create one to get started.</td>
      </tr>
    `;
    return;
  }

  shipmentTableBody.innerHTML = shipments.map(shipment => `
    <tr>
      <td class="code">${shipment.trackingCode}</td>
      <td>${shipment.receiver.name}</td>
      <td>${shipment.destination}</td>
      <td><span class="${getStatusClass(shipment.currentStatus)}">${getStatusLabel(shipment.currentStatus)}</span></td>
      <td class="text-gray">${formatDate(shipment.createdAt)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-primary btn-sm" onclick="openEditShipment('${shipment.trackingCode}')" title="Edit Shipment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="btn ${shipment.isRoutingActive ? 'btn-danger' : 'btn-success'} btn-sm" onclick="toggleShipmentRoute('${shipment.trackingCode}')" title="${shipment.isRoutingActive ? 'Stop Route' : 'Start Route'}">
            ${shipment.isRoutingActive ? `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ` : `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            `}
          </button>
          <button class="btn btn-danger btn-sm" onclick="confirmDelete('${shipment.trackingCode}')" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderCardView(shipments) {
  if (!shipmentCards) return;

  if (shipments.length === 0) {
    shipmentCards.innerHTML = `
      <div class="empty-cards">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        <p>No shipments found. Create one to get started.</p>
      </div>
    `;
    return;
  }

  shipmentCards.innerHTML = shipments.map(shipment => `
    <div class="shipment-card">
      <div class="shipment-card-header">
        <div class="info">
          <p class="code">${shipment.trackingCode}</p>
          <p class="name">${shipment.receiver.name}</p>
        </div>
        <span class="${getStatusClass(shipment.currentStatus)}">${getStatusLabel(shipment.currentStatus)}</span>
      </div>
      <div class="shipment-card-details">
        <p><span class="label">To:</span> ${shipment.destination}</p>
        <p><span class="label">Date:</span> ${formatDate(shipment.createdAt)}</p>
      </div>
      <div class="shipment-card-actions">
        <button class="btn btn-primary btn-sm" onclick="openEditShipment('${shipment.trackingCode}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Edit
        </button>
        <button class="btn ${shipment.isRoutingActive ? 'btn-danger' : 'btn-success'} btn-sm" onclick="toggleShipmentRoute('${shipment.trackingCode}')">
          ${shipment.isRoutingActive ? `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            Stop
          ` : `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Start
          `}
        </button>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('${shipment.trackingCode}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `).join('');
}

async function confirmDelete(trackingCode) {
  if (confirm('Are you sure you want to delete this shipment?')) {
    await deleteShipment(trackingCode);
    await renderShipmentList(searchInput ? searchInput.value : '');
  }
}

// Toggle shipment routing status from the list
// Toggle shipment routing status from the list
async function toggleShipmentRoute(trackingCode) {
  // Use cache first
  const shipments = await getStoredShipments();
  const shipment = shipments.find(s => s.trackingCode === trackingCode);

  if (!shipment) return;

  // Optimistic UI Update
  const originalStatus = shipment.isRoutingActive;
  shipment.isRoutingActive = !shipment.isRoutingActive;

  // Update button immediately (find button by onclick attribute to be safe or just re-render row)
  // Re-rendering the list from cache is fast now
  renderShipmentList(searchInput ? searchInput.value : '');

  try {
    const success = await saveShipment(shipment);
    if (!success) {
      // Revert on failure
      shipment.isRoutingActive = originalStatus;
      renderShipmentList(searchInput ? searchInput.value : '');
      alert('Failed to update status');
    }
  } catch (e) {
    shipment.isRoutingActive = originalStatus;
    renderShipmentList(searchInput ? searchInput.value : '');
  }
}


// ============================================
// EDIT SHIPMENT
// ============================================

let editingShipmentCode = null;
const editModal = document.getElementById('editModal');
const editShipmentForm = document.getElementById('editShipmentForm');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');

async function openEditShipment(trackingCode) {
  const shipments = await getStoredShipments();
  const shipment = shipments.find(s => s.trackingCode === trackingCode);

  if (!shipment) {
    alert('Shipment not found');
    return;
  }

  editingShipmentCode = trackingCode;

  // Populate distribution center dropdown with all available warehouses
  // We provide all warehouses so the admin has full control to manually select the correct export/import hubs
  const centerSelect = document.getElementById('editCurrentCenter');
  centerSelect.innerHTML = '<option value="">-- Select Current Location --</option>';

  DISTRIBUTION_WAREHOUSES.forEach(w => {
    const option = document.createElement('option');
    option.value = w.id;
    option.textContent = `${w.name} - ${w.location}`;
    option.dataset.lat = w.lat;
    option.dataset.lng = w.lng;
    option.dataset.location = w.name;
    centerSelect.appendChild(option);
  });

  // Set current center if exists
  if (shipment.currentCenter) {
    centerSelect.value = shipment.currentCenter;
  }

  // Populate form fields - Status & Location
  document.getElementById('editTrackingCode').textContent = trackingCode;
  document.getElementById('editStatus').value = shipment.currentStatus || 'pending';
  document.getElementById('editOrigin').value = shipment.origin || '';
  document.getElementById('editDestination').value = shipment.destination || '';

  // Shipper Information
  document.getElementById('editShipperName').value = shipment.sender?.name || '';
  document.getElementById('editShipperEmail').value = shipment.sender?.email || '';
  document.getElementById('editShipperPhone').value = shipment.sender?.phone || shipment.sender?.contact || '';
  document.getElementById('editShipperAddress').value = shipment.sender?.address || '';

  // Receiver Information
  document.getElementById('editReceiverName').value = shipment.receiver?.name || '';
  document.getElementById('editReceiverEmail').value = shipment.receiver?.email || '';
  document.getElementById('editReceiverPhone').value = shipment.receiver?.phone || shipment.receiver?.contact || '';
  document.getElementById('editReceiverAddress').value = shipment.receiver?.address || '';

  // Shipment Details
  document.getElementById('editCarrier').value = shipment.carrier || '';
  document.getElementById('editShipmentType').value = shipment.shipmentType || '';

  // Package Information
  document.getElementById('editContents').value = shipment.packageInfo?.contents || '';
  document.getElementById('editWeight').value = shipment.packageInfo?.weight || '';
  document.getElementById('editDepartureDate').value = shipment.packageInfo?.departureDate || '';
  document.getElementById('editDepartureTime').value = shipment.packageInfo?.departureTime || '';
  document.getElementById('editPickupDate').value = shipment.packageInfo?.pickupDate || '';
  document.getElementById('editPickupTime').value = shipment.packageInfo?.pickupTime || '';
  document.getElementById('editExpectedDeliveryDate').value = shipment.packageInfo?.expectedDeliveryDate || shipment.estimatedDelivery || '';
  document.getElementById('editSpecialInstructions').value = shipment.specialInstructions || shipment.notice || '';

  // Show modal
  editModal.classList.remove('hidden');
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingShipmentCode = null;
}

async function saveEditedShipment(e) {
  e.preventDefault();

  if (!editingShipmentCode) return;

  const shipments = await getStoredShipments();
  const shipment = shipments.find(s => s.trackingCode === editingShipmentCode);

  if (!shipment) {
    alert('Shipment not found');
    closeEditModal();
    return;
  }
  const oldStatus = shipment.currentStatus;
  const newStatus = document.getElementById('editStatus').value;
  const oldCenter = shipment.currentCenter;
  const newCenter = document.getElementById('editCurrentCenter').value;

  // Update shipment fields - Status & Location
  shipment.currentStatus = newStatus;
  shipment.origin = document.getElementById('editOrigin').value;
  shipment.destination = document.getElementById('editDestination').value;

  // Shipper Information
  shipment.sender = {
    name: document.getElementById('editShipperName').value,
    email: document.getElementById('editShipperEmail').value,
    phone: document.getElementById('editShipperPhone').value,
    address: document.getElementById('editShipperAddress').value
  };

  // Receiver Information
  shipment.receiver = {
    name: document.getElementById('editReceiverName').value,
    email: document.getElementById('editReceiverEmail').value,
    phone: document.getElementById('editReceiverPhone').value,
    address: document.getElementById('editReceiverAddress').value
  };

  // Shipment Details
  shipment.carrier = document.getElementById('editCarrier').value;
  shipment.shipmentType = document.getElementById('editShipmentType').value;

  // Package Information
  shipment.packageInfo = {
    contents: document.getElementById('editContents').value,
    weight: document.getElementById('editWeight').value,
    departureDate: document.getElementById('editDepartureDate').value,
    departureTime: document.getElementById('editDepartureTime').value,
    pickupDate: document.getElementById('editPickupDate').value,
    pickupTime: document.getElementById('editPickupTime').value,
    expectedDeliveryDate: document.getElementById('editExpectedDeliveryDate').value
  };

  shipment.estimatedDelivery = document.getElementById('editExpectedDeliveryDate').value;
  shipment.specialInstructions = document.getElementById('editSpecialInstructions').value;

  // Handle distribution center change
  if (newCenter && newCenter !== oldCenter) {
    const warehouse = DISTRIBUTION_WAREHOUSES.find(w => w.id === newCenter);
    if (warehouse) {
      shipment.currentCenter = newCenter;
      // Use full location address instead of the Hub name
      shipment.currentLocation = warehouse.location;

      if (!shipment.routeHistory) {
        shipment.routeHistory = [];
      }

      // Add to route history with coordinates
      shipment.routeHistory.push({
        id: generateUUID(),
        location: warehouse.location, // Use full address
        timestamp: new Date().toISOString(),
        status: newStatus,
        description: `Package arrived at ${warehouse.location}`, // Use address in description too
        completed: true,
        coordinates: { lat: warehouse.lat, lng: warehouse.lng }
      });
    }
  } else if (oldStatus !== newStatus) {
    // If only status changed (no center change), still add to history
    if (!shipment.routeHistory) {
      shipment.routeHistory = [];
    }

    // Find current center to get coordinates if possible, otherwise use null
    let currentCoords = null;
    if (shipment.currentCenter) {
      const center = DISTRIBUTION_WAREHOUSES.find(w => w.id === shipment.currentCenter);
      if (center) {
        currentCoords = { lat: center.lat, lng: center.lng };
      }
    }

    shipment.routeHistory.push({
      id: generateUUID(),
      location: shipment.currentLocation || shipment.destination,
      timestamp: new Date().toISOString(),
      status: newStatus,
      description: `Status updated to ${getStatusLabel(newStatus)}`,
      completed: true,
      coordinates: currentCoords // Add coordinates here so map updates even on status change
    });
  }

  // Save shipment
  // Update cache locally first
  // Note: 'shipment' is a reference to the object in 'allShipmentsCache' (from getStoredShipments)
  // so modifying it here updates the cache automatically.

  // Re-render immediately for UI feedback
  renderShipmentList(searchInput ? searchInput.value : '');
  closeEditModal();

  // Save to DB in background
  saveShipment(shipment).then(success => {
    if (success) {
      // Optional: Show toast
    } else {
      alert('Failed to save changes to server. Please check connection.');
    }
  });
}

// Event listeners for edit modal
if (closeEditModalBtn) {
  closeEditModalBtn.addEventListener('click', closeEditModal);
}

if (editShipmentForm) {
  editShipmentForm.addEventListener('submit', async function (e) {
    await saveEditedShipment(e);
  });
}

// Close modal when clicking outside
if (editModal) {
  editModal.addEventListener('click', function (e) {
    if (e.target === editModal) {
      closeEditModal();
    }
  });
}

// ============================================
// CREATE SHIPMENT
// ============================================

const shipmentForm = document.getElementById('shipmentForm');
const successModal = document.getElementById('successModal');
const generatedCodeEl = document.getElementById('generatedCode');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const copyBtnText = document.getElementById('copyBtnText');
const closeModalBtn = document.getElementById('closeModalBtn');
const viewShipmentsBtn = document.getElementById('viewShipmentsBtn');

if (shipmentForm) {
  shipmentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const trackingCode = generateTrackingCode();
    const timestamp = new Date().toISOString();

    const originCountry = formData.get('originCountry');
    const destinationCountry = formData.get('destinationCountry');

    // Find the closest distribution center to the origin
    const originWarehouse = findClosestWarehouse(originCountry);

    const newShipment = {
      trackingCode,
      sender: {
        name: formData.get('shipperName'),
        email: formData.get('shipperEmail'),
        phone: formData.get('shipperPhone'),
        address: formData.get('shipperAddress')
      },
      receiver: {
        name: formData.get('receiverName'),
        email: formData.get('receiverEmail'),
        phone: formData.get('receiverPhone'),
        address: formData.get('receiverAddress')
      },
      origin: originCountry,
      destination: destinationCountry,
      carrier: formData.get('carrier'),
      shipmentType: formData.get('shipmentType'),
      packageInfo: {
        contents: formData.get('contents'),
        weight: formData.get('weight'),
        departureDate: formData.get('departureDate'),
        departureTime: formData.get('departureTime'),
        pickupDate: formData.get('pickupDate'),
        pickupTime: formData.get('pickupTime'),
        expectedDeliveryDate: formData.get('expectedDeliveryDate')
      },
      estimatedDelivery: formData.get('expectedDeliveryDate'),
      createdAt: timestamp,
      specialInstructions: formData.get('specialInstructions') || '',
      currentStatus: 'pending',
      currentCenter: originWarehouse ? originWarehouse.id : null,
      currentLocation: originWarehouse ? originWarehouse.location : originCountry,
      isRoutingActive: false,
      routeHistory: [{
        id: generateUUID(),
        location: originWarehouse ? originWarehouse.location : originCountry,
        timestamp: timestamp,
        status: 'pending',
        description: originWarehouse
          ? `Shipment created at ${originWarehouse.location}`
          : 'Shipment created and ready for processing',
        completed: true,
        coordinates: originWarehouse ? { lat: originWarehouse.lat, lng: originWarehouse.lng } : undefined
      }]
    };

    await saveShipment(newShipment);

    // Send email notification to receiver
    sendShipmentNotificationEmail(newShipment);

    // Show success modal
    generatedCodeEl.textContent = trackingCode;
    successModal.classList.remove('hidden');

    // Reset form
    this.reset();
  });
}

if (copyCodeBtn) {
  copyCodeBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(generatedCodeEl.textContent);
    copyBtnText.textContent = 'Copied!';
    setTimeout(() => {
      copyBtnText.textContent = 'Copy Tracking Code';
    }, 2000);
  });
}

async function closeModal() {
  successModal.classList.add('hidden');
  copyBtnText.textContent = 'Copy Tracking Code';

  // Switch to list view
  listViewBtn.click();
  await renderShipmentList();
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

if (viewShipmentsBtn) {
  viewShipmentsBtn.addEventListener('click', closeModal);
}

// ============================================
// ROUTING CONTROL
// ============================================

const routingView = document.getElementById('routingView');
const dashboardView = document.getElementById('dashboardView');
const routingContent = document.getElementById('routingContent');
const backToListBtn = document.getElementById('backToListBtn');

if (backToListBtn) {
  backToListBtn.addEventListener('click', closeRoutingControl);
}

async function openRoutingControl(trackingCode) {
  const shipments = await getStoredShipments();
  currentShipment = shipments.find(s => s.trackingCode === trackingCode);

  if (!currentShipment) return;

  dashboardView.classList.add('hidden');
  routingView.classList.remove('hidden');

  renderRoutingControl();
}

async function closeRoutingControl() {
  // Clean up map when closing
  if (routingMap) {
    routingMap.remove();
    routingMap = null;
  }
  routingView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  currentShipment = null;
  await renderShipmentList(searchInput ? searchInput.value : '');
}

function renderRoutingControl() {
  if (!currentShipment || !routingContent) return;

  const isActive = currentShipment.isRoutingActive;

  routingContent.innerHTML = `
    <div class="routing-header">
      <div>
        <h3>Route Control: ${currentShipment.trackingCode}</h3>
        <p>Origin: <strong>${currentShipment.origin}</strong> → Destination: <strong>${currentShipment.destination}</strong></p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="closeRoutingControl()">Close</button>
    </div>
    <div class="routing-body">
      <div class="routing-controls">
        <div class="routing-status">
          <h4>Routing Status</h4>
          <div class="routing-status-info">
            <span class="${isActive ? 'active' : 'inactive'}">${isActive ? 'Route Active - Showing Journey' : 'Route Stopped - Showing Distribution Centers'}</span>
            <div class="status-dot ${isActive ? 'active' : 'inactive'}"></div>
          </div>
          <button class="btn ${isActive ? 'btn-danger' : 'btn-primary'} btn-full" onclick="toggleRouting()">
            ${isActive ? `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              Stop Route
            ` : `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Start Route
            `}
          </button>
          <p class="routing-hint" style="margin-top: 0.75rem; font-size: 0.85rem; color: #6b7280;">
            ${isActive
      ? 'Route is active. Map shows the journey from origin to destination.'
      : 'Route is stopped. Map shows available distribution centers between origin and destination.'}
          </p>
        </div>
      </div>
      
      <div class="routing-timeline">
        <div class="routing-map-container">
          <div id="routingMap" class="routing-map"></div>
          <div class="map-legend">
            ${isActive ? `
              <div class="legend-item"><div class="legend-dot origin"></div> Origin</div>
              <div class="legend-item"><div class="legend-dot destination"></div> Destination</div>
            ` : `
              <div class="legend-item"><div class="legend-dot warehouse"></div> Distribution Center</div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  // Initialize map after DOM is rendered
  setTimeout(() => initializeRoutingMap(), 100);
}

// Initialize the routing map
function initializeRoutingMap() {
  const mapContainer = document.getElementById('routingMap');
  if (!mapContainer || !currentShipment) return;

  // Clean up existing map
  if (routingMap) {
    routingMap.remove();
    routingMap = null;
  }

  // Create map centered on a default location
  routingMap = L.map('routingMap').setView([20, 0], 2);

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(routingMap);

  const isActive = currentShipment.isRoutingActive;
  const points = [];

  if (isActive) {
    // ROUTE ACTIVE: Show route from origin to destination
    const originWarehouse = findClosestWarehouse(currentShipment.origin);
    const destWarehouse = findClosestWarehouse(currentShipment.destination);

    // Add origin marker
    if (originWarehouse) {
      points.push([originWarehouse.lat, originWarehouse.lng]);

      const originIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px; 
          height: 24px; 
          background: #22c55e; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8"/></svg></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([originWarehouse.lat, originWarehouse.lng], { icon: originIcon })
        .addTo(routingMap)
        .bindPopup(`
          <div class="popup-title"><strong>Origin</strong></div>
          <div>${originWarehouse.name}</div>
          <div style="font-size: 0.8rem; color: #666;">${currentShipment.origin}</div>
        `);
    }

    // Add destination marker
    if (destWarehouse) {
      points.push([destWarehouse.lat, destWarehouse.lng]);

      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px; 
          height: 24px; 
          background: #ef4444; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        "><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 7v10l8 5 8-5V7L12 2z"/></svg></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker([destWarehouse.lat, destWarehouse.lng], { icon: destIcon })
        .addTo(routingMap)
        .bindPopup(`
          <div class="popup-title"><strong>Destination</strong></div>
          <div>${destWarehouse.name}</div>
          <div style="font-size: 0.8rem; color: #666;">${currentShipment.destination}</div>
        `);
    }

    // Draw route line from origin to destination
    if (points.length > 1) {
      L.polyline(points, {
        color: '#00D4FF',
        weight: 4,
        opacity: 0.8
      }).addTo(routingMap);
    }

  } else {
    // ROUTE STOPPED: Show distribution centers between origin and destination
    const routeCenters = getRouteDistributionCenters(currentShipment.origin, currentShipment.destination);

    routeCenters.forEach(warehouse => {
      points.push([warehouse.lat, warehouse.lng]);

      const warehouseIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 20px; 
          height: 20px; 
          background: #f59e0b; 
          border-radius: 50%; 
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker([warehouse.lat, warehouse.lng], { icon: warehouseIcon })
        .addTo(routingMap)
        .bindPopup(`
          <div class="popup-title"><strong>${warehouse.name}</strong></div>
          <div style="font-size: 0.85rem; color: #666;">${warehouse.location}</div>
        `);
    });
  }

  // Fit map to show all markers
  if (points.length > 0) {
    const bounds = L.latLngBounds(points);
    routingMap.fitBounds(bounds, { padding: [50, 50] });
  }
}


async function toggleRouting() {
  if (!currentShipment) return;

  currentShipment.isRoutingActive = !currentShipment.isRoutingActive;
  await saveShipment(currentShipment);
  renderRoutingControl();
}
