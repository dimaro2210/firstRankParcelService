import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const sEmail = email.trim();
    if (!sEmail || !password) {
      setError("Please enter both your User ID/email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await Promise.race([
        login(sEmail, password),
        new Promise<{ success: boolean, error?: string }>((_, reject) => setTimeout(() => reject(new Error("Login request timed out. Please try again.")), 15000))
      ]);
      setLoading(false);
      
      if (result.success) {
        navigate("/dashboard");
      } else { 
        setError(result.error || "Invalid credentials. Please try again."); 
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An unexpected error occurred during login.");
    }
  };

  const iconFilter = "brightness(0) saturate(100%) invert(14%) sepia(30%) saturate(700%) hue-rotate(120deg)";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#DAF1DE" }}>
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-center px-6 md:px-16 w-[450px] flex-shrink-0 relative overflow-hidden" style={{ backgroundColor: "#0B2B26" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59A25] opacity-5 -mr-32 -mt-32 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#235347] opacity-20 -ml-32 -mb-32 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="mb-8 md:mb-12">
            <Logo variant="light" size="xl" />
          </div>
          <h2 className="text-[24px] md:text-[40px] font-bold text-[#FFF7E1] mb-6 leading-tight">Welcome to the future of shipping.</h2>
          <p className="text-[#8EB69B] text-[18px] mb-8 md:mb-12 leading-relaxed font-medium">Sign in to access your FIRSTRANK PARCEL portal, track global shipments, and manage your business deliveries with ease.</p>
          <div className="space-y-6">
            {[
              { icon: "https://www.ups.com/webassets/icons/local_shipping.svg", label: "Real-time global tracking" },
              { icon: "https://www.ups.com/webassets/icons/box.svg",            label: "Inventory & supply management" },
              { icon: "https://www.ups.com/webassets/icons/pin.svg",            label: "Pickup & drop-off locations" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 text-[#FFF7E1] text-[16px] font-bold group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:bg-[#F59A25]" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                  <img src={item.icon} alt={item.label} className="w-5 h-5 invert" />
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 md:py-12 relative">
        <div className="w-full max-w-lg">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#0B2B26] font-bold mb-6 hover:text-[#F59A25] transition-colors w-fit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </button>
          <div className="bg-white rounded-[32px] p-6 md:p-12 border border-[#8EB69B]/30" style={{ boxShadow: "0px 10px 40px rgba(11,43,38,0.08)" }}>
            <div className="mb-10 flex flex-col items-center text-center">
              <Logo size="lg" className="mb-6 justify-center" />
              <h1 className="text-[24px] md:text-[32px] font-bold text-[#0B2B26] mb-3">Sign In</h1>
              <p className="text-[16px] text-[#235347] font-medium">
                New user? <Link href="/auth/signup"><span className="font-bold cursor-pointer hover:underline" style={{ color: "#F59A25" }}>Create a FIRSTRANK PARCEL Account</span></Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[13px] uppercase tracking-widest font-bold text-[#235347] mb-2">User ID or Email Address</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your User ID or email"
                  className="w-full border-2 border-[#8EB69B] rounded-[12px] px-5 py-4 text-[16px] font-medium focus:outline-none focus:border-[#F59A25] transition-all text-[#0B2B26]"
                  style={{ backgroundColor: "#FFF7E1" }} required />
              </div>

              <div>
                <label className="block text-[13px] uppercase tracking-widest font-bold text-[#235347] mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border-2 border-[#8EB69B] rounded-[12px] px-5 py-4 text-[16px] font-medium focus:outline-none focus:border-[#F59A25] transition-all text-[#0B2B26] pr-14"
                    style={{ backgroundColor: "#FFF7E1" }} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8EB69B] hover:text-[#0B2B26] transition-colors">
                    {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between whitespace-nowrap gap-2">
                <label className="flex items-center gap-2 text-[13px] sm:text-[15px] text-[#235347] cursor-pointer font-medium">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] border-2 border-[#8EB69B] cursor-pointer accent-[#235347]" />
                  Remember me
                </label>
                <Link href="/#contact">
                  <span className="text-[13px] sm:text-[15px] font-bold cursor-pointer hover:underline" style={{ color: "#F59A25" }}>Forgot Password?</span>
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-100 rounded-[12px] p-4 text-[14px] text-red-700 font-bold flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold">!</div>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-5 rounded-full font-bold text-[18px] transition-all shadow-md flex items-center justify-center gap-3 text-white"
                style={{ backgroundColor: "#F59A25", opacity: loading ? 0.7 : 1 }}
                onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = "#C89B3C")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#F59A25")}>
                {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Signing In...</>) : "Sign In"}
              </button>
            </form>



            <div className="mt-8 md:mt-12 pt-8 border-t border-[#DAF1DE] text-center">
              <p className="text-[13px] text-[#8EB69B] leading-relaxed font-medium">
                By signing in, you agree to FIRSTRANK PARCEL's{" "}
                <Link href="/#contact"><span className="underline cursor-pointer font-bold text-[#235347]">Terms of Use</span></Link>{" "}and{" "}
                <Link href="/#contact"><span className="underline cursor-pointer font-bold text-[#235347]">Privacy Notice</span></Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
