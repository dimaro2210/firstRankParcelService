
const DISTRIBUTION_WAREHOUSES = [
    // US State Capitals
    { id: 'us-al-mtg', name: 'Montgomery Distribution Center', location: 'Montgomery, AL, USA', lat: 32.3792, lng: -86.3077 },
    { id: 'us-ak-jun', name: 'Juneau Distribution Center', location: 'Juneau, AK, USA', lat: 58.3019, lng: -134.4197 },
    { id: 'us-az-phx', name: 'Phoenix Distribution Center', location: 'Phoenix, AZ, USA', lat: 33.4484, lng: -112.0740 },
    { id: 'us-ar-lr', name: 'Little Rock Distribution Center', location: 'Little Rock, AR, USA', lat: 34.7465, lng: -92.2896 },
    { id: 'us-ca-sac', name: 'Sacramento Distribution Center', location: 'Sacramento, CA, USA', lat: 38.5816, lng: -121.4944 },
    { id: 'us-co-den', name: 'Denver Distribution Center', location: 'Denver, CO, USA', lat: 39.7392, lng: -104.9903 },
    { id: 'us-ct-hfd', name: 'Hartford Distribution Center', location: 'Hartford, CT, USA', lat: 41.7658, lng: -72.6734 },
    { id: 'us-de-dov', name: 'Dover Distribution Center', location: 'Dover, DE, USA', lat: 39.1582, lng: -75.5244 },
    { id: 'us-fl-tlh', name: 'Tallahassee Distribution Center', location: 'Tallahassee, FL, USA', lat: 30.4383, lng: -84.2807 },
    { id: 'us-ga-atl', name: 'Atlanta Distribution Center', location: 'Atlanta, GA, USA', lat: 33.7490, lng: -84.3880 },
    { id: 'us-hi-hnl', name: 'Honolulu Distribution Center', location: 'Honolulu, HI, USA', lat: 21.3069, lng: -157.8583 },
    { id: 'us-id-boi', name: 'Boise Distribution Center', location: 'Boise, ID, USA', lat: 43.6150, lng: -116.2023 },
    { id: 'us-il-spf', name: 'Springfield Distribution Center', location: 'Springfield, IL, USA', lat: 39.7817, lng: -89.6501 },
    { id: 'us-in-ind', name: 'Indianapolis Distribution Center', location: 'Indianapolis, IN, USA', lat: 39.7684, lng: -86.1581 },
    { id: 'us-ia-dsm', name: 'Des Moines Distribution Center', location: 'Des Moines, IA, USA', lat: 41.5868, lng: -93.6250 },
    { id: 'us-ks-top', name: 'Topeka Distribution Center', location: 'Topeka, KS, USA', lat: 39.0558, lng: -95.6890 },
    { id: 'us-ky-fft', name: 'Frankfort Distribution Center', location: 'Frankfort, KY, USA', lat: 38.2009, lng: -84.8733 },
    { id: 'us-la-br', name: 'Baton Rouge Distribution Center', location: 'Baton Rouge, LA, USA', lat: 30.4515, lng: -91.1871 },
    { id: 'us-me-aug', name: 'Augusta Distribution Center', location: 'Augusta, ME, USA', lat: 44.3106, lng: -69.7795 },
    { id: 'us-md-ann', name: 'Annapolis Distribution Center', location: 'Annapolis, MD, USA', lat: 38.9784, lng: -76.4922 },
    { id: 'us-ma-bos', name: 'Boston Distribution Center', location: 'Boston, MA, USA', lat: 42.3601, lng: -71.0589 },
    { id: 'us-mi-lan', name: 'Lansing Distribution Center', location: 'Lansing, MI, USA', lat: 42.7325, lng: -84.5555 },
    { id: 'us-mn-stp', name: 'Saint Paul Distribution Center', location: 'Saint Paul, MN, USA', lat: 44.9537, lng: -93.0900 },
    { id: 'us-ms-jac', name: 'Jackson Distribution Center', location: 'Jackson, MS, USA', lat: 32.2988, lng: -90.1848 },
    { id: 'us-mo-jef', name: 'Jefferson City Distribution Center', location: 'Jefferson City, MO, USA', lat: 38.5767, lng: -92.1735 },
    { id: 'us-mt-hel', name: 'Helena Distribution Center', location: 'Helena, MT, USA', lat: 46.5891, lng: -112.0391 },
    { id: 'us-ne-lin', name: 'Lincoln Distribution Center', location: 'Lincoln, NE, USA', lat: 40.8136, lng: -96.7026 },
    { id: 'us-nv-cc', name: 'Carson City Distribution Center', location: 'Carson City, NV, USA', lat: 39.1638, lng: -119.7674 },
    { id: 'us-nh-con', name: 'Concord Distribution Center', location: 'Concord, NH, USA', lat: 43.2081, lng: -71.5375 },
    { id: 'us-nj-tre', name: 'Trenton Distribution Center', location: 'Trenton, NJ, USA', lat: 40.2171, lng: -74.7429 },
    { id: 'us-nm-sfe', name: 'Santa Fe Distribution Center', location: 'Santa Fe, NM, USA', lat: 35.6869, lng: -105.9378 },
    { id: 'us-ny-alb', name: 'Albany Distribution Center', location: 'Albany, NY, USA', lat: 42.6526, lng: -73.7562 },
    { id: 'us-nc-ral', name: 'Raleigh Distribution Center', location: 'Raleigh, NC, USA', lat: 35.7796, lng: -78.6382 },
    { id: 'us-nd-bis', name: 'Bismarck Distribution Center', location: 'Bismarck, ND, USA', lat: 46.8083, lng: -100.7837 },
    { id: 'us-oh-col', name: 'Columbus Distribution Center', location: 'Columbus, OH, USA', lat: 39.9612, lng: -82.9988 },
    { id: 'us-ok-okc', name: 'Oklahoma City Distribution Center', location: 'Oklahoma City, OK, USA', lat: 35.4676, lng: -97.5164 },
    { id: 'us-or-sal', name: 'Salem Distribution Center', location: 'Salem, OR, USA', lat: 44.9429, lng: -123.0351 },
    { id: 'us-pa-har', name: 'Harrisburg Distribution Center', location: 'Harrisburg, PA, USA', lat: 40.2732, lng: -76.8867 },
    { id: 'us-ri-pro', name: 'Providence Distribution Center', location: 'Providence, RI, USA', lat: 41.8240, lng: -71.4128 },
    { id: 'us-sc-col', name: 'Columbia Distribution Center', location: 'Columbia, SC, USA', lat: 34.0007, lng: -81.0348 },
    { id: 'us-sd-pie', name: 'Pierre Distribution Center', location: 'Pierre, SD, USA', lat: 44.3683, lng: -100.3510 },
    { id: 'us-tn-nas', name: 'Nashville Distribution Center', location: 'Nashville, TN, USA', lat: 36.1627, lng: -86.7816 },
    { id: 'us-tx-aus', name: 'Austin Distribution Center', location: 'Austin, TX, USA', lat: 30.2672, lng: -97.7431 },
    { id: 'us-ut-slc', name: 'Salt Lake City Distribution Center', location: 'Salt Lake City, UT, USA', lat: 40.7608, lng: -111.8910 },
    { id: 'us-vt-mon', name: 'Montpelier Distribution Center', location: 'Montpelier, VT, USA', lat: 44.2601, lng: -72.5754 },
    { id: 'us-va-ric', name: 'Richmond Distribution Center', location: 'Richmond, VA, USA', lat: 37.5407, lng: -77.4360 },
    { id: 'us-wa-oly', name: 'Olympia Distribution Center', location: 'Olympia, WA, USA', lat: 47.0379, lng: -122.9007 },
    { id: 'us-wv-cha', name: 'Charleston Distribution Center', location: 'Charleston, WV, USA', lat: 38.3498, lng: -81.6326 },
    { id: 'us-wi-mad', name: 'Madison Distribution Center', location: 'Madison, WI, USA', lat: 43.0731, lng: -89.4012 },
    { id: 'us-wy-che', name: 'Cheyenne Distribution Center', location: 'Cheyenne, WY, USA', lat: 41.1400, lng: -104.8202 },

    // International Hubs
    { id: 'lon', name: 'London Distribution Center', location: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { id: 'dub', name: 'Dubai Distribution Center', location: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    { id: 'sin', name: 'Singapore Distribution Center', location: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { id: 'hkg', name: 'Hong Kong Distribution Center', location: 'Hong Kong, China', lat: 22.3193, lng: 114.1694 },
    { id: 'syd', name: 'Sydney Distribution Center', location: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { id: 'tok', name: 'Tokyo Distribution Center', location: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { id: 'fra', name: 'Frankfurt Distribution Center', location: 'Frankfurt, Germany', lat: 50.1109, lng: 8.6821 },
    { id: 'par', name: 'Paris Distribution Center', location: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { id: 'tor', name: 'Toronto Distribution Center', location: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
    { id: 'mum', name: 'Mumbai Distribution Center', location: 'Mumbai, India', lat: 19.0760, lng: 72.8777 }
];

function findClosestWarehouse(locationString) {
    if (!locationString) return null;

    const locationLower = locationString.toLowerCase();

    // Try to match by location keywords
    const matchScores = DISTRIBUTION_WAREHOUSES.map(warehouse => {
        let score = 0;
        const warehouseLocationLower = warehouse.location.toLowerCase();
        const warehouseNameLower = warehouse.name.toLowerCase();

        // Check for exact or partial matches
        const locationParts = locationLower.split(/[,\s]+/);
        locationParts.forEach(part => {
            if (part.length > 2) {
                if (warehouseLocationLower.includes(part)) score += 10;
                if (warehouseNameLower.includes(part)) score += 5;
            }
        });

        return { warehouse, score };
    });

    // Sort by score and return the best match
    matchScores.sort((a, b) => b.score - a.score);

    if (matchScores[0].score > 0) {
        return matchScores[0].warehouse;
    }

    // Default to first warehouse if no match found
    return null;
}

function getRouteDistributionCenters(originLocation, destinationLocation) {
    if (!originLocation || !destinationLocation) {
        return DISTRIBUTION_WAREHOUSES;
    }

    const originWarehouse = findClosestWarehouse(originLocation);
    const destinationWarehouse = findClosestWarehouse(destinationLocation);

    if (!originWarehouse || !destinationWarehouse) {
        return DISTRIBUTION_WAREHOUSES;
    }

    console.log(`Origin Warehouse: ${originWarehouse.name}`);
    console.log(`Destination Warehouse: ${destinationWarehouse.name}`);

    // If origin and destination are the same, return empty
    if (originWarehouse.id === destinationWarehouse.id) {
        return [];
    }

    // Calculate the bounding box with some padding for the route corridor
    const minLat = Math.min(originWarehouse.lat, destinationWarehouse.lat);
    const maxLat = Math.max(originWarehouse.lat, destinationWarehouse.lat);
    const minLng = Math.min(originWarehouse.lng, destinationWarehouse.lng);
    const maxLng = Math.max(originWarehouse.lng, destinationWarehouse.lng);

    // Add padding to create a corridor (about 500 miles / ~7 degrees latitude/longitude)
    const latPadding = Math.max(7, (maxLat - minLat) * 0.3);
    const lngPadding = Math.max(7, (maxLng - minLng) * 0.3);

    // Filter distribution centers within the corridor (excluding origin and destination)
    const routeCenters = DISTRIBUTION_WAREHOUSES.filter(warehouse => {
        // Exclude origin and destination
        if (warehouse.id === originWarehouse.id || warehouse.id === destinationWarehouse.id) {
            return false;
        }

        // Check if warehouse is within the expanded bounding box
        const withinLatRange = warehouse.lat >= (minLat - latPadding) && warehouse.lat <= (maxLat + latPadding);
        const withinLngRange = warehouse.lng >= (minLng - lngPadding) && warehouse.lng <= (maxLng + lngPadding);

        // Add distance check to filter out outliers in the bounding box
        // Consider the line from origin to destination and check perpendicular distance
        if (withinLatRange && withinLngRange) {
            // Simple distance check from the center of the route
            const centerLat = (minLat + maxLat) / 2;
            const centerLng = (minLng + maxLng) / 2;
            // Accept if within reasonable distance from center or endpoints
            // Todo: Implement more precise cross-track distance if needed
            return true;
        }

        return false;
    });

    // Sort by distance from origin to create a logical route order
    routeCenters.sort((a, b) => {
        const distA = Math.sqrt(
            Math.pow(a.lat - originWarehouse.lat, 2) +
            Math.pow(a.lng - originWarehouse.lng, 2)
        );
        const distB = Math.sqrt(
            Math.pow(b.lat - originWarehouse.lat, 2) +
            Math.pow(b.lng - originWarehouse.lng, 2)
        );
        return distA - distB;
    });

    return routeCenters;
}

// Test Case 1: Sacramento CA to New York NY
const origin1 = "123 Main St, Sacramento, CA 95814";
const dest1 = "456 Broadway, New York, NY 10001";
console.log("\n--- Test Case 1: Sacramento -> NY ---");
const result1 = getRouteDistributionCenters(origin1, dest1);
console.log("Found centers:", result1.length);
result1.forEach(c => console.log(`- ${c.name} (${c.location})`));

// Test Case 2: Seattle WA to Los Angeles CA (North-South)
const origin2 = "Seattle, WA";
const dest2 = "Los Angeles, CA";
console.log("\n--- Test Case 2: Seattle -> Los Angeles ---");
const result2 = getRouteDistributionCenters(origin2, dest2);
console.log("Found centers:", result2.length);
result2.forEach(c => console.log(`- ${c.name} (${c.location})`));

// Test Case 3: Miami FL to Atlanta GA (Short distance)
const origin3 = "Miami, FL";
const dest3 = "Atlanta, GA";
console.log("\n--- Test Case 3: Miami -> Atlanta ---");
const result3 = getRouteDistributionCenters(origin3, dest3);
console.log("Found centers:", result3.length);
result3.forEach(c => console.log(`- ${c.name} (${c.location})`));
