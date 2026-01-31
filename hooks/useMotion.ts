"use client";

import { useEffect, useState } from "react";

export interface OrientationState {
  type: string | null;
  angle: number | null;
}

export interface DeviceMotionState {
  alpha: number | null; // compass 0–360
  beta: number | null;
  gamma: number | null;
  acceleration: { x: number | null; y: number | null; z: number | null };
  supported: boolean;
}

export interface MotionState {
  orientation: OrientationState;
  deviceMotion: DeviceMotionState;
}

const defaultMotion: MotionState = {
  orientation: { type: null, angle: null },
  deviceMotion: {
    alpha: null,
    beta: null,
    gamma: null,
    acceleration: { x: null, y: null, z: null },
    supported: false,
  },
};

function getScreenOrientation(): OrientationState {
  if (typeof screen === "undefined" || !screen.orientation) {
    return { type: null, angle: null };
  }
  const o = screen.orientation as { type?: string; angle?: number };
  return {
    type: o.type ?? null,
    angle: typeof o.angle === "number" ? o.angle : null,
  };
}

export function useMotion(): MotionState {
  const [state, setState] = useState<MotionState>(defaultMotion);

  useEffect(() => {
    const updateOrientation = () => {
      setState((s) => ({
        ...s,
        orientation: getScreenOrientation(),
      }));
    };

    updateOrientation();
    if (screen.orientation) {
      (screen.orientation as unknown as EventTarget).addEventListener("change", updateOrientation);
    }

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      setState((s) => ({
        ...s,
        deviceMotion: {
          ...s.deviceMotion,
          supported: true,
          acceleration: {
            x: acc?.x ?? null,
            y: acc?.y ?? null,
            z: acc?.z ?? null,
          },
        },
      }));
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const ev = e as DeviceOrientationEvent & { alpha?: number | null; beta?: number | null; gamma?: number | null };
      setState((s) => ({
        ...s,
        deviceMotion: {
          ...s.deviceMotion,
          supported: true,
          alpha: ev.alpha ?? null,
          beta: ev.beta ?? null,
          gamma: ev.gamma ?? null,
        },
      }));
    };

    window.addEventListener("devicemotion", handleDeviceMotion);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      if (screen.orientation) {
        (screen.orientation as unknown as EventTarget).removeEventListener("change", updateOrientation);
      }
      window.removeEventListener("devicemotion", handleDeviceMotion);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return state;
}
