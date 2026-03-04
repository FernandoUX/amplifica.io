import { Check } from "lucide-react";

type Step = { label: string; number: number };
const STEPS: Step[] = [
  { number: 1, label: "Definición de Destino" },
  { number: 2, label: "Detalle de Artículos" },
  { number: 3, label: "Reserva de andén" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = step.number < current;
        const active = step.number === current;
        return (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center gap-2 ${done ? "text-green-600" : active ? "text-indigo-600" : "text-gray-400"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0
                ${done ? "bg-green-500 text-white" : active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {done ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${done ? "text-green-600" : active ? "text-indigo-700" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-12 mx-3 ${done ? "bg-green-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
