import { Link } from "wouter";
import { ChevronRight, Globe2, ShieldCheck, Leaf, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7E1] text-[#0B2B26] font-sans overflow-hidden">
      {/* ── PREMIUM HERO ── */}
      <div className="relative w-full min-h-[80vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={`${import.meta.env.BASE_URL}firstrank_delivery_van.png`}
            alt="Firstrank Parcel Truck" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0B2B26]/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B26] via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[#F59A25] text-[14px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            Welcome to FIRSTRANK PARCEL
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[32px] sm:text-[40px] md:text-[80px] lg:text-[100px] font-bold text-white leading-[1.1] mb-8"
          >
            Logistics. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8EB69B] to-[#F59A25]">Reimagined.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[18px] md:text-[24px] text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            We are building the world's most advanced, reliable, and sustainable global shipping network.
          </motion.p>
        </div>
      </div>

      {/* ── THE STORY SECTION (IMAGE LEFT, TEXT RIGHT) ── */}
      <div className="py-24 md:py-40 bg-[#0B2B26]">
        <div className="max-w-7xl mx-auto px-6" data-aos="fade-up">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="w-full"
            >
              <motion.p variants={fadeUp} className="text-[#F59A25] text-[14px] font-bold uppercase tracking-widest mb-4">Our Purpose</motion.p>
              <motion.h2 variants={fadeUp} className="text-[32px] md:text-[48px] font-bold text-white leading-tight mb-8">
                Connecting people, <br className="hidden md:block" /> empowering growth.
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-6 text-[#8EB69B] text-[18px] md:text-[20px] leading-relaxed font-medium">
                <p>
                  At FIRSTRANK PARCEL, we believe that physical distance should never be a barrier to human connection or business success. We saw an industry burdened by outdated technology and hidden fees, and we chose to rewrite the rules.
                </p>
                <p>
                  By leveraging state-of-the-art routing algorithms and a rapidly expanding eco-conscious fleet, we provide an unparalleled digital-first experience. When you ship with FIRSTRANK PARCEL, you aren't just sending a package—you are sending a promise.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── CORE VALUES GRID ── */}
      <div className="py-24 md:py-40 bg-[#FFF7E1]">
        <div className="max-w-7xl mx-auto px-6" data-aos="fade-up">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-[32px] md:text-[56px] font-bold text-[#0B2B26] mb-6">Built on excellence.</h2>
            <p className="text-[20px] text-[#235347] font-medium max-w-2xl mx-auto">These four pillars guide every decision we make and every package we deliver.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Globe2, title: "Global Network", desc: "Spanning over 200 countries with seamless customs integration and localized care." },
              { icon: ShieldCheck, title: "Total Reliability", desc: "99.9% on-time delivery rate backed by transparent, real-time GPS tracking." },
              { icon: Leaf, title: "Zero Carbon", desc: "Aggressively transitioning to fully electric fleets and sustainable packaging." },
              { icon: Users, title: "Partner Focus", desc: "Dedicated support and scalable APIs built specifically to help businesses thrive." }
            ].map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white rounded-[32px] p-8 shadow-xl border border-[#8EB69B]/20 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-[#DAF1DE] flex items-center justify-center mb-8 border border-[#8EB69B]/40">
                  <v.icon className="text-[#0B2B26]" size={28} />
                </div>
                <h3 className="text-[22px] font-bold text-[#0B2B26] mb-4">{v.title}</h3>
                <p className="text-[16px] text-[#235347] leading-relaxed font-medium">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── PARALLAX STATS ── */}
      <div className="relative py-32 overflow-hidden bg-[#0B2B26]">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Global" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center"
          >
            {[
              { stat: "120+", label: "Countries Served" },
              { stat: "5M+", label: "Packages Daily" },
              { stat: "100%", label: "Carbon Neutral by 2040" },
              { stat: "150K", label: "Team Members" }
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="backdrop-blur-md bg-white/5 rounded-[32px] p-8 border border-white/10">
                <p className="text-[40px] md:text-[64px] font-bold text-[#F59A25] mb-2">{s.stat}</p>
                <p className="text-[14px] font-bold uppercase tracking-widest text-gray-300">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── PREMIUM CTA ── */}
      <div className="bg-[#FFF7E1] py-32">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up"
        >
          <div className="bg-[#DAF1DE] rounded-[48px] p-12 md:p-20 shadow-2xl border-4 border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59A25] opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B2B26] opacity-10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <h2 className="text-[32px] md:text-[56px] font-bold text-[#0B2B26] mb-6 relative z-10">Experience the future.</h2>
            <p className="text-[20px] text-[#235347] font-medium mb-10 max-w-xl mx-auto relative z-10">
              Join millions of users who have already upgraded their shipping experience.
            </p>
            <Link href="/auth/register">
              <button className="relative z-10 px-10 py-5 bg-[#0B2B26] text-white rounded-full font-bold text-[18px] transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3 shadow-xl hover:shadow-[#0B2B26]/30">
                Get Started <ArrowRight size={20} strokeWidth={3} />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
