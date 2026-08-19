import { supabase } from '@/lib/supabase';

// Share Store — manages share links in Supabase

export interface ShareLink {
  id?: string;
  token: string;
  shipmentId: string;
  senderEmail: string;
  recipientLabel?: string;
  createdAt: string;
}

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// ── Create a share link — stores in Supabase AND returns token ──
export async function createShareLink(shipmentId: string, senderEmail: string, recipientLabel?: string, client = supabase): Promise<string> {
  // Check if one exists
  const { data: existing } = await client
    .from('share_links')
    .select('token')
    .eq('shipment_id', shipmentId)
    .eq('sender_email', senderEmail)
    .single();

  if (existing) {
    return existing.token;
  }

  const token = generateToken();
  const { error } = await client.from('share_links').insert({
    token,
    shipment_id: shipmentId,
    sender_email: senderEmail,
    recipient_name: recipientLabel || null,
  });

  if (error) {
    console.error('Error creating share link:', error);
  }

  return token;
}

// ── Build a share URL ──
export function buildShareUrl(token: string, _shipment?: any, _senderEmail?: string, _recipientName?: string): string {
  const base = window.location.origin;
  const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  // Simply use the token. Supabase handles the lookup!
  return `${base}${basePath}/shared/${token}`;
}

// ── Decode share data (Kept for backwards compatibility with old Base64 URLs) ──
export function decodeShareToken(token: string): any | null {
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(json);
    if (data && data.s && typeof data.se === "string") {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

// ── Lookup functions ──

export async function getShareByToken(token: string, client = supabase): Promise<ShareLink | null> {
  const { data, error } = await client
    .from('share_links')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    token: data.token,
    shipmentId: data.shipment_id,
    senderEmail: data.sender_email,
    recipientLabel: data.recipient_name,
    createdAt: data.created_at,
  };
}

export async function getSharesForShipment(shipmentId: string, client = supabase): Promise<ShareLink[]> {
  const { data, error } = await client
    .from('share_links')
    .select('*')
    .eq('shipment_id', shipmentId);

  if (error) return [];

  return (data || []).map(d => ({
    id: d.id,
    token: d.token,
    shipmentId: d.shipment_id,
    senderEmail: d.sender_email,
    recipientLabel: d.recipient_name,
    createdAt: d.created_at,
  }));
}

export async function getSharesBySender(senderEmail: string, client = supabase): Promise<ShareLink[]> {
  const { data, error } = await client
    .from('share_links')
    .select('*')
    .eq('sender_email', senderEmail);

  if (error) return [];

  return (data || []).map(d => ({
    id: d.id,
    token: d.token,
    shipmentId: d.shipment_id,
    senderEmail: d.sender_email,
    recipientLabel: d.recipient_name,
    createdAt: d.created_at,
  }));
}

export async function revokeShareLink(token: string, client = supabase): Promise<void> {
  const { error } = await client
    .from('share_links')
    .delete()
    .eq('token', token);

  if (error) {
    console.error('Error revoking share link:', error);
  }
}
