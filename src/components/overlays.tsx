import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * Lightweight overlays rendered inline (no portals) so they stay inside the phone screen.
 * The screen container uses `screen-contain`, which anchors position:fixed to it.
 */

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
}

function Backdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      aria-hidden
      onClick={onClose}
      className="fixed inset-0 z-40 bg-overlay backdrop-blur-[2px] animate-in fade-in duration-200"
    />
  );
}

export function SideDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 left-0 z-50 flex w-[82%] flex-col overflow-y-auto bg-sidebar no-scrollbar animate-in slide-in-from-left duration-300"
      >
        {children}
      </aside>
    </>
  );
}

export function BottomSheet({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[88%] overflow-y-auto rounded-t-[2rem] border-t border-border bg-card no-scrollbar animate-in slide-in-from-bottom duration-300",
          className,
        )}
      >
        <div className="sticky top-0 z-10 flex justify-center bg-card pb-2 pt-3">
          <span className="h-1.5 w-12 rounded-full bg-muted-foreground/40" />
        </div>
        {children}
      </div>
    </>
  );
}

export function Modal({
  open,
  onClose,
  children,
  className,
  showClose = true,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <>
      <Backdrop onClose={onClose} />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-5">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "pointer-events-auto relative w-full overflow-hidden rounded-3xl border border-border bg-card shadow-card animate-in zoom-in-95 fade-in duration-200",
            className,
          )}
        >
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-overlay text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {children}
        </div>
      </div>
    </>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  danger,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} showClose={false}>
      <div className="p-6 text-center">
        <h3 className="font-display text-3xl tracking-wide">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={onClose} className="h-12 rounded-2xl bg-surface font-semibold">
            Voltar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "h-12 rounded-2xl font-semibold",
              danger ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function VideoModal({ open, onClose, src, title }: { open: boolean; onClose: () => void; src: string; title: string }) {
  return (
    <Modal open={open} onClose={onClose} className="bg-stage">
      <video src={src} className="aspect-video w-full bg-stage object-cover" autoPlay loop muted playsInline controls />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Demonstração</p>
        <p className="font-display text-2xl tracking-wide">{title}</p>
      </div>
    </Modal>
  );
}
