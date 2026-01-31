/**
 * Extend browser types for optional APIs used by the dashboard.
 */

interface Navigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: "4g" | "3g" | "2g" | "slow-2g";
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

