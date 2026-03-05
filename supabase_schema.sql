-- =============================================
-- FIRSTRANK PARCEL SERVICE - SUPABASE SCHEMA
-- =============================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- https://bsjmewgxgtxwhxfyupfv.supabase.co

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS route_history;
DROP TABLE IF EXISTS shipments;

-- =============================================
-- SHIPMENTS TABLE
-- =============================================
CREATE TABLE shipments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code VARCHAR(20) UNIQUE NOT NULL,
  
  -- Sender Information
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  sender_phone VARCHAR(50),
  sender_address TEXT,
  
  -- Receiver Information
  receiver_name VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255),
  receiver_phone VARCHAR(50),
  receiver_address TEXT,
  
  -- Route Information
  origin VARCHAR(255),
  destination VARCHAR(255) NOT NULL,
  
  -- Shipment Details
  carrier VARCHAR(50),
  shipment_type VARCHAR(100),
  
  -- Package Information
  contents TEXT,
  weight DECIMAL(10, 2),
  departure_date DATE,
  departure_time TIME,
  pickup_date DATE,
  pickup_time TIME,
  expected_delivery_date DATE,
  estimated_delivery DATE,
  special_instructions TEXT,
  
  -- Status & Location
  current_status VARCHAR(50) DEFAULT 'pending',
  current_center VARCHAR(50),
  current_location VARCHAR(255),
  is_routing_active BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROUTE HISTORY TABLE
-- =============================================
CREATE TABLE route_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50),
  description TEXT,
  completed BOOLEAN DEFAULT TRUE,
  
  -- Coordinates for map display
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_shipments_tracking_code ON shipments(tracking_code);
CREATE INDEX idx_shipments_current_status ON shipments(current_status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_route_history_shipment_id ON route_history(shipment_id);
CREATE INDEX idx_route_history_timestamp ON route_history(timestamp DESC);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - Allow public read/write with anon key
-- =============================================

-- Shipments policies
CREATE POLICY "Allow public read on shipments" 
  ON shipments FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on shipments" 
  ON shipments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update on shipments" 
  ON shipments FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete on shipments" 
  ON shipments FOR DELETE 
  USING (true);

-- Route history policies
CREATE POLICY "Allow public read on route_history" 
  ON route_history FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on route_history" 
  ON route_history FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update on route_history" 
  ON route_history FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete on route_history" 
  ON route_history FOR DELETE 
  USING (true);

-- =============================================
-- AUTOMATIC UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON shipments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- END OF SCHEMA
-- =============================================
