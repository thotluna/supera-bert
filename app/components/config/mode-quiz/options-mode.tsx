import { ModeQuiz } from "@/libs/quiz/models";
import { JSX } from "react";

interface IMode {
  mode: ModeQuiz
  name: string
  description: string
  icon: JSX.Element
}

export const OptionsMode = ({ name, description, icon, mode }: IMode): JSX.Element => {
  return (
    <label
      htmlFor={mode}
      className="relative flex-1 p-5 flex flex-col items-start rounded-xl cursor-pointer border border-foreground/10 bg-subface transition-all duration-500 hover:border-accent/30 has-checked:border-accent has-checked:shadow-neon group overflow-hidden"
    >
      <input
        type="radio"
        name="mode"
        id={mode}
        value={mode}
        className="sr-only"
        defaultChecked={mode === 'standard'}
      />

      <div className="absolute right-3 bottom-2 text-foreground/5 scale-[2.8] -rotate-12 transition-all duration-700 group-hover:rotate-6 group-has-checked:text-accent/10 group-has-checked:scale-[3]">
        {icon}
      </div>

      <div className="relative z-10 flex items-center gap-3 mb-2 text-accent transition-transform duration-300 group-has-checked:translate-x-1">
        {icon}
        <span className="font-bold text-base tracking-tight text-foreground/90 group-has-checked:text-foreground">
          {name}
        </span>
      </div>

      <p className="relative z-10 text-xs text-foreground/50 leading-snug font-medium transition-colors group-has-checked:text-foreground/70">
        {description}
      </p>
    </label>
  )
}
