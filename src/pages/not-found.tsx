import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">404 — Page Not Found</h1>
        <p className="text-sm text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button
            className="px-6 py-2.5 rounded-full font-semibold text-sm"
            style={{ backgroundColor: "#FFC400", color: "#121212" }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
