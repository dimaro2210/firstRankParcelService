import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { getShareByToken, decodeShareToken } from "@/lib/shareStore";
import { getShipmentById, saveShipment } from "@/lib/shipmentStore";
import type { Shipment } from "@/lib/shipmentStore";
import Dashboard from "@/pages/Dashboard";
import Header from "@/components/Header";

export default function SharedDashboard() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [recipientName, setRecipientName] = useState("Recipient");
  const [senderEmail, setSenderEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Invalid share link.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Try decoding old base64 tokens first for backwards compatibility
        const decoded = decodeShareToken(token);
        if (decoded && decoded.s) {
          const shipmentData = decoded.s as Shipment;
          await saveShipment(shipmentData); // ensure it's saved to supabase if needed
          setShipment(shipmentData);
          setSenderEmail(decoded.se);
          setRecipientName(decoded.rn || "Recipient");
          setLoading(false);
          return;
        }

        // New token lookup via Supabase
        const share = await getShareByToken(token);
        if (!share) {
          setError("This link is invalid or has been revoked by the sender.");
          setLoading(false);
          return;
        }

        const found = await getShipmentById(share.shipmentId);
        if (!found) {
          setError("Shipment not found. It may have been removed.");
          setLoading(false);
          return;
        }

        setShipment(found);
        setSenderEmail(share.senderEmail);
        setRecipientName(
          found.to?.name || found.receiver_name || share.recipientLabel || "Recipient"
        );
      } catch (err) {
        console.error("SharedDashboard load error:", err);
        setError("Something went wrong loading this shipment.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-firstrank-orange rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-sm">Loading your shipment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6 border border-red-100">
              <AlertTriangle size={40} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-outfit mb-3">
              Link Not Valid
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{error}</p>
            <Link href="/">
              <button className="px-8 py-3 rounded-xl bg-firstrank-orange text-white font-bold hover:brightness-110 transition-all">
                Go to Firstrank Parcel
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success — render the real Dashboard in shared mode
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Dashboard sharedShipment={shipment} sharedRecipientName={recipientName} sharedSenderEmail={senderEmail} />
      </main>
    </div>
  );
}
