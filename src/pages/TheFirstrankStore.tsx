import { useState } from "react";
import { ChevronRight } from "lucide-react";

const stores = [
  { name: "The FIRSTRANK PARCEL Store #1234", address: "123 Broadway, New York, NY 10001", phone: "(212) 555-0100", hours: "Mon-Fri 8AM–7PM, Sat 9AM–5PM", distance: "0.2 mi" },
  { name: "The FIRSTRANK PARCEL Store #5678", address: "456 5th Ave, New York, NY 10018", phone: "(212) 555-0200", hours: "Mon-Fri 8AM–8PM, Sat 9AM–6PM", distance: "0.5 mi" },
  { name: "The FIRSTRANK PARCEL Store #9012", address: "789 Lexington Ave, New York, NY 10022", phone: "(212) 555-0300", hours: "Mon-Fri 8AM–7PM, Sat 10AM–4PM", distance: "0.9 mi" },
  { name: "The FIRSTRANK PARCEL Store #3456", address: "321 West 23rd St, New York, NY 10011", phone: "(212) 555-0400", hours: "Mon-Fri 7:30AM–8PM, Sat 9AM–5PM", distance: "1.2 mi" },
];

const services = [
  { icon: "https://www.ups.com/webassets/icons/box.svg", name: "Packing Services", desc: "Expert packing for fragile, irregular, or large items." },
  { icon: "https://www.ups.com/webassets/icons/local_shipping.svg", name: "Printing", desc: "Full-color printing, copies, and document services." },
  { icon: "https://www.ups.com/webassets/icons/alert.svg", name: "Mailbox Services", desc: "Private mailbox with a real street address." },
  { icon: "https://www.ups.com/webassets/icons/pin.svg", name: "FIRSTRANK PARCEL Drop Off", desc: "Drop off pre-labeled packages anytime during store hours." },
];

export default function TheFirstrankStore() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF7E1" }}>
      {/* Hero */}
      <div style={{ backgroundColor: "#0B2B26" }} className="py-10 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59A25] opacity-5 -mr-48 -mt-48 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#235347] opacity-30 -ml-32 -mb-32 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10" data-aos="fade-up">
          <p className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-4">Store Locator</p>
          <h1 className="text-[28px] md:text-[48px] font-bold text-[#FFF7E1] mb-4 leading-tight">Find a FIRSTRANK PARCEL Store®</h1>
          <p className="text-[#8EB69B] text-[20px] mb-8 md:mb-12 font-medium">Expert packing, shipping, printing, and business services at a location near you.</p>

          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto bg-[#FFF7E1] p-3 rounded-[20px] shadow-2xl">
            <div className="flex-1 flex items-center px-4 gap-3">
              <img src="https://www.ups.com/webassets/icons/search.svg" alt="Search" className="w-6 h-6 opacity-40" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
              <input type="text" placeholder="ZIP Code or City, State" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setSearched(true)}
                className="w-full py-3 text-[16px] outline-none text-[#0B2B26] placeholder-[#8EB69B] font-medium bg-transparent" />
            </div>
            <button onClick={() => setSearched(true)}
              className="px-10 py-4 rounded-full font-bold text-[16px] transition-all flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: "#F59A25" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>
              Find Stores <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Map + Store List */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16" data-aos="fade-up">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Map placeholder */}
          <div className="lg:flex-1 rounded-[32px] overflow-hidden border-8 border-white shadow-sm" style={{ minHeight: "500px" }}>
            <div style={{ position: "relative", height: "100%", minHeight: "500px", backgroundColor: "#DAF1DE" }}>
              <svg viewBox="0 0 600 400" className="w-full h-full object-cover">
                <rect fill="#DAF1DE" width="600" height="400" />
                <rect fill="#8EB69B" opacity="0.3" x="0" y="180" width="600" height="10" />
                <rect fill="#8EB69B" opacity="0.3" x="0" y="260" width="600" height="8" />
                <rect fill="#8EB69B" opacity="0.3" x="140" y="0" width="8" height="400" />
                <rect fill="#8EB69B" opacity="0.3" x="280" y="0" width="8" height="400" />
                <rect fill="#8EB69B" opacity="0.3" x="420" y="0" width="8" height="400" />
                {stores.map((_, i) => {
                  const positions = [{ cx: 170, cy: 150 }, { cx: 310, cy: 220 }, { cx: 450, cy: 140 }, { cx: 240, cy: 300 }];
                  return (
                    <g key={i}>
                      <circle cx={positions[i].cx} cy={positions[i].cy} r="18" fill="#235347" className="animate-pulse" />
                      <circle cx={positions[i].cx} cy={positions[i].cy} r="6" fill="#F59A25" />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-6 right-6 text-[#FFF7E1] px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest" style={{ backgroundColor: "#235347" }}>
                Interactive Map View
              </div>
            </div>
          </div>

          {/* Store list */}
          <div className="lg:w-[450px] space-y-6 max-h-[600px] overflow-y-auto pr-4">
            <h2 className="font-bold text-[#0B2B26] text-[24px] mb-6">{searched ? `Stores near "${query || "New York, NY"}"` : "Nearby Stores"}</h2>
            {stores.map((store, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-[#DAF1DE] hover:border-[#F59A25] group" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.06)" }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-bold text-[18px] text-[#0B2B26] group-hover:text-[#235347] transition-colors">{store.name}</h3>
                  <span className="text-[13px] font-bold text-[#235347] bg-[#DAF1DE] px-3 py-1 rounded-full shrink-0">{store.distance}</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: "https://www.ups.com/webassets/icons/pin.svg", text: store.address },
                    { icon: "https://www.ups.com/webassets/icons/blue_help.svg", text: store.phone },
                    { icon: "https://www.ups.com/webassets/icons/alarm_on.svg", text: store.hours },
                  ].map((row, j) => (
                    <div key={j} className="flex items-center gap-3 text-[14px] text-[#235347] font-medium">
                      <img src={row.icon} alt="" className="w-4 h-4 opacity-50" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
                      {row.text}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button className="flex-1 py-3 rounded-full text-[14px] font-bold transition-all shadow-md text-white"
                    style={{ backgroundColor: "#F59A25" }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>Directions</button>
                  <button className="flex-1 py-3 rounded-full text-[14px] font-bold border-2 transition-all hover:bg-[#DAF1DE]"
                    style={{ borderColor: "#235347", color: "#235347" }}>Store Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-24" style={{ backgroundColor: "#DAF1DE" }}>
        <div className="max-w-7xl mx-auto px-4" data-aos="fade-up">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-4">What we do</p>
            <h2 className="text-[24px] md:text-[40px] font-bold text-[#0B2B26]">The FIRSTRANK PARCEL Store Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((svc) => (
              <div key={svc.name} className="bg-white rounded-[32px] p-6 md:p-10 text-center hover:shadow-2xl transition-all border-2 border-[#DAF1DE] hover:border-[#F59A25] group">
                <div className="w-20 h-20 rounded-[24px] mx-auto mb-8 flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: "#DAF1DE" }}>
                  <img src={svc.icon} alt={svc.name} className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
                </div>
                <h3 className="font-bold text-[20px] text-[#0B2B26] mb-4">{svc.name}</h3>
                <p className="text-[15px] text-[#235347] leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
