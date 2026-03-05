-- ==============================================================================
-- SQL to Add International Hubs to an Existing USA-to-Poland Shipment
-- ==============================================================================

-- Instructions:
-- 1. Go to your Supabase Dashboard -> SQL Editor
-- 2. Click "New query"
-- 3. Copy and paste this entire file into the editor
-- 4. REPLACE 'YOUR_TRACKING_CODE_HERE' on line 12 with your actual tracking code (e.g., 'FPS-ABC-123')
-- 5. Click "Run"

DO $$
DECLARE
    target_tracking_code VARCHAR(20) := 'YOUR_TRACKING_CODE_HERE'; -- <--- UPDATE THIS LINE
    target_shipment_id UUID;
BEGIN
    -- 1. Find the shipment ID using the tracking code
    SELECT id INTO target_shipment_id 
    FROM shipments 
    WHERE tracking_code = target_tracking_code;

    IF target_shipment_id IS NULL THEN
        RAISE EXCEPTION 'Shipment with tracking code % not found.', target_tracking_code;
    END IF;

    -- 2. Insert the JFK Export Hub securely without duplicating
    IF NOT EXISTS (
        SELECT 1 FROM route_history 
        WHERE shipment_id = target_shipment_id AND location = 'New York, NY, USA'
    ) THEN
        INSERT INTO route_history (
            shipment_id, location, status, description, completed, lat, lng, timestamp
        ) VALUES (
            target_shipment_id,
            'New York, NY, USA',
            'in-transit',
            'Package departed from JFK International Export Hub and is flying to destination country.',
            true,
            40.6413,
            -73.7781,
            -- Setting the timestamp to 2 hours ago to maintain sequence
            NOW() - INTERVAL '2 hours' 
        );
        RAISE NOTICE 'Added JFK Export Hub successfully.';
    ELSE
        RAISE NOTICE 'JFK Export Hub already exists for this shipment.';
    END IF;

    -- 3. Insert the Warsaw Airport Transit Hub securely without duplicating
    IF NOT EXISTS (
        SELECT 1 FROM route_history 
        WHERE shipment_id = target_shipment_id AND location = 'Warsaw, Masovian, Poland' AND description ILIKE '%Airport%'
    ) THEN
        INSERT INTO route_history (
            shipment_id, location, status, description, completed, lat, lng, timestamp
        ) VALUES (
            target_shipment_id,
            'Warsaw, Masovian, Poland',
            'in-transit',
            'Package arrived at Warsaw International Airport Hub and is pending customs clearance.',
            true,
            52.1659,
            20.9671,
            -- Setting the timestamp to 1 hour ago to maintain sequence
            NOW() - INTERVAL '1 hour'
        );
        RAISE NOTICE 'Added Warsaw Airport Transit Hub successfully.';
    ELSE
        RAISE NOTICE 'Warsaw Airport Transit Hub already exists for this shipment.';
    END IF;

END $$;
