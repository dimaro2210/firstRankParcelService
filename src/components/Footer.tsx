import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Youtube, Twitter, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="bg-[#071D19] text-[#FFF7E1] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F59A25] opacity-[0.03] -mr-60 -mt-60 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#235347] opacity-[0.08] -ml-40 -mb-40 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* ── Main Content ── */}
        <div className="pt-20 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">

            {/* Column 1: Brand */}
            <div className="space-y-6 sm:col-span-2 lg:col-span-1">
              <Link href="/">
                <div className="cursor-pointer inline-block">
                  <Logo variant="light" size="lg" />
                </div>
              </Link>
              <p className="text-[#8EB69B] text-[14px] leading-relaxed max-w-xs">
                Moving the world forward by delivering what matters. Your trusted partner for global logistics excellence.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Youtube, href: "#" },
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F59A25] hover:border-[#F59A25] hover:text-[#0B2B26] text-white/50 transition-all duration-300">
                    <social.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-bold text-[13px] mb-6 text-[#F59A25] uppercase tracking-[0.2em]">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "Track Package", href: "/tracking" },
                  { label: "Get a Quote", href: "/shipping/quote" },
                  { label: "Our Services", href: "/business-solutions" },
                  { label: "About Us", href: "/about" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-[#8EB69B] hover:text-white transition-colors cursor-pointer text-[14px] font-medium flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="font-bold text-[13px] mb-6 text-[#F59A25] uppercase tracking-[0.2em]">Support</h3>
              <ul className="space-y-3">
                {[
                  { label: "Help Center", href: "/support/help-center" },
                  { label: "File a Claim", href: "/support/file-a-claim" },
                  { label: "Schedule Pickup", href: "/shipping/schedule-pickup" },
                  { label: "FAQs", href: "/support/help-center" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-[#8EB69B] hover:text-white transition-colors cursor-pointer text-[14px] font-medium flex items-center gap-1 group">
                        {link.label}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/[0.06]">
          <div className="py-6 text-center">
            <p className="text-[12px] text-[#8EB69B]/40 font-medium">
              © {new Date().getFullYear()} Firstrank Parcel. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
