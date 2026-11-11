import squatImg from "@/assets/ex-squat.jpg";
import legpressImg from "@/assets/ex-legpress.jpg";
import benchImg from "@/assets/ex-bench.jpg";
import hipthrustImg from "@/assets/ex-hipthrust.jpg";
import pulldownImg from "@/assets/ex-pulldown.jpg";
import curlImg from "@/assets/ex-curl.jpg";
import plankImg from "@/assets/ex-plank.jpg";
import deadliftImg from "@/assets/ex-deadlift.jpg";
import shoulderImg from "@/assets/ex-shoulder.jpg";
import tricepsImg from "@/assets/ex-triceps.jpg";
import treadmillImg from "@/assets/ex-treadmill.jpg";
import vSquat from "@/assets/videos/demo-squat.mp4.asset.json";
import vBench from "@/assets/videos/demo-bench.mp4.asset.json";
import vGlute from "@/assets/videos/demo-glute.mp4.asset.json";
import vCurl from "@/assets/videos/demo-curl.mp4.asset.json";
import vPlank from "@/assets/videos/demo-plank.mp4.asset.json";
import vPulldown from "@/assets/videos/demo-pulldown.mp4.asset.json";
import vTreadmill from "@/assets/videos/demo-treadmill.mp4.asset.json";
import vShoulder from "@/assets/videos/demo-shoulder.mp4.asset.json";
import vDeadlift from "@/assets/videos/demo-deadlift.mp4.asset.json";
import vTriceps from "@/assets/videos/demo-triceps.mp4.asset.json";

export const GYM_NAME = "FORJA";

export type Exercise = {
  id: string;
  name: string;
  muscle: string;
  image: string;
  video: string;
  sets: number;
  reps: string;
  /** Load per set in kg; empty for bodyweight / time-based work. */
  weights: number[];
  restSec: number;
  tips: string[];
  /** Exercises sharing a bisetId are performed back to back. */
  bisetId?: string;
};

export type WorkoutType = "inferiores" | "superiores" | "core";

export type Workout = {
  id: string;
  letter: string;
  name: string;
  type: WorkoutType;
  muscles: string[];
  cover: string;
  exercises: Exercise[];
};

export const WORKOUT_TYPES: { id: WorkoutType; label: string; description: string }[] = [
  { id: "inferiores", label: "Membros inferiores", description: "Pernas e glúteos" },
  { id: "superiores", label: "Membros superiores", description: "Peito, costas e braços" },
  { id: "core", label: "Core & Cardio", description: "Abdômen e condicionamento" },
];

const ex = (e: Exercise) => e;

