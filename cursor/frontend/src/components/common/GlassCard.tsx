import { PropsWithChildren } from "react";

export default function GlassCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}

