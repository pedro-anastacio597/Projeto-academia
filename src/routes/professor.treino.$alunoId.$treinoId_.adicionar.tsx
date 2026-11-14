import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ImagePlus, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { BottomSheet } from "@/components/overlays";
import { getWorkout, type Exercise } from "@/lib/gym-data";
import { actions, useAppState, type CustomExercise } from "@/lib/store";
import { getCatalog, mediaForMuscle, muscleGroups, normalize, toCustom } from "@/lib/workout";

/** Lê a foto escolhida e reduz para no máx. 480 px (JPEG), para caber no armazenamento local. */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 480 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagem inválida"));
    };
    img.src = url;
  });
}
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/professor/treino/$alunoId/$treinoId_/adicionar")({
  head: () => ({
    meta: [
      { title: "Adicionar exercício — FORJA Academia" },
      { name: "description", content: "Escolha os exercícios que serão adicionados ao treino do aluno." },
    ],
  }),
  component: AddExercise,
});

const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const label = "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground";

function AddExercise() {
  const { alunoId, treinoId } = Route.useParams();
  const navigate = useNavigate();
  const s = useAppState();
  const base = getWorkout(treinoId);
  const student = s.users.find((u) => u.email.toLowerCase() === alunoId.toLowerCase());

  const [group, setGroup] = useState("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  const custom = student?.customWorkouts?.[treinoId];
  const list: CustomExercise[] = custom ?? base?.exercises.map(toCustom) ?? [];

  // Só entram os exercícios que ainda não estão neste treino.
  // (s.catalog entra na lista de dependências para refletir exercícios recém-criados.)
  const available = useMemo(() => {
    const used = new Set(list.map((c) => c.exId));
    return getCatalog().filter((e) => !used.has(e.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.map((c) => c.exId).join(","), s.catalog]);

  const visible = available.filter(
    (e) => normalize(e.muscle).includes(normalize(group)) && normalize(e.name).includes(normalize(name)),
  );

  const back = () => {
    if (window.history.length > 1) window.history.back();
    else navigate({ to: "/professor/treino/$alunoId/$treinoId", params: { alunoId, treinoId } });
  };

  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const discard = () => {
    setSelected([]);
    back();
  };

  const save = () => {
    if (!student || !selected.length) return;
    const chosen = selected.map((id) => available.find((e) => e.id === id)).filter((e): e is Exercise => !!e);
    if (!chosen.length) return;
    actions.updateStudent(student.email, {
      customWorkouts: { ...(student.customWorkouts ?? {}), [treinoId]: [...list, ...chosen.map(toCustom)] },
    });
    toast.success(chosen.length === 1 ? "Exercício adicionado" : `${chosen.length} exercícios adicionados`, {
      description: chosen.map((e) => e.name).join(", "),
    });
    back();
  };

  const onCreated = (ex: Exercise) => {
    setSelected((cur) => [...cur, ex.id]);
    setGroup("");
    setName("");
    setCreating(false);
    toast.success("Exercício criado", { description: `${ex.name} já está selecionado.` });
  };

  const footer = (
    <div className="grid grid-cols-[1.35fr_1fr_1fr] gap-2">
      <button
        onClick={() => setCreating(true)}
        className="flex h-12 items-center justify-center gap-1 whitespace-nowrap rounded-2xl border border-primary/60 bg-primary/10 px-2 text-[13px] font-semibold text-primary"
      >
        <Plus className="h-4 w-4 shrink-0" /> Criar exercício
      </button>
      <button onClick={discard} className="h-12 rounded-2xl bg-surface text-[13px] font-semibold">
        Descartar
      </button>
      <button
        onClick={save}
        disabled={!selected.length}
        className="h-12 rounded-2xl bg-primary text-[13px] font-bold text-primary-foreground disabled:opacity-40"
      >
        Salvar{selected.length ? ` (${selected.length})` : ""}
      </button>
    </div>
  );

  return (
    <AppShell title="Adicionar exercício" back footer={student && base ? footer : undefined}>
      {() =>
        !student || !base ? (
          <p className="m-5 rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Treino ou aluno não encontrado.
          </p>
        ) : (
          <div className="space-y-4 px-5 pb-6 pt-6">
            <p className="text-xs text-muted-foreground">
              Toque nos exercícios para marcar um ou mais e depois em <b>Salvar</b>. Só aparecem exercícios que ainda não estão no {base.name}.
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className={label}>Grupo do exercício</span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className={cn(field, "pl-9")}
                    type="search"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="Ex.: Peitoral, Glúteo, Ombro…"
                    list="grupos-musculares"
                  />
                  <datalist id="grupos-musculares">
                    {muscleGroups().map((g) => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </span>
              </label>
              <label className="block">
                <span className={label}>Nome do exercício</span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className={cn(field, "pl-9")}
                    type="search"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex.: Supino, Rosca, Prancha…"
                  />
                </span>
              </label>
            </div>

            <div className="space-y-3">
              {visible.map((e) => {
                const on = selected.includes(e.id);
                return (
                  <button
                    key={e.id}
                    onClick={() => toggle(e.id)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-3xl border bg-card p-3 pr-4 text-left transition active:scale-[0.99]",
                      on ? "border-primary bg-primary/10" : "border-border",
                    )}
                  >
                    <img src={e.image} alt={e.name} loading="lazy" width={816} height={816} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{e.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {e.muscle} · {e.sets} × {e.reps}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full border",
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
              {visible.length === 0 && (
                <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  {available.length === 0
                    ? "Todos os exercícios já estão neste treino. Use “Criar exercício” para cadastrar um novo."
                    : "Nenhum exercício encontrado. Ajuste a busca ou use “Criar exercício”."}
                </p>
              )}
            </div>

            <CreateExercise
              open={creating}
              onClose={() => setCreating(false)}
              defaultName={name}
              defaultGroup={group}
              onCreated={onCreated}
            />
          </div>
        )
      }
    </AppShell>
  );
}

function CreateExercise({
  open,
  onClose,
  defaultName,
  defaultGroup,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  defaultName: string;
  defaultGroup: string;
  onCreated: (ex: Exercise) => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Montado só quando aberto: os campos já nascem preenchidos com o que foi digitado na busca. */}
      <CreateForm onClose={onClose} defaultName={defaultName} defaultGroup={defaultGroup} onCreated={onCreated} />
    </BottomSheet>
  );
}

function CreateForm({
  onClose,
  defaultName,
  defaultGroup,
  onCreated,
}: {
  onClose: () => void;
  defaultName: string;
  defaultGroup: string;
  onCreated: (ex: Exercise) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [muscle, setMuscle] = useState(defaultGroup);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Escolha um arquivo de imagem.");
    try {
      setImage(await readImage(file));
      setError(null);
    } catch {
      setError("Não foi possível ler essa imagem.");
    }
  };

  const submit = () => {
    const n = name.trim();
    const m = muscle.trim();
    if (!n) return setError("Informe o nome do exercício.");
    if (!m) return setError("Informe o grupo do exercício.");
    if (!image) return setError("Escolha uma imagem para o exercício.");
    if (getCatalog().some((e) => normalize(e.name) === normalize(n))) return setError("Já existe um exercício com esse nome.");
    // Reaproveita a grafia de um grupo que já existe (ex.: "peitoral" -> "Peitoral").
    const group = muscleGroups().find((g) => normalize(g) === normalize(m)) ?? m;
    // Padrão 3 × 15, sem carga: o professor ajusta depois no editor do treino.
    const ex: Exercise = {
      id: `x-${crypto.randomUUID().slice(0, 8)}`,
      name: n,
      muscle: group,
      image,
      video: mediaForMuscle(group).video,
      sets: 3,
      reps: "15",
      weights: [],
      restSec: 60,
      tips: [],
    };
    actions.addCatalogExercise(ex);
    onCreated(ex);
  };

  return (
    <div className="space-y-4 px-5 pb-6 pt-2">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl tracking-wide">Criar exercício</p>
        <button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <X className="h-4 w-4" />
        </button>
      </div>

      <label className="block">
        <span className={label}>Nome</span>
        <input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Cadeira Extensora" />
      </label>
      <label className="block">
        <span className={label}>Grupo</span>
        <input className={field} value={muscle} onChange={(e) => setMuscle(e.target.value)} placeholder="Ex.: Quadríceps" list="grupos-criar" />
        <datalist id="grupos-criar">
          {muscleGroups().map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </label>
      <div>
        <span className={label}>Imagem</span>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-background p-3">
          {image ? (
            <img src={image} alt="Prévia do exercício" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-surface text-muted-foreground">
              <ImagePlus className="h-6 w-6" />
            </span>
          )}
          <span className="text-sm font-semibold">{image ? "Trocar imagem" : "Escolher imagem"}</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">Entra com 3 séries × 15 repetições. Depois você ajusta séries, repetições e carga no editor do treino.</p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 gap-2">
        <button onClick={onClose} className="h-12 rounded-2xl bg-surface font-semibold">
          Cancelar
        </button>
        <button onClick={submit} className="h-12 rounded-2xl bg-primary font-bold text-primary-foreground">
          Criar
        </button>
      </div>
    </div>
  );
}
