require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const https = require('https');

// Initialize Supabase Client (from supabaseClient.js config)
const SUPABASE_URL = 'https://bsjmewgxgtxwhxfyupfv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzam1ld2d4Z3R4d2h4Znl1cGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzQwNzIsImV4cCI6MjA4NDcxMDA3Mn0.jgcHd-G-D9DAEw4q8F1k8fppMD--4inMpH-RSyGhDkY';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TRACKING_CODE = process.argv[2];

if (!TRACKING_CODE) {
    console.error("Please provide a tracking code. Example: node update_shipment.js FPS-ABC-123");
    process.exit(1);
}

// Hubs to insert
const jfk_hub = { location: 'New York, NY, USA', lat: 40.6413, lng: -73.7781, name: 'JFK International Export Hub' };
const waw_hub = { location: 'Warsaw, Masovian, Poland', lat: 52.1659, lng: 20.9671, name: 'Warsaw International Airport Hub' };

async function getShipmentByTrackingCode(trackingCode) {
    const { data: shipment, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_code', trackingCode)
        .single();

    if (error) throw error;
    return shipment;
}

async function getRouteHistory(shipmentId) {
    const { data: routeHistory, error } = await supabase
        .from('route_history')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('timestamp', { ascending: true });

    if (error) throw error;
    return routeHistory || [];
}

async function addHistoryEntry(shipmentId, hub, status, description, timeOffsetMinutes) {
    // Offset time slightly to simulate sequence if passing multiple back-to-back
    const d = new Date();
    d.setMinutes(d.getMinutes() - timeOffsetMinutes);

    const entry = {
        shipment_id: shipmentId,
        location: hub.location,
        status: status,
        description: description,
        completed: true,
        lat: hub.lat,
        lng: hub.lng,
        timestamp: d.toISOString()
    };

    const { error } = await supabase.from('route_history').insert([entry]);
    if (error) {
        console.error(`Failed to insert ${hub.name}:`, error);
        throw error;
    }
    console.log(`Successfully added ${hub.name} to route history.`);
}

async function main() {
    try {
        console.log(`Looking up shipment: ${TRACKING_CODE}...`);
        const shipment = await getShipmentByTrackingCode(TRACKING_CODE);
        console.log(`Found shipment ID: ${shipment.id}`);

        const history = await getRouteHistory(shipment.id);

        // Ensure JFK and WAW are not already present
        const hasJFK = history.some(h => h.location === jfk_hub.location);
        const hasWAW = history.some(h => h.location === waw_hub.location);

        if (!hasJFK) {
            console.log("Adding JFK Export Hub...");
            await addHistoryEntry(shipment.id, jfk_hub, 'in-transit', `Package departed from ${jfk_hub.name} and is flying to destination country.`, 120);
        } else {
            console.log("JFK Hub already present in history.");
        }

        if (!hasWAW) {
            console.log("Adding Warsaw Airport Transit Hub...");
            await addHistoryEntry(shipment.id, waw_hub, 'in-transit', `Package arrived at ${waw_hub.name} and is pending customs clearance.`, 60);
        } else {
            console.log("Warsaw Hub already present in history.");
        }

        console.log("Shipment update complete!");

    } catch (err) {
        console.error("Error:", err.message);
    }
}

main();
