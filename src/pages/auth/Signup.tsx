import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";

export default function Signup() {
  const [accountType, setAccountType] = useState<"Personal" | "Business">("Personal");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const { register } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const sFirstName = firstName.trim();
    const sLastName = lastName.trim();
    const sEmail = email.trim();
    const sCompany = company.trim();
    const sAddress = address.trim();
    const sPostalCode = postalCode.trim();
    const sUserId = userId.trim() || sEmail.split("@")[0];

    if (!sFirstName || !sLastName || !sEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreed) { setError("You must agree to the terms to continue."); return; }
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const result = await register({ 
      firstName: sFirstName, lastName: sLastName, email: sEmail, password, accountType, 
      userId: sUserId,
      company: sCompany, address: sAddress, postalCode: sPostalCode 
    });
    setLoading(false);
    if (result.success) { 
      setSuccessMsg("success");
      setFirstName(""); setLastName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setCompany(""); setAddress(""); setPostalCode(""); setUserId(""); setAgreed(false);
    }
    else { setError(result.error || "An error occurred. Please try again."); }
  };

  const passwordStrength = (pw: string) => {
    if (pw.length === 0) return null;
    if (pw.length < 6) return "weak";
    if (pw.length < 10) return "medium";
    return "strong";
  };
  const strength = passwordStrength(password);

  const inputClass = "w-full border-2 border-[#8EB69B] rounded-[12px] px-5 py-4 text-[16px] font-medium focus:outline-none focus:border-[#F59A25] transition-all text-[#0B2B26]";
  const labelClass = "block text-[13px] uppercase tracking-widest font-bold text-[#235347] mb-2";

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
          <h2 className="text-[24px] md:text-[40px] font-bold text-[#FFF7E1] mb-6 leading-tight">Start your journey with FIRSTRANK PARCEL.</h2>
          <p className="text-[#8EB69B] text-[18px] mb-8 md:mb-12 leading-relaxed font-medium">Create an account to unlock powerful shipping tools, discounted rates, and seamless global logistics management.</p>
          <div className="space-y-6">
            {["Free to create and use", "Track all your shipments", "Manage deliveries in one place", "Exclusive member discounts"].map((label) => (
              <div key={label} className="flex items-center gap-4 text-[#FFF7E1] text-[16px] font-bold">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#F59A25" }}>
                  <CheckCircle size={20} color="#fff" />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 md:py-12 relative">
        <div className="w-full max-w-2xl">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#0B2B26] font-bold mb-6 hover:text-[#F59A25] transition-colors w-fit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
          </button>
          <div className="bg-white rounded-[32px] p-6 md:p-12 border border-[#8EB69B]/30" style={{ boxShadow: "0px 10px 40px rgba(11,43,38,0.08)" }}>
            <div className="mb-10 flex flex-col items-center text-center">
              <Logo size="lg" className="mb-6 justify-center" />
              <h1 className="text-[24px] md:text-[32px] font-bold text-[#0B2B26] mb-3">Create Account</h1>
              <p className="text-[16px] text-[#235347] font-medium">
                Already have an account? <Link href="/auth/login"><span className="font-bold cursor-pointer hover:underline" style={{ color: "#F59A25" }}>Sign In</span></Link>
              </p>
            </div>

            {successMsg ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100 shadow-xl">
                  <CheckCircle size={48} className="text-green-500" />
                </div>
                <h2 className="text-[28px] font-bold text-[#0B2B26] mb-4">Registration Successful!</h2>
                <p className="text-[16px] text-[#235347] font-medium leading-relaxed max-w-md mx-auto mb-8">
                  Your account has been created. Please <span className="font-bold text-[#F59A25]">check your email</span> for a confirmation link to activate your account.
                </p>
                <Link href="/auth/login">
                  <button className="w-full max-w-sm py-4 rounded-full font-bold text-[16px] transition-all shadow-md text-white bg-[#0B2B26] hover:bg-[#123d36]">
                    Back to Login
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {/* Account type toggle */}
                <div className="flex gap-2 mb-10 p-1.5 rounded-full border-2 border-[#DAF1DE]" style={{ backgroundColor: "#DAF1DE" }}>
                  {(["Personal", "Business"] as const).map((type) => (
                    <button key={type} onClick={() => setAccountType(type)}
                      className="flex-1 py-3 rounded-full text-[15px] font-bold transition-all"
                      style={accountType === type
                        ? { backgroundColor: "#235347", color: "#FFF7E1", boxShadow: "0 4px 12px rgba(11,43,38,0.15)" }
                        : { backgroundColor: "transparent", color: "#8EB69B" }}>
                      {type} Account
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
                </div>
              </div>

              {accountType === "Business" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className={labelClass}>Company Name *</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required={accountType === "Business"} />
                </div>
              )}

              <div>
                <label className={labelClass}>Address *</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Shipping Lane, Suite 400" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Postal Code *</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 90210" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
                </div>
              </div>

              <div>
                <label className={labelClass}>User ID (Optional)</label>
                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}
                  placeholder="Choose a User ID" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} />
                <p className="text-[12px] text-[#8EB69B] mt-2 font-medium italic">If blank, your email will be used for login.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" className={`${inputClass} pr-14`} style={{ backgroundColor: "#FFF7E1" }} required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8EB69B] hover:text-[#0B2B26] transition-colors">
                      {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="flex gap-1.5 mt-3 px-1">
                      {["weak", "medium", "strong"].map((level, i) => (
                        <div key={level} className="flex-1 h-1.5 rounded-full transition-all duration-500"
                          style={{ backgroundColor:
                            (strength === "weak" && i === 0) ? "#ef4444" :
                            (strength === "medium" && i <= 1) ? "#C89B3C" :
                            (strength === "strong") ? "#235347" : "#DAF1DE" }} />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password" className={inputClass} style={{ backgroundColor: "#FFF7E1" }} required />
                </div>
              </div>

              <label className="flex items-start gap-4 text-[15px] text-[#235347] cursor-pointer font-medium">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded-[4px] border-2 border-[#8EB69B] cursor-pointer mt-0.5 accent-[#235347]" />
                <span className="leading-relaxed">
                  I agree to the FIRSTRANK PARCEL{" "}
                  <Link href="/#contact"><span className="font-bold underline cursor-pointer" style={{ color: "#F59A25" }}>Terms of Service</span></Link>{" "}and{" "}
                  <Link href="/#contact"><span className="font-bold underline cursor-pointer" style={{ color: "#F59A25" }}>Privacy Policy</span></Link>.
                </span>
              </label>

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
                {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Creating Account...</>) : "Create Account"}
              </button>
              </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
