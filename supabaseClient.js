/* ============================================
   SUPABASE CLIENT CONFIGURATION
   ============================================ */

// Supabase Configuration
const SUPABASE_URL = 'https://bsjmewgxgtxwhxfyupfv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzam1ld2d4Z3R4d2h4Znl1cGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzQwNzIsImV4cCI6MjA4NDcxMDA3Mn0.jgcHd-G-D9DAEw4q8F1k8fppMD--4inMpH-RSyGhDkY';

// Initialize Supabase client
const supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// SUPABASE DATABASE FUNCTIONS
// ============================================

// Fetch all shipments from Supabase
async function fetchAllShipments() {
    try {
        const { data: shipments, error } = await supabaseInstance
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch route history for all shipments
        const shipmentsWithHistory = await Promise.all(
            shipments.map(async (shipment) => {
                const { data: routeHistory, error: historyError } = await supabaseInstance
                    .from('route_history')
                    .select('*')
                    .eq('shipment_id', shipment.id)
                    .order('timestamp', { ascending: true });

                if (historyError) {
                    console.error('Error fetching route history:', historyError);
                    return transformShipmentFromDB(shipment, []);
                }

                return transformShipmentFromDB(shipment, routeHistory || []);
            })
        );

        return shipmentsWithHistory;
    } catch (error) {
        console.error('Error fetching shipments:', error);
        return [];
    }
}

// Fetch a single shipment by tracking code
async function fetchShipmentByTrackingCode(trackingCode) {
    try {
        const { data: shipment, error } = await supabaseInstance
            .from('shipments')
            .select('*')
            .eq('tracking_code', trackingCode.toUpperCase())
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        // Fetch route history
        const { data: routeHistory, error: historyError } = await supabaseInstance
            .from('route_history')
            .select('*')
            .eq('shipment_id', shipment.id)
            .order('timestamp', { ascending: true });

        if (historyError) {
            console.error('Error fetching route history:', historyError);
            return transformShipmentFromDB(shipment, []);
        }

        return transformShipmentFromDB(shipment, routeHistory || []);
    } catch (error) {
        console.error('Error fetching shipment:', error);
        return null;
    }
}

