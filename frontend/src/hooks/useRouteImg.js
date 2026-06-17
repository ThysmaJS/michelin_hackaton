import { useState, useEffect } from 'react';

export default function useRouteImg(path, fallback) {
  const [src, setSrc] = useState(fallback);
  useEffect(() => {
    if (!path) return;
    const img = new Image();
    img.onload = () => setSrc(`url(${path}) center/cover`);
    img.src = path;
  }, [path]);
  return src;
}
