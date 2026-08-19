import { Link } from "wouter";

export default function HelpCenter() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF7E1" }}>
      {/* Hero */}
      <div style={{ backgroundColor: "#0B2B26" }} className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F59A25] opacity-5 -mr-48 -mt-48 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#235347] opacity-30 -ml-32 -mb-32 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10" data-aos="fade-up">
          <div className="w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-10 border border-white/20 backdrop-blur-sm" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <img src="https://www.ups.com/webassets/icons/blue_help.svg" alt="Help" className="w-10 h-10 invert" />
          </div>
          <h1 className="text-[32px] md:text-[56px] font-bold text-[#FFF7E1] mb-10 leading-tight">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-[#FFF7E1] p-2 rounded-full shadow-2xl flex items-center pr-4">
              <div className="pl-6 pr-4">
                <img src="https://www.ups.com/webassets/icons/search.svg" alt="Search" className="w-6 h-6 opacity-40" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
              </div>
              <input type="text" placeholder="Search for tracking, shipping, claims, and more..."
                className="w-full py-4 text-[18px] outline-none text-[#0B2B26] font-medium placeholder-[#8EB69B] bg-transparent" />
              <button className="px-10 py-4 rounded-full font-bold text-[16px] transition-all shadow-md text-white"
                style={{ backgroundColor: "#F59A25" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>Search</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="py-16 md:py-20" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-7xl mx-auto px-4" data-aos="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/tracking">
              <div className="bg-white rounded-[32px] p-8 md:p-10 cursor-pointer hover:shadow-2xl transition-all relative flex flex-col items-center justify-center text-center group border-2 border-transparent hover:border-[#F59A25]" style={{ boxShadow: "0px 10px 40px rgba(11,43,38,0.08)" }}>
                <img src="https://www.ups.com/webassets/icons/new-window.svg" alt="Expand" className="absolute top-6 right-6 w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <img src="https://www.ups.com/us/en/media_1821b85213357cf79b6cf93c9b6f3c651898bb26c.avif?width=200&format=webply&optimize=medium" alt="Tracking" className="w-24 h-24 mb-6 object-contain group-hover:scale-110 transition-transform duration-500" />
                <p className="text-[24px] md:text-[28px] font-bold text-[#0B2B26]">Tracking</p>
                <p className="text-[#8EB69B] mt-2 font-medium">Track your packages in real-time and get updates.</p>
              </div>
            </Link>
            <Link href="/#contact">
              <div className="bg-white rounded-[32px] p-8 md:p-10 cursor-pointer hover:shadow-2xl transition-all relative flex flex-col items-center justify-center text-center group border-2 border-transparent hover:border-[#F59A25]" style={{ boxShadow: "0px 10px 40px rgba(11,43,38,0.08)" }}>
                <img src="https://www.ups.com/webassets/icons/new-window.svg" alt="Expand" className="absolute top-6 right-6 w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                <img src="https://www.ups.com/us/en/media_160924a6735fde1d4adc6ae9fc9db1c333a3dabe6.avif?width=200&format=webply&optimize=medium" alt="Help" className="w-24 h-24 mb-6 object-contain group-hover:scale-110 transition-transform duration-500" />
                <p className="text-[24px] md:text-[28px] font-bold text-[#0B2B26]">How Can We Help You?</p>
                <p className="text-[#8EB69B] mt-2 font-medium">Find answers or get in touch with our expert team.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── QUICK TOPICS ── */}
      <div className="py-24" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-7xl mx-auto px-4" data-aos="fade-up">
          <div className="text-center mb-8 md:mb-16">
            <p className="text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-4">Support Center</p>
            <h2 className="text-[24px] md:text-[40px] font-bold text-[#0B2B26]">Popular Help Topics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Tracking",         desc: "Find your package and set up proactive alerts.",          icon: "https://www.ups.com/webassets/icons/pin.svg",         link: "/tracking" },
              { title: "Pricing",          desc: "Calculate shipping time and costs for your next delivery.", icon: "https://www.ups.com/webassets/icons/savings.svg",     link: "/shipping/quote" },
              { title: "Billing & Invoices", desc: "View and pay your recent invoices securely online.",    icon: "https://www.ups.com/webassets/icons/savings.svg",     link: "/billing" },
              { title: "Claims",           desc: "Report a lost or damaged package easily.",                icon: "https://www.ups.com/webassets/icons/alert.svg",       link: "/support/file-a-claim" },
            ].map((topic) => (
              <Link key={topic.title} href={topic.link}>
                <div className="bg-white rounded-[32px] p-6 md:p-10 cursor-pointer hover:shadow-2xl transition-all h-full flex flex-col border-2 border-[#DAF1DE] hover:border-[#F59A25] group" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.06)" }}>
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 transition-transform group-hover:scale-110" style={{ backgroundColor: "#DAF1DE" }}>
                    <img src={topic.icon} alt={topic.title} className="w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)" }} />
                  </div>
                  <h3 className="text-[22px] font-bold text-[#0B2B26] mb-4">{topic.title}</h3>
                  <p className="text-[16px] text-[#235347] font-medium flex-1 leading-relaxed">{topic.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT METHODS ── */}
      <div className="py-32" style={{ backgroundColor: "#DAF1DE" }}>
        <div className="max-w-5xl mx-auto px-4 text-center" data-aos="fade-up">
          <div className="rounded-[48px] p-6 md:p-16 relative overflow-hidden shadow-2xl" style={{ backgroundColor: "#0B2B26" }}>
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#235347] opacity-20 -ml-32 -mt-32 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59A25] opacity-10 -mr-32 -mb-32 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-[24px] md:text-[40px] font-bold text-[#FFF7E1] mb-6">Still need assistance?</h2>
              <p className="text-[#8EB69B] text-[18px] mb-8 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Our support experts are standing by. Whether you need help with a complex shipment or a simple tracking question, we're here to ensure your logistics move firstrank logix.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/#contact">
                  <button className="px-6 md:px-12 py-5 font-bold text-[18px] rounded-full transition-all hover:scale-105 w-full sm:w-auto text-white"
                    style={{ backgroundColor: "#F59A25" }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>Contact Support</button>
                </Link>
                <Link href="/support/file-a-claim">
                  <button className="px-6 md:px-12 py-5 font-bold text-[18px] rounded-full border-2 border-[#8EB69B] text-[#FFF7E1] transition-all hover:bg-[#8EB69B] hover:text-[#0B2B26] hover:scale-105 w-full sm:w-auto">
                    File a Claim
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
