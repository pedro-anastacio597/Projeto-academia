import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,


  ChevronRight,

  Dumbbell,
  HeartPulse,
  History,
  Home,
<<<<<<< HEAD
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  Wallet,
} from "lucide-react";
import { SideDrawer } from "./overlays";
import { actions, homePath, initials, useAppState, currentUser, type User } from "@/lib/store";
=======
  LogOut,
  Menu,
  Wallet,
} from "lucide-react";
import { SideDrawer } from "./overlays";
import { actions, initials, useAppState, currentUser, type User } from "@/lib/store";
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
import { GYM_NAME, getPlan, fmtDate } from "@/lib/gym-data";
import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-2 border-primary bg-accent font-display tracking-wider text-foreground",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

const MENU = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/treinos", label: "Treinos", icon: Dumbbell },
  { to: "/plano", label: "Plano", icon: Wallet },
  { to: "/avaliacoes", label: "Avaliação física", icon: HeartPulse },
  { to: "/historico", label: "Histórico", icon: History },
] as const;

<<<<<<< HEAD
const TRAINER_MENU = [
  { to: "/professor", label: "Painel", icon: LayoutDashboard },
  { to: "/professor/alunos", label: "Alunos", icon: Users },
] as const;

=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
function ProfileMenu({ user, onClose }: { user: User; onClose: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const plan = getPlan(user.plan);
<<<<<<< HEAD
  const trainer = user.role === "professor";
  const menu = trainer ? TRAINER_MENU : MENU;
=======
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
  return (
    <div className="flex min-h-full flex-col">
      <div className="relative overflow-hidden bg-card-glow px-6 pb-6 pt-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={user.name} className="h-16 w-16 text-2xl" />
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-sidebar",
                user.planStatus === "ativo" ? "bg-success" : "bg-destructive",
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{user.name.split(" ")[0]}</p>
<<<<<<< HEAD
            {trainer ? (
              <>
                <p className="text-sm font-semibold text-primary">Professor</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </>
            ) : (
              <>
                <p className={cn("text-sm font-semibold", user.planStatus === "ativo" ? "text-success" : "text-destructive")}>
                  {user.planStatus === "ativo" ? "Ativo" : "Plano cancelado"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {plan.name} · até {fmtDate(user.planEnd)}
                </p>
              </>
            )}
=======
            <p className={cn("text-sm font-semibold", user.planStatus === "ativo" ? "text-success" : "text-destructive")}>
              {user.planStatus === "ativo" ? "Ativo" : "Plano cancelado"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {plan.name} · até {fmtDate(user.planEnd)}
            </p>
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Você está em</p>
            <p className="font-display text-xl tracking-wider">{GYM_NAME} ACADEMIA</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 py-3 pr-4">
<<<<<<< HEAD
        {menu.map((m) => {
          const active = path === m.to || (m.to !== "/inicio" && m.to !== "/professor" && path.startsWith(m.to));
=======
        {MENU.map((m) => {
          const active = path === m.to || (m.to !== "/inicio" && path.startsWith(m.to));
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
          return (
            <Link
              key={m.to}
              to={m.to}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 rounded-r-full px-6 py-3.5 text-[15px] font-semibold transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <m.icon className="h-5 w-5" />
              {m.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => {
          actions.logout();
          onClose();
          navigate({ to: "/" });
        }}
        className="mx-4 mb-6 flex items-center gap-4 rounded-2xl border border-border px-5 py-3.5 font-semibold text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </button>
    </div>
  );
}

/**
 * Signed-in app screen: header (profile/menu or back button), scrollable body, optional fixed footer.
 * Redirects to /login when there is no signed-in user.
 */
export function AppShell({
  title,
  back,
  children,
  footer,
  right,
}: {
  title: string;
  back?: boolean;
  children: (user: User) => ReactNode;
  footer?: ReactNode;
  right?: ReactNode;
}) {
  const s = useAppState();
  const user = currentUser(s);
  const navigate = useNavigate();
<<<<<<< HEAD
  const path = useRouterState({ select: (r) => r.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  // Cada perfil só enxerga a sua área: professor em /professor, aluno nas demais telas.
  const inTrainerArea = path.startsWith("/professor");
  const wrongArea = !!user && (user.role === "professor") !== inTrainerArea;

  useEffect(() => {
    if (s.ready && !user) navigate({ to: "/login" });
    else if (user && wrongArea) navigate({ to: homePath(user) });
  }, [s.ready, user, wrongArea, navigate]);

  if (!s.ready || !user || wrongArea) {
=======
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (s.ready && !user) navigate({ to: "/login" });
  }, [s.ready, user, navigate]);

  if (!s.ready || !user) {
>>>>>>> 9e0916ba01f5f41dd129bef358dff57b51ae646d
    return (
      <div className="grid h-full place-items-center">
        <Dumbbell className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-background px-5 pb-4 pt-4">
        {back ? (
          <button
            onClick={() => window.history.back()}
            aria-label="Voltar"
            className="grid h-11 w-11 place-items-center rounded-full bg-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu do perfil" className="relative">
            <Avatar name={user.name} className="h-11 w-11 text-lg" />
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
              <Menu className="h-3 w-3" />
            </span>
          </button>
        )}
        <h1 className="truncate font-display text-3xl tracking-wide">{title}</h1>
        <div className="flex items-center gap-2">{right}</div>
      </header>
      <main className="relative min-h-0 flex-1 overflow-y-auto rounded-t-[2rem] bg-card/40 no-scrollbar">
        {children(user)}
      </main>
      {footer && <div className="shrink-0 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">{footer}</div>}
      <SideDrawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <ProfileMenu user={user} onClose={() => setMenuOpen(false)} />
      </SideDrawer>
    </div>
  );
}

export function HeaderIcon({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} className="relative grid h-11 w-11 place-items-center rounded-full bg-surface">
      {children}
    </button>
  );
}

