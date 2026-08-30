import { LayerStack, type LayerStep } from "./components/LayerStack";

const STEPS: LayerStep[] = [
  {
    title: "Definimos el alcance",
    body: "Salís de la primera llamada con una lista de lo que entra, lo que queda afuera y cuánto cuesta.",
  },
  {
    title: "Diseñamos las pantallas",
    body: "Ves la interfaz completa antes de que exista una línea de código. Mover cosas acá no cuesta nada.",
  },
  {
    title: "Construimos en tramos de dos semanas",
    body: "Cada tramo cierra con algo que podés abrir y usar. El entorno de prueba está siempre disponible.",
  },
  {
    title: "Salimos a producción con vos",
    body: "Publicamos juntos y quedamos disponibles treinta días para los ajustes que aparecen con usuarios reales.",
  },
];

/* Sandbox only. The bands above and below give the sticky column room to
   enter and leave, the way it behaves inside the real landing page. */
export default function App() {
  return (
    <main>
      <div className="flex h-[70vh] items-end justify-center pb-16 text-ink-3">
        <p className="text-sm">Scrolleá para ver el ensamblado</p>
      </div>

      <LayerStack steps={STEPS} className="py-16 lg:py-24" />

      <div className="h-[70vh]" />
    </main>
  );
}
