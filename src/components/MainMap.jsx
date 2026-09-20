import { useState, useRef, useEffect, useCallback } from "react";
import mapImage from "./eu-c-03.png";
import pin from "./MapPin.png";
import './MainMapStyle.css';

const PIN_DISPLAY_RADIUS = 20;

export default function Map({ yellowUrl, greenUrl, guessed, onScore }) {
  const [markerPos, setMarkerPos] = useState(null);
  const [overlaysLoaded, setOverlaysLoaded] = useState({ green: false, yellow: false });
  const greenImgRef = useRef(null);
  const yellowImgRef = useRef(null);
  const hasScoredRef = useRef(false);

  // new round → clear the old pin and loaded-state so nothing carries over
  useEffect(() => {
    setMarkerPos(null);
    setOverlaysLoaded({ green: false, yellow: false });
    hasScoredRef.current = false;
  }, [greenUrl, yellowUrl]);

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMarkerPos({ x, y });
  }

  function hasOpaquePixelNear(imgEl, pos, rect) {
    if (!imgEl || !imgEl.complete || imgEl.naturalWidth === 0) return false;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = imgEl.naturalWidth;
      canvas.height = imgEl.naturalHeight;
      canvas.getContext("2d").drawImage(imgEl, 0, 0);

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = Math.floor(pos.x * scaleX);
      const y = Math.floor(pos.y * scaleY);

      // convert the pin's on-screen size into natural-image pixels,
      // so a hit means the pin visually touches the overlay, not a pinpoint
      const radiusX = Math.max(1, Math.ceil(PIN_DISPLAY_RADIUS * scaleX));
      const radiusY = Math.max(1, Math.ceil(PIN_DISPLAY_RADIUS * scaleY));

      const startX = Math.max(0, x - radiusX);
      const startY = Math.max(0, y - radiusY);
      const endX = Math.min(canvas.width, x + radiusX);
      const endY = Math.min(canvas.height, y + radiusY);
      const w = endX - startX;
      const h = endY - startY;
      if (w <= 0 || h <= 0) return false;

      const data = canvas.getContext("2d").getImageData(startX, startY, w, h).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 10) return true;
      }
      return false;
    } catch (err) {
      console.error("Pixel check failed (likely a CORS/tainted-canvas issue):", err);
      return false;
    }
  }

  const tryScore = useCallback(() => {
    if (hasScoredRef.current) return;
    if (!guessed || !markerPos) return;
    if (!overlaysLoaded.green || !overlaysLoaded.yellow) return;

    const rect = greenImgRef.current.getBoundingClientRect();
    const hitGreen = hasOpaquePixelNear(greenImgRef.current, markerPos, rect);
    const hitYellow = hasOpaquePixelNear(yellowImgRef.current, markerPos, rect);

    hasScoredRef.current = true;

    if (hitGreen) onScore(200);
    else if (hitYellow) onScore(100);
    else onScore(0);
  }, [guessed, markerPos, overlaysLoaded, onScore]);

  useEffect(() => {
    tryScore();
  }, [tryScore]);

  if (guessed) {
    return (
      <>
        <img
          ref={yellowImgRef}
          src={yellowUrl}
          alt="the yellow map"
          width="100%"
          className="colorOverlay"
          crossOrigin="anonymous"
          onLoad={() => setOverlaysLoaded((prev) => ({ ...prev, yellow: true }))}
        />
        <img
          ref={greenImgRef}
          src={greenUrl}
          alt="the green map"
          width="100%"
          className="colorOverlay"
          crossOrigin="anonymous"
          onLoad={() => setOverlaysLoaded((prev) => ({ ...prev, green: true }))}
        />
        <img src={mapImage} alt="the main map" width="100%" className="mainMap" />
        {markerPos && (
          <img
            src={pin}
            alt="marker"
            className="pin"
            width="20"
            style={{
              position: "absolute",
              left: markerPos.x - 10,
              top: markerPos.y - 10,
              pointerEvents: "none",
            }}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <img src={mapImage} onClick={handleClick} alt="the main map" width="100%" className="mainMap" />
        {markerPos && (
          <img
            src={pin}
            alt="marker"
            className="pin"
            width="20"
            style={{
              position: "absolute",
              left: markerPos.x - 10,
              top: markerPos.y - 10,
              pointerEvents: "none",
            }}
          />
        )}
      </>
    );
  }
}