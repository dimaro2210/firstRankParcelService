import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────

export interface Bill {
  id: string;
  userEmail: string;
  receiverEmail?: string;
  shipmentId?: string;
  trackingNumber?: string;
  title: string;
  amount: number;
  note: string;
  imageUrl?: string;
  imageFileName?: string;
  status: "unpaid" | "pending" | "paid";
  createdAt: string;
  paidAt?: string;
}

export interface Deposit {
  id: string;
  userEmail: string;
  amount: number;
  method: "bitcoin" | "usdt";
  receiptImage?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
}

export interface Notification {
  id: string;
  userEmail: string;
  type: "bill_created" | "deposit_approved" | "deposit_rejected" | "bill_paid" | "account_update" | string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// ── Local Storage Cache Keys ────────────────────────────────────────

const LOCAL_BILLS_KEY = "firstrank_bills";
const LOCAL_DEPOSITS_KEY = "firstrank_deposits";
const LOCAL_NOTIFS_KEY = "firstrank_notifications";
const LOCAL_BALANCES_KEY = "firstrank_user_balances";

function getLocalBills(): Bill[] {
  try {
    const raw = localStorage.getItem(LOCAL_BILLS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setLocalBills(bills: Bill[]): void {
  try {
    localStorage.setItem(LOCAL_BILLS_KEY, JSON.stringify(bills));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(e);
  }
}

function getLocalDeposits(): Deposit[] {
  try {
    const raw = localStorage.getItem(LOCAL_DEPOSITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setLocalDeposits(deps: Deposit[]): void {
  try {
    localStorage.setItem(LOCAL_DEPOSITS_KEY, JSON.stringify(deps));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(e);
  }
}

function getLocalNotifs(): Notification[] {
  try {
    const raw = localStorage.getItem(LOCAL_NOTIFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setLocalNotifs(notifs: Notification[]): void {
  try {
    localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(e);
  }
}

function getLocalBalances(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LOCAL_BALANCES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// ── Bills ──────────────────────────────────────────────────────────

export async function getBills(email?: string, client = supabase): Promise<Bill[]> {
  let dbBills: Bill[] = [];
  try {
    let query = client.from('bills').select('*').order('created_at', { ascending: false });
    if (email) {
      query = query.or(`user_email.eq.${email},receiver_email.eq.${email}`);
    }
    const { data, error } = await query;
    if (!error && data) {
      dbBills = data.map(mapDbToBill);
    }
  } catch (e) {
    // Supabase table permission / RLS handled gracefully via local fallback
  }

  const localBills = getLocalBills();
  const billMap = new Map<string, Bill>();

  for (const b of dbBills) {
    billMap.set(b.id, b);
  }
  for (const b of localBills) {
    const existing = billMap.get(b.id);
    if (!existing || b.status === "paid" || new Date(b.paidAt || b.createdAt).getTime() >= new Date(existing.paidAt || existing.createdAt).getTime()) {
      billMap.set(b.id, b);
    }
  }

  const all = Array.from(billMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!email) {
    return all;
  }

  const target = email.trim().toLowerCase();
  return all.filter(b => {
    const uEmail = (b.userEmail || "").trim().toLowerCase();
    const rEmail = (b.receiverEmail || "").trim().toLowerCase();
    const note = (b.note || "").toLowerCase();
    return uEmail === target || rEmail === target || note.includes(target);
  });
}

export async function saveBill(bill: Bill, client = supabase): Promise<void> {
  // 1. Save locally
  const current = getLocalBills();
  const idx = current.findIndex(b => b.id === bill.id);
  if (idx >= 0) {
    current[idx] = bill;
  } else {
    current.unshift(bill);
  }
  setLocalBills(current);

  // 2. Also try Supabase
  try {
    await client.from('bills').upsert(mapBillToDb(bill));
  } catch (e) {
    // Supabase handled via local cache
  }
}

export async function deleteBill(id: string, client = supabase): Promise<void> {
  const current = getLocalBills().filter(b => b.id !== id);
  setLocalBills(current);

  try {
    await client.from('bills').delete().eq('id', id);
  } catch (e) {
    // Handled
  }
}

// ── Deposits ───────────────────────────────────────────────────────

export async function getDeposits(email?: string, client = supabase): Promise<Deposit[]> {
  let dbDeposits: Deposit[] = [];
  try {
    let query = client.from('deposits').select('*').order('created_at', { ascending: false });
    if (email) {
      query = query.eq('user_email', email);
    }
    const { data, error } = await query;
    if (!error && data) {
      dbDeposits = data.map(mapDbToDeposit);
    }
  } catch (e) {
    // Handled
  }

  const local = getLocalDeposits();
  const depMap = new Map<string, Deposit>();
  for (const d of local) depMap.set(d.id, d);
  for (const d of dbDeposits) depMap.set(d.id, d);

  const all = Array.from(depMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!email) return all;
  const target = email.trim().toLowerCase();
  return all.filter(d => (d.userEmail || "").trim().toLowerCase() === target);
}

export async function saveDeposit(deposit: Deposit, client = supabase): Promise<void> {
  const current = getLocalDeposits();
  const idx = current.findIndex(d => d.id === deposit.id);
  if (idx >= 0) {
    current[idx] = deposit;
  } else {
    current.unshift(deposit);
  }
  setLocalDeposits(current);

  try {
    const isStatusUpdate = deposit.status === 'approved' || deposit.status === 'rejected';
    if (isStatusUpdate) {
      await client.from('deposits').update(mapDepositToDb(deposit)).eq('id', deposit.id);
    } else {
      await client.from('deposits').insert(mapDepositToDb(deposit));
    }
  } catch (e) {
    // Handled
  }
}

// ── Balance ────────────────────────────────────────────────────────

export async function getUserBalance(email: string, client = supabase): Promise<number> {
  const localMap = getLocalBalances();
  const key = email.trim().toLowerCase();
  
  try {
    const { data, error } = await client.from('users').select('wallet_balance').eq('email', email).maybeSingle();
    if (!error && data && data.wallet_balance !== null && data.wallet_balance !== undefined) {
      return Number(data.wallet_balance);
    }
  } catch (e) {
    // Handled
  }

  return localMap[key] ?? 0;
}

export async function setUserBalance(email: string, amount: number, client = supabase): Promise<void> {
  const localMap = getLocalBalances();
  const key = email.trim().toLowerCase();
  localMap[key] = Math.max(0, amount);
  try {
    localStorage.setItem(LOCAL_BALANCES_KEY, JSON.stringify(localMap));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error(e);
  }

  try {
    await client.from('users').update({ wallet_balance: Math.max(0, amount) }).eq('email', email);
  } catch (e) {
    // Handled
  }
}

// ── Notifications ──────────────────────────────────────────────────

export async function getNotifications(email: string, client = supabase): Promise<Notification[]> {
  let dbNotifs: Notification[] = [];
  try {
    const { data, error } = await client.from('notifications').select('*').eq('user_email', email).order('created_at', { ascending: false });
    if (!error && data) {
      dbNotifs = data.map(mapDbToNotification);
    }
  } catch (e) {
    // Handled
  }

  const local = getLocalNotifs();
  const notifMap = new Map<string, Notification>();
  for (const n of local) notifMap.set(n.id, n);
  for (const n of dbNotifs) notifMap.set(n.id, n);

  const all = Array.from(notifMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const target = email.trim().toLowerCase();
  return all.filter(n => (n.userEmail || "").trim().toLowerCase() === target);
}

export async function getAllNotifications(client = supabase): Promise<Notification[]> {
  let dbNotifs: Notification[] = [];
  try {
    const { data, error } = await client.from('notifications').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      dbNotifs = data.map(mapDbToNotification);
    }
  } catch (e) {
    // Handled
  }

  const local = getLocalNotifs();
  const notifMap = new Map<string, Notification>();
  for (const n of local) notifMap.set(n.id, n);
  for (const n of dbNotifs) notifMap.set(n.id, n);

  return Array.from(notifMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveNotification(notif: Notification, client = supabase): Promise<void> {
  const current = getLocalNotifs();
  const idx = current.findIndex(n => n.id === notif.id);
  if (idx >= 0) {
    current[idx] = notif;
  } else {
    current.unshift(notif);
  }
  setLocalNotifs(current);

  try {
    await client.from('notifications').upsert(mapNotificationToDb(notif));
  } catch (e) {
    // Handled
  }
}

export async function markAllNotificationsRead(email: string, client = supabase): Promise<void> {
  const target = email.trim().toLowerCase();
  const current = getLocalNotifs().map(n => (n.userEmail || "").trim().toLowerCase() === target ? { ...n, read: true } : n);
  setLocalNotifs(current);

  try {
    await client.from('notifications').update({ read: true }).eq('user_email', email);
  } catch (e) {
    // Handled
  }
}

export async function getUnreadCount(email: string, client = supabase): Promise<number> {
  const notifs = await getNotifications(email, client);
  return notifs.filter(n => !n.read).length;
}

// ── Wallet Addresses ───────────────────────────────────────────────

export async function getWalletAddresses(client = supabase): Promise<{ bitcoin: string; usdt: string }> {
  const defaults = {
    bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    usdt: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
  };
  try {
    const { data, error } = await client.from('settings').select('*').eq('key', 'crypto_wallets').maybeSingle();
    if (error || !data) return defaults;
    return data.value;
  } catch (e) {
    return defaults;
  }
}

export async function saveWalletAddresses(wallets: { bitcoin: string; usdt: string }, client = supabase): Promise<void> {
  try {
    await client.from('settings').upsert({ key: 'crypto_wallets', value: wallets });
  } catch (e) {
    console.error(e);
  }
}

// ── Helpers ────────────────────────────────────────────────────────

export function generateId(prefix = "id"): string {
  return crypto.randomUUID();
}

function mapDbToBill(db: any): Bill {
  return {
    id: db.id,
    userEmail: db.user_email,
    receiverEmail: db.receiver_email,
    shipmentId: db.shipment_id,
    trackingNumber: db.tracking_number,
    title: db.title,
    amount: Number(db.amount),
    note: db.note,
    imageUrl: db.image_url,
    imageFileName: db.image_file_name,
    status: db.status,
    createdAt: db.created_at,
    paidAt: db.paid_at,
  };
}

function mapBillToDb(b: Bill): any {
  return {
    id: b.id,
    user_email: b.userEmail,
    receiver_email: b.receiverEmail,
    shipment_id: b.shipmentId,
    tracking_number: b.trackingNumber,
    title: b.title,
    amount: b.amount,
    note: b.note,
    image_url: b.imageUrl,
    image_file_name: b.imageFileName,
    status: b.status,
    created_at: b.createdAt,
    paid_at: b.paidAt,
  };
}

function mapDbToDeposit(db: any): Deposit {
  return {
    id: db.id,
    userEmail: db.user_email,
    amount: Number(db.amount),
    method: db.method,
    receiptImage: db.receipt_image,
    status: db.status,
    createdAt: db.created_at,
    reviewedAt: db.reviewed_at,
  };
}

function mapDepositToDb(d: Deposit): any {
  return {
    id: d.id,
    user_email: d.userEmail,
    amount: d.amount,
    method: d.method,
    receipt_image: d.receiptImage,
    status: d.status,
    created_at: d.createdAt,
    reviewed_at: d.reviewedAt,
  };
}

function mapDbToNotification(db: any): Notification {
  return {
    id: db.id,
    userEmail: db.user_email,
    type: db.type,
    title: db.title,
    body: db.body,
    read: db.read,
    createdAt: db.created_at,
  };
}

function mapNotificationToDb(n: Notification): any {
  return {
    id: n.id,
    user_email: n.userEmail,
    type: n.type,
    title: n.title,
    body: n.body,
    read: n.read,
    created_at: n.createdAt,
  };
}

