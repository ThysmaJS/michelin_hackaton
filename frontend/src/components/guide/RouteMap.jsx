import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// All colors from the official Michelin digital charter
const SEG_COLOR = {
  depart:  '#84BD00',  // Vert Généreux
  sommet:  '#582C83',  // Violet Engagé
  arrivee: '#00205B',  // Bleu Foncé Michelin
  cle:     '#FCE500',  // Jaune Michelin
  descente:'#53565A',  // Gris Responsable
};

export default function RouteMap({ waypoints, segments, height = 300 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !waypoints?.length) return;

    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 17,
    }).addTo(map);

    // Straight-line fallback shown while OSRM loads (dashed, dimmed)
    const fallbackLine = L.polyline(waypoints, {
      color: '#27509b', weight: 4, opacity: 0.35, dashArray: '8 6',
    }).addTo(map);

    // Segment markers (start, end, key points)
    waypoints.forEach((latlng, i) => {
      const seg = segments?.[i];
      const isStart = i === 0;
      const isEnd = i === waypoints.length - 1;
      const color = isStart ? '#84BD00' : isEnd ? '#00205B' : (SEG_COLOR[seg?.type] ?? '#FCE500');
      const radius = (isStart || isEnd) ? 9 : 7;
      const marker = L.circleMarker(latlng, {
        radius, fillColor: color, color: '#ffffff', weight: 2.5, fillOpacity: 1, zIndexOffset: 100,
      }).addTo(map);
      if (seg?.name) marker.bindTooltip(seg.name, { permanent: false, direction: 'top', offset: [0, -radius] });
    });

    map.fitBounds(L.latLngBounds(waypoints), { padding: [40, 40], animate: false });
    mapRef.current = map;

    // Fetch road-snapped route from OSRM (cycling profile)
    let cancelled = false;
    setLoading(true);
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');

    fetch(`https://router.project-osrm.org/route/v1/cycling/${coords}?geometries=geojson&overview=full`)
      .then((r) => {
        if (!r.ok) throw new Error('OSRM error');
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const geometry = data.routes?.[0]?.geometry?.coordinates;
        if (geometry?.length) {
          const latlngs = geometry.map(([lng, lat]) => [lat, lng]);
          map.removeLayer(fallbackLine);
          L.polyline(latlngs, { color: '#27509b', weight: 5, opacity: 0.9, lineJoin: 'round', lineCap: 'round' }).addTo(map);
          map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40] });
        } else {
          // OSRM returned no route — solidify fallback
          map.removeLayer(fallbackLine);
          L.polyline(waypoints, { color: '#27509b', weight: 5, opacity: 0.9 }).addTo(map);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        map.removeLayer(fallbackLine);
        L.polyline(waypoints, { color: '#27509b', weight: 5, opacity: 0.9 }).addTo(map);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [waypoints]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ height, width: '100%' }} />
      {loading && (
        <div style={{
          position: 'absolute', top: 12, right: 48, zIndex: 1000,
          background: 'rgba(255,255,255,.92)', borderRadius: 8, padding: '6px 14px',
          fontSize: 12, fontWeight: 700, color: '#27509b',
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: '0 2px 10px rgba(0,0,0,.18)',
        }}>
          <span style={{ display: 'inline-block', animation: 'spinSlow 1s linear infinite' }}>⟳</span>
          Calcul du tracé routier…
        </div>
      )}
    </div>
  );
}
