import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, User, LogOut, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navItems = [
    {
      label: "Shipping",
      id: "shipping",
      links: [
        { label: "Calculate Time & Cost", href: "/shipping/quote", icon: "https://www.ups.com/webassets/icons/savings.svg" },
        { label: "Schedule a Pickup", href: "/shipping/schedule-pickup", icon: "https://www.ups.com/webassets/icons/box.svg" },
        { label: "Change Delivery", href: "/track/change-delivery", icon: "https://www.ups.com/webassets/icons/alert.svg" },
        { label: "International Shipping", href: "/shipping/international-shipping", icon: "https://www.ups.com/webassets/icons/globe.svg" },
      ]
    },
    {
      label: "Tracking",
      href: "/tracking",
    },
    {
      label: "Business Solutions",
      id: "business",
      links: [
        { label: "FIRSTRANK PARCEL for Enterprise", href: "/business-solutions", icon: "https://www.ups.com/webassets/icons/business.svg" },
        { label: "E-commerce Support", href: "/business-solutions", icon: "https://www.ups.com/webassets/icons/shopping_cart.svg" },
        { label: "Firstrank Parcel My Choice®", href: "/track/firstrank-my-choice", icon: "https://www.ups.com/webassets/icons/verified_user.svg" },
      ]
    },
    {
      label: "Support",
      id: "support",
      links: [
        { label: "Help Center", href: "/support/help-center", icon: "https://www.ups.com/webassets/icons/blue_help.svg" },
        { label: "File a Claim", href: "/support/file-a-claim", icon: "https://www.ups.com/webassets/icons/alert.svg" },
        { label: "Contact Us", href: "/#contact", icon: "https://www.ups.com/webassets/icons/phone.svg" },
      ]
    }
  ];

  return (
    <>
      {/* Main Navigation — Liquid Glass Header */}
      <header
        className="sticky top-0 z-[100] h-20"
        style={{
          background: 'transparent',
        }}
      >
        {/* ── Liquid Glass Layers ── */}
        {/* Layer 1: Blur */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            isolation: 'isolate',
          }}
        />
        {/* Layer 2: Base Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'rgba(255,255,255,0.4)' }}
        />
        {/* Layer 3: Frosted Tint */}
        <div
          className="absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)' }}
        />
        {/* Layer 4: Inner glow / shadow */}
        <div
          className="absolute inset-0 z-[3] overflow-hidden"
          style={{
            boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.8), inset 0 -1px 1px 0 rgba(255,255,255,0.3), 0 8px 32px rgba(0,0,0,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.4)'
          }}
        />

        {/* ── Header Content ── */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 h-full flex items-center justify-between relative z-[10]">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-12 min-w-0">
             <Link href="/">
                <div className="flex items-center cursor-pointer">
                   <Logo size="md" />
                </div>
             </Link>

             <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => (
                  <div key={item.label} className="relative"
                       onMouseEnter={() => item.links && setActiveDropdown(item.id || null)}
                       onMouseLeave={() => setActiveDropdown(null)}>

                    {item.href ? (
                      <Link href={item.href}>
                        <span className="px-6 py-3 text-[14px] font-bold text-[#0B2B26] uppercase tracking-wider hover:text-[#F59A25] cursor-pointer transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button className="flex items-center gap-2 px-6 py-3 text-[14px] font-bold text-[#0B2B26] uppercase tracking-wider hover:text-[#F59A25] transition-colors">
                        {item.label} <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.id ? "rotate-180" : ""}`} />
                      </button>
                    )}

                    {/* Liquid Glass Dropdown Panel */}
                    {item.links && activeDropdown === item.id && (
                      <div className="absolute top-full left-0 pt-4 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                         <div className="relative rounded-[32px] overflow-hidden p-3">
                            {/* Dropdown glass layers */}
                            <div
                              className="absolute inset-0 z-0 rounded-[32px]"
                              style={{
                                backdropFilter: 'blur(40px) saturate(200%)',
                                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                                filter: 'url(#glass-distortion)',
                                isolation: 'isolate',
                              }}
                            />
                            <div
                              className="absolute inset-0 z-[1] rounded-[32px]"
                              style={{ background: 'rgba(255, 247, 225, 0.65)' }}
                            />
                            <div
                              className="absolute inset-0 z-[2] rounded-[32px]"
                              style={{ background: 'rgba(255, 255, 255, 0.20)' }}
                            />
                            <div
                              className="absolute inset-0 z-[3] rounded-[32px] overflow-hidden"
                              style={{
                                boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.4), 0 12px 40px rgba(11,43,38,0.15)',
                              }}
                            />

                            {/* Dropdown Content */}
                            <div className="relative z-[10]">
                            {item.links.map((link) => (
                              <Link key={link.label} href={link.href}>
                                <div className="flex items-center gap-4 p-4 rounded-[20px] hover:bg-white/30 transition-all group cursor-pointer">
                                   <div className="w-10 h-10 bg-[#DAF1DE]/60 rounded-full flex items-center justify-center group-hover:bg-[#8EB69B]/30 transition-colors backdrop-blur-sm">
                                      <img src={link.icon} className="w-5 h-5 opacity-60 group-hover:opacity-100" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg) brightness(90%) contrast(90%)" }} />
                                   </div>
                                   <span className="text-[14px] font-bold text-[#0B2B26]">{link.label}</span>
                                </div>
                              </Link>
                            ))}
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                ))}
             </nav>
          </div>

          <div className="flex items-center gap-3">

             {isAuthenticated ? (
               <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                     <button className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/40 transition-all relative group"
                       style={{
                         background: 'rgba(218,241,222,0.5)',
                         backdropFilter: 'blur(20px)',
                         boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(11,43,38,0.1)',
                       }}
                     >
                        {user?.profilePicture ? (
                           <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                           <User size={20} className="text-[#0B2B26]" />
                        )}
                     </button>
                  </Link>
                  <button onClick={async () => { await logout(); setLocation("/"); }}
                    className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[14px] transition-all relative overflow-hidden group"
                    style={{
                      background: 'rgba(11,43,38,0.85)',
                      backdropFilter: 'blur(20px)',
                      color: '#FFF7E1',
                      boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.15), 0 4px 15px rgba(11,43,38,0.2)',
                    }}
                  >
                     <span className="relative z-10 flex items-center gap-2">Logout <LogOut size={16} /></span>
                  </button>
               </div>
             ) : (
               <div className="hidden md:flex items-center gap-3">
                  <Link href="/auth/login">
                     <button
                       className="px-6 py-3 rounded-full font-bold text-[14px] text-[#235347] transition-all relative overflow-hidden"
                       style={{
                         background: 'rgba(218,241,222,0.3)',
                         backdropFilter: 'blur(20px)',
                         boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 1px 0 rgba(255,255,255,0.2)',
                       }}
                     >
                       Login
                     </button>
                  </Link>
               </div>
             )}

             <button onClick={() => setMobileOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full transition-colors"
               style={{
                 background: 'rgba(218,241,222,0.3)',
                 backdropFilter: 'blur(20px)',
                 boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.4)',
               }}
             >
                <Menu size={24} className="text-[#0B2B26]" />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — Liquid Glass Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] animate-in fade-in duration-300 lg:hidden"
          style={{
            background: 'rgba(11,43,38,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
           <div className="absolute top-0 right-0 h-full w-full max-w-sm animate-in slide-in-from-right duration-300 flex flex-col relative overflow-hidden">
              {/* Mobile panel glass layers */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backdropFilter: 'blur(60px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(60px) saturate(200%)',
                  filter: 'url(#glass-distortion)',
                  isolation: 'isolate',
                }}
              />
              <div
                className="absolute inset-0 z-[1]"
                style={{ background: 'rgba(255, 247, 225, 0.75)' }}
              />
              <div
                className="absolute inset-0 z-[2]"
                style={{ background: 'rgba(255, 255, 255, 0.20)' }}
              />
              <div
                className="absolute inset-0 z-[3] overflow-hidden"
                style={{
                  boxShadow: 'inset 2px 0 2px 0 rgba(255,255,255,0.5), inset -1px 0 1px 0 rgba(255,255,255,0.3), -12px 0 40px rgba(11,43,38,0.2)',
                }}
              />
              {/* Left edge glass rim highlight */}
              <div
                className="absolute top-0 left-0 bottom-0 w-px z-[4]"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.6), transparent)' }}
              />

              {/* Mobile Menu Content */}
              <div className="relative z-[10] flex flex-col h-full p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#0B2B26]/10">
                 <Link href="/" onClick={() => setMobileOpen(false)}>
                   <div className="cursor-pointer">
                     <Logo size="md" />
                   </div>
                 </Link>
                 <button onClick={() => setMobileOpen(false)}
                   className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                   style={{
                     background: 'rgba(218,241,222,0.6)',
                     backdropFilter: 'blur(20px)',
                     boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.3)',
                   }}
                 >
                    <X size={20} className="text-[#0B2B26]" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8">
                 {navItems.map((item) => (
                   <div key={item.label}>
                      {item.href ? (
                        <Link href={item.href}>
                           <p className="text-[24px] font-bold text-[#0B2B26]">{item.label}</p>
                        </Link>
                      ) : (
                        <div className="space-y-4">
                           <p className="text-[12px] font-bold uppercase tracking-widest text-[#8EB69B]">{item.label}</p>
                           <div className="grid grid-cols-1 gap-2">
                              {item.links?.map((link) => (
                                <Link key={link.label} href={link.href}>
                                   <div className="flex items-center gap-4 p-4 rounded-[20px] font-bold text-[#0B2B26] relative overflow-hidden"
                                     style={{
                                       background: 'rgba(218,241,222,0.5)',
                                       backdropFilter: 'blur(20px)',
                                       boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.3)',
                                     }}
                                   >
                                      <img src={link.icon} className="w-5 h-5 opacity-50" style={{ filter: "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg) brightness(90%) contrast(90%)" }} />
                                      {link.label}
                                   </div>
                                </Link>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>

              <div className="pt-8 border-t border-[#8EB69B]/30 mt-auto">
                  {isAuthenticated ? (
                   <button onClick={async () => { await logout(); setLocation("/"); setMobileOpen(false); }}
                     className="w-full py-5 rounded-full font-bold text-[16px] relative overflow-hidden"
                     style={{
                       background: 'rgba(11,43,38,0.85)',
                       color: '#FFF7E1',
                       backdropFilter: 'blur(20px)',
                       boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.15), 0 6px 20px rgba(11,43,38,0.25)',
                     }}
                   >Logout</button>
                 ) : (
                   <div className="flex flex-col gap-3">
                      <Link href="/auth/login" className="w-full">
                         <button className="w-full py-5 rounded-full font-bold text-[16px] text-[#0B2B26] relative overflow-hidden"
                           style={{
                             background: 'rgba(255,255,255,0.3)',
                             border: '2px solid rgba(142,182,155,0.5)',
                             backdropFilter: 'blur(20px)',
                             boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 0 rgba(255,255,255,0.3)',
                           }}
                         >Login</button>
                      </Link>
                      <Link href="/auth/register" className="w-full">
                         <button className="w-full py-5 rounded-full font-bold text-[16px] text-white relative overflow-hidden"
                           style={{
                             background: 'rgba(245,154,37,0.9)',
                             backdropFilter: 'blur(20px)',
                             boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.3), 0 6px 20px rgba(245,154,37,0.3)',
                           }}
                         >Sign Up</button>
                      </Link>
                   </div>
                 )}
              </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
}
