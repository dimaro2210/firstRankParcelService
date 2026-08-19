import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

export default function International() {
  const [, navigate] = useLocation();

  const services = [
    { name: "FIRSTRANK PARCEL Worldwide Express Plus®", delivery: "Next business day", coverage: "215+ countries", icon: "https://www.ups.com/webassets/icons/alarm_on.svg" },
    { name: "FIRSTRANK PARCEL Worldwide Express®", delivery: "1–3 business days", coverage: "220+ countries", icon: "https://www.ups.com/webassets/icons/local_shipping.svg" },
    { name: "FIRSTRANK PARCEL Worldwide Expedited®", delivery: "2–5 business days", coverage: "220+ countries", icon: "https://www.ups.com/webassets/icons/box.svg" },
    { name: "FIRSTRANK PARCEL Standard", delivery: "Day-definite", coverage: "US/Canada/Mexico", icon: "https://www.ups.com/webassets/icons/local_shipping.svg" },
  ];

  const resources = [
    {
      icon: "https://www.ups.com/webassets/icons/alert.svg",
      title: "Tariff Resource Guide",
      desc: "Get the latest tariff updates and navigate compliance changes.",
      href: "/#contact",
    },
    {
      icon: "https://www.ups.com/webassets/icons/blue_help.svg",
      title: "Import Fees Explained",
      desc: "Learn how recent U.S. import policy changes affect your shipments.",
      href: "/#contact",
    },
    {
      icon: "https://www.ups.com/webassets/icons/alert.svg",
      title: "Understanding Customs",
      desc: "Tips to avoid holds and delays at customs.",
      href: "/#contact",
    },
    {
      icon: "https://www.ups.com/webassets/icons/savings.svg",
      title: "Landed Cost Calculator",
      desc: "Estimate duties, taxes, and fees before you ship.",
      href: "/shipping/quote",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ backgroundColor: "var(--firstrank-deep)" }} className="py-10 md:py-20 px-4">
        <div className="max-w-5xl mx-auto" data-aos="fade-up">
          <p className="text-[13px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--firstrank-orange)" }}>International Shipping</p>
          <h1 className="text-[28px] md:text-[48px] font-bold text-white mb-6">Ship to 220+ Countries & Territories</h1>
          <p className="text-gray-300 text-[18px] mb-10 max-w-2xl leading-relaxed">
            Expand your reach with FIRSTRANK PARCEL's global network. Fast, reliable international shipping with customs expertise and compliance support.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/shipping/quote")}
              className="px-8 py-3.5 rounded-full font-bold text-[16px] transition-colors hover:bg-firstrank-amber"
              style={{ backgroundColor: "var(--firstrank-orange)", color: "#121212" }}
            >
              Get International Rate
            </button>
            <button
              onClick={() => navigate("/#contact")}
              className="px-8 py-3.5 rounded-full font-bold text-[16px] border-2 border-white text-white transition-colors hover:bg-white hover:text-firstrank-deep"
            >
              Contact Sales
            </button>
          </div>
          <p className="text-gray-300 text-[13px] mt-8">
            💰 Save up to 65% with code <strong>GOINTL</strong> on your first international shipment.{" "}
            <a href="/#contact" className="underline hover:text-white">Terms apply.</a>
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--firstrank-cream)" }} className="py-10 md:py-20">
        {/* Services */}
        <div className="max-w-5xl mx-auto px-4 mb-10 md:mb-20" data-aos="fade-up">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#121212] mb-10">International Services</h2>
          <div className="space-y-4">
            {services.map((svc) => (
              <div key={svc.name} className="bg-white rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer" style={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.05)" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#E6F0F9" }}>
                  <img src={svc.icon} alt={svc.name} className="w-6 h-6 opacity-80 invert" style={{ filter: "brightness(0) saturate(100%) invert(21%) sepia(99%) saturate(1637%) hue-rotate(193deg) brightness(97%) contrast(98%)" }} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-[18px] text-[#121212]">{svc.name}</h3>
                  <p className="text-[15px] text-gray-600 mt-1">{svc.delivery} <span className="mx-1">•</span> {svc.coverage}</p>
                </div>
                <button
                  onClick={() => navigate("/shipping/quote")}
                  className="px-6 py-3 w-full md:w-auto rounded-full text-[15px] font-bold flex items-center justify-center gap-2 transition-colors hover:bg-firstrank-amber"
                  style={{ backgroundColor: "var(--firstrank-orange)", color: "#121212" }}
                >
                  Get Rate <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Banner */}
        <div style={{ backgroundColor: "#FFF3CC" }} className="py-6 md:py-12 px-4 mb-10 md:mb-20">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left" data-aos="fade-up">
            <div className="flex-1">
              <h2 className="text-[20px] md:text-[28px] font-bold text-[#121212] mb-3">Save up to 65% on International Shipping</h2>
              <p className="text-[#121212] text-[16px]">Use promo code <strong>GOINTL</strong> to automatically apply your discount when shipping internationally.</p>
            </div>
            <button
              onClick={() => navigate("/shipping/quote")}
              className="px-8 py-3.5 rounded-full font-bold text-[16px] flex-shrink-0 transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--firstrank-deep)", color: "white" }}
            >
              Get Quote
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="max-w-5xl mx-auto px-4 mb-10" data-aos="fade-up">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#121212] mb-10">Trade & Compliance Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((r) => (
              <div key={r.title} className="flex flex-col md:flex-row gap-6 p-8 bg-white rounded-[24px] shadow-sm hover:-translate-y-0.5 transition-transform" style={{ boxShadow: "0px 4px 15px rgba(0,0,0,0.05)" }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0"
                  style={{ backgroundColor: "var(--firstrank-cream)" }}
                >
                  <img src={r.icon} alt={r.title} className="w-6 h-6 invert opacity-70" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-[18px] text-[#121212] mb-2">{r.title}</h3>
                  <p className="text-[15px] text-gray-600 mb-4 leading-relaxed">{r.desc}</p>
                  <a href={r.href} className="text-[15px] font-bold flex items-center justify-center md:justify-start gap-1 hover:underline" style={{ color: "var(--firstrank-deep)" }}>
                    Learn More <ChevronRight size={14} strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Country coverage */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center" data-aos="fade-up">
          <img src="https://www.ups.com/webassets/icons/pin.svg" alt="Globe" className="w-16 h-16 mx-auto mb-6 opacity-30 invert" />
          <h2 className="text-[36px] font-bold text-[#121212] mb-4">Delivering to 220+ Countries & Territories</h2>
          <p className="text-[18px] text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">From the Americas to Asia-Pacific, Europe, Africa, and the Middle East — FIRSTRANK PARCEL has you covered with reliable global logistics.</p>
          <button
            onClick={() => navigate("/shipping/quote")}
            className="px-10 py-4 rounded-full font-bold text-[16px] transition-colors hover:bg-firstrank-amber"
            style={{ backgroundColor: "var(--firstrank-orange)", color: "#121212" }}
          >
            Start an International Shipment
          </button>
        </div>
      </div>
    </div>
  );
}
