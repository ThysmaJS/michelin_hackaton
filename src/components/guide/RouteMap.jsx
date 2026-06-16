import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const SEG_COLOR = {
  depart:  '#16a34a',
  sommet:  '#e63946',
  arrivee: '#f97316',
  cle:     '#FCE500',
  descente:'#84BD00',
};

export default function RouteMap({ waypoints, segments, height = 300 }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !waypoints?.length) return;

    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 17,
    }).addTo(map);

    L.polyline(waypoints, {
      color: '#27509b',
      weight: 5,
      opacity: 0.85,
      lineJoin: 'round',
      lineCap: 'round',
    }).addTo(map);

    waypoints.forEach((latlng, i) => {
      const seg = segments?.[i];
      const segType = seg?.type || 'cle';
      const isStart = i === 0;
      const isEnd = i === waypoints.length - 1;
      const color = isStart ? '#16a34a' : isEnd ? '#f97316' : (SEG_COLOR[segType] ?? '#FCE500');
      const radius = (isStart || isEnd) ? 9 : 7;

      const marker = L.circleMarker(latlng, {
        radius,
        fillColor: color,
        color: '#ffffff',
        weight: 2.5,
        fillOpacity: 1,
      }).addTo(map);

      if (seg?.name) {
        marker.bindTooltip(seg.name, { permanent: false, direction: 'top', offset: [0, -radius] });
      }
    });

    map.fitBounds(L.latLngBounds(waypoints), { padding: [36, 36], animate: false });
    mapRef.current = map;

    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [waypoints]);

  return <div ref={containerRef} style={{ height, width: '100%' }} />;
}
