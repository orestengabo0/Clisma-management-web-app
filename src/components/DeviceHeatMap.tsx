import { useEffect, useMemo, useState, useRef } from 'react';
import L from 'leaflet';
import { getHotspots, type Hotspot } from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 2;

export default function DeviceHeatMap() {
  const token = useAuthStore((s) => s.token);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [heatLoaded, setHeatLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const polygonLayersRef = useRef<any[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const heatPoints = useMemo(() => {
    if (!hotspots.length) return [];
    
    const maxPollution = Math.max(1, ...hotspots.map(h => h.pollutionLevel || 0));
    return hotspots.map(h => [
      h.location.latitude,
      h.location.longitude,
      Math.max(0.1, (h.pollutionLevel || 0) / maxPollution)
    ]);
  }, [hotspots]);

  // Cluster hotspots using simple distance-based clustering
  const clusters = useMemo(() => {
    if (!hotspots.length) return [];

    const CLUSTER_DISTANCE = 0.05; // ~5km threshold for clustering
    const clustered: Hotspot[][] = [];
    const visited = new Set<number>();

    hotspots.forEach((hotspot, idx) => {
      if (visited.has(idx)) return;

      const cluster: Hotspot[] = [hotspot];
      visited.add(idx);

      // Find nearby hotspots
      hotspots.forEach((other, otherIdx) => {
        if (visited.has(otherIdx)) return;

        const distance = Math.sqrt(
          Math.pow(hotspot.location.latitude - other.location.latitude, 2) +
          Math.pow(hotspot.location.longitude - other.location.longitude, 2)
        );

        if (distance < CLUSTER_DISTANCE) {
          cluster.push(other);
          visited.add(otherIdx);
        }
      });

      // Only create cluster polygons for groups of 3+ hotspots
      if (cluster.length >= 3) {
        clustered.push(cluster);
      }
    });

    return clustered;
  }, [hotspots]);

  // Create convex hull for a set of points
  const createConvexHull = (points: [number, number][]) => {
    if (points.length < 3) return points;

    // Sort points by x-coordinate
    const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    // Build lower hull
    const lower: [number, number][] = [];
    for (const point of sorted) {
      while (lower.length >= 2) {
        const cross = 
          (lower[lower.length - 1][0] - lower[lower.length - 2][0]) *
          (point[1] - lower[lower.length - 2][1]) -
          (lower[lower.length - 1][1] - lower[lower.length - 2][1]) *
          (point[0] - lower[lower.length - 2][0]);
        if (cross <= 0) break;
        lower.pop();
      }
      lower.push(point);
    }

    // Build upper hull
    const upper: [number, number][] = [];
    for (let i = sorted.length - 1; i >= 0; i--) {
      const point = sorted[i];
      while (upper.length >= 2) {
        const cross =
          (upper[upper.length - 1][0] - upper[upper.length - 2][0]) *
          (point[1] - upper[upper.length - 2][1]) -
          (upper[upper.length - 1][1] - upper[upper.length - 2][1]) *
          (point[0] - upper[upper.length - 2][0]);
        if (cross <= 0) break;
        upper.pop();
      }
      upper.push(point);
    }

    // Remove last point of each half because it's repeated
    lower.pop();
    upper.pop();

    return lower.concat(upper);
  };

  // Calculate center based on hotspots
  const center = useMemo((): [number, number] => {
    if (!hotspots.length) return DEFAULT_CENTER;
    
    const validHotspots = hotspots.filter(h => 
      h.location.latitude && h.location.longitude
    );
    
    if (!validHotspots.length) return DEFAULT_CENTER;

    const lat = validHotspots.reduce((sum, h) => sum + h.location.latitude, 0) / validHotspots.length;
    const lng = validHotspots.reduce((sum, h) => sum + h.location.longitude, 0) / validHotspots.length;
    
    return [lat, lng];
  }, [hotspots]);

  // Load Leaflet.heat plugin
  useEffect(() => {
    // Check if already loaded
    if ((L as any).heatLayer) {
      setHeatLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.async = true;
    script.onload = () => {
      setHeatLoaded(true);
      console.log('Leaflet.heat loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Leaflet.heat');
      setError('Failed to load heatmap functionality');
      setHeatLoaded(false);
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize Leaflet map directly (without react-leaflet)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    const map = L.map(mapContainerRef.current).setView(center, DEFAULT_ZOOM);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center]);

  // Fetch hotspots data
  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await getHotspots(0, 500, 'id,ASC');
        if (!cancelled) {
          setHotspots(response.content);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch hotspots:', err);
          setError('Failed to load hotspot data');
          setHotspots([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  // Update heat layer and cluster polygons when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !heatLoaded || !(L as any).heatLayer || !heatPoints.length) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Remove existing polygon layers
    polygonLayersRef.current.forEach(layer => map.removeLayer(layer));
    polygonLayersRef.current = [];

    // Create cluster polygons
    clusters.forEach((cluster, idx) => {
      const points: [number, number][] = cluster.map(h => [
        h.location.latitude,
        h.location.longitude
      ]);

      // Create convex hull
      const hull = createConvexHull(points);

      // Add some padding to the hull
      const centerLat = hull.reduce((sum, p) => sum + p[0], 0) / hull.length;
      const centerLng = hull.reduce((sum, p) => sum + p[1], 0) / hull.length;
      
      const paddedHull = hull.map(([lat, lng]) => {
        const latDiff = lat - centerLat;
        const lngDiff = lng - centerLng;
        return [
          lat + latDiff * 0.15, // 15% padding
          lng + lngDiff * 0.15
        ] as [number, number];
      });

      // Calculate average pollution for color intensity
      const avgPollution = cluster.reduce((sum, h) => sum + (h.pollutionLevel || 0), 0) / cluster.length;
      const maxPollution = Math.max(...cluster.map(h => h.pollutionLevel || 0));
      
      // Color based on pollution level
      const intensity = avgPollution / Math.max(1, ...hotspots.map(h => h.pollutionLevel || 0));
      const color = intensity > 0.7 ? '#ff0000' : intensity > 0.4 ? '#ff8800' : '#ffcc00';

      // Create polygon
      const polygon = L.polygon(paddedHull, {
        color: color,
        weight: 3,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.15,
        smoothFactor: 1
      }).addTo(map);

      // Add popup with cluster info
      polygon.bindPopup(`
        <div class="p-2">
          <strong>Hotspot Cluster ${idx + 1}</strong><br/>
          <span class="text-sm">Locations: ${cluster.length}</span><br/>
          <span class="text-sm">Avg Pollution: ${avgPollution.toFixed(2)}</span><br/>
          <span class="text-sm">Max Pollution: ${maxPollution.toFixed(2)}</span>
        </div>
      `);

      polygonLayersRef.current.push(polygon);
    });

    // Create new heat layer
    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      minOpacity: 0.4,
      gradient: {
        0.2: 'blue',
        0.4: 'cyan',
        0.6: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    });

    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    // Fit map to show all points
    const bounds = L.latLngBounds(
      heatPoints.map(([lat, lng]) => L.latLng(lat, lng))
    );
    
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.1));
    }

    // Cleanup function
    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      polygonLayersRef.current.forEach(layer => {
        if (map) map.removeLayer(layer);
      });
      polygonLayersRef.current = [];
    };
  }, [heatPoints, heatLoaded, clusters, hotspots]);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/80 z-[1000]">
          <div className="rounded bg-white px-4 py-2 shadow-lg border">
            Loading heatmap data...
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-[1000]">
          {error}
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full" />

      {hotspots.length === 0 && !loading && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="rounded bg-white/90 px-4 py-2 shadow-lg border">
            No hotspot data available
          </div>
        </div>
      )}
    </div>
  );
}