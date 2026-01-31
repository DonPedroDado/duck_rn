"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { TimeSection } from "@/components/TimeSection";
import { EnvironmentSection } from "@/components/EnvironmentSection";
import { LocationSection } from "@/components/LocationSection";
import { DeviceSection } from "@/components/DeviceSection";
import { NetworkSection } from "@/components/NetworkSection";
import { CosmosSection } from "@/components/CosmosSection";
import { MotionSection } from "@/components/MotionSection";
import { MetaSection } from "@/components/MetaSection";
import { RandomImagePopup } from "@/components/RandomImagePopup";

export default function DashboardPage() {
  const { coords, error, loading, request } = useGeolocation();

  return (
    <main className="min-h-screen bg-black px-4 py-10 sm:px-6 lg:px-8">
      <RandomImagePopup />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#00ff41] sm:text-4xl">
            Right Now
          </h1>
          <p className="mt-2 text-[#00ff41]/80">
            A real-time snapshot of this moment, your environment, device, and
            your place in the universe.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <TimeSection />
          <EnvironmentSection
            latitude={coords?.latitude ?? null}
            longitude={coords?.longitude ?? null}
            onRequestLocation={request}
          />
          <LocationSection
            coords={coords}
            onRequestLocation={request}
            loading={loading}
            error={error}
          />
          <DeviceSection />
          <NetworkSection />
          <CosmosSection />
          <MotionSection />
          <MetaSection />
        </div>
      </div>
    </main>
  );
}
