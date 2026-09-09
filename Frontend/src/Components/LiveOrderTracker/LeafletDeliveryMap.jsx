import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletDeliveryMap = ({ currentStep, status, address }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const tileLayerRef = useRef(null);
    const riderMarkerRef = useRef(null);
    const routePolylineRef = useRef(null);
    const progressPolylineRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [telemetrySpeed, setTelemetrySpeed] = useState(24);

    // Highly realistic street-level route coordinates (Central kitchen to Customer Indiranagar)
    const restaurantPos = [12.9719, 77.5937]; // Church Street / MG Road Central Hub
    const customerPos = [12.9785, 77.6408];   // 100ft Road Indiranagar

    // Detailed road-following street waypoints
    const waypoints = [
        [12.9719, 77.5937], // 1. Central Kitchen (Church St)
        [12.9730, 77.6010], // 2. Mayo Hall Junction
        [12.9742, 77.6115], // 3. Trinity Circle
        [12.9754, 77.6220], // 4. Halasuru Lake Overpass
        [12.9768, 77.6325], // 5. CMH Road Entrance
        [12.9785, 77.6408]  // 6. Customer Home (100ft Rd)
    ];

    const stepWaypointMap = {
        1: waypoints[0],
        2: waypoints[1],
        3: waypoints[3],
        4: waypoints[4],
        5: waypoints[5]
    };

    // Google Maps Tile Sources
    const tileSources = {
        streets: {
            url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [12.9750, 77.6177],
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: true
            });

            tileLayerRef.current = L.tileLayer(tileSources.streets.url, {
                maxZoom: tileSources.streets.maxZoom,
                subdomains: tileSources.streets.subdomains
            }).addTo(map);

            L.control.zoom({ position: 'topright' }).addTo(map);

            // 1. Restaurant Pin
            const restaurantIcon = L.divIcon({
                className: 'custom-leaflet-pin',
                html: `
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-[#2b1f1d] transform hover:scale-110 transition-all font-black text-lg">
                            🍳
                        </div>
                        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-gray-900/90 text-white text-[10px] font-bold whitespace-nowrap shadow-lg border border-white/20 backdrop-blur-md font-mono">
                            Central Kitchen
                        </div>
                    </div>
                `,
                iconSize: [44, 58],
                iconAnchor: [22, 52]
            });
            L.marker(restaurantPos, { icon: restaurantIcon }).addTo(map);

            // 2. Customer Home Pin
            const customerCity = address?.city || 'Home';
            const customerIcon = L.divIcon({
                className: 'custom-leaflet-pin',
                html: `
                    <div class="flex flex-col items-center group cursor-pointer">
                        <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-[#2b1f1d] transform hover:scale-110 transition-all font-black text-lg">
                            📍
                        </div>
                        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-700/95 text-white text-[10px] font-bold whitespace-nowrap shadow-lg border border-white/20 backdrop-blur-md font-mono">
                            ${customerCity}
                        </div>
                    </div>
                `,
                iconSize: [44, 58],
                iconAnchor: [22, 52]
            });
            L.marker(customerPos, { icon: customerIcon }).addTo(map);

            // 3. Planned Route Glow (Underlayer)
            L.polyline(waypoints, {
                color: '#FF6B35',
                weight: 8,
                opacity: 0.25,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map);

            // 4. Main Route Polyline (Dashed Path)
            routePolylineRef.current = L.polyline(waypoints, {
                color: '#FF6B35',
                weight: 4,
                opacity: 0.85,
                dashArray: '6, 8',
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map);

            // 5. Active Driven Polyline
            progressPolylineRef.current = L.polyline([waypoints[0]], {
                color: '#22C55E',
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(map);

            // 6. Animated Rider Bike Marker
            const initialRiderPos = stepWaypointMap[currentStep] || waypoints[0];
            const riderIcon = L.divIcon({
                className: 'custom-leaflet-pin',
                html: `
                    <div class="flex flex-col items-center relative cursor-pointer">
                        <div class="absolute -inset-2 rounded-full bg-primary/30 animate-ping"></div>
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-[#2b1f1d] relative z-10 text-xl font-bold">
                            🛵
                        </div>
                        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-extrabold whitespace-nowrap shadow-xl border border-white/30 font-mono tracking-wider uppercase z-10">
                            Alex (Driver)
                        </div>
                    </div>
                `,
                iconSize: [48, 62],
                iconAnchor: [24, 56]
            });

            riderMarkerRef.current = L.marker(initialRiderPos, { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);

            const bounds = L.latLngBounds([restaurantPos, customerPos]);
            map.fitBounds(bounds, { padding: [55, 55] });

            mapInstanceRef.current = map;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Smooth continuous movement animation when "Out For Delivery"
    useEffect(() => {
        if (!mapInstanceRef.current || !riderMarkerRef.current) return;

        if (status === "Out For Delivery" || currentStep === 4) {
            let progress = 0;
            let currentWaypointIdx = 0;

            const animateRider = () => {
                progress += 0.004; // Smooth cruising speed

                if (currentWaypointIdx < waypoints.length - 1) {
                    const start = waypoints[currentWaypointIdx];
                    const end = waypoints[currentWaypointIdx + 1];

                    const lat = start[0] + (end[0] - start[0]) * progress;
                    const lng = start[1] + (end[1] - start[1]) * progress;

                    if (riderMarkerRef.current) {
                        riderMarkerRef.current.setLatLng([lat, lng]);
                    }

                    if (progressPolylineRef.current) {
                        const passedPoints = waypoints.slice(0, currentWaypointIdx + 1);
                        progressPolylineRef.current.setLatLngs([...passedPoints, [lat, lng]]);
                    }

                    if (progress >= 1) {
                        progress = 0;
                        currentWaypointIdx += 1;
                    }

                    animationFrameRef.current = requestAnimationFrame(animateRider);
                }
            };

            animationFrameRef.current = requestAnimationFrame(animateRider);

            const speedInterval = setInterval(() => {
                setTelemetrySpeed(prev => Math.floor(22 + Math.random() * 8));
            }, 2500);

            return () => {
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                clearInterval(speedInterval);
            };
        } else {
            const targetPos = stepWaypointMap[currentStep] || waypoints[0];
            riderMarkerRef.current.setLatLng(targetPos);

            const currentIdx = currentStep === 1 ? 1 : (currentStep === 2 ? 2 : (currentStep === 3 ? 4 : waypoints.length));
            if (progressPolylineRef.current) {
                progressPolylineRef.current.setLatLngs(waypoints.slice(0, currentIdx));
            }
        }
    }, [currentStep, status]);

    return (
        <div className="relative w-full h-full min-h-[340px] lg:min-h-[440px] overflow-hidden bg-slate-900 z-0">
            {/* Live GPS Telemetry Header Pill */}
            <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white font-mono text-[11px] shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-emerald-400">GPS ACTIVE</span>
                <span className="text-gray-400">|</span>
                <span>Speed: <b className="text-white">{telemetrySpeed} km/h</b></span>
            </div>

            {/* Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[340px] lg:min-h-[440px] z-0" />
        </div>
    );
};

export default LeafletDeliveryMap;
