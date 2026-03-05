-- ==============================================================================
-- SQL to Revert the International Hubs for an Existing USA-to-Poland Shipment
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

    -- 2. Delete the JFK Export Hub entry
    DELETE FROM route_history 
    WHERE shipment_id = target_shipment_id 
      AND location = 'New York, NY, USA'
      AND description ILIKE '%JFK%';
      
    RAISE NOTICE 'Removed JFK Export Hub (if it existed).';

    -- 3. Delete the Warsaw Airport Transit Hub entry
    DELETE FROM route_history 
    WHERE shipment_id = target_shipment_id 
      AND location = 'Warsaw, Masovian, Poland' 
      AND description ILIKE '%Airport%';

    RAISE NOTICE 'Removed Warsaw Airport Transit Hub (if it existed).';

END $$;
