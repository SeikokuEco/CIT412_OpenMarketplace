import { useEffect, useState } from "react";

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "/maps-script";
    s.onload = () => setLoaded(true);
    document.body.appendChild(s);
  }, []);

  return loaded;
}
