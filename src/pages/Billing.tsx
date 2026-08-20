import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState, useCallback } from "react";
import {
  CreditCard, Plus, ArrowLeft, Copy, Check, Upload, Loader2,
  AlertTriangle, Bitcoin, CheckCircle2, Clock, X, FileText,
  ChevronRight, DollarSign, Bell, Image as ImageIcon, Wallet, ShieldCheck, ArrowUpRight,
  Download, Paperclip, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getBills, saveBill, getDeposits, saveDeposit, getUserBalance,
  setUserBalance, getNotifications, markAllNotificationsRead,
  getUnreadCount, saveNotification, generateId, getWalletAddresses,
} from "@/lib/billingStore";
import type { Bill, Deposit } from "@/lib/billingStore";
import { getShipmentsForUser, saveShipment } from "@/lib/shipmentStore";
import { sendBillPaidEmail } from "@/lib/emailService";

type DepositStep = 1 | 2 | 3 | 4 | 5;

export default function Billing() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  // ── Data ──
  const [bills, setBills] = useState<Bill[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [balance, setBalance] = useState(0);
  const [walletAddresses, setWalletAddresses] = useState({ bitcoin: "1AZiAXQEd26KNJMC4MrhAUZiRjvP3azYMe" });

  // ── Deposit modal ──
  const [showDeposit, setShowDeposit] = useState(false);
  const [step, setStep] = useState<DepositStep>(1);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod] = useState<"bitcoin">("bitcoin");
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");
  const [copied, setCopied] = useState(false);
  const [depositId, setDepositId] = useState("");

  // ── Tab & Bill View ──
  const [tab, setTab] = useState<"bills" | "deposits">("bills");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  // Payment flow: "confirm" → "loading" → "success"
  const [payStep, setPayStep] = useState<"confirm" | "loading" | "success" | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    const userShipments = await getShipmentsForUser(user.email);
    const shipmentBills = userShipments.flatMap(s => (s.bills || (s.from as any)?.bills || []) as Bill[]);
    const storeBills = await getBills(user.email);
    const combined = Array.from(new Map([...shipmentBills, ...storeBills].map(b => [b.id, b])).values());

    setBills(combined);
    setDeposits(await getDeposits(user.email));
    setBalance(await getUserBalance(user.email));
    setWalletAddresses(await getWalletAddresses());
  }, [user]);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth/login");
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    reload();
    const handleStorage = () => reload();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [reload]);

  if (!isAuthenticated || !user) return null;

  // ── Open the payment confirmation modal ──
  const openPayModal = (bill: Bill) => {
    setSelectedBill(bill);
    setPayStep("confirm");
  };

  // ── Execute the actual payment ──
  const confirmPayBill = async () => {
    if (!selectedBill) return;
    if (balance < selectedBill.amount) {
      setPayStep(null);
      setSelectedBill(null);
      setShowDeposit(true);
      return;
    }
    setPayStep("loading");
    const paidBill: Bill = { ...selectedBill, status: "paid", paidAt: new Date().toISOString() };
    const newBal = Math.max(0, balance - selectedBill.amount);

    try {
      // 1. Deduct balance
      await setUserBalance(user.email, newBal);

      // 2. Save bill
      await saveBill(paidBill);

      // 3. Update shipment if attached
      const userShipments = await getShipmentsForUser(user.email);
      for (const s of userShipments) {
        const hasBill = (s.bills || (s.from as any)?.bills || []).some((b: any) => b.id === selectedBill.id);
        if (hasBill) {
          const updatedBills = (s.bills || (s.from as any)?.bills || []).map((b: any) => 
            b.id === selectedBill.id ? paidBill : b
          );
          await saveShipment({ ...s, bills: updatedBills });
        }
      }

      // 4. Send email receipt
      const receiverTarget = selectedBill.receiverEmail || selectedBill.userEmail || user.email;
      if (receiverTarget) {
        sendBillPaidEmail(receiverTarget, paidBill);
      }
    } catch (err) {
      console.error("Error executing payment in billing page:", err);
    }

    // 5. Smooth 3 second loading transition to success
    setTimeout(async () => {
      setPayStep("success");
      await reload();
    }, 3000);
  };

  const closePayModal = () => {
    setPayStep(null);
    setSelectedBill(null);
  };

  // ── Deposit step helpers ──
  const resetDeposit = () => {
    setStep(1);
    setDepositAmount("");
    setDepositMethod("bitcoin");
    setReceiptFile(null);
    setReceiptName("");
    setCopied(false);
    setShowDeposit(false);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setReceiptFile(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSentIt = async () => {
    const id = generateId("dep");
    setDepositId(id);
    const dep: Deposit = {
      id,
      userEmail: user.email,
      amount: parseFloat(depositAmount),
      method: depositMethod,
      receiptImage: receiptFile ?? undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    await saveDeposit(dep);
    setStep(4); // loading
    setTimeout(() => { setStep(5); reload(); }, 5000);
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletAddr = walletAddresses.bitcoin;
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(walletAddr);

  const unpaidBills = bills.filter(b => b.status === "unpaid");
  const paidBills = bills.filter(b => b.status === "paid");

  return (
    <div className="min-h-screen bg-firstrank-cream pb-24 font-inter">

      {/* ── CLEAN MINIMAL HEADER ── */}
      <div className="relative pt-24 pb-12 md:pt-32 md:pb-16 px-4 md:px-8 border-b border-gray-200 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59A25] opacity-5 -mr-32 -mt-32 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B2B26] opacity-5 -ml-32 -mb-32 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <p className="text-[12px] font-bold uppercase tracking-widest text-[#F59A25] mb-3">Finance Center</p>
            <h1 className="text-[32px] md:text-[56px] font-bold text-[#0B2B26] leading-none font-outfit tracking-tight mb-4">Billing & Payments</h1>
            <p className="text-gray-500 text-[16px] md:text-[18px] max-w-xl leading-relaxed">Manage your shipping invoices, track deposits, and maintain your account balance securely.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Available Balance</p>
              <p className="text-[36px] md:text-[44px] font-outfit font-bold text-[#0B2B26] leading-none tracking-tight">${balance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => { setShowDeposit(true); setStep(1); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#F59A25] hover:bg-[#E08A1B] text-white rounded-full font-bold text-[15px] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              <Plus size={18} /> Add Funds
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 md:mt-12 relative z-20">

        {/* ── MINIMAL TABS ── */}
        <div className="flex bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50 backdrop-blur-sm self-start mb-4">
          {(["bills", "deposits"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${tab === t ? "bg-white text-[#0B2B26] shadow-sm border border-gray-200/50" : "text-gray-400 hover:text-gray-600"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-700 font-bold text-[14px] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Bills Tab ── */}
            {tab === "bills" && (
              <div>
                {/* ── UNPAID BILLS ONLY ── */}
                {unpaidBills.length > 0 && (
                  <div>
                    <div className="grid gap-4">
                      {unpaidBills.map(bill => (
                        <div key={bill.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-[14px] font-bold text-[#0B2B26] mb-1">{bill.title}</p>
                              <p className="text-[12px] text-gray-500">Invoice: #{bill.id.split("-")[1]?.toUpperCase() || bill.id}</p>
                              <p className="text-[12px] text-gray-500">{new Date(bill.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[20px] font-bold font-outfit text-[#F59A25]">${bill.amount.toFixed(2)}</p>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full mt-2">
                                <AlertTriangle size={12} /> Unpaid
                              </span>
                            </div>
                          </div>
                          {bill.note && <p className="text-[13px] text-gray-600 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">{bill.note}</p>}

                          {bill.imageUrl && (
                            <div className="mb-4 rounded-xl overflow-hidden relative group max-h-48 border border-gray-100 bg-gray-50 flex items-center justify-center">
                              <img src={bill.imageUrl} alt="Bill Document" className="w-full h-full object-contain mix-blend-multiply" />
                              <a
                                href={bill.imageUrl}
                                download={bill.imageFileName || "bill-receipt.png"}
                                className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-firstrank-deep hover:text-firstrank-orange shadow-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-[11px] font-bold z-10"
                              >
                                <Download size={14} /> Download
                              </a>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openPayModal(bill)}
                              className="flex-1 bg-[#0B2B26] text-white py-3 rounded-xl font-bold text-[13px] hover:bg-[#123d36] transition-all flex items-center justify-center gap-2"
                            >
                              <CreditCard size={16} /> Pay Invoice
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── PAID BILLS ── */}
                {paidBills.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Payment History</h3>
                    <div className="grid gap-4">
                      {paidBills.map(bill => (
                        <div key={bill.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 opacity-70 hover:opacity-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[14px] font-bold text-[#0B2B26] mb-1 line-through decoration-gray-300">{bill.title}</p>
                              <p className="text-[12px] text-gray-500">Invoice: #{bill.id.split("-")[1]?.toUpperCase() || bill.id}</p>
                              <p className="text-[12px] text-gray-500">Paid on {bill.paidAt ? new Date(bill.paidAt).toLocaleDateString() : new Date(bill.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[20px] font-bold font-outfit text-gray-400">${bill.amount.toFixed(2)}</p>
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full mt-2 border border-green-100">
                                <CheckCircle2 size={12} /> Paid
                              </span>
                            </div>
                          </div>
                          
                          {bill.imageUrl && (
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-[12px] text-gray-500 flex items-center gap-1.5"><FileText size={14} /> Receipt attached</span>
                              <a
                                href={bill.imageUrl}
                                download={bill.imageFileName || "bill-receipt.png"}
                                className="text-[12px] font-bold text-[#0B2B26] hover:text-[#F59A25] transition-colors flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
                              >
                                <Download size={14} /> Download
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {bills.length === 0 && (
                  <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <FileText className="text-gray-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No Invoices</h3>
                    <p className="text-gray-500 text-sm">You have no billing records at this time.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Deposits Tab ── */}
            {tab === "deposits" && (
              <div>
                {deposits.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Wallet size={28} className="text-gray-300 mx-auto mb-3" />
                    <p className="font-outfit font-bold text-[#0B2B26] text-lg mb-1">No deposits yet</p>
                    <p className="text-gray-400 text-[14px] mb-5">Add funds to manage your shipments.</p>
                    <button onClick={() => { setShowDeposit(true); setStep(1); }} className="px-6 py-2.5 bg-[#0B2B26] text-white rounded-xl font-bold text-[13px]">Make a Deposit</button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {deposits.map(dep => (
                      <div key={dep.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/30 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${dep.method === "bitcoin" ? "bg-orange-50 border border-orange-100" : "bg-green-50 border border-green-100"}`}>
                          {dep.method === "bitcoin" ? <Bitcoin size={18} className="text-orange-500" /> : <DollarSign size={18} className="text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0B2B26] text-[15px]">${dep.amount.toFixed(2)}</p>
                          <p className="text-[12px] text-gray-400 capitalize">{dep.method} · {new Date(dep.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${
                          dep.status === "approved" ? "bg-green-50 text-green-600 border-green-100"
                          : dep.status === "rejected" ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>{dep.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── DEPOSIT MODAL ── */}
      {showDeposit && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              {step > 1 && step < 4 ? (
                <button onClick={() => setStep((step - 1) as DepositStep)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <ArrowLeft size={18} className="text-gray-600" />
                </button>
              ) : <div className="w-9" />}
              <div className="flex gap-1.5">
                {[1,2,3].map(s => (
                  <div key={s} className={`h-1.5 rounded-full transition-all ${s <= Math.min(step, 3) ? "bg-[#F59A25] w-6" : "bg-gray-200 w-4"}`} />
                ))}
              </div>
              {step < 4 && (
                <button onClick={resetDeposit} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                  <X size={18} className="text-gray-600" />
                </button>
              )}
              {step >= 4 && <div className="w-9" />}
            </div>

            {/* ── Step 1: Amount ── */}
            {step === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-1">Deposit Funds</h2>
                <p className="text-sm text-gray-500 mb-6">Enter how much you want to deposit into your balance.</p>
                <div className="mb-6">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg font-bold text-[#0B2B26] outline-none focus:border-[#F59A25] transition-colors"
                    />
                  </div>
                </div>
                <button
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#F59A25" }}
                >
                  Continue
                </button>
              </div>
            )}

            {/* ── Step 2: Method ── */}
            {step === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-1">Payment Method</h2>
                <p className="text-sm text-gray-500 mb-6">You will send <span className="font-bold text-[#0B2B26]">${parseFloat(depositAmount || "0").toFixed(2)}</span> via Bitcoin</p>
                <div className="mb-6">
                  <div className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#0B2B26] bg-[#0B2B26]/5 text-left">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-orange-50 shrink-0">
                      <Bitcoin size={20} className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#0B2B26] text-sm">Bitcoin</p>
                      <p className="text-xs text-gray-500">BTC network</p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-[#0B2B26] bg-[#0B2B26] flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm"
                  style={{ backgroundColor: "#F59A25" }}
                >
                  Continue
                </button>
              </div>
            )}

            {/* ── Step 3: QR + Address + Receipt ── */}
            {step === 3 && (
              <div className="p-6">
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-1">Send Payment</h2>
                <p className="text-sm text-gray-500 mb-5">Send exactly <span className="font-bold text-[#0B2B26]">${parseFloat(depositAmount || "0").toFixed(2)}</span> worth of <span className="font-bold">BTC</span> to the address below.</p>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm">
                    <img src={qrUrl} alt="Wallet QR" className="w-44 h-44 rounded-lg" />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 mb-4">
                  <p className="flex-1 text-xs font-mono text-gray-700 break-all leading-relaxed">{walletAddr}</p>
                  <button
                    onClick={() => copyAddress(walletAddr)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                  </button>
                </div>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <span className="font-bold">Important:</span> Only send <span className="font-bold">Bitcoin (BTC)</span> to this address. Sending any other cryptocurrency may result in <span className="font-bold">permanent loss of funds</span>.
                  </p>
                </div>

                {/* Receipt Upload */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Upload Payment Receipt</label>
                  <label className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${receiptFile ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleReceiptUpload} />
                    {receiptFile ? (
                      <><Check size={18} className="text-green-500 shrink-0" /><p className="text-sm font-medium text-green-700 truncate">{receiptName}</p></>
                    ) : (
                      <><Upload size={18} className="text-gray-400 shrink-0" /><p className="text-sm text-gray-500">Tap to upload receipt (image or PDF)</p></>
                    )}
                  </label>
                </div>

                <button
                  disabled={!receiptFile}
                  onClick={handleSentIt}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#0B2B26" }}
                >
                  I've Sent It
                </button>
              </div>
            )}

            {/* ── Step 4: Loading ── */}
            {step === 4 && (
              <div className="p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F59A25]/10 flex items-center justify-center mx-auto mb-6">
                  <Loader2 size={28} className="text-[#F59A25] animate-spin" />
                </div>
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-2">Processing...</h2>
                <p className="text-sm text-gray-500">Submitting your deposit request</p>
              </div>
            )}

            {/* ── Step 5: Pending confirmation ── */}
            {step === 5 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto mb-5">
                  <Clock size={28} className="text-amber-500" />
                </div>
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-2">Deposit Submitted!</h2>
                <p className="text-sm text-gray-600 mb-1">Your deposit is being reviewed.</p>
                <p className="text-sm font-bold text-amber-600 mb-6">This typically takes 5 to 30 minutes.</p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3 text-left">
                  <Bell size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">You will receive a notification once your deposit has been approved and the balance has been credited to your account.</p>
                </div>
                <button
                  onClick={() => { resetDeposit(); navigate("/dashboard"); }}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm"
                  style={{ backgroundColor: "#0B2B26" }}
                >
                  Go to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── PAYMENT FLOW MODAL ── */}
      {selectedBill && payStep && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* ── STEP: CONFIRM ── */}
            {payStep === "confirm" && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-outfit font-bold text-[#0B2B26]">Confirm Payment</h2>
                  <button onClick={closePayModal} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>

                {/* Invoice Summary */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Invoice</p>
                  <p className="text-[16px] font-bold text-[#0B2B26] mb-3">{selectedBill.title}</p>
                  {selectedBill.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden max-h-32 border border-gray-100 bg-white flex items-center justify-center">
                      <img src={selectedBill.imageUrl} alt="Bill" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="h-px bg-gray-200 my-3" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">Amount Due</p>
                    <p className="text-[22px] font-outfit font-bold text-[#F59A25]">${selectedBill.amount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Payment Source */}
                <div className="bg-[#0B2B26] rounded-2xl p-5 mb-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Paying From</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Wallet size={20} className="text-[#F59A25]" />
                      </div>
                      <div>
                        <p className="font-bold text-[15px]">Dashboard Balance</p>
                        <p className="text-[12px] text-white/60">Available funds</p>
                      </div>
                    </div>
                    <p className="text-[20px] font-outfit font-bold">${balance.toFixed(2)}</p>
                  </div>
                </div>

                {/* Insufficient funds warning */}
                {balance < selectedBill.amount && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700 mb-1">Insufficient Balance</p>
                      <p className="text-xs text-red-600">You need ${(selectedBill.amount - balance).toFixed(2)} more. Please deposit funds first.</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {balance >= selectedBill.amount ? (
                  <button
                    onClick={confirmPayBill}
                    className="w-full py-4 rounded-xl font-bold text-white text-[15px] bg-[#F59A25] hover:bg-[#E08A1B] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Confirm Payment of ${selectedBill.amount.toFixed(2)} <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => { closePayModal(); setShowDeposit(true); setStep(1); }}
                    className="w-full py-4 rounded-xl font-bold text-white text-[15px] bg-[#0B2B26] hover:bg-[#123d36] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Deposit Funds
                  </button>
                )}
              </div>
            )}

            {/* ── STEP: LOADING ── */}
            {payStep === "loading" && (
              <div className="p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F59A25]/10 flex items-center justify-center mx-auto mb-6">
                  <Loader2 size={36} className="text-[#F59A25] animate-spin" />
                </div>
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-2">Processing Payment...</h2>
                <p className="text-sm text-gray-500 mb-1">Deducting ${selectedBill.amount.toFixed(2)} from your balance</p>
                <p className="text-xs text-gray-400">Please wait, do not close this window</p>
              </div>
            )}

            {/* ── STEP: SUCCESS ── */}
            {payStep === "success" && (
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} className="text-green-500" />
                </div>
                <h2 className="text-xl font-outfit font-bold text-[#0B2B26] mb-2">Payment Successful!</h2>
                <p className="text-sm text-gray-600 mb-1">Invoice <span className="font-bold">"{selectedBill.title}"</span> has been paid.</p>
                <p className="text-sm text-green-600 font-bold mb-6">The receiver has been notified via email.</p>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-[#0B2B26]">${selectedBill.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">New Balance</span>
                    <span className="font-bold text-[#0B2B26]">${balance.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={closePayModal}
                  className="w-full py-4 rounded-xl font-bold text-white text-sm bg-[#0B2B26] hover:bg-[#123d36] transition-all"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
