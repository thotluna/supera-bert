import { ModeQuiz } from "@/libs/quiz/models";
import { Clock, GraduationCap, Brain } from "lucide-react";
import { OptionsMode } from "./options-mode";
import { JSX } from "react";

export default function ModeConfig(): JSX.Element {

  const modes = [
    {
      mode: 'timed' as ModeQuiz,
      name: 'Contrarreloj',
      description: 'Ráfaga de 10 preguntas en 3 minutos. Pon a prueba tu agilidad bajo presión.',
      icon: <Clock />
    },
    {
      mode: 'standard' as ModeQuiz,
      name: 'Standard',
      description: 'Simulacro oficial: 50 preguntas en 2 horas. La experiencia real de examen.',
      icon: <GraduationCap />
    },
    {
      mode: 'untimed' as ModeQuiz,
      name: 'Sin límite',
      description: 'Todo el banco de preguntas sin cronómetro. Estudia a tu propio ritmo.',
      icon: <Brain />
    }
  ];

  return (
    <article className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {modes.map((mode) => (
        <div
          key={mode.mode}
          className="flex"
        >
          <OptionsMode {...mode} />
        </div>
      ))}
    </article>
  );
}