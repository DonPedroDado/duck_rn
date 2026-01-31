"use client";

import { useEffect, useRef, useState } from "react";

const MIN_DELAY_MS = 1_000;   // 1 second
const MAX_DELAY_MS = 60_000;  // 1 minute
const DISPLAY_DURATION_MS = 3_000; // show for 3 seconds

type Side = "left" | "right";

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSide(): Side {
  return Math.random() < 0.5 ? "left" : "right";
}

export function RandomImagePopup() {
  const [visible, setVisible] = useState(false);
  const [side, setSide] = useState<Side>("left");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scheduleNext = () => {
      const delayMs = randomBetween(MIN_DELAY_MS, MAX_DELAY_MS);
      timeoutRef.current = setTimeout(() => {
        setSide(randomSide());
        setVisible(true);
        displayRef.current = setTimeout(() => {
          setVisible(false);
          scheduleNext();
        }, DISPLAY_DURATION_MS);
      }, delayMs);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (displayRef.current) clearTimeout(displayRef.current);
    };
  }, []);

  if (!visible) return null;

  const fromLeft = side === "left";
  // Head looks at opposite side (toward center): from left → face right (rotate 90deg), from right → face left (rotate -90deg)
  const rotateDeg = fromLeft ? 90 : -90;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center"
      role="img"
      aria-hidden
    >
      <div
        className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-2 ${fromLeft ? "left-0 animate-popup-crawl-left" : "right-0 animate-popup-crawl-right"}`}
      >
        {/* Image rotated sideways; head faces the opposite side (center) */}
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bezos-popup.png"
            alt=""
            width={320}
            height={320}
            className="rounded-lg object-cover shadow-2xl ring-2 ring-[#00ff41]/50"
            style={{ transform: `rotate(${rotateDeg}deg)` }}
          />
          {/* Speech bubble: readable text, tail toward face (center) */}
          <div
            className={`absolute top-1/2 z-10 max-w-[200px] -translate-y-1/2 rounded-xl border-2 border-[#00ff41]/60 bg-black/95 px-3 py-2 text-sm leading-tight text-[#00ff41] shadow-lg ${fromLeft ? "left-full ml-3" : "right-full mr-3"}`}
          >
            <p>I know everything about you... &gt;:)</p>
            {/* Triangle tail pointing at the face */}
            <div
              className="absolute top-1/2 h-0 w-0 -translate-y-1/2 border-[8px] border-transparent"
              style={
                fromLeft
                  ? { left: "-8px", borderRightColor: "rgba(0,0,0,0.95)", borderTopColor: "transparent", borderBottomColor: "transparent" }
                  : { right: "-8px", borderLeftColor: "rgba(0,0,0,0.95)", borderTopColor: "transparent", borderBottomColor: "transparent" }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
