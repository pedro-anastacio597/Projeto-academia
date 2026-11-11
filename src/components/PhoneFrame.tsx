import { useEffect, useState, type ReactNode } from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () =>
      setT(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}

/** Renders the app inside a phone mockup on larger screens, full-screen on phones. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-stage sm:py-6">
      <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-background sm:h-[min(844px,calc(100dvh-3rem))] sm:w-[390px] sm:rounded-[3rem] sm:border-[10px] sm:border-bezel sm:shadow-phone">
        <div className="relative hidden h-9 shrink-0 items-center justify-between px-7 text-xs font-semibold text-foreground sm:flex">
          <Clock />
          <div className="absolute left-1/2 top-1.5 h-6 w-24 -translate-x-1/2 rounded-full bg-stage" />
          <div className="flex items-center gap-1">
            <Signal className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
            <BatteryFull className="h-4 w-4" />
          </div>
        </div>
        <div className="screen-contain relative min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