export const WORKOUTS: Workout[] = [
  {
    id: "a",
    letter: "A",
    name: "Treino A",
    type: "inferiores",
    muscles: ["Quadríceps", "Posterior"],
    cover: squatImg,
    exercises: [
      ex({ id: "a1", name: "Agachamento Livre - Barra", muscle: "Quadríceps", image: squatImg, video: vSquat.url, sets: 4, reps: "12/10/10/8", weights: [40, 50, 55, 60], restSec: 90, tips: ["Pés na largura dos ombros", "Desça até a coxa ficar paralela ao chão", "Mantenha o tronco firme"] }),
      ex({ id: "a2", name: "Leg Press 45°", muscle: "Quadríceps", image: legpressImg, video: vSquat.url, sets: 4, reps: "12", weights: [120, 140, 160, 160], restSec: 90, tips: ["Não estenda totalmente os joelhos", "Lombar sempre apoiada no banco"] }),
      ex({ id: "a3", name: "Stiff - Barra", muscle: "Posterior", image: deadliftImg, video: vDeadlift.url, sets: 3, reps: "12/10/8", weights: [30, 35, 40], restSec: 60, tips: ["Joelhos levemente flexionados", "Barra próxima ao corpo"] }),
      ex({ id: "a4", name: "Agachamento Búlgaro - Halteres", muscle: "Quadríceps", image: squatImg, video: vSquat.url, sets: 3, reps: "10", weights: [10, 12, 12], restSec: 60, tips: ["Pé de trás apoiado no banco", "Joelho da frente alinhado ao pé"] }),
    ],
  },
  {
    id: "b",
    letter: "B",
    name: "Treino B",
    type: "superiores",
    muscles: ["Peitoral", "Dorsal", "Abdômen"],
    cover: benchImg,
    exercises: [
      ex({ id: "b1", name: "Supino Reto - Barra", muscle: "Peitoral", image: benchImg, video: vBench.url, sets: 4, reps: "12/10/8/8", weights: [30, 40, 45, 45], restSec: 90, tips: ["Escápulas retraídas", "Desça a barra até a linha do peito"] }),
      ex({ id: "b2", name: "Puxada Frontal - Polia", muscle: "Dorsal", image: pulldownImg, video: vPulldown.url, sets: 4, reps: "12", weights: [40, 45, 50, 50], restSec: 60, tips: ["Puxe a barra em direção ao peito", "Evite balançar o tronco"] }),
      ex({ id: "b3", name: "Prancha Isométrica", muscle: "Abdômen", image: plankImg, video: vPlank.url, sets: 3, reps: "40s", weights: [], restSec: 45, tips: ["Quadril alinhado com os ombros", "Contraia o abdômen"] }),
    ],
  },
  {
    id: "c",
    letter: "C",
    name: "Treino C",
    type: "inferiores",
    muscles: ["Glúteo", "Perna"],
    cover: hipthrustImg,
    exercises: [
      ex({ id: "c1", name: "Elevação Pélvica - Barra", muscle: "Glúteo", image: hipthrustImg, video: vGlute.url, sets: 4, reps: "12", weights: [40, 50, 60, 60], restSec: 90, tips: ["Queixo levemente para baixo", "Contraia o glúteo no topo por 1s"] }),
      ex({ id: "c2", name: "Agachamento Búlgaro - Livre", muscle: "Glúteo", image: squatImg, video: vSquat.url, sets: 4, reps: "10", weights: [10, 13, 15, 15], restSec: 60, tips: ["Incline levemente o tronco à frente para ativar o glúteo"] }),
      ex({ id: "c3", name: "Levantamento Terra - Estilo Sumô", muscle: "Glúteo", image: deadliftImg, video: vDeadlift.url, sets: 3, reps: "12/10/8", weights: [40, 50, 55], restSec: 90, tips: ["Pés afastados e pontas para fora", "Coluna neutra durante todo o movimento"] }),
      ex({ id: "c4", name: "Stiff - Barra", muscle: "Perna", image: deadliftImg, video: vDeadlift.url, sets: 3, reps: "12/10/8", weights: [20, 25, 30], restSec: 0, tips: ["Execute logo em seguida o exercício B do bi-set"], bisetId: "c-bs1" }),
      ex({ id: "c5", name: "Leg Press - Pés Altos", muscle: "Perna", image: legpressImg, video: vSquat.url, sets: 3, reps: "15", weights: [100, 120, 120], restSec: 90, tips: ["Pés no alto da plataforma enfatizam o glúteo"], bisetId: "c-bs1" }),
    ],
  },
  {
    id: "d",
    letter: "D",
    name: "Treino D",
    type: "superiores",
    muscles: ["Ombro", "Bíceps", "Tríceps"],
    cover: shoulderImg,
    exercises: [
      ex({ id: "d1", name: "Desenvolvimento - Halteres", muscle: "Ombro", image: shoulderImg, video: vShoulder.url, sets: 4, reps: "12/10/10/8", weights: [10, 12, 14, 14], restSec: 60, tips: ["Não trave os cotovelos no topo", "Costas apoiadas no banco"] }),
      ex({ id: "d2", name: "Rosca Direta - Halteres", muscle: "Bíceps", image: curlImg, video: vCurl.url, sets: 3, reps: "12", weights: [10, 12, 12], restSec: 60, tips: ["Cotovelos fixos ao lado do corpo"] }),
      ex({ id: "d3", name: "Tríceps Corda - Polia", muscle: "Tríceps", image: tricepsImg, video: vTriceps.url, sets: 3, reps: "12", weights: [20, 25, 25], restSec: 60, tips: ["Abra a corda no final do movimento"] }),
      ex({ id: "d4", name: "Rosca Martelo - Halteres", muscle: "Bíceps", image: curlImg, video: vCurl.url, sets: 3, reps: "10", weights: [10, 10, 12], restSec: 60, tips: ["Pegada neutra, palmas voltadas uma para a outra"] }),
    ],
  },
  {
    id: "e",
    letter: "E",
    name: "Treino E",
    type: "core",
    muscles: ["Abdômen", "Cardio"],
    cover: treadmillImg,
    exercises: [
      ex({ id: "e1", name: "Esteira - Intervalado", muscle: "Cardio", image: treadmillImg, video: vTreadmill.url, sets: 1, reps: "20 min", weights: [], restSec: 0, tips: ["1 min rápido / 1 min leve", "Mantenha a postura ereta"] }),
      ex({ id: "e2", name: "Prancha Frontal", muscle: "Abdômen", image: plankImg, video: vPlank.url, sets: 3, reps: "45s", weights: [], restSec: 45, tips: ["Não deixe o quadril cair"] }),
      ex({ id: "e3", name: "Prancha Lateral", muscle: "Abdômen", image: plankImg, video: vPlank.url, sets: 3, reps: "30s cada lado", weights: [], restSec: 30, tips: ["Corpo em linha reta da cabeça aos pés"] }),
    ],
  },
];

export function getWorkout(id: string) {
  return WORKOUTS.find((w) => w.id === id);
}

