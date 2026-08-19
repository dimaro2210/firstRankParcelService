import { useState, useEffect, useMemo, useRef, useCallback, Component, ErrorInfo, ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { ChevronRight, Search, MapPin, Package, Clock, CheckCircle2, AlertTriangle, Navigation, Truck, ArrowRight, Plane, ArrowLeft, Layers, Map as MapIcon, Flag } from "lucide-react";
import confetti from "canvas-confetti";
import { getShipments } from "@/lib/shipmentStore";
import type { Shipment } from "@/lib/shipmentStore";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function getBearing(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  let brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

interface TrackResult {
  trackingNumber: string;
  status: string;
  statusLabel: string;
  estimatedDelivery: string;
  service: string;
  weight: string;
  from: string;
  to: string;
  events: Array<{ 
    status: string; 
    location: string; 
    time: string; 
    date: string; 
    done: boolean; 
    current: boolean;
    coordinates?: { lat: number; lng: number };
  }>;
}

function buildResultFromShipment(shipment: Shipment): TrackResult {
  const fromCityStateZip = shipment.from ? `${shipment.from.city}, ${shipment.from.state} ${shipment.from.zip}` : "";
  const toCityStateZip = shipment.to ? `${shipment.to.city}, ${shipment.to.state} ${shipment.to.zip}` : "";
  const fromStr = shipment.origin || fromCityStateZip || "Unknown Origin";
  const toStr = shipment.destination || toCityStateZip || "Unknown Destination";
  const statusStr = shipment.status || shipment.current_status || "PENDING";
  
  return {
    trackingNumber: shipment.trackingNumber || shipment.tracking_code || "",
    status: statusStr.toUpperCase().replace(/ /g, "_"),
    statusLabel: statusStr,
    estimatedDelivery: shipment.estimatedDelivery || shipment.expected_delivery_date || "Pending",
    service: shipment.service || shipment.shipment_type || shipment.carrier || "Standard",
    weight: shipment.weight ? String(shipment.weight) : "N/A",
    from: fromStr,
    to: toStr,
    events: (Array.isArray(shipment.events) ? shipment.events : []).map((e, i) => ({
      status: e.status || (e as any).activity || "Unknown Status",
      location: e.location || "Unknown Location",
      time: e.time,
      date: e.date,
      done: true,
      current: i === 0,
      coordinates: e.coordinates,
    })),
  };
}

function buildDemoResult(tn: string): TrackResult {
  return {
    trackingNumber: tn,
    status: "IN_TRANSIT",
    statusLabel: "In Transit",
    estimatedDelivery: `${new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })} by 8:00 PM`,
    service: "FIRSTRANK PARCEL Ground",
    weight: "2.1 lbs",
    from: "Louisville, KY 40213",
    to: "Chicago, IL 60601",
    events: [
      { status: "In Transit", location: "Indianapolis, IN", time: "4:12 AM", date: "Today", done: true, current: true, coordinates: { lat: 39.7684, lng: -86.1581 } },
      { status: "Departed Facility", location: "Louisville, KY", time: "10:47 PM", date: "Yesterday", done: true, current: false, coordinates: { lat: 38.2527, lng: -85.7585 } },
      { status: "Picked Up", location: "Shipper Location", time: "9:24 AM", date: "Yesterday", done: true, current: false, coordinates: { lat: 38.0406, lng: -84.5037 } },
    ],
  };
}

class TrackingErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tracking Page Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-10 flex flex-col items-center justify-center text-center">
          <AlertTriangle size={64} className="text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-red-900 mb-4">Tracking Page Crashed</h1>
          <p className="text-red-700 mb-4">A critical error occurred while rendering the tracking data.</p>
          <pre className="bg-white p-6 rounded-xl shadow-lg text-left text-red-600 text-sm overflow-auto max-w-3xl w-full border border-red-200">
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function TrackingWrapper() {
  return (
    <TrackingErrorBoundary>
      <Tracking />
    </TrackingErrorBoundary>
  );
}

function Tracking() {
  const [, navigate] = useLocation();
  const [trackingInput, setTrackingInput] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [transitWaypoints, setTransitWaypoints] = useState<Array<{ name: string; type: string; lat: number; lng: number; order: number }>>([]);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const mapStyleRef = useRef(mapStyle);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    mapStyleRef.current = mapStyle;
    if (tileLayerRef.current) {
      const urls: Record<string, string> = {
        streets: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      };
      tileLayerRef.current.setUrl(urls[mapStyle]);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (result && result.statusLabel.toLowerCase().includes('delivered')) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#F59A25', '#0B2B26', '#22c55e'], zIndex: 9999 });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#F59A25', '#0B2B26', '#22c55e'], zIndex: 9999 });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [result]);

  const doSearch = useCallback(async (tn: string) => {
    if (!tn.trim()) return;
    setIsLoading(true);
    try {
      // Fetch with a 10-second timeout to prevent indefinite hanging on network errors
      const fetchPromise = getShipments();
      const timeoutPromise = new Promise<Shipment[]>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000));
      
      let all: Shipment[] = [];
      try {
        all = await Promise.race([fetchPromise, timeoutPromise]);
      } catch (err) {
        console.error("Tracking network error:", err);
        // On network failure, we will naturally fall through to the demo result
      }
      
      const found = all.find((s) => (s.trackingNumber?.toLowerCase() === tn.trim().toLowerCase()) || (s.tracking_code?.toLowerCase() === tn.trim().toLowerCase()));
      if (found) {
        setResult(buildResultFromShipment(found));
        setNotice(found.notice && found.notice.trim() ? found.notice.trim() : null);
        setTransitWaypoints(Array.isArray(found.transit_waypoints) ? found.transit_waypoints : []);
        setCurrentLocation(found.current_location || "");
      } else {
        setResult(buildDemoResult(tn.trim()));
        setNotice(null);
        setTransitWaypoints([]);
        setCurrentLocation("");
      }
      setSearched(true);
      navigate(`/tracking?tn=${encodeURIComponent(tn.trim())}`, { replace: false });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tn = params.get("tn");
    if (tn) { setTrackingInput(tn); doSearch(tn); }
  }, [doSearch]);

  useEffect(() => {
    const handleStorage = () => {
      if (searched && trackingInput) doSearch(trackingInput);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [searched, trackingInput, doSearch]);

  const handleSearch = () => doSearch(trackingInput);

  const pathCoords = useMemo(() => {
    if (!result) return [];
    if (Array.isArray(transitWaypoints) && transitWaypoints.length > 0) {
      return [...transitWaypoints]
        .sort((a, b) => a.order - b.order)
        .map(wp => [wp.lat, wp.lng] as [number, number]);
    }
    return result.events
      .filter(e => e.coordinates)
      .map(e => [e.coordinates!.lat, e.coordinates!.lng] as [number, number])
      .reverse(); 
  }, [result, transitWaypoints]);

  const totalDistance = useMemo(() => {
    let dist = 0;
    if (pathCoords.length > 1) {
      for (let i = 0; i < pathCoords.length - 1; i++) {
        dist += L.latLng(pathCoords[i][0], pathCoords[i][1]).distanceTo(L.latLng(pathCoords[i+1][0], pathCoords[i+1][1]));
      }
    }
    return Math.round(dist / 1000);
  }, [pathCoords]);

  // ── Vanilla Leaflet Map ────────────────────────────────────────
  const trackingMapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const initTrackingMap = useCallback(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer || typeof L === 'undefined') return;

    if (trackingMapRef.current) {
      trackingMapRef.current.remove();
      trackingMapRef.current = null;
    }

    const map = L.map(mapContainer, { zoomControl: false }).setView([20, 0], 2);
    L.control.zoom({ position: 'topright' }).addTo(map);
    trackingMapRef.current = map;

    const urls: Record<string, string> = {
      streets: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    };
    tileLayerRef.current = L.tileLayer(urls[mapStyleRef.current], {
      attribution: '&copy; Map Data',
      maxZoom: 20,
    }).addTo(map);

    const allPoints: [number, number][] = [];

    if (transitWaypoints.length > 0) {
      const sorted = [...transitWaypoints].sort((a, b) => a.order - b.order);
      
      // Fallback: If no current location is explicitly set, assume the package is at the Origin (first waypoint)
      const resolvedLocation = currentLocation || sorted[0]?.name || "";
      const currentWp = sorted.find(wp => wp.name === resolvedLocation);
      const currentOrder = currentWp?.order ?? -1;

      // Build the trail: only waypoints from origin up to current location
      const trailPoints: [number, number][] = [];

      sorted.forEach((wp, index) => {
        const isPassed = wp.order <= currentOrder;
        const isCurrent = wp.name === resolvedLocation;

        if (isPassed || isCurrent) {
          trailPoints.push([wp.lat, wp.lng]);
        }

        // Add all points for map bounds (but don't show destination marker)
        allPoints.push([wp.lat, wp.lng]);

        if (isCurrent) {
          // Calculate bearing to face the next location
          let angle = 90; // Default facing East
          if (index < sorted.length - 1) {
            angle = getBearing(wp.lat, wp.lng, sorted[index + 1].lat, sorted[index + 1].lng);
          } else if (index > 0) {
            angle = getBearing(sorted[index - 1].lat, sorted[index - 1].lng, wp.lat, wp.lng);
          }
          let rotation = angle - 90;
          let scaleY = angle > 180 ? -1 : 1;
          const transformStr = `rotate(${rotation}deg) scaleY(${scaleY})`;

          // ── TRUCK OR AIRPLANE MARKER at current location (animated) ──
          const isFlight = wp.type === 'flight';
          const vehicleHtml = isFlight ? `
            <div style="position:relative;width:48px;height:48px;" class="animated-truck-marker">
              <div style="position:absolute;inset:0;background:rgba(245,154,37,0.25);border-radius:50%;animation:truckPulse 2s ease-in-out infinite;"></div>
              <div style="position:absolute;inset:6px;background:#F59A25;border-radius:50%;border:3px solid white;box-shadow:0 4px 15px rgba(245,154,37,0.5);display:flex;align-items:center;justify-content:center;transform:${transformStr};">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3.5-3.5 3.5-2.5-.5-1.5 1.5 3 1.5 1.5 3 1.5-1.5-.5-2.5 3.5-3.5 3.5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
                </svg>
              </div>
            </div>` : `
            <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 6px 8px rgba(0,0,0,0.3));transform:${transformStr};" class="animated-truck-marker">
              <svg viewBox="0 0 64 64" style="width:48px;height:48px;">
                <rect x="6" y="20" width="36" height="26" rx="4" fill="#FFF7E1"/>
                <path d="M42 28 L54 30 L58 40 L58 46 L42 46 Z" fill="#0B2B26"/>
                <path d="M44 30 L52 32 L54 38 L44 38 Z" fill="#E2E8F0"/>
                <rect x="6" y="34" width="36" height="4" fill="#F59A25"/>
                <rect x="42" y="40" width="16" height="2" fill="#F59A25"/>
                <circle cx="16" cy="48" r="6" fill="#1E293B"/>
                <circle cx="16" cy="48" r="2" fill="#CBD5E1"/>
                <circle cx="48" cy="48" r="6" fill="#1E293B"/>
                <circle cx="48" cy="48" r="2" fill="#CBD5E1"/>
              </svg>
            </div>`;
          const vehicleIcon = L.divIcon({ className: 'custom-map-marker', html: vehicleHtml, iconSize: [48, 48], iconAnchor: [24, 24] });
          const vMarker = L.marker(trailPoints.length > 0 ? trailPoints[0] : [wp.lat, wp.lng], { icon: vehicleIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup(`<div style="font-family:-apple-system,sans-serif;"><strong style="color:#F59A25;">📍 Current Location</strong><br><span style="font-weight:600;">${wp.name}</span><br><span style="color:#6b7280;font-size:0.85rem;">${wp.type === 'center' ? 'Distribution Center' : wp.type === 'origin' ? 'Pickup Location' : wp.type}</span></div>`);
          
          if (trailPoints.length > 1) {
            const duration = 2500;
            const startTime = performance.now();
            const segments = [];
            let cDist = 0;
            for(let i=0; i<trailPoints.length - 1; i++){
               const p1 = L.latLng(trailPoints[i]);
               const p2 = L.latLng(trailPoints[i+1]);
               const d = p1.distanceTo(p2);
               segments.push({ p1, p2, dist: d, cum: cDist });
               cDist += d;
            }
            const animate = (time) => {
              const elapsed = time - startTime;
              let progress = Math.min(elapsed / duration, 1);
              progress = 1 - Math.pow(1 - progress, 3);
              const currentDist = progress * cDist;
              let currentSeg = segments[0];
              for (const seg of segments) {
                if (currentDist >= seg.cum && currentDist <= seg.cum + seg.dist) {
                  currentSeg = seg; break;
                }
              }
              if (currentSeg) {
                const segProgress = currentSeg.dist > 0 ? (currentDist - currentSeg.cum) / currentSeg.dist : 1;
                const clat = currentSeg.p1.lat + (currentSeg.p2.lat - currentSeg.p1.lat) * segProgress;
                const clng = currentSeg.p1.lng + (currentSeg.p2.lng - currentSeg.p1.lng) * segProgress;
                vMarker.setLatLng([clat, clng]);
              }
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        } else if (isPassed && wp.type !== "destination") {
          // ── Passed waypoint dot or Origin Pin ──
          let markerHtml = `<div style="width:12px;height:12px;background:#9ca3af;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`;
          let iconSize: [number, number] = [12, 12];
          let iconAnchor: [number, number] = [6, 6];
          
          if (wp.type === 'origin' || index === 0) {
            markerHtml = `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:#22c55e;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(34,197,94,0.4);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>`;
            iconSize = [32, 32];
            iconAnchor = [16, 16];
          }
          
          const icon = L.divIcon({ className: 'custom-map-marker', html: markerHtml, iconSize, iconAnchor });
          L.marker([wp.lat, wp.lng], { icon: icon })
            .addTo(map)
            .bindPopup(`<div style="font-family:-apple-system,sans-serif;"><strong>${wp.name}</strong><br><span style="color:#22c55e;font-size:0.85rem;">${index === 0 ? 'Origin' : '✓ Passed'}</span></div>`);
        }
        // Don't show markers for future waypoints or destination
      });

      // Destination Pin
      const destWp = sorted[sorted.length - 1];
      if (destWp && destWp.name !== resolvedLocation) {
        const destHtml = `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:#ef4444;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(239,68,68,0.4);"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>`;
        const destIcon = L.divIcon({ className: 'custom-map-marker', html: destHtml, iconSize: [32, 32], iconAnchor: [16, 16] });
        L.marker([destWp.lat, destWp.lng], { icon: destIcon }).addTo(map)
          .bindPopup(`<div style="font-family:-apple-system,sans-serif;"><strong>${destWp.name}</strong><br><span style="color:#ef4444;font-size:0.85rem;">Destination</span></div>`);
      }

      // Draw the yellow trail (from origin to current location)
      if (trailPoints.length > 1) {
        // Dark outline for contrast on any background
        L.polyline(trailPoints, { color: '#0B2B26', weight: 8, opacity: 0.35 }).addTo(map);
        // Bright yellow trail line
        L.polyline(trailPoints, { color: '#FFD600', weight: 5, opacity: 1, dashArray: '12, 6' }).addTo(map);
      }

    } else if (result && result.events) {
      // Fallback: use event coordinates
      const orderedEvents = [...result.events].reverse();
      orderedEvents.forEach((point, index) => {
        if (point.coordinates) {
          allPoints.push([point.coordinates.lat, point.coordinates.lng]);
          const isLast = index === orderedEvents.length - 1;

          if (isLast) {
            // Truck or Airplane at latest event
            let angle = 90;
            if (index > 0 && orderedEvents[index - 1].coordinates) {
              angle = getBearing(orderedEvents[index - 1].coordinates!.lat, orderedEvents[index - 1].coordinates!.lng, point.coordinates.lat, point.coordinates.lng);
            }
            let rotation = angle - 90;
            let scaleY = angle > 180 ? -1 : 1;
            const transformStr = `rotate(${rotation}deg) scaleY(${scaleY})`;

            const isFlightEvent = point.location.toLowerCase().includes('flight') || point.status.toLowerCase().includes('airspace');
            const fallbackVehicleHtml = isFlightEvent ? `
              <div style="position:relative;width:48px;height:48px;" class="animated-truck-marker">
                <div style="position:absolute;inset:0;background:rgba(245,154,37,0.25);border-radius:50%;animation:truckPulse 2s ease-in-out infinite;"></div>
                <div style="position:absolute;inset:6px;background:#F59A25;border-radius:50%;border:3px solid white;box-shadow:0 4px 15px rgba(245,154,37,0.5);display:flex;align-items:center;justify-content:center;transform:${transformStr};">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3.5-3.5 3.5-2.5-.5-1.5 1.5 3 1.5 1.5 3 1.5-1.5-.5-2.5 3.5-3.5 3.5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
                  </svg>
                </div>
              </div>` : `
              <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 6px 8px rgba(0,0,0,0.3));transform:${transformStr};" class="animated-truck-marker">
                <svg viewBox="0 0 64 64" style="width:48px;height:48px;">
                  <rect x="6" y="20" width="36" height="26" rx="4" fill="#FFF7E1"/>
                  <path d="M42 28 L54 30 L58 40 L58 46 L42 46 Z" fill="#0B2B26"/>
                  <path d="M44 30 L52 32 L54 38 L44 38 Z" fill="#E2E8F0"/>
                  <rect x="6" y="34" width="36" height="4" fill="#F59A25"/>
                  <rect x="42" y="40" width="16" height="2" fill="#F59A25"/>
                  <circle cx="16" cy="48" r="6" fill="#1E293B"/>
                  <circle cx="16" cy="48" r="2" fill="#CBD5E1"/>
                  <circle cx="48" cy="48" r="6" fill="#1E293B"/>
                  <circle cx="48" cy="48" r="2" fill="#CBD5E1"/>
                </svg>
              </div>`;
            const fallbackVehicleIcon = L.divIcon({ className: 'custom-map-marker', html: fallbackVehicleHtml, iconSize: [48, 48], iconAnchor: [24, 24] });
            L.marker([point.coordinates.lat, point.coordinates.lng], { icon: fallbackVehicleIcon, zIndexOffset: 1000 })
              .addTo(map)
              .bindPopup(`<div style="font-family:-apple-system,sans-serif;"><strong>${point.location}</strong><br><span style="color:#6b7280;font-size:0.85rem;">${point.status}</span></div>`);
          } else {
            const dotHtml = `<div style="width:10px;height:10px;background:#9ca3af;border-radius:50%;border:2px solid white;"></div>`;
            const dotIcon = L.divIcon({ className: 'custom-map-marker', html: dotHtml, iconSize: [10, 10], iconAnchor: [5, 5] });
            L.marker([point.coordinates.lat, point.coordinates.lng], { icon: dotIcon }).addTo(map);
          }
        }
      });

      // Yellow dashed trail for event-based tracking
      if (allPoints.length > 1) {
        // Dark outline for contrast on any background
        L.polyline(allPoints, { color: '#0B2B26', weight: 8, opacity: 0.35 }).addTo(map);
        // Bright yellow trail line
        L.polyline(allPoints, { color: '#FFD600', weight: 5, opacity: 1, dashArray: '12, 6' }).addTo(map);
      }
    }

    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40] });
    }

    // Ensure map tiles render correctly within rounded containers
    setTimeout(() => { map.invalidateSize(); }, 200);
  }, [result, transitWaypoints, currentLocation]);

  useEffect(() => {
    if (result && pathCoords.length > 0) {
      const timeout = setTimeout(() => initTrackingMap(), 100);
      return () => clearTimeout(timeout);
    }
    return () => {
      if (trackingMapRef.current) { trackingMapRef.current.remove(); trackingMapRef.current = null; }
    };
  }, [result, pathCoords, initTrackingMap]);

  // Progress step logic
  const getProgress = () => {
    if (!result) return 0;
    const s = result.statusLabel.toLowerCase();
    if (s.includes("delivered")) return 100;
    if (s.includes("out for delivery")) return 75;
    if (s.includes("in transit") || s.includes("in-transit")) return 50;
    if (s.includes("picked") || s.includes("shipped")) return 25;
    return 10;
  };

  const steps = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
  const stepsDone = (idx: number) => {
    if (!result) return false;
    const s = result.statusLabel.toLowerCase();
    if (s.includes("delivered")) return true;
    if (idx === 0) return true;
    if (idx === 1 && (s.includes("in transit") || s.includes("in-transit") || s.includes("out for delivery") || s.includes("out-for-delivery"))) return true;
    if (idx === 2 && (s.includes("out for delivery") || s.includes("out-for-delivery"))) return true;
    return false;
  };

  return (
    <div className="bg-[#FFF7E1] min-h-screen font-sans">
      <style>{`
        @keyframes driftAndBob {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2px, -3px) rotate(1deg); }
          50% { transform: translate(4px, 0px) rotate(0deg); }
          75% { transform: translate(2px, 3px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animated-truck-marker {
          animation: driftAndBob 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* ── Search Section ── */}
      <div className="pt-24 md:pt-28 pb-8 md:pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {(() => {
            const params = new URLSearchParams(window.location.search);
            const fromShared = params.get('fromShared');
            if (fromShared) {
              return (
                <div className="mb-8 flex justify-center">
                  <Link href={`/shared/${fromShared}`}>
                    <button className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-firstrank-deep font-bold text-[13px] flex items-center gap-2 transition-all shadow-sm">
                      <ArrowLeft size={16} /> Back to Shared Dashboard
                    </button>
                  </Link>
                </div>
              );
            }
            return null;
          })()}
          
          <p className="text-[#F59A25] text-xs font-bold uppercase tracking-[0.2em] mb-3">Track Shipment</p>
          <h1 className="text-3xl md:text-5xl font-outfit font-bold text-[#0B2B26] mb-8 leading-tight">Where's your package?</h1>

          <div className="relative shadow-xl shadow-[#0B2B26]/5 rounded-2xl p-2 overflow-hidden">
            {/* Glass layers for search bar */}
            <div className="absolute inset-0 z-0 rounded-2xl" style={{ backdropFilter: 'blur(30px) saturate(200%)', WebkitBackdropFilter: 'blur(30px) saturate(200%)', filter: 'url(#glass-distortion)', isolation: 'isolate' }} />
            <div className="absolute inset-0 z-[1] rounded-2xl" style={{ background: 'rgba(255,255,255,0.70)' }} />
            <div className="absolute inset-0 z-[2] rounded-2xl" style={{ background: 'rgba(255,255,255,0.15)' }} />
            <div className="absolute inset-0 z-[3] rounded-2xl overflow-hidden" style={{ boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.6), inset -1px -1px 1px 1px rgba(255,255,255,0.4)', border: '1px solid rgba(200,200,200,0.3)' }} />
            <div className="relative z-[10] flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-2">
              <Search className="text-gray-400 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Enter tracking number"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full text-base md:text-lg text-[#0B2B26] bg-transparent outline-none placeholder:text-gray-400 font-medium"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-200 hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 shrink-0 relative overflow-hidden"
              style={{ background: 'rgba(245,154,37,0.9)', backdropFilter: 'blur(10px)', boxShadow: 'inset 1px 1px 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(245,154,37,0.25)' }}
            >
              Track <ChevronRight size={18} strokeWidth={3} />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content (Grid Layout) ── */}
      <div className="max-w-6xl mx-auto px-4 pb-20">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#235347]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F59A25] mb-4"></div>
            <p className="text-lg font-medium animate-pulse">Locating your shipment...</p>
          </div>
        ) : !searched ? (
          /* ── Default Feature Cards ── */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            {[
              { title: "Real-time Updates", desc: "Instant notifications on your package location.", icon: MapPin },
              { title: "Delivery Planning", desc: "Estimated time windows for arrivals.", icon: Clock },
              { title: "Secure Handover", desc: "Verified delivery with photo proof.", icon: Package },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 shadow-lg shadow-[#0B2B26]/5 rounded-2xl p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#FFF7E1] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F59A25]/20">
                  <f.icon className="text-[#F59A25]" size={28} />
                </div>
                <h3 className="text-[#0B2B26] font-bold text-lg mb-2 font-outfit">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        ) : result ? (
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">

            {/* ── MAIN CONTENT (Status & Map) ── */}
            <div className="flex-1 w-full flex flex-col gap-6">
              
              {/* Status Card - Redesigned for simplicity and cleanliness */}
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden">
                
                {/* Important Notice */}
                {notice && (
                  <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 md:px-5 md:py-4 flex items-center gap-4 mb-8">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0px 6px 8px rgba(220, 38, 38, 0.25))' }}>
                      <defs>
                        <linearGradient id="redGrad3D" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FF8B8B" />
                          <stop offset="0.4" stopColor="#EF4444" />
                          <stop offset="1" stopColor="#991B1B" />
                        </linearGradient>
                        <linearGradient id="whiteGrad3D" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FFFFFF" />
                          <stop offset="1" stopColor="#FFE5E5" />
                        </linearGradient>
                      </defs>
                      <path d="M24 4L4 40H44L24 4Z" fill="url(#redGrad3D)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                      <path d="M24 6L10 32C19 28 29 28 38 32L24 6Z" fill="white" fillOpacity="0.25" />
                      <rect x="21.5" y="16" width="5" height="12" rx="2.5" fill="url(#whiteGrad3D)" style={{ filter: 'drop-shadow(0px 3px 3px rgba(100,0,0,0.5))' }} />
                      <circle cx="24" cy="34" r="3" fill="url(#whiteGrad3D)" style={{ filter: 'drop-shadow(0px 3px 3px rgba(100,0,0,0.5))' }} />
                    </svg>
                    <div>
                      <p className="text-red-800 font-bold text-[15px] mb-0.5 tracking-wide">Important Notice</p>
                      <p className="text-red-700/90 text-sm leading-relaxed">{notice}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                        <div className={`w-2 h-2 rounded-full ${result.statusLabel === 'Delivered' ? 'bg-green-500' : 'bg-[#F59A25]'}`} />
                        <span className="text-gray-600 font-semibold text-xs tracking-wide uppercase">
                          {result.statusLabel}
                        </span>
                      </div>
                      <span className="text-gray-400 font-mono text-sm tracking-wide">#{result.trackingNumber}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-outfit font-bold text-[#0B2B26] mb-3">
                      {result.statusLabel === "Delivered" ? "Package Delivered" : "On Its Way"}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                      <Clock size={16} className={result.statusLabel === 'Delivered' ? 'text-green-500' : 'text-[#F59A25]'} />
                      Estimated Delivery: <span className="text-[#0B2B26] font-bold">{result.estimatedDelivery}</span>
                    </p>
                  </div>
                  
                  {/* Current Location Quick View - Minimalist */}
                  <div className="flex items-center gap-3 text-sm shrink-0 bg-gray-50 px-5 py-3.5 rounded-[1rem] border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                      <MapPin size={16} className="text-[#F59A25]" />
                    </div>
                    <div className="text-left">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Current Location</p>
                      <p className="text-[#0B2B26] font-semibold max-w-[150px] truncate">
                        {currentLocation || (transitWaypoints.length > 0 ? [...transitWaypoints].sort((a, b) => a.order - b.order)[0]?.name : result?.events?.[0]?.location) || "Unknown Location"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Simplified Progress Bar */}
                <div className="mb-6">
                  <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${result.statusLabel === 'Delivered' ? 'bg-green-500' : 'bg-[#F59A25]'}`}
                      style={{ width: `${getProgress()}%` }}
                    />
                  </div>
                </div>

                {/* Minimal Steps */}
                <div className="flex justify-between items-center px-1">
                  {steps.map((step, idx) => {
                    const done = stepsDone(idx);
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                        <p className={`text-[11px] font-bold tracking-wide text-center transition-colors duration-500 ${done ? "text-[#0B2B26]" : "text-gray-400"}`}>{step}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Container - Sleek and rounded */}
              <div className="rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm bg-white p-2">
                <div className="rounded-[1.5rem] overflow-hidden relative">
                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
                    {/* Distance / ETA Overlay */}
                    <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 pointer-events-auto transition-transform hover:scale-105">
                      <div className="w-10 h-10 rounded-full bg-[#FFF7E1] flex items-center justify-center border border-[#F59A25]/20">
                        <MapIcon className="text-[#F59A25]" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Route Distance</p>
                        <p className="text-[#0B2B26] font-bold text-sm">
                          {totalDistance > 0 ? `${totalDistance} km` : 'Calculating...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 z-[400] pointer-events-auto">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-1 flex items-center">
                      <button onClick={() => setMapStyle('streets')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapStyle === 'streets' ? 'bg-[#0B2B26] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Map</button>
                      <button onClick={() => setMapStyle('satellite')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapStyle === 'satellite' ? 'bg-[#0B2B26] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Satellite</button>
                      <button onClick={() => setMapStyle('dark')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapStyle === 'dark' ? 'bg-[#0B2B26] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>Dark</button>
                    </div>
                  </div>
                  {pathCoords.length > 0 ? (
                    <div ref={mapContainerRef} id="trackingMap" style={{ height: '400px', width: '100%', zIndex: 1 }} />
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50/50">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Navigation size={24} className="text-gray-300" />
                      </div>
                      <p className="text-gray-400 font-medium text-sm">Preparing map data...</p>
                    </div>
                  )}
                  {/* Subtle inner shadow for map */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] z-[2]" />
                </div>
              </div>

            </div>

            {/* ── SIDEBAR (Tracking History) ── */}
            <div className="w-full lg:w-[380px] shrink-0">
              
              <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 h-full">
                <h3 className="text-xl font-outfit font-bold text-[#0B2B26] mb-8 flex items-center gap-2">
                  History
                </h3>

                {/* Tracking History Timeline - Clean Design */}
                {transitWaypoints.length > 0 ? (
                  <div className="relative pl-3 space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div className="absolute left-[17px] top-2 bottom-6 w-px bg-gray-100" />
                    {(() => {
                      const wpsArray = Array.isArray(transitWaypoints) ? transitWaypoints : [];
                      const sortedWps = [...wpsArray].sort((a, b) => a.order - b.order);
                      const resolvedLoc = currentLocation || sortedWps[0]?.name || "";
                      const currentOrder = sortedWps.find(w => w.name === resolvedLoc)?.order ?? -1;

                      return sortedWps
                        .filter(wp => wp.order <= currentOrder)
                        .reverse()
                        .map((wp, idx) => {
                          const isCurrent = wp.name === resolvedLoc;
                          const matchingEvent = result.events.find(e => e.location === wp.name);

                          return (
                            <div key={idx} className="relative flex gap-6 group">
                              {/* Clean Dot */}
                              <div className={`w-[10px] h-[10px] rounded-full shrink-0 z-10 mt-1.5 transition-all ${
                                isCurrent 
                                  ? result.statusLabel === 'Delivered' 
                                    ? "bg-green-500 ring-4 ring-green-500/20"
                                    : "bg-[#F59A25] ring-4 ring-[#F59A25]/20"
                                  : "bg-white border-2 border-gray-200 group-hover:border-gray-400"
                              }`} />
                              
                              {/* Content */}
                              <div className="flex-1 pb-2">
                                <p className={`text-[15px] font-bold mb-1 ${
                                  isCurrent ? "text-[#0B2B26]" : "text-gray-600"
                                }`}>
                                  {isCurrent ? (result.statusLabel === 'Delivered' ? 'Delivered' : 'Current Location') : (wp.type === "origin" ? "Picked Up" : "In Transit")}
                                </p>
                                
                                <p className="text-sm text-gray-500 font-medium mb-2 leading-relaxed">
                                  {wp.name}
                                </p>

                                {matchingEvent && (
                                  <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">
                                    {matchingEvent.date} · {matchingEvent.time}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        });
                    })()}
                  </div>
                ) : (
                  /* Fallback event-based history */
                  <div className="relative pl-3 space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <div className="absolute left-[17px] top-2 bottom-6 w-px bg-gray-100" />
                    {result.events.map((event, idx) => (
                      <div key={idx} className="relative flex gap-6 group">
                        <div className={`w-[10px] h-[10px] rounded-full shrink-0 z-10 mt-1.5 transition-all ${
                          idx === 0 
                            ? result.statusLabel === 'Delivered'
                              ? "bg-green-500 ring-4 ring-green-500/20"
                              : "bg-[#F59A25] ring-4 ring-[#F59A25]/20"
                            : "bg-white border-2 border-gray-200 group-hover:border-gray-400"
                        }`} />
                        <div className="flex-1 pb-2">
                          <p className={`text-[15px] font-bold mb-1 ${idx === 0 ? "text-[#0B2B26]" : "text-gray-600"}`}>{event.status}</p>
                          <p className="text-sm text-gray-500 font-medium mb-2 leading-relaxed">{event.location}</p>
                          <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">{event.date} · {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          /* ── Not Found ── */
          <div className="bg-white shadow-xl shadow-[#0B2B26]/5 border border-gray-100 rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto mt-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm">
              <Package size={36} className="text-gray-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-[#0B2B26] mb-3">No Results Found</h2>
            <p className="text-gray-500 text-base mb-8">
              We couldn't find any tracking information for <span className="text-[#0B2B26] font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{trackingInput}</span>. Please double-check your tracking code.
            </p>
            <button onClick={() => setSearched(false)} className="px-8 py-3.5 rounded-xl bg-[#0B2B26] text-white font-bold text-sm hover:bg-[#153e37] transition-all shadow-lg shadow-[#0B2B26]/20 hover:shadow-xl hover:-translate-y-0.5">
              Try Another Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
