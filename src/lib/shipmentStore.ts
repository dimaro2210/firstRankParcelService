import { supabase } from '@/lib/supabase';

export interface Shipment {
  id: string;
  userEmail?: string;
  trackingNumber?: string;
  tracking_code?: string;
  createdAt: string;
  status?: string;
  current_status?: string;
  origin?: string;
  destination?: string;
  receiver_name?: string;
  receiver_email?: string;
  weight?: number;
  service?: string;
  shipment_type?: string;
  carrier?: string;
  estimatedDelivery?: string;
  expected_delivery_date?: string;
  from?: { city: string; state: string; zip: string };
  to?: { city: string; state: string; zip: string };
  events?: Array<{ date: string; time: string; location: string; activity?: string; status?: string; coordinates?: { lat: number; lng: number } }>;
  [key: string]: any;
}

export interface RegisteredUser {
  email: string;
  firstName?: string;
  lastName?: string;
  [key: string]: any;
}

export async function getShipments(client = supabase): Promise<Shipment[]> {
  const { data, error } = await client
    .from('shipments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching shipments:', error);
    return [];
  }
  
  return (data || []).map(mapDbToShipment);
}

export async function getShipmentById(id: string, client = supabase): Promise<Shipment | null> {
  const { data, error } = await client
    .from('shipments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToShipment(data);
}

export async function saveShipment(shipment: Shipment, client = supabase): Promise<void> {
  const { error } = await client
    .from('shipments')
    .upsert(mapShipmentToDb(shipment));

  if (error) {
    console.error('Error saving shipment:', error);
  }
}

export async function deleteShipment(id: string, client = supabase): Promise<void> {
  const { error } = await client
    .from('shipments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting shipment:', error);
  }
}

