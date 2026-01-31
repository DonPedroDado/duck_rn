import { type ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardCard({ title, children, className = "" }: DashboardCardProps) {
  return (
    <section
      className={`rounded-xl border border-[#00ff41]/40 bg-[#0a0a0a] p-6 shadow-[0_0_15px_rgba(0,255,65,0.08)] ${className}`}
      aria-labelledby={`card-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <h2
        id={`card-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#00ff41]/80"
      >
        {title}
      </h2>
      <div className="space-y-2 text-sm text-[#00ff41]">{children}</div>
    </section>
  );
}

export function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0">
      <span className="text-[#00ff41]/70">{label}</span>
      <span className={mono ? "font-mono text-[#00ff41]" : "text-[#00ff41]"}>
        {value}
      </span>
    </div>
  );
}
