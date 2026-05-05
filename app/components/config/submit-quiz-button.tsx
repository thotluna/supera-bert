import { useFormStatus } from "react-dom";
import { Play } from "lucide-react";
import { JSX } from "react";
import { Button } from "../ui/button";

export function SubmitQuizButton(): JSX.Element {
  const { pending } = useFormStatus();

  return (
    <div className="w-full md:w-auto z-50 p-4 md:p-0 bg-background/80 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-t border-white/5 md:border-none">
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={pending}
        leftIcon={<Play className="w-4 h-4 fill-current" />}
        className="w-full md:w-64"
      >
        Iniciar Simulacro
      </Button>
    </div>
  );
}

