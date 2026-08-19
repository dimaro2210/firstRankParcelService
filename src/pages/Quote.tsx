import { useState } from "react";
import { Link } from "wouter";
import { geocodeAddress, haversineKm } from "@/lib/waypointEngine";
import { Loader2, AlertCircle } from "lucide-react";

// Helper to add business days
function addBusinessDays(date: Date, days: number): Date {
  let count = 0;
  const result = new Date(date);
  while (count < days) {
    result.setDate(result.getDate() + 1);
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      count++;
    }
  }
  return result;
}

export default function Quote() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("Origin and Destination are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    
    try {
      const originGeo = await geocodeAddress(origin);
      const destGeo = await geocodeAddress(destination);
      
      if (!originGeo || !destGeo) {
        setError("Could not find the specified origin or destination. Please check the locations.");
        setLoading(false);
        return;
      }
      
      const distanceKm = haversineKm(originGeo.lat, originGeo.lng, destGeo.lat, destGeo.lng);
      const distanceMiles = distanceKm * 0.621371;
      
      const w = parseFloat(weight) || 1;
      const l = parseFloat(length) || 10;
      const wi = parseFloat(width) || 10;
      const h = parseFloat(height) || 10;
      
      const volWeight = (l * wi * h) / 139;
      const billableWeight = Math.max(w, volWeight);
      
      // Base pricing logic
      const baseDistanceRate = Math.max(5, distanceMiles * 0.015);
      const weightRate = billableWeight * 0.45;
      const baseCost = baseDistanceRate + weightRate;
      
      const today = new Date();
      const formatDelivery = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Ground shipping days based on distance
      const groundDays = Math.max(2, Math.min(6, Math.ceil(distanceMiles / 400)));
      
      const calculatedRates = [
        { service: "FIRSTRANK PARCEL Ground", days: `${groundDays} business days`, delivery: formatDelivery(addBusinessDays(today, groundDays)), price: `$${(baseCost * 1.0).toFixed(2)}`, icon: "https://www.ups.com/webassets/icons/local_shipping.svg" },
        { service: "FIRSTRANK PARCEL 3 Day Select®", days: "3 business days", delivery: formatDelivery(addBusinessDays(today, 3)), price: `$${(baseCost * 1.8).toFixed(2)}`, icon: "https://www.ups.com/webassets/icons/box.svg" },
        { service: "FIRSTRANK PARCEL 2nd Day Air®", days: "2 business days", delivery: formatDelivery(addBusinessDays(today, 2)), price: `$${(baseCost * 2.5).toFixed(2)}`, icon: "https://www.ups.com/webassets/icons/alarm_on.svg" },
        { service: "FIRSTRANK PARCEL Next Day Air Saver®", days: "1 business day", delivery: formatDelivery(addBusinessDays(today, 1)) + " (EOD)", price: `$${(baseCost * 3.5).toFixed(2)}`, icon: "https://www.ups.com/webassets/icons/alarm_on.svg" },
        { service: "FIRSTRANK PARCEL Next Day Air®", days: "Next business day", delivery: formatDelivery(addBusinessDays(today, 1)) + " (Morning)", price: `$${(baseCost * 4.5).toFixed(2)}`, icon: "https://www.ups.com/webassets/icons/alarm_on.svg" },
      ];
      
      setRates(calculatedRates);
    } catch (e) {
      setError("An error occurred while calculating rates.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-firstrank-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16" data-aos="fade-up">
        <div className="mb-8 md:mb-12">
          <p className="text-[14px] font-bold uppercase tracking-widest text-firstrank-deep mb-4 text-center lg:text-left">Shipping Calculator</p>
          <h1 className="text-[24px] md:text-[40px] font-bold text-[#121212] mb-4 leading-tight text-center lg:text-left">Calculate Time & Cost</h1>
          <p className="text-[18px] text-gray-500 font-medium max-w-2xl leading-relaxed text-center lg:text-left">Get estimated delivery dates and business rates for your next shipment. Fast, transparent, and accurate.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-[450px]">
            <div className="bg-white rounded-[32px] p-6 md:p-10 shadow-sm sticky top-32" style={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.05)" }}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-3">Origin ZIP Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 30301"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full bg-firstrank-cream border-2 border-[#8EB69B]/40 rounded-[16px] px-6 py-4 text-[16px] font-bold outline-none focus:border-firstrank-orange transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-3">Destination ZIP Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 10001"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-firstrank-cream border-2 border-[#8EB69B]/40 rounded-[16px] px-6 py-4 text-[16px] font-bold outline-none focus:border-firstrank-orange transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-[13px] font-bold uppercase tracking-widest text-[#121212] mb-6 border-b border-gray-100 pb-2">Package Dimensions</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-[12px] font-bold text-gray-400 mb-2">Weight (lbs)</label>
                      <input
                        type="number"
                        placeholder="0.0"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-firstrank-cream border-2 border-[#8EB69B]/40 rounded-[12px] px-5 py-3 text-[16px] font-bold outline-none focus:border-firstrank-orange transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-400 mb-2">L (in)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full bg-firstrank-cream border-2 border-[#8EB69B]/40 rounded-[12px] px-5 py-3 text-[16px] font-bold outline-none focus:border-firstrank-orange transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-400 mb-2">W (in)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full bg-firstrank-cream border-2 border-[#8EB69B]/40 rounded-[12px] px-5 py-3 text-[16px] font-bold outline-none focus:border-firstrank-orange transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full py-5 rounded-full font-bold text-[18px] transition-all shadow-xl hover:bg-firstrank-amber hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--firstrank-orange)", color: "#121212" }}
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : "Get Rates"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {!searched ? (
              <div className="bg-white rounded-[32px] p-6 md:p-20 flex flex-col items-center justify-center text-center shadow-sm h-full" style={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.05)" }}>
                <div className="w-24 h-24 bg-firstrank-cream rounded-[24px] flex items-center justify-center mb-8">
                  <img src="https://www.ups.com/webassets/icons/savings.svg" alt="Rates" className="w-12 h-12 invert opacity-20" />
                </div>
                <h2 className="text-[24px] font-bold text-[#121212] mb-3">Your Results Will Appear Here</h2>
                <p className="text-gray-400 font-medium max-w-sm">Enter your shipment details and zip codes to see the most accurate rates and transit times.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-[24px] p-6 flex items-start gap-4">
                    <AlertCircle size={24} className="shrink-0" />
                    <div>
                      <p className="font-bold text-[16px] mb-1">Calculation Error</p>
                      <p className="font-medium text-[14px]">{error}</p>
                    </div>
                  </div>
                )}
                
                {!error && rates.length > 0 && (
                  <>
                    <div className="bg-firstrank-deep rounded-[32px] p-6 md:p-10 mb-10 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-firstrank-orange opacity-5 -mr-32 -mt-32 rounded-full blur-3xl"></div>
                       <h3 className="text-white font-bold text-[20px] mb-8 relative z-10">Available Services</h3>
                       <div className="space-y-4 relative z-10">
                         {rates.map((rate, idx) => (
                           <div key={idx} className="bg-white/5 backdrop-blur-md rounded-[24px] p-8 flex flex-col md:flex-row items-center gap-8 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                             <div className="w-16 h-16 rounded-[20px] bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                               <img src={rate.icon} alt={rate.service} className="w-8 h-8" />
                             </div>
                             <div className="flex-1 text-center md:text-left">
                               <p className="text-white font-bold text-[20px] mb-1 leading-tight">{rate.service}</p>
                               <p className="text-firstrank-orange text-[14px] font-bold uppercase tracking-widest">{rate.days}</p>
                               <p className="text-gray-400 text-[14px] font-medium mt-1">Estimated delivery: {rate.delivery}</p>
                             </div>
                             <div className="text-center md:text-right">
                               <p className="text-[24px] md:text-[32px] font-bold text-white mb-1">{rate.price}</p>
                               <Link href="/support/help-center">
                                 <button className="px-10 py-3 rounded-full font-bold text-[14px] transition-all hover:bg-firstrank-amber" style={{ backgroundColor: "var(--firstrank-orange)", color: "#121212" }}>
                                   Contact for Shipping
                                 </button>
                               </Link>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                    <div className="text-center p-8 bg-white rounded-[32px] border-2 border-dashed border-gray-100 shadow-sm">
                      <p className="text-gray-400 font-medium text-[14px]">Rates are dynamically calculated based on live distance data and standard volumetric weights.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