/** Weekly schedule: index = Date.getDay() (0 = domingo). null = descanso. */
export const WEEK_SCHEDULE: (string | null)[] = [null, "a", "b", "c", "d", "e", "a"];
export const WEEK_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];
export const WEEK_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export type Post = {
  id: string;
  author: string;
  role: string;
  initials: string;
  date: string;
  quote: string;
  body?: string;
  likes: number;
};

export const POSTS: Post[] = [
  { id: "p1", author: "Tibério Costa", role: "Professor", initials: "TC", date: "Hoje, 06:30", quote: "Disciplina é fazer o que precisa ser feito, mesmo quando você não está com vontade.", likes: 184 },
  { id: "p2", author: "Camila Rocha", role: "Personal Trainer", initials: "CR", date: "Ontem, 18:10", quote: "O corpo alcança o que a mente acredita.", body: "Lembrem de beber água durante o treino e respeitar o tempo de descanso entre as séries!", likes: 97 },
  { id: "p3", author: "FORJA Academia", role: "Oficial", initials: "FJ", date: "09/11", quote: "Não pare quando estiver cansado. Pare quando terminar.", likes: 256 },
  { id: "p4", author: "Rafael Nunes", role: "Professor", initials: "RN", date: "07/11", quote: "Um treino ruim ainda é melhor do que nenhum treino.", likes: 143 },
];

export type Evaluation = {
  id: string;
  date: string; // ISO
  professor: string;
  weight: number;
  height: number;
  bodyFat: number;
  leanMass: number;
  visceralFat: number;
  restingHr: number;
  measures: { label: string; value: number }[];
  notes: string;
  goal: string;
};

export const EVALUATIONS: Evaluation[] = [
  {
    id: "av3",
    date: "2026-11-03",
    professor: "Tibério Costa",
    weight: 64.2,
    height: 1.65,
    bodyFat: 22.4,
    leanMass: 49.8,
    visceralFat: 4,
    restingHr: 64,
    measures: [
      { label: "Braço", value: 28.5 },
      { label: "Cintura", value: 70 },
      { label: "Abdômen", value: 78 },
      { label: "Quadril", value: 101 },
      { label: "Coxa", value: 58 },
      { label: "Panturrilha", value: 36 },
    ],
    notes: "Ótima evolução na composição corporal. Manter progressão de carga nos treinos de membros inferiores e incluir mais cardio no Treino E.",
    goal: "Hipertrofia de glúteos e redução de 2% de gordura",
  },
  {
    id: "av2",
    date: "2026-08-04",
    professor: "Camila Rocha",
    weight: 65.8,
    height: 1.65,
    bodyFat: 24.9,
    leanMass: 49.4,
    visceralFat: 5,
    restingHr: 68,
    measures: [
      { label: "Braço", value: 28 },
      { label: "Cintura", value: 73 },
      { label: "Abdômen", value: 81 },
      { label: "Quadril", value: 99 },
      { label: "Coxa", value: 57 },
      { label: "Panturrilha", value: 35.5 },
    ],
    notes: "Aumentar a frequência semanal para 5 treinos. Atenção à técnica do agachamento.",
    goal: "Redução de gordura corporal",
  },
  {
    id: "av1",
    date: "2026-05-05",
    professor: "Camila Rocha",
    weight: 67.5,
    height: 1.65,
    bodyFat: 27.1,
    leanMass: 49.2,
    visceralFat: 6,
    restingHr: 72,
    measures: [
      { label: "Braço", value: 27.5 },
      { label: "Cintura", value: 76 },
      { label: "Abdômen", value: 85 },
      { label: "Quadril", value: 98 },
      { label: "Coxa", value: 56 },
      { label: "Panturrilha", value: 35 },
    ],
    notes: "Avaliação inicial. Foco em adaptação e condicionamento nas primeiras semanas.",
    goal: "Adaptação e condicionamento",
  },
];

export function bmi(e: Pick<Evaluation, "weight" | "height">) {
  return e.weight / (e.height * e.height);
}

export type PlanId = "mensal" | "trimestral" | "anual";

export type PlanInfo = {
  id: PlanId;
  name: string;
  months: number;
  monthly: number;
  discount: number; // percent
  perks: string[];
};

export const PLANS: PlanInfo[] = [
  { id: "mensal", name: "Musculação Mensal", months: 1, monthly: 119.9, discount: 0, perks: ["Musculação livre", "Avaliação física trimestral"] },
  { id: "trimestral", name: "Musculação Trimestral", months: 3, monthly: 104.9, discount: 12, perks: ["Musculação livre", "Avaliação física mensal", "1 aula experimental de funcional"] },
  { id: "anual", name: "Black Anual", months: 12, monthly: 89.9, discount: 25, perks: ["Musculação + aulas coletivas", "Avaliação física mensal", "Acesso a todas as unidades", "Levar 1 amigo por mês"] },
];

export function getPlan(id: PlanId) {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function planTotal(p: PlanInfo) {
  return p.monthly * p.months;
}

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
