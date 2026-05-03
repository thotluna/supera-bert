import { JSX } from "react";

interface SectionConfigProps {
  children: React.ReactNode;
  title: string;
}

export default function SectionConfig({ title, children }: SectionConfigProps): JSX.Element {
  return (
    <section className="w-full flex flex-col gap-4">
      <header className="text-xs md:text-sm text-foreground/40 font-bold uppercase tracking-[0.2em] flex items-center gap-3">
        <span className="w-8 h-px bg-foreground/10" />
        <h2>{title}</h2>
      </header>
      {children}
    </section>
  );
}