// Create or update a shipment in Supabase
async function upsertShipment(shipmentData) {
    try {
        // Transform to database format
        const dbShipment = transformShipmentToDB(shipmentData);

        // Check if shipment exists
        const { data: existing } = await supabaseInstance
            .from('shipments')
            .select('id')
            .eq('tracking_code', shipmentData.trackingCode)
            .single();

        let shipmentId;

        if (existing) {
            // Update existing shipment
            const { data, error } = await supabaseInstance
                .from('shipments')
                .update(dbShipment)
                .eq('tracking_code', shipmentData.trackingCode)
                .select('id')
                .single();

            if (error) throw error;
            shipmentId = data.id;
        } else {
            // Insert new shipment
            const { data, error } = await supabaseInstance
                .from('shipments')
                .insert(dbShipment)
                .select('id')
                .single();

            if (error) throw error;
            shipmentId = data.id;
        }

        // Handle route history - add new entries if provided
        if (shipmentData.routeHistory && shipmentData.routeHistory.length > 0) {
            // Get existing history count
            const { count } = await supabaseInstance
                .from('route_history')
                .select('*', { count: 'exact', head: true })
                .eq('shipment_id', shipmentId);

            // Only add new entries (entries beyond what's already in DB)
            const newEntries = shipmentData.routeHistory.slice(count || 0);

            if (newEntries.length > 0) {
                const historyRecords = newEntries.map(entry => ({
                    shipment_id: shipmentId,
                    location: entry.location,
                    status: entry.status,
                    description: entry.description,
                    completed: entry.completed !== false,
                    lat: entry.coordinates?.lat || null,
                    lng: entry.coordinates?.lng || null,
                    timestamp: entry.timestamp || new Date().toISOString()
                }));

                const { error: historyError } = await supabaseInstance
                    .from('route_history')
                    .insert(historyRecords);

                if (historyError) {
                    console.error('Error saving route history:', historyError);
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Error upserting shipment:', error);
        return false;
    }
}

// Delete a shipment from Supabase
async function deleteShipmentFromDB(trackingCode) {
    try {
        const { error } = await supabaseInstance
            .from('shipments')
            .delete()
            .eq('tracking_code', trackingCode);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting shipment:', error);
        return false;
    }
}

// ============================================
// DATA TRANSFORMATION HELPERS
// ============================================

// Transform database record to app format
function transformShipmentFromDB(dbRecord, routeHistory = []) {
    return {
        id: dbRecord.id,
        trackingCode: dbRecord.tracking_code,
        sender: {
            name: dbRecord.sender_name,
            email: dbRecord.sender_email,
            phone: dbRecord.sender_phone,
            address: dbRecord.sender_address
        },
        receiver: {
            name: dbRecord.receiver_name,
            email: dbRecord.receiver_email,
            phone: dbRecord.receiver_phone,
            address: dbRecord.receiver_address
        },
        origin: dbRecord.origin,
        destination: dbRecord.destination,
        carrier: dbRecord.carrier,
        shipmentType: dbRecord.shipment_type,
        packageInfo: {
            contents: dbRecord.contents,
            weight: dbRecord.weight,
            departureDate: dbRecord.departure_date,
            departureTime: dbRecord.departure_time,
            pickupDate: dbRecord.pickup_date,
            pickupTime: dbRecord.pickup_time,
            expectedDeliveryDate: dbRecord.expected_delivery_date
        },
        estimatedDelivery: dbRecord.estimated_delivery,
        specialInstructions: dbRecord.special_instructions,
        currentStatus: dbRecord.current_status,
        currentCenter: dbRecord.current_center,
        currentLocation: dbRecord.current_location,
        isRoutingActive: dbRecord.is_routing_active,
        createdAt: dbRecord.created_at,
        updatedAt: dbRecord.updated_at,
        // Transform route history
        routeHistory: routeHistory.map(h => ({
            id: h.id,
            location: h.location,
            status: h.status,
            description: h.description,
            completed: h.completed,
            timestamp: h.timestamp,
            coordinates: (h.lat && h.lng) ? { lat: parseFloat(h.lat), lng: parseFloat(h.lng) } : undefined
        })),
        // Additional fields for public display
        shipperName: dbRecord.sender_name,
        shipperAddress: dbRecord.sender_address,
        receiverName: dbRecord.receiver_name,
        receiverAddress: dbRecord.receiver_address,
        contents: dbRecord.contents,
        weight: dbRecord.weight,
        departureDate: dbRecord.departure_date,
        departureTime: dbRecord.departure_time,
        pickupDate: dbRecord.pickup_date,
        pickupTime: dbRecord.pickup_time,
        expectedDeliveryDate: dbRecord.expected_delivery_date
    };
}

// Transform app format to database record
function transformShipmentToDB(shipment) {
    return {
        tracking_code: shipment.trackingCode,
        sender_name: shipment.sender?.name,
        sender_email: shipment.sender?.email,
        sender_phone: shipment.sender?.phone,
        sender_address: shipment.sender?.address,
        receiver_name: shipment.receiver?.name,
        receiver_email: shipment.receiver?.email,
        receiver_phone: shipment.receiver?.phone,
        receiver_address: shipment.receiver?.address,
        origin: shipment.origin,
        destination: shipment.destination,
        carrier: shipment.carrier,
        shipment_type: shipment.shipmentType,
        contents: shipment.packageInfo?.contents,
        weight: shipment.packageInfo?.weight ? parseFloat(shipment.packageInfo.weight) : null,
        departure_date: shipment.packageInfo?.departureDate || null,
        departure_time: shipment.packageInfo?.departureTime || null,
        pickup_date: shipment.packageInfo?.pickupDate || null,
        pickup_time: shipment.packageInfo?.pickupTime || null,
        expected_delivery_date: shipment.packageInfo?.expectedDeliveryDate || shipment.estimatedDelivery || null,
        estimated_delivery: shipment.estimatedDelivery || shipment.packageInfo?.expectedDeliveryDate || null,
        special_instructions: shipment.specialInstructions,
        current_status: shipment.currentStatus || 'pending',
        current_center: shipment.currentCenter,
        current_location: shipment.currentLocation,
        is_routing_active: shipment.isRoutingActive || false
    };
}

// ============================================
// EXPORT FUNCTIONS GLOBALLY
// ============================================

window.fetchAllShipments = fetchAllShipments;
window.fetchShipmentByTrackingCode = fetchShipmentByTrackingCode;
window.upsertShipment = upsertShipment;
window.deleteShipmentFromDB = deleteShipmentFromDB;

