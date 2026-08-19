import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

export default function BusinessSolutions() {
  const [, navigate] = useLocation();

  const solutions = [
    { icon: "https://www.ups.com/webassets/icons/local_shipping.svg", title: "Scheduled Pickups", desc: "Set up regular pickups that fit your business schedule — daily, weekly, or on demand.", cta: "Contact Us", href: "/#contact" },
    { icon: "https://www.ups.com/webassets/icons/alert.svg", title: "Simplified Returns", desc: "Build customer loyalty with a painless returns process. Offer prepaid return labels with ease.", cta: "Contact Support", href: "/#contact" },
    { icon: "https://www.ups.com/webassets/icons/box.svg", title: "Shipping Supplies", desc: "Order FIRSTRANK-approved boxes, envelopes, and labels for free — delivered to your door.", cta: "Order Now", href: "/shipping/order-supplies" },
    { icon: "https://www.ups.com/webassets/icons/globe.svg", title: "International Shipping", desc: "Reach customers around the world with FIRSTRANK PARCEL's vast international network in 220+ countries.", cta: "Learn More", href: "/shipping/international-shipping" },
    { icon: "https://www.ups.com/webassets/icons/savings.svg", title: "Billing & Reporting", desc: "Centralized invoicing, detailed shipping reports, and spend analysis tools for your team.", cta: "View Billing", href: "/billing" },
    { icon: "https://www.ups.com/webassets/icons/blue_help.svg", title: "Expert Consultation", desc: "Get a free 15-minute consultation with a FIRSTRANK PARCEL shipping expert to optimize your strategy.", cta: "Book Now", href: "/#contact" },
  ];

  return (
    <div style={{ backgroundColor: "#FFF7E1" }}>
      {/* Hero */}
      <div style={{ backgroundColor: "#0B2B26" }} className="py-24 px-4 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F59A25] opacity-5 -mr-48 -mb-48 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#235347] opacity-30 -ml-48 -mt-48 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-up">
          <div className="max-w-3xl">
            <p className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-6">Business Solutions</p>
            <h1 className="text-[32px] md:text-[56px] font-bold text-[#FFF7E1] mb-6 leading-tight">Ship Smarter. Grow Faster.</h1>
            <p className="text-[#8EB69B] text-[20px] mb-8 md:mb-12 font-medium leading-relaxed">
              FIRSTRANK PARCEL has the tools and global expertise to streamline your shipping, simplify returns, and reach customers across every continent.
            </p>
            <div className="flex gap-6 flex-wrap">
              <button
                onClick={() => navigate("/auth/signup")}
                className="px-10 py-4 rounded-full font-bold text-[16px] shadow-lg transition-all"
                style={{ backgroundColor: "#F59A25", color: "#fff" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/#contact")}
                className="px-10 py-4 rounded-full font-bold text-[16px] border-2 border-[#8EB69B] text-[#FFF7E1] transition-all hover:bg-[#8EB69B] hover:text-[#0B2B26]"
              >
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions grid */}
      <div className="max-w-7xl mx-auto px-4 py-24" data-aos="fade-up">
        <div className="text-center mb-8 md:mb-16">
          <p className="text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-4">Efficiency at Scale</p>
          <h2 className="text-[24px] md:text-[40px] font-bold text-[#0B2B26]">Everything Your Business Needs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutions.map((sol) => (
            <div key={sol.title} className="bg-white rounded-[32px] p-6 md:p-10 hover:shadow-2xl transition-all border-2 border-[#DAF1DE] hover:border-[#F59A25] group flex flex-col" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.06)" }}>
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 transition-transform group-hover:scale-110" style={{ backgroundColor: "#DAF1DE" }}>
                <img src={sol.icon} alt={sol.title} className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg) brightness(90%) contrast(90%)" }} />
              </div>
              <h3 className="text-[22px] font-bold text-[#0B2B26] mb-4">{sol.title}</h3>
              <p className="text-[16px] text-[#235347]/70 mb-8 leading-relaxed flex-1">{sol.desc}</p>
              <a href={sol.href} className="text-[15px] font-bold flex items-center gap-2 text-[#F59A25] group-hover:text-[#C89B3C] transition-colors">
                {sol.cta} <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>



      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 py-32 text-center" data-aos="fade-up">
        <div className="rounded-[48px] p-6 md:p-16 relative overflow-hidden shadow-2xl" style={{ backgroundColor: "#0B2B26" }}>
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#235347] opacity-30 -ml-32 -mt-32 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59A25] opacity-10 -mr-32 -mb-32 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-[24px] md:text-[40px] font-bold text-[#FFF7E1] mb-6">Ready to scale your business?</h2>
            <p className="text-[#8EB69B] text-[18px] mb-10 max-w-2xl mx-auto leading-relaxed">
              Open a FIRSTRANK PARCEL account today and gain access to business-only rates, simplified fulfillment, and expert support.
            </p>
            <button
              onClick={() => navigate("/auth/signup")}
              className="px-6 md:px-12 py-5 rounded-full font-bold text-[18px] shadow-xl transition-all hover:scale-105"
              style={{ backgroundColor: "#F59A25", color: "#fff" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
            >
              Create Your Free Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
