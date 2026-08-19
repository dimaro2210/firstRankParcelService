import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function FileClaim() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [claimType, setClaimType] = useState("");
  const [tracking, setTracking] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth/login");
  }, [isAuthenticated, loading]);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-20 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: "#235347" }}>
          <img src="https://www.ups.com/webassets/icons/box.svg" alt="Success" className="w-12 h-12 invert" />
        </div>
        <h1 className="text-[36px] font-bold text-[#0B2B26] mb-4">Claim Submitted</h1>
        <p className="text-[18px] text-[#235347] mb-2">Your claim reference number is:</p>
        <p className="text-[20px] md:text-[28px] font-mono font-bold mb-4" style={{ color: "#F59A25" }}>CLM-{Date.now().toString().slice(-8)}</p>
        <p className="text-[16px] text-[#235347] mb-10 leading-relaxed">
          You'll receive a confirmation email. Claims are typically reviewed within 5-7 business days.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-10 py-4 rounded-full font-bold text-[16px] transition-colors"
          style={{ backgroundColor: "#F59A25", color: "#fff" }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const inputClass = "w-full border border-[#8EB69B] rounded px-4 py-3.5 text-[16px] text-[#0B2B26] focus:outline-none focus:border-[#F59A25] focus:ring-1 focus:ring-[#F59A25] bg-white";
  const labelClass = "block text-[13px] uppercase tracking-wide font-bold text-[#235347] mb-2";

  return (
    <div style={{ backgroundColor: "#DAF1DE", minHeight: "calc(100vh - 80px)" }} className="pb-20">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        <h1 className="text-[24px] md:text-[32px] font-bold text-[#0B2B26] mb-2">File a Claim</h1>
        <p className="text-[16px] text-[#235347] mb-8 md:mb-12">Report a lost, damaged, or delayed package. Claims must be filed within 60 days of shipment.</p>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-8 md:mb-12 relative">
          <div className="absolute top-4 left-4 right-4 h-0.5" style={{ backgroundColor: "#8EB69B", zIndex: 0 }} />
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center relative flex-1" style={{ zIndex: 1 }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold transition-colors"
                style={{
                  backgroundColor: step >= s ? "#235347" : "#FFF7E1",
                  color: step >= s ? "#FFF7E1" : "#8EB69B",
                  border: step >= s ? "none" : "2px solid #8EB69B"
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <p className="text-[12px] mt-2 font-bold uppercase tracking-wider" style={{ color: step >= s ? "#235347" : "#8EB69B" }}>
                {s === 1 ? "Package Info" : s === 2 ? "Claim Details" : "Review"}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[24px] p-8 md:p-6 md:p-10" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.07)" }}>
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-bold text-[20px] text-[#0B2B26] mb-4">Package Information</h2>
              <div>
                <label className={labelClass}>Claim Type *</label>
                <select value={claimType} onChange={(e) => setClaimType(e.target.value)} className={inputClass}>
                  <option value="">Select claim type</option>
                  <option>Lost Package</option>
                  <option>Damaged Package</option>
                  <option>Delay Claim</option>
                  <option>Missing Content</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tracking Number *</label>
                <input type="text" value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="1Z999AA10123456784" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Ship Date *</label>
                <input type="date" value={shipDate} onChange={(e) => setShipDate(e.target.value)} className={inputClass} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-bold text-[20px] text-[#0B2B26] mb-4">Claim Details</h2>
              <div>
                <label className={labelClass}>Declared Value of Package ($) *</label>
                <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description of Contents *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the contents and the damage or loss..." rows={4} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Supporting Documents</label>
                <div className="border-2 border-dashed border-[#8EB69B] rounded-[12px] p-6 md:p-10 text-center hover:border-[#F59A25] transition-colors cursor-pointer" style={{ backgroundColor: "#DAF1DE" }}>
                  <img src="https://www.ups.com/webassets/icons/box.svg" alt="Upload" className="w-10 h-10 mx-auto mb-4 opacity-40" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
                  <p className="text-[16px] font-bold text-[#0B2B26] mb-1">Click to upload documents</p>
                  <p className="text-[14px] text-[#235347]">Photos, invoices, or receipts (PNG, JPG, PDF up to 10MB)</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-bold text-[20px] text-[#0B2B26] mb-6">Review Your Claim</h2>
              <div className="space-y-4 rounded-[12px] p-6 mb-8 border border-[#8EB69B]" style={{ backgroundColor: "#DAF1DE" }}>
                {[
                  { label: "Claim Type", value: claimType || "Lost Package" },
                  { label: "Tracking Number", value: tracking || "1Z999AA10123456784" },
                  { label: "Ship Date", value: shipDate || "N/A" },
                  { label: "Declared Value", value: `$${value || "0.00"}` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-[15px]">
                    <span className="text-[#8EB69B] font-bold uppercase tracking-wide text-[12px]">{row.label}</span>
                    <span className="font-bold text-[#0B2B26]">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mb-8 p-6 rounded-[12px] border border-[#8EB69B]" style={{ backgroundColor: "#DAF1DE" }}>
                <img src="https://www.ups.com/webassets/icons/blue_help.svg" alt="Info" className="w-6 h-6 shrink-0 mt-0.5" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
                <p className="text-[14px] text-[#235347] leading-relaxed">
                  By submitting this claim, you certify that all information provided is accurate. FIRSTRANK PARCEL may contact you for additional documentation to verify your claim.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(true)}
                className="w-full py-4 rounded-full font-bold text-[16px] shadow-md transition-colors"
                style={{ backgroundColor: "#F59A25", color: "#fff" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
              >
                Submit Claim
              </button>
            </div>
          )}

          <div className="flex justify-between mt-10 pt-6 border-t border-[#DAF1DE]">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="px-8 py-3.5 rounded-full border-2 text-[16px] font-bold transition-colors"
                style={{ borderColor: "#8EB69B", color: "#235347" }}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
                className="px-8 py-3.5 rounded-full text-[16px] font-bold ml-auto transition-colors"
                style={{ backgroundColor: "#F59A25", color: "#fff" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
