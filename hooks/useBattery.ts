"use client";

import { useEffect, useState } from "react";

export interface BatteryState {
  supported: boolean;
  level: number | null; // 0–1
  charging: boolean | null;
  chargingTime: number | null; // seconds
  dischargingTime: number | null;
}

const defaultState: BatteryState = {
  supported: false,
  level: null,
  charging: null,
  chargingTime: null,
  dischargingTime: null,
};

export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>(defaultState);

  useEffect(() => {
    const nav = navigator as Navigator;
    if (!nav.getBattery) {
      setState((s) => ({ ...s, supported: false }));
      return;
    }

    nav.getBattery().then((battery) => {
      const update = () => {
        setState({
          supported: true,
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime === Infinity ? null : battery.chargingTime,
          dischargingTime: battery.dischargingTime === Infinity ? null : battery.dischargingTime,
        });
      };

      update();
      battery.addEventListener("levelchange", update);
      battery.addEventListener("chargingchange", update);
      battery.addEventListener("chargingtimechange", update);
      battery.addEventListener("dischargingtimechange", update);

      return () => {
        battery.removeEventListener("levelchange", update);
        battery.removeEventListener("chargingchange", update);
        battery.removeEventListener("chargingtimechange", update);
        battery.removeEventListener("dischargingtimechange", update);
      };
    }).catch(() => {
      setState((s) => ({ ...s, supported: false }));
    });
  }, []);

  return state;
}