export async function getShipmentsForUser(email: string, client = supabase): Promise<Shipment[]> {
  const { data, error } = await client
    .from('shipments')
    .select('*')
    .or(`user_email.eq.${email},receiver_email.eq.${email}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shipments for user:', error);
    return [];
  }

  return (data || []).map(mapDbToShipment);
}

export async function getRegisteredUsers(client = supabase): Promise<RegisteredUser[]> {
  const { data, error } = await client
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return (data || []).map(mapDbToUser);
}

export async function updateRegisteredUser(user: RegisteredUser, client = supabase): Promise<void> {
  const dbUser: any = { ...user };
  
  if (user.firstName !== undefined) dbUser.first_name = user.firstName;
  if (user.lastName !== undefined) dbUser.last_name = user.lastName;
  if (user.accountType !== undefined) dbUser.account_type = user.accountType;
  if (user.userId !== undefined) dbUser.user_id = user.userId;
  if (user.postalCode !== undefined) dbUser.postal_code = user.postalCode;
  if (user.profilePicture !== undefined) dbUser.profile_picture = user.profilePicture;
  if (user.walletBalance !== undefined) dbUser.wallet_balance = user.walletBalance;

  // Remove camelCase fields to avoid Supabase errors
  delete dbUser.firstName;
  delete dbUser.lastName;
  delete dbUser.accountType;
  delete dbUser.userId;
  delete dbUser.postalCode;
  delete dbUser.profilePicture;
  delete dbUser.walletBalance;

  const { error } = await client
    .from('users')
    .update(dbUser)
    .eq('email', user.email);

  if (error) {
    console.error('Error updating user:', error);
  }
}

export async function getFullUserAccount(email: string, client = supabase): Promise<RegisteredUser | null> {
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbToUser(data);
}

function mapDbToUser(db: any): RegisteredUser {
  return {
    email: db.email,
    firstName: db.first_name,
    lastName: db.last_name,
    accountType: db.account_type,
    userId: db.user_id,
    company: db.company,
    address: db.address,
    postalCode: db.postal_code,
    profilePicture: db.profile_picture,
    status: db.status,
    role: db.role,
    walletBalance: db.wallet_balance,
    ...db,
  };
}

function mapDbToShipment(db: any): Shipment {
  const metadata = db.from_address || {};
  return {
    id: db.id,
    userEmail: db.user_email,
    trackingNumber: db.tracking_number,
    tracking_code: db.tracking_number,
    createdAt: db.created_at,
    status: db.status,
    current_status: db.status,
    origin: db.origin,
    destination: db.destination,
    receiver_name: db.receiver_name,
    receiver_email: db.receiver_email,
    weight: db.weight,
    service: db.service_type,
    shipment_type: db.service_type,
    estimatedDelivery: db.expected_delivery_date,
    expected_delivery_date: db.expected_delivery_date,
    from: metadata,
    to: db.to_address,
    events: (db.events || []).map((e: any) => ({
      ...e,
      // DB events may use 'activity' instead of 'status' — expose both
      status: e.status || e.activity || '',
      activity: e.activity || e.status || '',
    })),
    
    // Unpack metadata
    sender_phone: metadata.sender_phone,
    sender_address: metadata.sender_address,
    receiver_phone: metadata.receiver_phone,
    receiver_address: metadata.receiver_address,
    contents: metadata.contents,
    departure_date: metadata.departure_date,
    departure_time: metadata.departure_time,
    current_location: metadata.current_location,
    notice: metadata.notice,
    carrier: metadata.carrier,
    transit_waypoints: metadata.transit_waypoints,
    changeRequest: metadata.changeRequest,
    bills: metadata.bills || []
  };
}

function mapShipmentToDb(s: Shipment): any {
  // Pack fields missing from SQL schema into the from_address JSONB column
  const extraMetadata = {
    ...s.from,
    sender_phone: s.sender_phone,
    sender_address: s.sender_address,
    receiver_phone: s.receiver_phone,
    receiver_address: s.receiver_address,
    contents: s.contents,
    departure_date: s.departure_date,
    departure_time: s.departure_time,
    current_location: s.current_location,
    notice: s.notice,
    carrier: s.carrier,
    transit_waypoints: s.transit_waypoints,
    changeRequest: s.changeRequest,
    bills: s.bills || (s.from as any)?.bills || []
  };

  return {
    id: s.id,
    user_email: s.userEmail || '',
    tracking_number: s.trackingNumber || s.tracking_code || '',
    status: s.status || s.current_status || 'PENDING',
    origin: s.origin || '',
    destination: s.destination || '',
    receiver_name: s.receiver_name || '',
    receiver_email: s.receiver_email || '',
    weight: s.weight || 0,
    service_type: s.service || s.shipment_type || s.carrier || '',
    expected_delivery_date: s.estimatedDelivery || s.expected_delivery_date || '',
    from_address: extraMetadata,
    to_address: s.to || null,
    events: s.events || [],
  };
}

export function generateTrackingNumber(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let num = "";
  for (let i = 0; i < 12; i++) {
    num += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SWF${num}`;
}

export const LOGISTICS_CENTERS = [
  // ── USA — Major Hubs ──────────────────────────────────────────────
  { name: "Atlanta Hartsfield–Jackson Airport (ATL)", lat: 33.6407, lng: -84.4277 },
  { name: "New York JFK International Airport (JFK)", lat: 40.6413, lng: -73.7781 },
  { name: "Chicago O'Hare International Airport (ORD)", lat: 41.9742, lng: -87.9073 },
  { name: "Los Angeles International Airport (LAX)", lat: 33.9425, lng: -118.4081 },
  { name: "Dallas/Fort Worth International Airport (DFW)", lat: 32.8998, lng: -97.0403 },
  { name: "Miami International Airport (MIA)", lat: 25.7959, lng: -80.2870 },
  { name: "Philadelphia International Airport (PHL)", lat: 39.8729, lng: -75.2437 },
  { name: "Denver International Airport (DEN)", lat: 39.8561, lng: -104.6737 },
  { name: "Seattle-Tacoma International Airport (SEA)", lat: 47.4502, lng: -122.3088 },
  { name: "Louisville Worldport Hub (SDF)", lat: 38.1744, lng: -85.7366 },
  { name: "Memphis Air Cargo Hub (MEM)", lat: 35.0424, lng: -89.9767 },

  // ── Europe ────────────────────────────────────────────────────────
  { name: "London Heathrow Airport (LHR)", lat: 51.4700, lng: -0.4543 },
  { name: "Paris Charles de Gaulle Airport (CDG)", lat: 49.0097, lng: 2.5479 },
  { name: "Frankfurt Airport (FRA)", lat: 50.0379, lng: 8.5622 },
  { name: "Amsterdam Schiphol Airport (AMS)", lat: 52.3105, lng: 4.7683 },
  { name: "Madrid Adolfo Suárez Airport (MAD)", lat: 40.4839, lng: -3.5680 },
  { name: "Istanbul Airport (IST)", lat: 41.2753, lng: 28.7519 },

  // ── Middle East ───────────────────────────────────────────────────
  { name: "Dubai International Airport (DXB)", lat: 25.2532, lng: 55.3657 },
  { name: "Doha Hamad International Airport (DOH)", lat: 25.2609, lng: 51.6138 },
  { name: "Abu Dhabi International Airport (AUH)", lat: 24.4330, lng: 54.6511 },

  // ── Asia Pacific ──────────────────────────────────────────────────
  { name: "Hong Kong International Airport (HKG)", lat: 22.3080, lng: 113.9185 },
  { name: "Tokyo Narita International Airport (NRT)", lat: 35.7720, lng: 140.3929 },
  { name: "Shanghai Pudong International Airport (PVG)", lat: 31.1434, lng: 121.8052 },
  { name: "Singapore Changi Airport (SIN)", lat: 1.3644, lng: 103.9915 },
  { name: "Seoul Incheon International Airport (ICN)", lat: 37.4602, lng: 126.4407 },
  { name: "Sydney Kingsford Smith Airport (SYD)", lat: -33.9399, lng: 151.1753 },

  // ── Africa ────────────────────────────────────────────────────────
  { name: "Lagos Murtala Muhammed Airport (LOS)", lat: 6.5774, lng: 3.3214 },
  { name: "Nairobi Jomo Kenyatta Airport (NBO)", lat: -1.3192, lng: 36.9275 },
  { name: "Johannesburg O.R. Tambo Airport (JNB)", lat: -26.1367, lng: 28.2411 },
  { name: "Cairo International Airport (CAI)", lat: 30.1219, lng: 31.4056 },
  { name: "Accra Kotoka International Airport (ACC)", lat: 5.6052, lng: -0.1668 },

  // ── Americas ──────────────────────────────────────────────────────
  { name: "Toronto Pearson International Airport (YYZ)", lat: 43.6777, lng: -79.6248 },
  { name: "São Paulo Guarulhos Airport (GRU)", lat: -23.4356, lng: -46.4731 },
  { name: "Bogotá El Dorado Airport (BOG)", lat: 4.7016, lng: -74.1469 },
];
