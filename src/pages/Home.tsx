import { useState } from "react";
import { useLocation, Link } from "wouter";
import { ChevronRight, Bell, Truck, HelpCircle, ArrowLeft, ArrowRight, Play, Globe, Shield, Zap, Clock, Package, CreditCard, TrendingUp } from "lucide-react";

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [businessPersonal, setBusinessPersonal] = useState<"Business" | "Personal">("Business");
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [, navigate] = useLocation();

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      navigate(`/tracking?tn=${encodeURIComponent(trackingNumber.trim())}`);
    } else {
      navigate("/tracking");
    }
  };

  const carouselSlides = [
    {
      img: "https://assets.ups.com/adobe/assets/urn:aaid:aem:8e3a0dd3-5108-40c4-a347-13c609c6810d/as/NextGenBrokerage-story-ushp-Q225.avif?assetname=NextGenBrokerage-story-ushp-Q225.png",
      caption: "FIRSTRANK PARCEL's next generation of brokerage services makes international shipping easier",
      link: "/shipping/international-shipping",
    },
    {
      img: "https://assets.ups.com/adobe/assets/urn:aaid:aem:a68a3d48-cadc-4251-89ea-01682993d5fb/as/returns-aboutstory-ushp-q425.avif?assetname=returns-aboutstory-ushp-q425.png",
      caption: "Simplified returns: building customer trust from the first click",
      link: "/business-solutions",
    },
    {
      img: "https://assets.ups.com/adobe/assets/urn:aaid:aem:8195feea-91f5-498b-be94-35b103c88d34/as/us-tupss5things-q225.avif?assetname=us-tupss5things-q225.png",
      caption: "5 things every business owner should know about returns",
      link: "/business-solutions",
    },
  ];

  return (
    <div style={{ color: "#0B2B26", backgroundColor: "#FFF7E1" }}>

      {/* ── HERO TRACKING SECTION ── */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "500px", backgroundColor: "#0B2B26", display: "flex", alignItems: "center" }}>
        {/* Animated Background Video */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}>
          <video
            src={`${import.meta.env.BASE_URL}hero-video.mp4`}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "translate(-50%, -50%)"
            }}
          />
          {/* Dark Overlay for Text Readability */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(11,43,38,0.65)",
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative w-full pt-20 pb-40" data-aos="fade-up" style={{ zIndex: 1 }}>
          <div className="text-center md:text-left mt-8 md:mt-12 flex-1 md:pr-12 lg:pr-24" data-aos="fade-right">
            <h1 className="text-[36px] md:text-[56px] font-bold text-[#FFF7E1] mb-6 leading-tight max-w-3xl">
              Fast, Reliable Delivery Worldwide
            </h1>
            <p className="text-[15px] sm:text-[18px] md:text-[22px] text-[#DAF1DE]/70 mb-8 md:mb-10 max-w-2xl mx-auto md:mx-0 font-medium">
              Experience fast, reliable, and completely transparent shipping from origin to destination.
            </p>
          </div>
        </div>
      </div>

      {/* ── TRACKING SECTION (OVERLAPPING) ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative" data-aos="fade-up" style={{ zIndex: 10, marginTop: "-120px", paddingBottom: "40px" }}>
        <div className="flex justify-center">

          {/* Tracking box (Centered) — Liquid Glass */}
          <div className="w-full max-w-3xl">
            <div className="relative rounded-[16px] md:rounded-[24px] p-5 md:p-10 overflow-hidden">
              {/* Glass Layer 1: Distortion + Blur */}
              <div className="absolute inset-0 z-0 rounded-[16px] md:rounded-[24px]" style={{ backdropFilter: 'blur(25px) saturate(180%)', WebkitBackdropFilter: 'blur(25px) saturate(180%)', isolation: 'isolate' }} />
              {/* Glass Layer 2: White overlay */}
              <div className="absolute inset-0 z-[1] rounded-[16px] md:rounded-[24px]" style={{ background: 'rgba(255,255,255,0.2)' }} />
              {/* Glass Layer 3: Frosted tint */}
              <div className="absolute inset-0 z-[2] rounded-[16px] md:rounded-[24px]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)' }} />
              {/* Glass Layer 4: Inner glow + shadow */}
              <div className="absolute inset-0 z-[3] rounded-[16px] md:rounded-[24px] overflow-hidden" style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.8), inset -1px -1px 1px 1px rgba(255,255,255,0.3), 0px 15px 50px rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.4)' }} />
              <div className="relative z-[10]">
              {/* Tracking heading with icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-inner">
                  <Package size={28} className="text-[#F59A25] drop-shadow-sm" strokeWidth={2.5} />
                </div>
                <h2 className="text-[20px] sm:text-[24px] md:text-[36px] font-bold text-white drop-shadow-md">Track Your Shipment</h2>
              </div>

              {/* Input + Button */}
              <div className="flex flex-col sm:flex-row gap-4 mb-3">
                <div className="flex-1" style={{ border: "1px solid #8EB69B", borderRadius: "8px", overflow: "hidden" }}>
                  <input
                    type="text"
                    id="hero-tracking-input"
                    placeholder="Tracking Number or InfoNotice®"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    className="w-full px-3 md:px-4 py-3 md:py-3.5 text-[14px] md:text-[16px] text-[#0B2B26] focus:outline-none focus:ring-2 focus:ring-[#F59A25] bg-white"
                    style={{ border: "none" }}
                  />
                </div>
                <button
                  id="hero-track-btn"
                  onClick={handleTrack}
                  className="px-6 md:px-8 py-3 md:py-3.5 font-bold text-[14px] md:text-[16px] flex items-center justify-center gap-1 transition-colors shrink-0 w-full sm:w-auto"
                  style={{ backgroundColor: "#F59A25", color: "#fff", borderRadius: "999px", border: "none", cursor: "pointer" }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
                >
                  Track <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>

              {/* Need help link */}
              <p className="hidden md:block text-[13px] md:text-[15px] text-white/90 mb-6 md:mb-8 drop-shadow-md">
                Need help changing your delivery?{" "}
                <Link href="/track/change-delivery">
                  <span className="underline cursor-pointer text-[#F59A25] hover:text-white transition-colors">Get Help</span>
                </Link>
              </p>

              {/* Bottom 3 quick links */}
              <div className="hidden md:flex flex-col sm:flex-row flex-wrap gap-x-6 md:gap-x-8 gap-y-3 md:gap-y-4">
                <Link href="/track/firstrank-my-choice">
                  <span className="flex items-center gap-2 text-[15px] font-medium cursor-pointer hover:underline text-white drop-shadow-md hover:text-[#F59A25] transition-colors">
                    <Bell size={18} className="fill-current" />
                    Set Up Alerts
                  </span>
                </Link>
                <Link href="/track/change-delivery">
                  <span className="flex items-center gap-2 text-[15px] font-medium cursor-pointer hover:underline text-white drop-shadow-md hover:text-[#F59A25] transition-colors">
                    <Truck size={18} className="fill-current" />
                    Change Delivery
                  </span>
                </Link>
                <Link href="/#contact">
                  <span className="flex items-center gap-2 text-[15px] font-medium cursor-pointer hover:underline text-white drop-shadow-md hover:text-[#F59A25] transition-colors">
                    <HelpCircle size={18} className="fill-current" />
                    Get Support
                  </span>
                </Link>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── SOLUTIONS FOR EVERYONE ── */}
      <div className="py-10 md:py-14" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <h2 className="text-2xl md:text-4xl font-bold text-[#0B2B26] text-center mb-2">Solutions for Everyone</h2>
          <div className="w-14 h-1 mx-auto mb-6 rounded-full" style={{ backgroundColor: "#F59A25" }} />

          {/* Pill toggles — Liquid Glass */}
          <div className="flex justify-center mb-8">
            <div className="relative flex rounded-full overflow-hidden" style={{ borderRadius: '999px' }}>
              {/* Glass pill background */}
              <div className="absolute inset-0 z-0 rounded-full" style={{ backdropFilter: 'blur(20px)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
              <div className="absolute inset-0 z-[1] rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <div className="absolute inset-0 z-[2] rounded-full" style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.3), 0 4px 15px rgba(11,43,38,0.08)', border: '1px solid rgba(142,182,155,0.4)' }} />
              {(["Business", "Personal"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBusinessPersonal(tab)}
                  className="relative z-[10] px-5 md:px-8 py-2 md:py-2.5 text-[13px] md:text-[15px] font-semibold transition-all duration-300"
                  style={
                    businessPersonal === tab
                      ? { backgroundColor: 'rgba(35,83,71,0.85)', color: '#FFF7E1', border: 'none', cursor: 'pointer', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(11,43,38,0.15)' }
                      : { backgroundColor: 'transparent', color: '#0B2B26', border: 'none', cursor: 'pointer' }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(businessPersonal === "Business" ? [
              { title: "Firstrank Parcel My Choice®", desc: "Know where your package is and when it will arrive with FIRSTRANK PARCEL My Choice® delivery alerts.", link: "/track/firstrank-my-choice", cta: "Check It Out" },
              { title: "Simplify Your Returns", desc: "By making the returns process easier, your customers can have more confidence to buy.", link: "/business-solutions", cta: "Get Started" },
              { title: "Order Shipping Supplies", desc: "Get boxes, envelopes, forms and labels just by logging in.", link: "/shipping/order-supplies", cta: "Order Now" },
              { title: "Chat with an Expert", desc: "Get personalized business advice by booking a free, 15-minute consultation.", link: "/#contact", cta: "Book Now" },
            ] : [
              { title: "Take Control of Your Deliveries", desc: "Know where your package is and when it will arrive with FIRSTRANK PARCEL My Choice® delivery alerts.", link: "/track/firstrank-my-choice", cta: "Check It Out" },
              { title: "Need to Change a Delivery?", desc: "Reroute, hold or change the location and time of your delivery.", link: "/track/change-delivery", cta: "See Delivery Options" },
              { title: "Leave Your Packing to the Pros", desc: "Bring your shipments to The FIRSTRANK PARCEL Store® and we'll take care of the rest.", link: "/the-firstrank-store", cta: "Find a FIRSTRANK PARCEL Store" },
              { title: "Reliable Delivery Around the Globe", desc: "Expand your possibilities with fast international shipping.", link: "/shipping/international-shipping", cta: "Get Started" },
            ]).map((item) => (
              <div key={item.title}
                className="p-5 md:p-8 rounded-[16px] md:rounded-[20px] flex flex-col bg-white border border-[#DAF1DE] hover:border-[#8EB69B] transition-all"
                style={{ boxShadow: "0px 8px 30px rgba(11,43,38,0.06)" }}>
                <h3 className="font-medium text-[#0B2B26] mb-3 md:mb-4 text-[20px] md:text-[26px] leading-[1.1]">{item.title}</h3>
                <p className="text-[14px] md:text-[17px] text-[#235347]/80 mb-4 md:mb-6 leading-relaxed flex-1">{item.desc}</p>
                <Link href={item.link}>
                  <span className="inline-flex items-center gap-1 text-[14px] md:text-[17px] font-medium cursor-pointer hover:underline text-[#F59A25]">
                    {item.cta} <ChevronRight size={18} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── DELIVERING WHAT MATTERS ── */}
      <div className="py-16 md:py-24" style={{ backgroundColor: "#0B2B26" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <p className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-4">Our Global Impact</p>
              <h2 className="text-[32px] md:text-[48px] font-outfit font-bold text-white leading-tight">Delivering What Matters</h2>
            </div>
            <Link href="/about">
              <button className="px-6 py-3 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                Discover Our Story <ChevronRight size={18} />
              </button>
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
            
            {/* Left — Premium Stats Bento */}
            <div className="flex flex-col gap-5 shrink-0 lg:w-[400px]">
              {[
                { num: "8 Years", label: "As an industry leader in on-time peak delivery", icon: <Clock size={24} className="text-[#F59A25]" /> },
                { num: "200+", label: "Countries and territories served", icon: <Globe size={24} className="text-[#8EB69B]" /> },
                { num: "22.4M", label: "Packages delivered daily", icon: <Truck size={24} className="text-white" /> },
              ].map((stat, i) => (
                <div key={i} className="relative rounded-[24px] p-6 hover:scale-[1.02] transition-all duration-500 group overflow-hidden flex-1 flex flex-col justify-center cursor-pointer">
                  {/* Glass layers for stat cards */}
                  <div className="absolute inset-0 z-0 rounded-[24px]" style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
                  <div className="absolute inset-0 z-[1] rounded-[24px]" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="absolute inset-0 z-[2] rounded-[24px]" style={{ background: 'rgba(255,255,255,0.03)' }} />
                  <div className="absolute inset-0 z-[3] rounded-[24px] overflow-hidden" style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.12), inset -1px -1px 1px 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.12)' }} />
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F59A25] opacity-0 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500 z-[4]"></div>
                  
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.1)' }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[32px] md:text-[40px] font-outfit font-bold text-white leading-none mb-1 tracking-tight">{stat.num}</p>
                      <p className="text-[14px] text-[#8EB69B] leading-snug font-medium pr-4">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Premium Carousel */}
            <div className="flex-1 w-full relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 group bg-black/20" style={{ minHeight: "450px" }}>
              <img
                src={carouselSlides[carouselIdx].img}
                alt={carouselSlides[carouselIdx].caption}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out"
                style={{ minHeight: "450px", position: "absolute", inset: 0 }}
              />
              
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B26] via-[#0B2B26]/40 to-transparent"></div>
              
              {/* Content & Controls */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end h-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                  <div className="max-w-md">
                    <div className="w-12 h-1 bg-[#F59A25] rounded-full mb-6"></div>
                    <p className="text-white text-[24px] md:text-[32px] font-outfit font-bold leading-tight mb-6 drop-shadow-lg">
                      {carouselSlides[carouselIdx].caption}
                    </p>
                  </div>
                  
                  <Link href={carouselSlides[carouselIdx].link}>
                    <button className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 hover:scale-110 transition-all hover:shadow-[0_0_20px_rgba(245,154,37,0.4)] relative group/btn"
                      style={{ backgroundColor: "#F59A25", cursor: "pointer", border: "none" }}>
                      <ChevronRight size={24} strokeWidth={3} color="#fff" className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>

                {/* Carousel controls */}
                <div className="flex items-center gap-4 mt-10 relative z-10 border-t border-white/20 pt-6">
                  <button onClick={() => setCarouselIdx((i) => (i - 1 + carouselSlides.length) % carouselSlides.length)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/20 backdrop-blur-md">
                    <ArrowLeft size={18} />
                  </button>
                  
                  <div className="flex items-center gap-2 px-4">
                    {carouselSlides.map((_, i) => (
                      <button key={i} onClick={() => setCarouselIdx(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === carouselIdx ? "w-8 bg-[#F59A25]" : "w-2 bg-white/30 hover:bg-white/50"}`}
                        style={{ border: "none", cursor: "pointer" }} />
                    ))}
                  </div>

                  <button onClick={() => setCarouselIdx((i) => (i + 1) % carouselSlides.length)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/20 backdrop-blur-md">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GET STARTED WITH FIRSTRANK PARCEL ── */}
      <div className="py-20 md:py-32" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-4">Why Choose Us</p>
            <h2 className="text-[32px] md:text-[56px] font-outfit font-bold text-[#0B2B26] leading-tight">Get Started with FIRSTRANK PARCEL</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { title: "Quicker Checkout", desc: "Give us your information once and we'll save it for next time.", icon: CreditCard },
              { title: "Personalized Discounts", desc: "Answer a few quick questions and we'll find the best deal for your business.", icon: TrendingUp },
              { title: "Custom Alerts", desc: "Get the shipping notifications you want — and only the ones you want.", icon: Bell },
              { title: "On-Demand Pickups", desc: "We'll take your shipments on your schedule — every day or every now and then.", icon: Truck },
            ].map((item, i) => (
              <div key={item.title} className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 border border-[#8EB69B]/20 group flex flex-col h-full cursor-pointer">
                <div className="w-20 h-20 rounded-[20px] bg-[#DAF1DE]/50 flex items-center justify-center mb-8 group-hover:bg-[#DAF1DE] transition-colors duration-300">
                  <item.icon size={36} className="text-[#235347] transform group-hover:scale-110 transition-transform duration-500" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }} />
                </div>
                <h3 className="font-outfit font-bold text-[#0B2B26] text-[22px] mb-4">{item.title}</h3>
                <p className="text-[16px] text-[#235347] leading-relaxed font-medium flex-1">{item.desc}</p>
                <div className="mt-8 pt-6 border-t border-[#8EB69B]/20 flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-[#FFF7E1] flex items-center justify-center group-hover:bg-[#F59A25] transition-colors duration-300">
                    <ChevronRight size={20} className="text-[#0B2B26] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── IMPORTANT UPDATES ── */}
      <div className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: "#FFF7E1" }}>
        
        {/* Liquid Glass Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F59A25]/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8EB69B]/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10" data-aos="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-4">Stay Informed</p>
              <h2 className="text-[32px] md:text-[56px] font-outfit font-bold text-[#0B2B26] leading-tight">Important Updates</h2>
            </div>
            <Link href="/shipping/international-shipping">
              <span className="text-[16px] font-bold text-[#F59A25] hover:text-[#C89B3C] cursor-pointer flex items-center gap-2 group transition-colors">
                View All Updates <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {[
              { title: "Ground Saver: Non-Compliant Label Fee", desc: "Effective May 4, 2026 — a $5.00 per package fee will apply to non-compliant FIRSTRANK PARCEL Ground Saver labels.", link: "/shipping/international-shipping", tag: "Fee Update", tagColor: "#D32F2F", tagBg: "rgba(211, 47, 47, 0.1)" },
              { title: "Domestic Fuel Surcharge", desc: "Effective March 9, 2026 — U.S. Ground Domestic and Ground Saver® Fuel Surcharge rates will change.", link: "/shipping/quote", tag: "Surcharge", tagColor: "#C89B3C", tagBg: "rgba(200, 155, 60, 0.15)" },
              { title: "International Ground Fuel Surcharge", desc: "Effective March 2, 2026 — U.S. International Ground Export/Import Fuel Surcharge will be adjusted.", link: "/shipping/international-shipping", tag: "International", tagColor: "#235347", tagBg: "rgba(35, 83, 71, 0.1)" },
              { title: "Trade Policy & Tariff Changes", desc: "Stay informed about how recent tariff changes may impact your shipping costs and customs clearance.", link: "/shipping/international-shipping", tag: "Policy", tagColor: "#0B2B26", tagBg: "rgba(11, 43, 38, 0.1)" },
            ].map((update) => (
              <Link key={update.title} href={update.link}>
                <div className="relative p-8 md:p-10 rounded-[40px] overflow-hidden hover:-translate-y-2 cursor-pointer group flex flex-col h-full transition-all duration-500">
                  {/* Liquid Glass Layers */}
                  <div className="absolute inset-0 z-0 rounded-[40px]" style={{ backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
                  <div className="absolute inset-0 z-[1] rounded-[40px]" style={{ background: 'rgba(255,255,255,0.35)' }} />
                  <div className="absolute inset-0 z-[2] rounded-[40px]" style={{ background: 'rgba(255,255,255,0.12)' }} />
                  <div className="absolute inset-0 z-[3] rounded-[40px] overflow-hidden transition-all duration-500" style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.6), inset -1px -1px 1px 1px rgba(255,255,255,0.4), 0 8px 32px rgba(11,43,38,0.04)' }} />
                  
                  {/* Inner subtle glow on hover */}
                  <div className="absolute inset-0 z-[4] bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px]"></div>

                  <div className="relative z-10 flex items-center justify-between gap-4 mb-8">
                    <span className="text-[12px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/50" style={{ color: update.tagColor, backgroundColor: update.tagBg, backdropFilter: 'blur(10px)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.3)' }}>
                      {update.tag}
                    </span>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-[#F59A25] transition-colors duration-300 shrink-0" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.4)' }}>
                      <ChevronRight size={18} className="text-[#0B2B26] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="font-outfit font-bold text-[#0B2B26] text-[24px] md:text-[28px] mb-4 leading-tight group-hover:text-[#235347] transition-colors relative z-10">{update.title}</h3>
                  <p className="text-[16px] md:text-[18px] text-[#235347]/80 leading-relaxed font-medium flex-1 relative z-10">{update.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="py-10 md:py-14" style={{ backgroundColor: "#0B2B26" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="text-center mb-6 md:mb-10">
            <p className="text-[11px] md:text-[13px] font-bold uppercase tracking-widest text-[#F59A25] mb-2">Navigate</p>
            <h2 className="text-xl md:text-3xl font-bold text-[#FFF7E1]">Quick Links</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {[
              { label: "My Choice® Login", icon: Shield, href: "/track/firstrank-my-choice" },
              { label: "Help & Support", icon: HelpCircle, href: "/#contact" },
              { label: "Order Supplies", icon: Truck, href: "/shipping/order-supplies" },
              { label: "File a Claim", icon: Bell, href: "/support/file-a-claim" },
              { label: "Change Delivery", icon: Clock, href: "/track/change-delivery" },
              { label: "Create Account", icon: Zap, href: "/auth/signup" },
            ].map((link) => (
              <Link key={link.label} href={link.href}>
                <div className="relative rounded-[14px] md:rounded-[18px] p-4 md:p-5 text-center cursor-pointer transition-all group overflow-hidden hover:scale-[1.03] hover:-translate-y-1 duration-300">
                  {/* Glass layers for quick link tiles */}
                  <div className="absolute inset-0 z-0 rounded-[14px] md:rounded-[18px]" style={{ backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
                  <div className="absolute inset-0 z-[1] rounded-[14px] md:rounded-[18px]" style={{ background: 'rgba(35,83,71,0.45)' }} />
                  <div className="absolute inset-0 z-[2] rounded-[14px] md:rounded-[18px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="absolute inset-0 z-[3] rounded-[14px] md:rounded-[18px] overflow-hidden" style={{ boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.12), inset -1px -1px 1px 0 rgba(255,255,255,0.06)', border: '1px solid rgba(35,83,71,0.7)' }} />
                  <div className="relative z-[10]">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{ background: 'rgba(255,247,225,0.08)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.08)' }}>
                      <link.icon size={18} className="text-[#F59A25]" />
                    </div>
                    <span className="block text-[11px] md:text-[13px] font-bold text-[#FFF7E1] leading-tight">{link.label}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE FIRSTRANK PARCEL ── */}
      <div className="py-10 md:py-16" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[12px] md:text-[14px] font-bold uppercase tracking-widest text-[#F59A25] mb-3">Why Firstrank Parcel</p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0B2B26]">Trusted by Businesses Worldwide</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Globe, title: "Global Reach", desc: "Ship to 220+ countries with reliable customs clearance and end-to-end tracking." },
              { icon: Shield, title: "Secure Shipping", desc: "Every package is covered with up to $100 in complimentary liability protection." },
              { icon: Zap, title: "Lightning Fast", desc: "Next-day and 2-day delivery options across all major domestic corridors." },
              { icon: Clock, title: "24/7 Support", desc: "Round-the-clock customer service via chat, phone, and our Help Center." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-[16px] md:rounded-[24px] p-5 md:p-8 border border-[#DAF1DE] hover:border-[#F59A25] hover:shadow-lg transition-all text-center group" style={{ boxShadow: "0px 4px 15px rgba(11,43,38,0.05)" }}>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: "#DAF1DE" }}>
                  <item.icon size={22} className="text-[#235347]" />
                </div>
                <h3 className="text-[16px] md:text-[20px] font-bold text-[#0B2B26] mb-2 md:mb-3">{item.title}</h3>
                <p className="text-[13px] md:text-[15px] text-[#235347]/80 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="py-10 md:py-16" style={{ backgroundColor: "#FFF7E1" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="relative rounded-[20px] md:rounded-[40px] p-6 md:p-14 text-center overflow-hidden">
            {/* CTA Glass Layers */}
            <div className="absolute inset-0 z-0 rounded-[20px] md:rounded-[40px]" style={{ backdropFilter: 'blur(20px)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
            <div className="absolute inset-0 z-[1] rounded-[20px] md:rounded-[40px]" style={{ background: 'rgba(11,43,38,0.92)' }} />
            <div className="absolute inset-0 z-[2] rounded-[20px] md:rounded-[40px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="absolute inset-0 z-[3] rounded-[20px] md:rounded-[40px] overflow-hidden" style={{ boxShadow: 'inset 0 2px 2px 0 rgba(255,255,255,0.1), inset 0 -1px 1px 0 rgba(255,255,255,0.05)' }} />
            {/* Top edge glass rim */}
            <div className="absolute top-0 left-[10%] right-[10%] h-px z-[4]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }} />
            <div className="relative z-10">
              <h2 className="text-[22px] md:text-[36px] font-bold text-[#FFF7E1] mb-3 md:mb-5">Ready to Ship with FIRSTRANK PARCEL?</h2>
              <p className="text-[14px] md:text-[18px] text-[#8EB69B] mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Create your free account today and get access to exclusive business rates, real-time tracking, and dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="px-6 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-[14px] md:text-[16px] transition-all hover:scale-105 relative overflow-hidden"
                  style={{ background: 'rgba(245,154,37,0.9)', color: '#fff', backdropFilter: 'blur(10px)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.3), 0 4px 15px rgba(245,154,37,0.3)' }}
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="px-6 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-[14px] md:text-[16px] text-[#FFF7E1] transition-all relative overflow-hidden"
                  style={{ background: 'rgba(142,182,155,0.1)', border: '2px solid rgba(142,182,155,0.5)', backdropFilter: 'blur(10px)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.1)' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(142,182,155,0.3)'; e.currentTarget.style.color = '#0B2B26'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(142,182,155,0.1)'; e.currentTarget.style.color = '#FFF7E1'; }}
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTACT US SECTION ── */}
      <div id="contact" className="py-10 md:py-20" style={{ backgroundColor: "#DAF1DE" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            
            {/* Left: Contact Info */}
            <div className="md:w-1/3">
              <h2 className="text-[28px] md:text-[40px] font-bold text-[#0B2B26] mb-4">Get in Touch</h2>
              <p className="text-[16px] text-[#235347] mb-8">We're here to help with all your shipping and business needs. Reach out to us today.</p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-widest text-[#8EB69B] mb-1">Company Email</p>
                  <p className="text-[18px] font-medium text-[#0B2B26] hover:text-[#F59A25] cursor-pointer transition-colors">support@firstrank logix.com</p>
                </div>
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-widest text-[#8EB69B] mb-1">Phone Number</p>
                  <a href="tel:+12135665575" className="text-[18px] font-medium text-[#0B2B26] hover:text-[#F59A25] cursor-pointer transition-colors block">+1 (213) 566-5575</a>
                  <p className="text-[14px] text-[#235347] mt-1">Mon–Fri 8AM–8PM ET</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="md:w-2/3 w-full">
              <div className="bg-white rounded-[24px] p-6 md:p-10" style={{ boxShadow: "0px 10px 40px rgba(11,43,38,0.08)" }}>
                <h3 className="font-bold text-[#0B2B26] text-[24px] mb-6">Send Us a Message</h3>

                {contactSubmitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#235347" }}>
                      <img src="https://www.ups.com/webassets/icons/box.svg" alt="Success" className="w-8 h-8 invert" />
                    </div>
                    <h4 className="text-[22px] font-bold text-[#0B2B26] mb-2">Message Sent!</h4>
                    <p className="text-[#235347] text-[16px] mb-6">We'll get back to you within 1-2 business days.</p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="px-6 py-3 rounded-full text-[14px] font-bold transition-colors"
                      style={{ backgroundColor: "#F59A25", color: "#fff" }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-bold text-[#235347] mb-2">Name *</label>
                        <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Your Name" required
                          className="w-full border border-[#8EB69B] rounded px-4 py-3 text-[15px] text-[#0B2B26] focus:outline-none focus:border-[#F59A25] focus:ring-1 focus:ring-[#F59A25] bg-white" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-[#235347] mb-2">Email *</label>
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="your@email.com" required
                          className="w-full border border-[#8EB69B] rounded px-4 py-3 text-[15px] text-[#0B2B26] focus:outline-none focus:border-[#F59A25] focus:ring-1 focus:ring-[#F59A25] bg-white" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-[#235347] mb-2">Message *</label>
                      <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="How can we help you?" rows={4} required
                        className="w-full border border-[#8EB69B] rounded px-4 py-3 text-[15px] text-[#0B2B26] focus:outline-none focus:border-[#F59A25] focus:ring-1 focus:ring-[#F59A25] resize-none bg-white" />
                    </div>

                    <button type="submit" className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-[15px] transition-colors"
                      style={{ backgroundColor: "#F59A25", color: "#fff" }}
                      onMouseOver={e => (e.currentTarget.style.backgroundColor = "#C89B3C")}
                      onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
