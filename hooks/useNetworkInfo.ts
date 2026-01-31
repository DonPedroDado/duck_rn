"use client";

import { useEffect, useState } from "react";

export interface NetworkInfoState {
  supported: boolean;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean | null;
  type: string | null;
  online: boolean | null;
}

const defaultState: NetworkInfoState = {
  supported: false,
  effectiveType: null,
  downlink: null,
  rtt: null,
  saveData: null,
  type: null,
  online: null,
};

function getConnection(): NetworkInformation | undefined {
  const nav = navigator as Navigator;
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

export function useNetworkInfo(): NetworkInfoState {
  const [state, setState] = useState<NetworkInfoState>(defaultState);

  useEffect(() => {
    const conn = getConnection();
    let connUpdate: (() => void) | null = null;

    if (!conn) {
      setState((s) => ({
        ...s,
        supported: false,
        online: navigator.onLine,
      }));
    } else {
      connUpdate = () => {
        setState((s) => ({
          ...s,
          supported: true,
          effectiveType: conn.effectiveType ?? null,
          downlink: conn.downlink ?? null,
          rtt: conn.rtt ?? null,
          saveData: conn.saveData ?? null,
          type: conn.type ?? null,
          online: navigator.onLine,
        }));
      };
      connUpdate();
      conn.addEventListener("change", connUpdate);
    }

    const handleOnline = () => setState((s) => ({ ...s, online: true }));
    const handleOffline = () => setState((s) => ({ ...s, online: false }));
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      if (conn && connUpdate) conn.removeEventListener("change", connUpdate);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return state;
}
