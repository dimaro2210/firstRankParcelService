import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

export default function FirstrankMyChoice() {
  const [, navigate] = useLocation();

  const features = [
    { icon: "https://www.ups.com/webassets/icons/alert.svg",        title: "Delivery Alerts",      desc: "Get proactive alerts via email, text, or the FIRSTRANK PARCEL app when your package is on its way." },
    { icon: "https://www.ups.com/webassets/icons/pin.svg",          title: "Delivery Preferences", desc: "Tell FIRSTRANK PARCEL exactly where you want your packages left, even if you're not home." },
    { icon: "https://www.ups.com/webassets/icons/alarm_on.svg",     title: "Reroute Packages",     desc: "Redirect a package to a FIRSTRANK PARCEL Access Point, neighbor, or different address." },
    { icon: "https://www.ups.com/webassets/icons/box.svg",          title: "Manage All Deliveries",desc: "View all incoming packages in one dashboard, regardless of retailer." },
  ];

  const iconFilter = "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)";

  return (
    <div style={{ backgroundColor: "#FFF7E1" }}>
      {/* Hero */}
      <div style={{ backgroundColor: "#0B2B26" }} className="py-24 px-4 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#235347] opacity-20 -ml-48 -mt-48 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F59A25] opacity-5 -mr-48 -mb-48 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10" data-aos="fade-up">
          <p className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-6">Delivery Management</p>
          <h1 className="text-[32px] md:text-[56px] font-bold text-[#FFF7E1] mb-6 leading-tight">FIRSTRANK PARCEL My Choice®</h1>
          <p className="text-[#8EB69B] text-[20px] mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Take absolute control of your deliveries. Get precise alerts, reroute packages in-flight, and manage every shipment from one powerful dashboard.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <button onClick={() => navigate("/auth/signup")}
              className="px-6 md:px-12 py-5 rounded-full font-bold text-[18px] shadow-lg transition-all hover:scale-105 text-white"
              style={{ backgroundColor: "#F59A25" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>Sign Up Free</button>
            <button onClick={() => navigate("/auth/login")}
              className="px-6 md:px-12 py-5 rounded-full font-bold text-[18px] border-2 border-[#8EB69B] text-[#FFF7E1] transition-all hover:bg-[#8EB69B] hover:text-[#0B2B26]">Log In</button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-24" data-aos="fade-up">
        <div className="text-center mb-10 md:mb-20">
          <p className="text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-4">The Power of Choice</p>
          <h2 className="text-[24px] md:text-[40px] font-bold text-[#0B2B26]">Master Your Logistics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-[32px] p-6 md:p-10 flex gap-8 hover:shadow-2xl transition-all border-2 border-[#DAF1DE] hover:border-[#F59A25] group" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.06)" }}>
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: "#DAF1DE" }}>
                <img src={f.icon} alt={f.title} className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" style={{ filter: iconFilter }} />
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-[#0B2B26] mb-3 leading-tight">{f.title}</h3>
                <p className="text-[16px] text-[#235347] leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto px-4 py-32 text-center" data-aos="fade-up">
        <div className="max-w-3xl mx-auto">
          <div className="w-24 h-24 rounded-[24px] flex items-center justify-center mx-auto mb-10" style={{ backgroundColor: "#DAF1DE" }}>
            <img src="https://www.ups.com/webassets/icons/savings.svg" alt="Privacy" className="w-12 h-12" style={{ filter: iconFilter }} />
          </div>
          <h2 className="text-[24px] md:text-[40px] font-bold text-[#0B2B26] mb-6 leading-tight">Your Privacy is Protected</h2>
          <p className="text-[#235347] text-[18px] mb-8 md:mb-12 leading-relaxed font-medium">Your personal information is only used to manage your deliveries and is never sold to third parties. Secure logistics is our highest priority.</p>
          <button onClick={() => navigate("/auth/signup")}
            className="px-6 md:px-16 py-5 rounded-full font-bold text-[18px] shadow-xl transition-all hover:scale-105 text-white"
            style={{ backgroundColor: "#F59A25" }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
            onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>Get Started Today</button>
        </div>
      </div>
    </div>
  );
}
