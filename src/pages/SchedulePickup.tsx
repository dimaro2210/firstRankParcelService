import { useState } from "react";
import { MapPin, Calendar, Clock, Package, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function SchedulePickup() {
  const [step, setStep] = useState(1);
  const [scheduled, setScheduled] = useState(false);

  // Form State
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [packageType, setPackageType] = useState("box");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setScheduled(true);
    }
  };

  const steps = [
    { id: 1, title: "Location", icon: MapPin },
    { id: 2, title: "Package", icon: Package },
    { id: 3, title: "Time", icon: Clock },
  ];

  return (
    <div className="bg-firstrank-cream min-h-screen pb-32">
      {/* Premium Header Area */}
      <div className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 overflow-hidden border-b border-white/10" style={{ background: 'linear-gradient(135deg, rgba(11,43,38,0.92) 0%, rgba(35,83,71,0.88) 50%, rgba(11,43,38,0.95) 100%)', backdropFilter: 'blur(40px) saturate(180%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }}></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center" data-aos="fade-up">
          <p className="text-[12px] md:text-[14px] font-bold uppercase tracking-widest text-firstrank-orange mb-4">Convenient & Reliable</p>
          <h1 className="text-[32px] md:text-[56px] font-outfit font-bold text-white mb-6 leading-tight tracking-tight">Schedule a Pickup</h1>
          <p className="text-[16px] md:text-[20px] text-firstrank-sage font-medium max-w-2xl mx-auto leading-relaxed">
            Let us come to you. Schedule a courier to pick up your packages directly from your home, office, or warehouse.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <AnimatePresence mode="wait">
          {scheduled ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-10 md:p-20 shadow-2xl border border-gray-100 text-center"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                <CheckCircle2 size={48} className="text-green-500" />
              </div>
              <h2 className="text-[32px] md:text-[40px] font-outfit font-bold text-firstrank-deep mb-4 tracking-tight">Pickup Scheduled!</h2>
              <p className="text-[18px] text-gray-500 mb-10 max-w-lg mx-auto">
                Your courier is scheduled to arrive on <strong>{date || "your selected date"}</strong> between <strong>{time || "your selected time"}</strong> at <strong>{address}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => { setScheduled(false); setStep(1); setAddress(""); setDate(""); setTime(""); }} className="px-8 py-4 rounded-full font-bold text-[16px] border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all w-full sm:w-auto">
                  Schedule Another
                </button>
                <Link href="/dashboard">
                  <button className="px-8 py-4 rounded-full font-bold text-[16px] bg-firstrank-orange text-white hover:bg-firstrank-amber shadow-lg shadow-firstrank-orange/20 transition-all hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto">
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Progress Steps */}
              <div className="bg-gray-50/80 border-b border-gray-100 p-8 flex justify-center">
                <div className="flex items-center w-full max-w-xl">
                  {steps.map((s, idx) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] transition-all duration-300 relative z-10 ${step >= s.id ? "bg-firstrank-orange text-white shadow-lg shadow-firstrank-orange/30" : "bg-white text-gray-300 border-2 border-gray-100"}`}>
                          <s.icon size={20} />
                        </div>
                        <p className={`absolute -bottom-6 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${step >= s.id ? "text-firstrank-orange" : "text-gray-300"}`}>{s.title}</p>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`h-1 flex-1 mx-4 rounded-full transition-colors duration-500 ${step > s.id ? "bg-firstrank-orange" : "bg-gray-100"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h3 className="text-[24px] font-outfit font-bold text-firstrank-deep mb-6">Where should we pick it up?</h3>
                      <div>
                        <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">Street Address</label>
                        <input required type="text" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">City</label>
                          <input required type="text" placeholder="New York" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">ZIP Code</label>
                          <input required type="text" placeholder="10001" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h3 className="text-[24px] font-outfit font-bold text-firstrank-deep mb-6">What are we picking up?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: "envelope", label: "Letter / Document", sub: "Under 1 lb" },
                          { id: "box", label: "Standard Box", sub: "1 - 50 lbs" },
                          { id: "pallet", label: "Freight / Pallet", sub: "Over 50 lbs" },
                        ].map((pt) => (
                          <div key={pt.id} onClick={() => setPackageType(pt.id)} className={`cursor-pointer rounded-[24px] p-6 border-2 transition-all duration-300 ${packageType === pt.id ? "border-firstrank-orange bg-firstrank-orange/5 shadow-md shadow-firstrank-orange/10" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${packageType === pt.id ? "bg-firstrank-orange text-white" : "bg-white text-gray-400 border border-gray-200"}`}>
                              <Package size={20} />
                            </div>
                            <p className="font-bold text-[16px] text-firstrank-deep mb-1">{pt.label}</p>
                            <p className="text-[12px] font-medium text-gray-500">{pt.sub}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8">
                        <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quantity</label>
                        <input required type="number" min="1" defaultValue="1" className="w-full md:w-48 bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all" />
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                      <h3 className="text-[24px] font-outfit font-bold text-firstrank-deep mb-6">When should we arrive?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><Calendar size={14}/> Select Date</label>
                          <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2"><Clock size={14}/> Time Window</label>
                          <select required value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] px-6 py-4 text-[16px] font-bold text-firstrank-deep outline-none focus:border-firstrank-orange focus:bg-white transition-all appearance-none cursor-pointer">
                            <option value="" disabled>Select a window</option>
                            <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                            <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                            <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-8 p-6 bg-blue-50/50 border border-blue-100 rounded-[24px] flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={18} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-blue-900 mb-1">Same-Day Pickup Available</p>
                          <p className="text-[13px] text-blue-700/80">Schedule before 1:00 PM local time for guaranteed same-day pickup. Additional fees may apply for oversized freight.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-4 rounded-full font-bold text-[16px] text-gray-400 hover:text-firstrank-deep transition-colors">
                      Back
                    </button>
                  ) : <div></div>}
                  <button type="submit" className="px-10 py-4 rounded-full font-bold text-[16px] bg-firstrank-orange text-white hover:bg-firstrank-amber shadow-lg shadow-firstrank-orange/20 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center gap-2">
                    {step === 3 ? "Confirm Pickup" : "Continue"} <ChevronRight size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
