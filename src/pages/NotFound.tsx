import { useLocation } from "wouter";
import { Package } from "lucide-react";

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: "var(--firstrank-cream)" }}>
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--firstrank-deep)" }}
      >
        <Package size={40} style={{ color: "#FFC400" }} />
      </div>
      <h1 className="text-6xl font-bold mb-4" style={{ color: "var(--firstrank-deep)" }}>404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We couldn't find the page you're looking for. It may have moved or doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-8 py-3 rounded-full font-semibold"
        style={{ backgroundColor: "#FFC400", color: "#121212" }}
      >
        Return to FIRSTRANK PARCEL Home
      </button>
    </div>
  );
}
