import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const FRANCE_CENTER = [46.6, 2.1];
const FRANCE_ZOOM = 5;

function pinIcon(label, stock, isActive) {
  const bg = isActive ? '#FCE500' : (stock ? '#00205B' : '#6b7280');
  const fg = isActive ? '#00205B' : (stock ? '#FCE500' : '#e5e7eb');
  const shadow = isActive
    ? '0 4px 20px rgba(252,229,0,.55)'
    : '0 4px 12px rgba(0,0,0,.35)';
  const pad = isActive ? '6px 12px' : '5px 10px';
  return L.divIcon({
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)">
      <div style="background:${bg};color:${fg};font-size:11px;font-weight:800;padding:${pad};border-radius:8px;white-space:nowrap;box-shadow:${shadow};line-height:1.4">${label}</div>
      <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${bg};margin-top:-1px"></div>
    </div>`,
  });
}

export default function Map({ c, searched, pins, activeRetailer, onPinClick }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  // { [label]: { marker, pin } }
  const markersRef = useRef({});
  const onPinClickRef = useRef(onPinClick);
  useEffect(() => { onPinClickRef.current = onPinClick; }, [onPinClick]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: FRANCE_CENTER,
      zoom: FRANCE_ZOOM,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Place / remove all markers when search state changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
    markersRef.current = {};

    if (!searched || !pins.length) {
      map.setView(FRANCE_CENTER, FRANCE_ZOOM, { animate: true });
      return;
    }

    const latlngs = [];
    pins.forEach((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: pinIcon(p.label, p.stock, false) }).addTo(map);
      marker.on('click', () => onPinClickRef.current?.(p.label));
      markersRef.current[p.label] = { marker, pin: p };
      latlngs.push([p.lat, p.lng]);
    });

    if (latlngs.length === 1) {
      map.setView(latlngs[0], 13, { animate: true });
    } else {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [48, 48], animate: true });
    }
  }, [searched, pins]);

  // Fly to selected retailer and toggle icon highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !searched) return;

    Object.values(markersRef.current).forEach(({ marker, pin }) => {
      const isActive = activeRetailer?.name === pin.label;
      marker.setIcon(pinIcon(pin.label, pin.stock, isActive));
    });

    if (activeRetailer) {
      map.flyTo([activeRetailer.lat, activeRetailer.lng], 14, { duration: 0.7 });
    }
  }, [activeRetailer, searched]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `1px solid ${c.border}`,
        minHeight: 440,
      }}
    />
  );
}
