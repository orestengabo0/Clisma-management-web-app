// @ts-nocheck
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { getHotspots, type Hotspot } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

const defaultCenter: [number, number] = [-1.661338, 29.510861];

function computeCenter(hotspots: Hotspot[]): [number, number] {
    if (!hotspots.length) return defaultCenter;
    const lat = hotspots.reduce((sum, h) => sum + h.location.latitude, 0) / hotspots.length;
    const lng = hotspots.reduce((sum, h) => sum + h.location.longitude, 0) / hotspots.length;
    return [lat, lng];
}

// Default Leaflet marker icons fix for bundlers
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function DeviceClusterMap() {
    const token = useAuthStore((s) => s.token);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [mapKey, setMapKey] = useState<string | number>(0);
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
        setMounted(true);
        setMapKey(Date.now());
    }, []);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const response = await getHotspots(0, 200, 'id,ASC');
                if (!cancelled) setHotspots(response.content);
            } catch {
                // swallow for now
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [token]);

    const center = useMemo(() => computeCenter(hotspots), [hotspots]);

    // Ensure map instance is disposed on unmount (helps dev strict/HMR)
    useEffect(() => {
        return () => {
            try {
                if (map && typeof map.remove === 'function') {
                    map.remove();
                }
            } catch {
                // ignore
            }
        };
    }, [map]);

    if (!mounted) return null;

    return (
        <div className="w-full h-full">
            <MapContainer id={`leaflet-map-${mapKey}`} whenCreated={setMap} key={mapKey} center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup chunkedLoading>{hotspots.map((h) => (
                    <Marker key={h.id} position={[h.location.latitude, h.location.longitude]}>
                        <Popup>
                            <div className="space-y-1">
                                <div className="font-medium">{h.location.name}</div>
                                <div className="text-sm text-gray-600">{h.location.description}</div>
                                <div className="text-sm">Pollution Level: {h.pollutionLevel}</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}</MarkerClusterGroup>
            </MapContainer>
            {loading && (
                <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="rounded bg-white/80 px-3 py-1 text-sm">Loading devices…</div>
                </div>
            )}
        </div>
    );
}


