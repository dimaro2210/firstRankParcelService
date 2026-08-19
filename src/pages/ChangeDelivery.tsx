import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { CheckCircle, X, ChevronRight, Package, Loader2, AlertCircle } from "lucide-react";
import { getShipmentsForUser, saveShipment, Shipment } from "@/lib/shipmentStore";

const options = [
  {
    id: "reschedule",
    icon: "https://www.ups.com/webassets/icons/alarm_on.svg",
    title: "Reschedule Delivery",
    desc: "Choose a different delivery date that works for you.",
  },
  {
    id: "reroute",
    icon: "https://www.ups.com/webassets/icons/pin.svg",
    title: "Reroute to Another Address",
    desc: "Send your package to a different address or access point.",
  },
  {
    id: "hold",
    icon: "https://www.ups.com/webassets/icons/box.svg",
    title: "Hold at FIRSTRANK PARCEL Location",
    desc: "Pick up your package at a nearby FIRSTRANK PARCEL facility or FIRSTRANK PARCEL Store.",
  },
  {
    id: "neighbor",
    icon: "https://www.ups.com/webassets/icons/blue_help.svg",
    title: "Leave with Neighbor",
    desc: "Authorize delivery to a neighbor's address.",
  },
] as const;

export default function ChangeDelivery() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states based on option
  const [newDate, setNewDate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newZip, setNewZip] = useState("");
  const [holdLocation, setHoldLocation] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    if (user) {
      (async () => {
        const all = await getShipmentsForUser(user.email);
        const userShipments = all.filter(s => s.status !== "Delivered");
        setShipments(userShipments);

        const params = new URLSearchParams(window.location.search);
        const tn = params.get("tn");
        if (tn) {
          const found = userShipments.find(s => s.trackingNumber === tn);
          if (found) setSelectedShipmentId(found.id);
        } else if (userShipments.length > 0) {
          setSelectedShipmentId(userShipments[0].id);
        }
      })();
    }
  }, [isAuthenticated, authLoading, user, navigate]);

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId);

  const handleSubmit = async () => {
    if (!selectedShipment || !selectedOption) return;
    setLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));

    let newData: any = {};
    if (selectedOption === "reschedule") newData = { date: newDate };
    if (selectedOption === "reroute") newData = { address: newAddress, city: newCity, state: newState, zip: newZip };
    if (selectedOption === "hold") newData = { location: holdLocation };

    const updatedShipment = { ...selectedShipment };
    updatedShipment.changeRequest = {
      id: `req-${Date.now()}`,
      type: selectedOption as any,
      status: "pending",
      newData,
      createdAt: new Date().toISOString()
    };

    saveShipment(updatedShipment);
    
    // Update local state so UI refreshes
    setShipments(prev => prev.map(s => s.id === updatedShipment.id ? updatedShipment : s));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-firstrank-cream px-4 pb-32">
        <div className="max-w-xl w-full bg-white rounded-[40px] p-10 md:p-16 text-center shadow-2xl border border-gray-100">
          <div className="w-24 h-24 bg-firstrank-mint rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <img src="https://www.ups.com/webassets/icons/alarm_on.svg" alt="Success" className="w-12 h-12 invert opacity-60" />
          </div>
          <h1 className="text-[32px] md:text-[40px] font-outfit font-bold text-firstrank-deep mb-4">Request Submitted</h1>
          <p className="text-[18px] text-gray-500 mb-10 leading-relaxed font-medium">Your delivery change request has been sent to our logistics team for approval. We'll notify you once it's processed.</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate(`/tracking?tn=${selectedShipment?.trackingNumber}`)}
              className="w-full py-4 rounded-full font-bold text-[16px] transition-all hover:bg-firstrank-amber shadow-lg"
              style={{ backgroundColor: "var(--firstrank-orange)", color: "white" }}
            >
              Track Package
            </button>
            <button
              onClick={() => { setSubmitted(false); setSelectedOption(""); }}
              className="w-full py-4 rounded-full border-2 border-gray-200 font-bold text-[16px] text-gray-500 transition-all hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-firstrank-cream min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="mb-12">
          <p className="text-[14px] font-bold uppercase tracking-widest text-firstrank-orange mb-4">In-Flight Options</p>
          <h1 className="text-[32px] md:text-[48px] font-outfit font-bold text-firstrank-deep mb-4 leading-tight">Change Delivery</h1>
          <p className="text-[18px] text-gray-500 font-medium">Select an active shipment to manage its delivery preferences.</p>
        </div>

        {shipments.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-300" />
            </div>
            <h2 className="text-[24px] font-bold text-firstrank-deep mb-2">No Active Shipments</h2>
            <p className="text-gray-500">You don't have any active shipments eligible for delivery changes.</p>
          </div>
        ) : (
          <>
            {/* Shipment Selector */}
            <div className="bg-white rounded-[32px] p-8 mb-10 shadow-sm border border-gray-100">
              <label className="block text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4">Select Shipment</label>
              <div className="relative">
                <select
                  value={selectedShipmentId}
                  onChange={(e) => { setSelectedShipmentId(e.target.value); setSelectedOption(""); }}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all appearance-none cursor-pointer"
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>{s.trackingNumber} — {s.to?.name || s.receiver_name}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
              </div>
            </div>

            {selectedShipment?.changeRequest?.status === "pending" ? (
              <div className="bg-blue-50 border border-blue-200 rounded-[32px] p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={32} className="text-blue-500" />
                </div>
                <h2 className="text-[24px] font-bold text-blue-900 mb-2">Request Pending Approval</h2>
                <p className="text-blue-700/80 max-w-md">You already have a <strong>{selectedShipment.changeRequest.type}</strong> request pending for this shipment. Please wait for our logistics team to approve it.</p>
              </div>
            ) : selectedShipment ? (
              <>
                <h2 className="text-[22px] font-outfit font-bold text-firstrank-deep mb-6">Choose a Delivery Option</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex flex-col p-6 rounded-[28px] cursor-pointer transition-all border-2 group hover:shadow-lg bg-white"
                      style={{
                        borderColor: selectedOption === opt.id ? "var(--firstrank-orange)" : "transparent",
                        boxShadow: selectedOption === opt.id ? "0px 10px 30px rgba(245,154,37,0.15)" : "0px 4px 15px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${selectedOption === opt.id ? 'bg-firstrank-orange/10' : 'bg-gray-50'}`}>
                          <img src={opt.icon} alt={opt.title} className={`w-7 h-7 ${selectedOption === opt.id ? 'opacity-100 invert-0' : 'opacity-40 invert'}`} style={selectedOption === opt.id ? { filter: "brightness(0) saturate(100%) invert(67%) sepia(35%) saturate(5427%) hue-rotate(345deg) brightness(101%) contrast(93%)" } : {}} />
                        </div>
                        <input
                          type="radio"
                          name="delivery-option"
                          value={opt.id}
                          checked={selectedOption === opt.id}
                          onChange={() => setSelectedOption(opt.id)}
                          className="w-6 h-6 border-2 border-gray-200 checked:border-firstrank-orange checked:bg-firstrank-orange appearance-none rounded-full transition-all cursor-pointer mt-2"
                        />
                      </div>
                      <div>
                        <p className="font-outfit font-bold text-[20px] text-firstrank-deep mb-2">{opt.title}</p>
                        <p className="text-[14px] text-gray-500 font-medium leading-relaxed">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedOption === "reschedule" && (
                  <div className="mb-10 p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                    <label className="block text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4">Select a New Delivery Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}

                {selectedOption === "reroute" && (
                  <div className="mb-10 p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 space-y-5">
                    <p className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-2">New Delivery Address</p>
                    <input type="text" value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Street Address" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <input type="text" value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="City" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all" />
                      <input type="text" value={newState} onChange={e => setNewState(e.target.value)} placeholder="State" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all" />
                      <input type="text" value={newZip} onChange={e => setNewZip(e.target.value)} placeholder="ZIP Code" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange transition-all" />
                    </div>
                  </div>
                )}

                {selectedOption === "hold" && (
                  <div className="mb-10 p-8 rounded-[32px] bg-white shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-6">Nearest FIRSTRANK PARCEL Locations</p>
                    <div className="space-y-3">
                      {["FIRSTRANK PARCEL Store - 123 Broadway (0.2 mi)", "FIRSTRANK PARCEL Customer Center - 456 5th Ave (0.8 mi)", "FIRSTRANK PARCEL Access Point - 789 Park Ave (1.1 mi)"].map((loc) => (
                        <label key={loc} className={`flex items-center gap-4 p-5 rounded-[20px] cursor-pointer transition-colors border-2 ${holdLocation === loc ? 'border-firstrank-orange bg-firstrank-orange/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                          <input type="radio" name="hold-location" value={loc} onChange={() => setHoldLocation(loc)} className="w-5 h-5 border-2 border-gray-200 checked:border-firstrank-orange checked:bg-firstrank-orange appearance-none rounded-full transition-all" />
                          <span className="text-[16px] font-bold text-firstrank-deep">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption || loading}
                  className="w-full py-5 rounded-full font-bold text-[18px] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-firstrank-amber flex items-center justify-center gap-2 text-white bg-firstrank-orange"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Submit Request"}
                </button>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
